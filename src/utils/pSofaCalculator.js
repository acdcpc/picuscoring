/**
 * pSOFA Score Calculator
 * 
 * This module implements the Pediatric Sequential Organ Failure Assessment (pSOFA) score
 * for assessing organ dysfunction in pediatric intensive care units.
 */

/**
 * Calculate pSOFA score based on physiological variables
 * 
 * @param {Object} inputValues - Physiological parameters
 * @returns {Object} - Calculated scores and assessment
 */
export const calculatePSOFAScore = (inputValues) => {
  // Validate inputs
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  let totalScore = 0;
  const scoreDetails = {};

  // Helper function to get age-adjusted thresholds
  const getAgeAdjustedThresholds = (ageCategory) => {
    switch (ageCategory) {
      case '<1 month':
        return { map: 46, creatinine: 1.2 };
      case '1 to 11 months':
        return { map: 55, creatinine: 0.8 };
      case '1 to <2 years':
        return { map: 58, creatinine: 0.8 };
      case '2 to <5 years':
        return { map: 60, creatinine: 0.8 };
      case '5 to <12 years':
        return { map: 62, creatinine: 1.0 };
      case '12 to 17 years':
        return { map: 65, creatinine: 1.2 };
      default:
        return { map: 60, creatinine: 1.0 }; // Default values
    }
  };

  const thresholds = getAgeAdjustedThresholds(inputValues.ageCategory || '5 to <12 years');

  // Respiratory Score (0-4)
  let respiratoryScore = 0;
  const fio2 = (parseFloat(inputValues.fio2) || 21) / 100;
  let oxygenationRatio;
  if (inputValues.oxygenMeasurement === 'PaO2') {
    const pao2 = parseFloat(inputValues.pao2) || 0;
    oxygenationRatio = pao2 / fio2;
  } else {
    const spo2 = parseFloat(inputValues.spo2) || 0;
    oxygenationRatio = spo2 / fio2; // Simplified for SpO2
  }

  if (oxygenationRatio >= 400) respiratoryScore = 0;
  else if (oxygenationRatio >= 300) respiratoryScore = 1;
  else if (oxygenationRatio >= 200) respiratoryScore = 2;
  else if (oxygenationRatio >= 100) respiratoryScore = 3;
  else respiratoryScore = 4;

  totalScore += respiratoryScore;
  scoreDetails.respiratoryScore = respiratoryScore;

  // Coagulation Score (0-4)
  let coagulationScore = 0;
  const platelets = parseFloat(inputValues.platelets) || 0;
  if (platelets >= 150) coagulationScore = 0;
  else if (platelets >= 100) coagulationScore = 1;
  else if (platelets >= 50) coagulationScore = 2;
  else if (platelets >= 20) coagulationScore = 3;
  else coagulationScore = 4;

  totalScore += coagulationScore;
  scoreDetails.coagulationScore = coagulationScore;

  // Liver Score (0-4)
  let liverScore = 0;
  const bilirubin = parseFloat(inputValues.bilirubin) || 0;
  if (bilirubin < 1.2) liverScore = 0;
  else if (bilirubin < 2.0) liverScore = 1;
  else if (bilirubin < 6.0) liverScore = 2;
  else if (bilirubin < 12.0) liverScore = 3;
  else liverScore = 4;

  totalScore += liverScore;
  scoreDetails.liverScore = liverScore;

  // Cardiovascular Score (0-4)
  let cardiovascularScore = 0;
  const map = parseFloat(inputValues.meanArterialPressure) || 0;
  const dopamine = parseFloat(inputValues.dopamine) || 0;
  const dobutamine = parseFloat(inputValues.dobutamine) || 0;
  const epinephrine = parseFloat(inputValues.epinephrine) || 0;
  const norepinephrine = parseFloat(inputValues.norepinephrine) || 0;

  if (map >= thresholds.map) cardiovascularScore = 0;
  else if (map >= (thresholds.map - 10)) cardiovascularScore = 1;
  else if (dopamine <= 5 || dobutamine > 0) cardiovascularScore = 2;
  else if (dopamine <= 15 || epinephrine <= 0.1 || norepinephrine <= 0.1) cardiovascularScore = 3;
  else cardiovascularScore = 4;

  totalScore += cardiovascularScore;
  scoreDetails.cardiovascularScore = cardiovascularScore;

  // Neurological Score (0-4)
  let neurologicalScore = 0;
  const gcs = parseInt(inputValues.glasgowComaScore) || 15;
  if (gcs >= 13) neurologicalScore = 0;
  else if (gcs >= 10) neurologicalScore = 1;
  else if (gcs >= 6) neurologicalScore = 2;
  else if (gcs >= 3) neurologicalScore = 3;
  else neurologicalScore = 4;

  totalScore += neurologicalScore;
  scoreDetails.neurologicalScore = neurologicalScore;

  // Renal Score (0-4)
  let renalScore = 0;
  const creatinine = parseFloat(inputValues.creatinine) || 0;
  if (creatinine < thresholds.creatinine) renalScore = 0;
  else if (creatinine < thresholds.creatinine * 1.5) renalScore = 1;
  else if (creatinine < thresholds.creatinine * 2) renalScore = 2;
  else if (creatinine < thresholds.creatinine * 3) renalScore = 3;
  else renalScore = 4;

  totalScore += renalScore;
  scoreDetails.renalScore = renalScore;

  // Additional Details
  scoreDetails.ageCategory = inputValues.ageCategory || 'Not specified';
  scoreDetails.oxygenationRatio = oxygenationRatio || 0;
  scoreDetails.glasgowComaScore = gcs;
  scoreDetails.meanArterialPressure = map;
  scoreDetails.bilirubin = bilirubin;
  scoreDetails.platelets = platelets;
  scoreDetails.creatinine = creatinine;

  // Mortality Risk (simplified for pSOFA)
  let mortalityRisk = 0;
  if (totalScore <= 4) mortalityRisk = 2; // Low
  else if (totalScore <= 8) mortalityRisk = 10; // Moderate
  else if (totalScore <= 12) mortalityRisk = 25; // High
  else mortalityRisk = 50; // Very High

  return {
    totalScore,
    mortalityRisk,
    severityCategory: totalScore <= 4 ? 'Low' : totalScore <= 8 ? 'Moderate' : totalScore <= 12 ? 'High' : 'Very High',
    ...scoreDetails,
  };
};

export default calculatePSOFAScore;