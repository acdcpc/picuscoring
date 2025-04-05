/**
 * SOFA Score Calculator
 * 
 * This module implements the Sequential Organ Failure Assessment (SOFA) scoring system
 * for assessing organ dysfunction in critically ill patients, with pediatric adaptations.
 * 
 * Based on research from:
 * - Vincent JL, et al. The SOFA (Sepsis-related Organ Failure Assessment) score to describe organ dysfunction/failure.
 * - Pediatric adaptations based on pSOFA literature
 */

/**
 * Calculate SOFA/pSOFA score based on physiological variables
 * 
 * @param {Object} params - Physiological parameters
 * @param {boolean} isPediatric - Whether to use pediatric adaptations
 * @param {number} ageInMonths - Age in months (for pediatric adaptations)
 * @returns {Object} - Calculated scores and assessment
 */
export const calculateSOFAScore = (params, isPediatric = true, ageInMonths = 0) => {
  // Calculate scores for each organ system
  const respiratoryScore = calculateRespiratoryScore(params.pao2fio2, params.isVentilated);
  const coagulationScore = calculateCoagulationScore(params.platelets);
  const liverScore = calculateLiverScore(params.bilirubin);
  const cardiovascularScore = calculateCardiovascularScore(
    params.map, 
    params.dopamine, 
    params.dobutamine, 
    params.epinephrine, 
    params.norepinephrine,
    isPediatric,
    ageInMonths
  );
  const neurologicalScore = calculateNeurologicalScore(params.gcs);
  const renalScore = calculateRenalScore(
    params.creatinine, 
    params.urineOutput,
    isPediatric,
    ageInMonths
  );
  
  // Calculate total score
  const totalScore = respiratoryScore + coagulationScore + liverScore + 
                    cardiovascularScore + neurologicalScore + renalScore;
  
  // Determine severity category
  const severityCategory = getSeverityCategory(totalScore);
  
  // Calculate mortality risk (simplified model)
  const mortalityRisk = calculateMortalityRisk(totalScore);
  
  return {
    respiratoryScore,
    coagulationScore,
    liverScore,
    cardiovascularScore,
    neurologicalScore,
    renalScore,
    totalScore,
    severityCategory,
    mortalityRisk
  };
};

/**
 * Calculate respiratory system score based on PaO2/FiO2 ratio
 */
const calculateRespiratoryScore = (pao2fio2, isVentilated) => {
  if (!pao2fio2) return 0;
  
  if (pao2fio2 < 100 && isVentilated) return 4;
  if (pao2fio2 >= 100 && pao2fio2 < 200 && isVentilated) return 3;
  if (pao2fio2 >= 200 && pao2fio2 < 300) return 2;
  if (pao2fio2 >= 300 && pao2fio2 < 400) return 1;
  return 0; // PaO2/FiO2 ≥ 400
};

/**
 * Calculate coagulation system score based on platelets
 */
const calculateCoagulationScore = (platelets) => {
  if (!platelets) return 0;
  
  if (platelets < 20) return 4;
  if (platelets >= 20 && platelets < 50) return 3;
  if (platelets >= 50 && platelets < 100) return 2;
  if (platelets >= 100 && platelets < 150) return 1;
  return 0; // Platelets ≥ 150
};

/**
 * Calculate liver score based on bilirubin
 */
const calculateLiverScore = (bilirubin) => {
  if (!bilirubin) return 0;
  
  // Convert mg/dL to μmol/L if needed (bilirubin * 17.1)
  const bilirubinUmolL = bilirubin > 50 ? bilirubin : bilirubin * 17.1;
  
  if (bilirubinUmolL >= 204) return 4;
  if (bilirubinUmolL >= 102 && bilirubinUmolL < 204) return 3;
  if (bilirubinUmolL >= 33 && bilirubinUmolL < 102) return 2;
  if (bilirubinUmolL >= 20 && bilirubinUmolL < 33) return 1;
  return 0; // Bilirubin < 20 μmol/L
};

/**
 * Calculate cardiovascular system score based on MAP and vasopressors
 */
