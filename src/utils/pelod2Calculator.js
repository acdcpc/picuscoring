/**
 * PELOD-2 Score Calculator
 * 
 * This module implements the Pediatric Logistic Organ Dysfunction 2 (PELOD-2) scoring system
 * for assessing the severity of multiple organ dysfunction syndrome in critically ill children.
 * 
 * Based on research from:
 * - Leteurtre S, et al. PELOD-2: An update of the PEdiatric logistic organ dysfunction score.
 */

/**
 * Calculate PELOD-2 score based on physiological variables
 * 
 * @param {Object} inputValues - Physiological parameters including ageInMonths
 * @returns {Object} - Calculated scores and assessment
 */
export const calculatePelod2Score = (inputValues) => {
  // Validate inputs
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }
  const validatedAgeInMonths = typeof inputValues.ageInMonths === 'number' && inputValues.ageInMonths >= 0 ? inputValues.ageInMonths : 102; // Default to 8.5 years if missing

  // Calculate scores for each organ system
  const neurologicalScore = calculateNeurologicalScore(inputValues.gcs, inputValues.pupillaryReaction);
  const cardiovascularScore = calculateCardiovascularScore(inputValues.lactate, inputValues.map, validatedAgeInMonths);
  const renalScore = calculateRenalScore(inputValues.creatinine, validatedAgeInMonths);
  const respiratoryScore = calculateRespiratoryScore(inputValues.pao2_fio2, inputValues.paco2, inputValues.invasiveVentilation === 'yes');
  const hematologicalScore = calculateHematologicalScore(inputValues.wbc, inputValues.platelets);
  
  // Calculate total score
  const totalScore = neurologicalScore + cardiovascularScore + renalScore + 
                    respiratoryScore + hematologicalScore;
  
  // Calculate mortality risk
  const mortalityRisk = calculateMortalityRisk(totalScore);
  
  // Determine severity category
  const severityCategory = getSeverityCategory(totalScore);
  
  return {
    neurologicalScore,
    cardiovascularScore,
    renalScore,
    respiratoryScore,
    hematologicalScore,
    totalScore,
    mortalityRisk,
    severityCategory
  };
};

/**
 * Calculate neurological system score based on GCS and pupillary reaction
 */
const calculateNeurologicalScore = (gcs, pupillaryReaction) => {
  // Check pupillary reaction first (higher priority)
  if (pupillaryReaction === 'both_fixed') {
    return 10;
  }
  
  // Check GCS
  if (!gcs) return 0;
  
  if (gcs < 5) return 10;
  if (gcs >= 5 && gcs <= 8) return 4;
  if (gcs >= 9 && gcs <= 11) return 1;
  return 0; // GCS ≥ 12
};

/**
 * Calculate cardiovascular system score based on lactatemia and MAP
 */
const calculateCardiovascularScore = (lactatemia, map, ageInMonths) => {
  // Check lactatemia first (higher priority)
  if (lactatemia !== undefined) {
    if (lactatemia >= 11) return 6;
    if (lactatemia >= 5 && lactatemia < 11) return 4;
    if (lactatemia >= 2 && lactatemia < 5) return 1;
  }
  
  // Check MAP if lactatemia not provided or not severe
  if (map !== undefined) {
    const mapThreshold = getAgeAdjustedMAPThreshold(ageInMonths);
    if (map < mapThreshold) return 4;
  }
  
  return 0;
};

/**
 * Get age-adjusted MAP threshold
 */
const getAgeAdjustedMAPThreshold = (ageInMonths) => {
  if (ageInMonths < 1) return 46; // Newborn
  if (ageInMonths < 12) return 55; // Infant
  if (ageInMonths < 24) return 60; // Toddler
  if (ageInMonths < 60) return 62; // Preschool
  if (ageInMonths < 144) return 65; // School age
  return 67; // Adolescent
};

/**
 * Calculate renal system score based on creatinine
 */
const calculateRenalScore = (creatinine, ageInMonths) => {
  if (creatinine === undefined) return 0;
  
  const thresholds = getAgeAdjustedCreatinineThresholds(ageInMonths);
  
  if (creatinine >= thresholds.severe) return 5;
  if (creatinine >= thresholds.moderate) return 2;
  return 0;
};

/**
 * Get age-adjusted creatinine thresholds
 */
const getAgeAdjustedCreatinineThresholds = (ageInMonths) => {
  if (ageInMonths < 1) {
    return { moderate: 0.8, severe: 1.3 }; // Newborn
  }
  if (ageInMonths < 12) {
    return { moderate: 0.3, severe: 0.7 }; // Infant
  }
  if (ageInMonths < 24) {
    return { moderate: 0.4, severe: 1.0 }; // Toddler
  }
  if (ageInMonths < 60) {
    return { moderate: 0.6, severe: 1.5 }; // Preschool
  }
  if (ageInMonths < 144) {
    return { moderate: 0.8, severe: 2.0 }; // School age
  }
  return { moderate: 1.2, severe: 3.0 }; // Adolescent
};

/**
 * Calculate respiratory system score based on PaO2/FiO2, PaCO2, and ventilation status
 */
const calculateRespiratoryScore = (pao2fio2, paco2, isVentilated) => {
  // Check PaO2/FiO2 ratio first (if ventilated)
  if (isVentilated && pao2fio2 !== undefined) {
    if (pao2fio2 < 60) return 6;
    if (pao2fio2 >= 60 && pao2fio2 < 100) return 3;
    if (pao2fio2 >= 100 && pao2fio2 < 200) return 1;
  }
  
  // Check PaCO2
  if (paco2 !== undefined) {
    if (paco2 > 90) return 3;
    if (paco2 > 75 && paco2 <= 90) return 1;
  }
  
  // Check ventilation status alone
  if (isVentilated) return 1;
  
  return 0;
};

/**
 * Calculate hematological system score based on WBC and platelets
 */
const calculateHematologicalScore = (wbc, platelets) => {
  // Check WBC
  if (wbc !== undefined) {
    if (wbc < 2) return 3;
  }
  
  // Check platelets
  if (platelets !== undefined) {
    if (platelets < 50) return 3;
    if (platelets >= 50 && platelets < 100) return 1;
  }
  
  return 0;
};

/**
 * Calculate mortality risk based on total PELOD-2 score
 * 
 * This is a simplified logistic regression model based on published data
 * For a real application, this would use the actual coefficients from the validated model
 */
const calculateMortalityRisk = (totalScore) => {
  // Simplified logistic regression model
  // ln(odds) = -6.61 + 0.47 * PELOD-2 score
  const logOdds = -6.61 + (0.47 * totalScore);
  const odds = Math.exp(logOdds);
  const probability = odds / (1 + odds);
  
  // Return as percentage with 1 decimal place
  return (probability * 100).toFixed(1);
};

/**
 * Get severity category based on total PELOD-2 score
 */
const getSeverityCategory = (totalScore) => {
  if (totalScore < 7) return 'Mild organ dysfunction';
  if (totalScore >= 7 && totalScore < 14) return 'Moderate organ dysfunction';
  if (totalScore >= 14 && totalScore < 21) return 'Severe organ dysfunction';
  return 'Very severe organ dysfunction';
};

export default calculatePelod2Score;