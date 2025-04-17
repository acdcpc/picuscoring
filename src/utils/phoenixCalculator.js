/**
 * Phoenix Sepsis Score Calculator
 * 
 * This module implements the Phoenix Sepsis score for assessing sepsis in pediatric patients.
 */

/**
 * Calculate Phoenix Sepsis score based on physiological variables
 * 
 * @param {Object} inputValues - Physiological parameters
 * @returns {Object} - Calculated scores and assessment
 */
export const calculatePhoenixScore = (inputValues) => {
  // Validate inputs
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  let totalScore = 0;
  const scoreDetails = {};

  // Helper function to get MAP thresholds based on age
  const getMAPThreshold = (ageCategory) => {
    switch (ageCategory) {
      case '<1 month':
        return 30; // MAP < 30 mmHg
      case '1 to 11 months':
        return 39; // MAP < 39 mmHg
      case '1 to <2 years':
        return 44; // MAP < 44 mmHg
      case '2 to <5 years':
        return 47; // MAP < 47 mmHg
      case '5 to <12 years':
        return 55; // MAP < 55 mmHg
      case '12 to 17 years':
        return 60; // MAP < 60 mmHg
      default:
        return 55; // Default to a reasonable value if age is not specified
    }
  };

  // Helper function to calculate PaO2/FiO2 or SpO2/FiO2 ratio
  const calculateOxygenationRatio = (inputValues) => {
    const fio2 = (parseFloat(inputValues.fio2) || 21) / 100; // Convert FiO2 percentage to decimal
    if (inputValues.oxygenMeasurement === 'PaO2') {
      const pao2 = parseFloat(inputValues.pao2) || 0;
      return pao2 / fio2;
    } else {
      const spo2 = parseFloat(inputValues.spo2) || 0;
      return spo2 / fio2; // Simplified for SpO2, MDCalc uses a more complex conversion
    }
  };

  // Respiratory Score (max 3 points)
  let respiratoryScore = 0;
  const oxygenationRatio = calculateOxygenationRatio(inputValues);
  const respiratorySupport = inputValues.respiratorySupport || 'None';

  // MDCalc uses different thresholds based on respiratory support and oxygenation
  if (respiratorySupport === 'IMV') {
    if (oxygenationRatio < 100) {
      respiratoryScore = 3; // Severe dysfunction
    } else if (oxygenationRatio < 200) {
      respiratoryScore = 2; // Moderate dysfunction
    } else if (oxygenationRatio < 300) {
      respiratoryScore = 1; // Mild dysfunction
    }
  } else if (respiratorySupport === 'Any, excluding IMV') {
    if (oxygenationRatio < 200) {
      respiratoryScore = 2; // Moderate dysfunction
    } else if (oxygenationRatio < 300) {
      respiratoryScore = 1; // Mild dysfunction
    }
  } else {
    if (oxygenationRatio < 300) {
      respiratoryScore = 1; // Mild dysfunction
    }
  }
  totalScore += respiratoryScore;
  scoreDetails.respiratoryScore = respiratoryScore;

  // Cardiovascular Score (max 6 points)
  let cardiovascularScore = 0;
  // Vasoactive Medications
  const vasoactiveMeds = inputValues.vasoactiveMedications || 'None';
  if (vasoactiveMeds === '1') {
    cardiovascularScore += 1;
  } else if (vasoactiveMeds === '≥2') {
    cardiovascularScore += 2;
  }
  // Lactate
  const lactate = parseFloat(inputValues.lactateLevel) || 0;
  if (lactate >= 5 && lactate <= 10.9) {
    cardiovascularScore += 1;
  } else if (lactate > 10.9) {
    cardiovascularScore += 2;
  }
  // MAP (age-adjusted)
  const map = parseFloat(inputValues.meanArterialPressure) || 0;
  const mapThreshold = getMAPThreshold(inputValues.ageCategory);
  if (map > 0 && map < mapThreshold) {
    cardiovascularScore += 1; // MAP below age-specific threshold
  }
  cardiovascularScore = Math.min(cardiovascularScore, 6); // Cap at max 6 points
  totalScore += cardiovascularScore;
  scoreDetails.cardiovascularScore = cardiovascularScore;

  // Coagulation Score (max 2 points)
  let coagulationScore = 0;
  const platelets = parseFloat(inputValues.plateletCount) || 0;
  const inr = parseFloat(inputValues.inr) || 0;
  const dDimer = parseFloat(inputValues.dDimer) || 0;
  const fibrinogen = parseFloat(inputValues.fibrinogen) || 0;

  if (platelets > 0 && platelets < 100) {
    coagulationScore += 1;
  }
  if (inr > 1.3) {
    coagulationScore += 1;
  }
  if (dDimer > 2) {
    coagulationScore += 1;
  }
  if (fibrinogen > 0 && fibrinogen < 100) {
    coagulationScore += 1;
  }
  coagulationScore = Math.min(coagulationScore, 2); // Cap at max 2 points
  totalScore += coagulationScore;
  scoreDetails.coagulationScore = coagulationScore;

  // Neurological Score (max 2 points)
  let neurologicScore = 0;
  const gcs = parseInt(inputValues.glasgowComaScore) || 15;
  const pupilsFixed = inputValues.pupilsFixed || 'No';

  if (gcs <= 10) {
    neurologicScore += 1;
  }
  if (pupilsFixed === 'Yes') {
    neurologicScore = 2; // Overrides GCS if pupils are fixed bilaterally
  }
  totalScore += neurologicScore;
  scoreDetails.neurologicScore = neurologicScore;

  // Systemic Infection (0–1)
  const systemicInfectionScore = parseInt(inputValues.systemicInfection) || 0;
  totalScore += systemicInfectionScore;
  scoreDetails.systemicInfectionScore = systemicInfectionScore;

  // Additional Details (for display purposes)
  scoreDetails.ageCategory = inputValues.ageCategory || 'Not specified';
  scoreDetails.glasgowComaScore = gcs;
  scoreDetails.pao2 = parseFloat(inputValues.pao2) || 0;
  scoreDetails.spo2 = parseFloat(inputValues.spo2) || 0;
  scoreDetails.fio2 = parseFloat(inputValues.fio2) || 0;
  scoreDetails.oxygenationRatio = oxygenationRatio;
  scoreDetails.respiratorySupport = respiratorySupport;
  scoreDetails.vasoactiveMedications = vasoactiveMeds;
  scoreDetails.lactateLevel = lactate;
  scoreDetails.meanArterialPressure = map;
  scoreDetails.plateletCount = platelets;
  scoreDetails.inr = inr;
  scoreDetails.dDimer = dDimer;
  scoreDetails.fibrinogen = fibrinogen;
  scoreDetails.pupilsFixed = pupilsFixed;

  // Interpretation
  let sepsisStatus = 'No Sepsis';
  let clinicalInterpretation = '';
  let mortalityRisk = 0;

  if (totalScore >= 2 && systemicInfectionScore === 1) {
    sepsisStatus = 'Sepsis Present';
    clinicalInterpretation = 'The patient meets criteria for sepsis due to a score ≥ 2 with confirmed or suspected infection.';
    if (cardiovascularScore >= 1 && vasoactiveMeds !== 'None') {
      sepsisStatus = 'Septic Shock Present';
      clinicalInterpretation = 'The patient meets criteria for septic shock due to sepsis with cardiovascular dysfunction and vasoactive medication use.';
    }
  }

  // Simplified Mortality Risk (based on total score, for illustration)
  if (totalScore >= 2 && totalScore < 5) {
    mortalityRisk = 5; // Low risk
  } else if (totalScore >= 5 && totalScore < 8) {
    mortalityRisk = 15; // Moderate risk
  } else if (totalScore >= 8) {
    mortalityRisk = 30; // High risk
  }

  return {
    totalScore,
    sepsisStatus,
    mortalityRisk,
    clinicalInterpretation,
    ...scoreDetails,
  };
};

export default calculatePhoenixScore;