const calculateCardiovascularScore = (
  map, 
  dopamine, 
  dobutamine, 
  epinephrine, 
  norepinephrine,
  isPediatric,
  ageInMonths
) => {
  // If no MAP provided, return 0
  if (!map && !dopamine && !dobutamine && !epinephrine && !norepinephrine) return 0;
  
  // Get age-adjusted hypotension threshold for pediatric patients
  const mapThreshold = isPediatric ? getPediatricMAPThreshold(ageInMonths) : 70;
  
  // Check vasopressors first (highest priority)
  if (dopamine > 15 || epinephrine > 0.1 || norepinephrine > 0.1) return 4;
  if (dopamine > 5 || epinephrine <= 0.1 || norepinephrine <= 0.1) return 3;
  if (dopamine <= 5 || dobutamine) return 2;
  
  // If no vasopressors, check MAP
  if (map && map < mapThreshold) return 1;
  
  return 0;
};

/**
 * Get age-adjusted MAP threshold for pediatric patients
 */
const getPediatricMAPThreshold = (ageInMonths) => {
  if (ageInMonths < 1) return 46; // Newborn
  if (ageInMonths < 12) return 55; // Infant
  if (ageInMonths < 24) return 60; // Toddler
  if (ageInMonths < 60) return 62; // Preschool
  if (ageInMonths < 144) return 65; // School age
  return 67; // Adolescent
};

/**
 * Calculate neurological system score based on Glasgow Coma Scale
 */
const calculateNeurologicalScore = (gcs) => {
  if (!gcs) return 0;
  
  if (gcs < 6) return 4;
  if (gcs >= 6 && gcs <= 9) return 3;
  if (gcs >= 10 && gcs <= 12) return 2;
  if (gcs >= 13 && gcs <= 14) return 1;
  return 0; // GCS = 15
};

/**
 * Calculate renal system score based on creatinine and urine output
 */
const calculateRenalScore = (creatinine, urineOutput, isPediatric, ageInMonths) => {
  // If neither parameter is provided, return 0
  if (!creatinine && !urineOutput) return 0;
  
  // Get age-adjusted creatinine thresholds for pediatric patients
  let creatinineThresholds = [0.7, 1.2, 2.0, 3.5, 5.0];
  if (isPediatric) {
    creatinineThresholds = getPediatricCreatinineThresholds(ageInMonths);
  }
  
  // Check urine output first (if provided)
  if (urineOutput !== undefined) {
    if (urineOutput < 200) return 4;
    if (urineOutput < 500) return 3;
  }
  
  // Check creatinine
  if (creatinine !== undefined) {
    if (creatinine >= creatinineThresholds[4]) return 4;
    if (creatinine >= creatinineThresholds[3]) return 3;
    if (creatinine >= creatinineThresholds[2]) return 2;
    if (creatinine >= creatinineThresholds[1]) return 1;
  }
  
  return 0;
};

/**
 * Get age-adjusted creatinine thresholds for pediatric patients
 * Returns array of [baseline, level1, level2, level3, level4] thresholds
 */
const getPediatricCreatinineThresholds = (ageInMonths) => {
  if (ageInMonths < 1) return [0.8, 1.0, 1.2, 2.5, 4.0]; // Newborn
  if (ageInMonths < 12) return [0.3, 0.5, 1.0, 1.7, 2.5]; // Infant
  if (ageInMonths < 24) return [0.4, 0.6, 1.1, 1.8, 3.0]; // Toddler
  if (ageInMonths < 60) return [0.5, 0.8, 1.2, 2.0, 3.5]; // Preschool
  if (ageInMonths < 144) return [0.6, 1.0, 1.5, 2.2, 4.0]; // School age
  return [0.7, 1.2, 2.0, 3.5, 5.0]; // Adolescent (same as adult)
};

/**
 * Get severity category based on total SOFA score
 */
const getSeverityCategory = (totalScore) => {
  if (totalScore < 6) return 'Mild organ dysfunction';
  if (totalScore >= 6 && totalScore < 10) return 'Moderate organ dysfunction';
  if (totalScore >= 10 && totalScore < 15) return 'Severe organ dysfunction';
  return 'Very severe organ dysfunction';
};

/**
 * Calculate mortality risk based on total SOFA score
 * 
 * This is a simplified model based on published data
 * For a real application, this would use the actual coefficients from validated studies
 */
const calculateMortalityRisk = (totalScore) => {
  // Simplified mortality risk model
  if (totalScore < 6) return '<10%';
  if (totalScore >= 6 && totalScore < 10) return '15-20%';
  if (totalScore >= 10 && totalScore < 15) return '40-50%';
  if (totalScore >= 15 && totalScore < 20) return '50-60%';
  return '>80%';
};

export default calculateSOFAScore;
