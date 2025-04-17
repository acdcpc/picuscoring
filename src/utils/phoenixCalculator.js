/**
 * Phoenix Sepsis Score Calculator
 */
export const calculatePhoenixScore = (inputValues) => {
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  if (!inputValues.ageCategory) {
    throw new Error('Age category is required');
  }

  let totalScore = 0;
  const scoreDetails = {};

  // Age-specific thresholds for MAP
  const getAgeThresholds = (ageCategory) => {
    switch (ageCategory) {
      case '<1 month':
        return { mapMin: 31 };
      case '1 to 11 months':
        return { mapMin: 39 };
      case '1 to <2 years':
        return { mapMin: 44 };
      case '2 to <5 years':
        return { mapMin: 49 };
      case '5 to <12 years':
        return { mapMin: 52 };
      case '12 to 17 years':
        return { mapMin: 62 };
      default:
        return { mapMin: 52 }; // Default to 5 to <12 years
    }
  };

  const thresholds = getAgeThresholds(inputValues.ageCategory);

  // Respiratory (max 3 points)
  const oxygenMeasurement = inputValues.oxygenMeasurement || '';
  const pao2 = parseFloat(inputValues.pao2) || 0;
  const spo2 = parseFloat(inputValues.spo2) || 0;
  const respiratorySupport = inputValues.respiratorySupport || 'none';

  // Oxygenation (1 point for PaO2 <40 or SpO2 <75%)
  if (oxygenMeasurement === 'PaO2' && pao2 > 0 && pao2 < 40) {
    totalScore += 1;
    scoreDetails.oxygenationScore = 1;
  } else if (oxygenMeasurement === 'SpO2' && spo2 > 0 && spo2 < 75) {
    totalScore += 1;
    scoreDetails.oxygenationScore = 1;
  } else {
    scoreDetails.oxygenationScore = 0;
  }

  // Respiratory Support (1-2 points)
  if (respiratorySupport === 'non_imv') {
    totalScore += 1;
    scoreDetails.respiratorySupportScore = 1;
  } else if (respiratorySupport === 'imv') {
    totalScore += 2;
    scoreDetails.respiratorySupportScore = 2;
  } else {
    scoreDetails.respiratorySupportScore = 0;
  }

  // Cardiovascular (max 6 points)
  const vasoactiveMedications = inputValues.vasoactiveMedications || '0';
  const lactate = parseFloat(inputValues.lactate) || 0;
  const map = parseFloat(inputValues.map) || 0;

  // Vasoactive Medications (1-2 points)
  if (vasoactiveMedications === '1') {
    totalScore += 1;
    scoreDetails.vasoactiveScore = 1;
  } else if (vasoactiveMedications === '2_or_more') {
    totalScore += 2;
    scoreDetails.vasoactiveScore = 2;
  } else {
    scoreDetails.vasoactiveScore = 0;
  }

  // Lactate (1-2 points)
  if (lactate >= 5 && lactate <= 10.9) {
    totalScore += 1;
    scoreDetails.lactateScore = 1;
  } else if (lactate > 10.9) {
    totalScore += 2;
    scoreDetails.lactateScore = 2;
  } else {
    scoreDetails.lactateScore = 0;
  }

  // MAP (1-2 points)
  if (map > 0 && map < thresholds.mapMin) {
    totalScore += 2;
    scoreDetails.mapScore = 2;
  } else {
    scoreDetails.mapScore = 0;
  }

  // Coagulation (max 2 points)
  const platelets = parseFloat(inputValues.platelets) || 0;
  const inr = parseFloat(inputValues.inr) || 0;
  const dDimer = parseFloat(inputValues.dDimer) || 0;
  const fibrinogen = parseFloat(inputValues.fibrinogen) || 0;

  // Platelets (0-1 point)
  if (platelets > 0 && platelets < 100) {
    totalScore += 1;
    scoreDetails.plateletsScore = 1;
  } else {
    scoreDetails.plateletsScore = 0;
  }

  // INR (0-1 point)
  if (inr > 1.3) {
    totalScore += 1;
    scoreDetails.inrScore = 1;
  } else {
    scoreDetails.inrScore = 0;
  }

  // D-dimer (0-1 point)
  if (dDimer > 2) {
    totalScore += 1;
    scoreDetails.dDimerScore = 1;
  } else {
    scoreDetails.dDimerScore = 0;
  }

  // Fibrinogen (0-1 point)
  if (fibrinogen > 0 && fibrinogen < 100) {
    totalScore += 1;
    scoreDetails.fibrinogenScore = 1;
  } else {
    scoreDetails.fibrinogenScore = 0;
  }

  // Neurological (max 2 points)
  const gcs = parseFloat(inputValues.gcs) || 15;
  const pupils = inputValues.pupils || 'reactive';

  if (pupils === 'fixed') {
    totalScore += 2;
    scoreDetails.neurologicalScore = 2;
  } else if (gcs <= 10) {
    totalScore += 1;
    scoreDetails.neurologicalScore = 1;
  } else {
    scoreDetails.neurologicalScore = 0;
  }

  // Systemic Infection (for sepsis diagnosis, not scored)
  const systemicInfection = parseInt(inputValues.systemicInfection) || 0;

  // Interpretation
  let sepsisStatus = 'No Sepsis';
  let clinicalInterpretation = '';
  if (totalScore >= 2 && systemicInfection === 1) {
    sepsisStatus = 'Sepsis Present';
    clinicalInterpretation = 'Patient meets criteria for sepsis (score ≥2 with suspected infection).';
  }

  // Mortality Risk (simplified, based on total score)
  const mortalityRisk = totalScore >= 2 ? Math.min(5 + totalScore * 2, 50) : 0;

  return {
    totalScore,
    sepsisStatus,
    mortalityRisk,
    clinicalInterpretation,
    ageCategory: inputValues.ageCategory,
    ...scoreDetails
  };
};

export default calculatePhoenixScore;