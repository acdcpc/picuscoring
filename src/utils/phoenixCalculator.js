/**
 * Phoenix Sepsis Score Calculator
 */
export const calculatePhoenixScore = (inputValues) => {
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  let totalScore = 0;
  const scoreDetails = {};

  // Age-specific thresholds
  const getAgeThresholds = (ageCategory) => {
    switch (ageCategory) {
      case '<1 month':
        return { hrMin: 100, hrMax: 180, rrMin: 30, rrMax: 60, sbpMin: 60 };
      case '1 to 11 months':
        return { hrMin: 90, hrMax: 160, rrMin: 30, rrMax: 50, sbpMin: 70 };
      case '1 to <2 years':
        return { hrMin: 80, hrMax: 150, rrMin: 25, rrMax: 40, sbpMin: 74 };
      case '2 to <5 years':
        return { hrMin: 70, hrMax: 140, rrMin: 22, rrMax: 34, sbpMin: 76 };
      case '5 to <12 years':
        return { hrMin: 60, hrMax: 130, rrMin: 18, rrMax: 30, sbpMin: 80 };
      case '12 to 17 years':
        return { hrMin: 55, hrMax: 120, rrMin: 14, rrMax: 25, sbpMin: 83 };
      default:
        return { hrMin: 60, hrMax: 130, rrMin: 18, rrMax: 30, sbpMin: 80 };
    }
  };

  const thresholds = getAgeThresholds(inputValues.ageCategory);

  // Temperature (2 points)
  const temperature = parseFloat(inputValues.temperature) || 0;
  if (temperature > 38.5 || temperature < 36.0) {
    totalScore += 2;
    scoreDetails.temperatureScore = 2;
  } else {
    scoreDetails.temperatureScore = 0;
  }

  // Heart Rate (1 point)
  const heartRate = parseFloat(inputValues.heartRate) || 0;
  if (heartRate < thresholds.hrMin || heartRate > thresholds.hrMax) {
    totalScore += 1;
    scoreDetails.heartRateScore = 1;
  } else {
    scoreDetails.heartRateScore = 0;
  }

  // Respiratory Rate (1 point)
  const respiratoryRate = parseFloat(inputValues.respiratoryRate) || 0;
  if (respiratoryRate < thresholds.rrMin || respiratoryRate > thresholds.rrMax) {
    totalScore += 1;
    scoreDetails.respiratoryRateScore = 1;
  } else {
    scoreDetails.respiratoryRateScore = 0;
  }

  // Blood Pressure (1 point)
  const systolicBP = parseFloat(inputValues.systolicBP) || 0;
  if (systolicBP > 0 && systolicBP < thresholds.sbpMin) {
    totalScore += 1;
    scoreDetails.bloodPressureScore = 1;
  } else {
    scoreDetails.bloodPressureScore = 0;
  }

  // Consciousness (1 point)
  const consciousness = inputValues.consciousness || 'normal';
  if (consciousness !== 'normal') {
    totalScore += 1;
    scoreDetails.consciousnessScore = 1;
  } else {
    scoreDetails.consciousnessScore = 0;
  }

  // White Blood Cell Count (1 point)
  const wbc = parseFloat(inputValues.wbc) || 0;
  if (wbc > 0 && (wbc < 5 || wbc > 15)) {
    totalScore += 1;
    scoreDetails.wbcScore = 1;
  } else {
    scoreDetails.wbcScore = 0;
  }

  // Skin Perfusion (1 point)
  const skinPerfusion = inputValues.skinPerfusion || 'normal';
  if (skinPerfusion === 'cold' || skinPerfusion === 'delayed') {
    totalScore += 1;
    scoreDetails.skinPerfusionScore = 1;
  } else {
    scoreDetails.skinPerfusionScore = 0;
  }

  // Oxygen Saturation (1 point)
  const spo2 = parseFloat(inputValues.spo2) || 0;
  if (spo2 > 0 && spo2 < 90) {
    totalScore += 1;
    scoreDetails.spo2Score = 1;
  } else {
    scoreDetails.spo2Score = 0;
  }

  // Systemic Infection (0-1)
  const systemicInfection = parseInt(inputValues.systemicInfection) || 0;
  totalScore += systemicInfection;
  scoreDetails.systemicInfectionScore = systemicInfection;

  // Interpretation
  let sepsisStatus = 'No Sepsis';
  let clinicalInterpretation = '';
  if (totalScore >= 2 && systemicInfection === 1) {
    sepsisStatus = 'Sepsis Present';
    clinicalInterpretation = 'Patient meets criteria for sepsis (score ≥2 with infection).';
  }

  // Mortality Risk (simplified)
  const mortalityRisk = totalScore >= 2 ? Math.min(5 + totalScore * 2, 30) : 0;

  return {
    totalScore,
    sepsisStatus,
    mortalityRisk,
    clinicalInterpretation,
    ageCategory: inputValues.ageCategory || 'Not specified',
    ...scoreDetails
  };
};

export default calculatePhoenixScore;