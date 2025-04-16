const calculatePhoenixScore = (inputValues) => {
  // Extract values
  const respiratory = parseInt(inputValues.respiratoryDysfunction) || 0;
  const cardiovascular = parseInt(inputValues.cardiovascularDysfunction) || 0;
  const renal = parseInt(inputValues.renalDysfunction) || 0;
  const neurologic = parseInt(inputValues.neurologicDysfunction) || 0;
  const systemicInfection = parseInt(inputValues.systemicInfection) || 0;

  // Calculate total score
  const totalScore = respiratory + cardiovascular + renal + neurologic + systemicInfection;

  // Determine sepsis status
  let sepsisStatus = 'No Sepsis';
  let mortalityRisk = 0;
  let clinicalInterpretation = 'No sepsis detected. Continue monitoring.';

  if (systemicInfection >= 1 && totalScore >= 2) {
    sepsisStatus = 'Sepsis';
    mortalityRisk = (totalScore * 2).toFixed(1); // Simplified risk estimation
    clinicalInterpretation = 'Sepsis detected. Initiate sepsis protocol.';
    if (totalScore >= 4) {
      sepsisStatus = 'Septic Shock';
      mortalityRisk = (totalScore * 3).toFixed(1); // Higher risk for septic shock
      clinicalInterpretation = 'Septic shock detected. Urgent intervention required.';
    }
  }

  return {
    totalScore,
    sepsisStatus,
    mortalityRisk,
    clinicalInterpretation,
    respiratoryScore: respiratory,
    cardiovascularScore: cardiovascular,
    renalScore: renal,
    neurologicScore: neurologic,
    systemicInfectionScore: systemicInfection,
  };
};

export default calculatePhoenixScore;