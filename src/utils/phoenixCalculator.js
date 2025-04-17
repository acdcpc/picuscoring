const calculatePhoenixScore = (inputValues) => {
  // Parse input values, default to 0 if not provided
  const respiratory = parseInt(inputValues.respiratoryDysfunction) || 0;
  const cardiovascular = parseInt(inputValues.cardiovascularDysfunction) || 0;
  const renal = parseInt(inputValues.renalDysfunction) || 0;
  const neurologic = parseInt(inputValues.neurologicDysfunction) || 0;
  const systemicInfection = parseInt(inputValues.systemicInfection) || 0;
  const hematologic = parseInt(inputValues.hematologicDysfunction) || 0;
  const hepatic = parseInt(inputValues.hepaticDysfunction) || 0;
  const immune = parseInt(inputValues.immuneDysfunction) || 0;
  const lactate = parseFloat(inputValues.lactateLevel) || 0;
  const platelets = parseInt(inputValues.plateletCount) || 0;
  const bilirubin = parseFloat(inputValues.bilirubinLevel) || 0;
  const creatinine = parseFloat(inputValues.creatinineLevel) || 0;
  const invasiveVentilation = inputValues.invasiveVentilation === 'Yes' ? 1 : 0;
  const vasopressorUse = inputValues.vasopressorUse === 'Yes' ? 1 : 0;
  const glasgowComaScore = parseInt(inputValues.glasgowComaScore) || 15;
  const pao2Fio2 = parseFloat(inputValues.pao2Fio2Ratio) || 500;

  // Calculate base score from predefined dysfunction categories
  let totalScore = respiratory + cardiovascular + renal + neurologic + systemicInfection + hematologic + hepatic + immune;

  // Adjust score based on additional parameters (simplified thresholds based on PHOENIX criteria)
  if (lactate >= 4) totalScore += 1; // Severe lactic acidosis
  if (platelets < 100) totalScore += 1; // Thrombocytopenia
  if (bilirubin >= 2) totalScore += 1; // Hyperbilirubinemia
  if (creatinine >= 2) totalScore += 1; // Acute kidney injury
  if (invasiveVentilation) totalScore += 1; // Mechanical ventilation
  if (vasopressorUse) totalScore += 1; // Vasopressor support
  if (glasgowComaScore < 13) totalScore += (15 - glasgowComaScore) >= 3 ? 1 : 0; // Neurologic impairment
  if (pao2Fio2 < 200) totalScore += 1; // Severe hypoxemia

  // Cap the total score to prevent overestimation
  totalScore = Math.min(totalScore, 20); // PHOENIX max score is typically around 20

  // Determine sepsis status and mortality risk
  let sepsisStatus = 'No Sepsis';
  let mortalityRisk = 0;
  let clinicalInterpretation = 'No sepsis detected. Continue monitoring.';

  if (systemicInfection >= 1 && totalScore >= 2) {
    sepsisStatus = 'Sepsis';
    mortalityRisk = Math.min((totalScore * 2.5).toFixed(1), 50); // Approx. 2.5% per point up to 50%
    clinicalInterpretation = 'Sepsis detected. Initiate sepsis protocol.';
    if (totalScore >= 5) {
      sepsisStatus = 'Severe Sepsis';
      mortalityRisk = Math.min((totalScore * 3).toFixed(1), 75);
      clinicalInterpretation = 'Severe sepsis detected. Urgent intervention required.';
    }
    if (totalScore >= 8) {
      sepsisStatus = 'Septic Shock';
      mortalityRisk = Math.min((totalScore * 3.5).toFixed(1), 90);
      clinicalInterpretation = 'Septic shock detected. Immediate critical care needed.';
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
    hematologicScore: hematologic,
    hepaticScore: hepatic,
    immuneScore: immune,
    lactateScore: lactate >= 4 ? 1 : 0,
    plateletScore: platelets < 100 ? 1 : 0,
    bilirubinScore: bilirubin >= 2 ? 1 : 0,
    creatinineScore: creatinine >= 2 ? 1 : 0,
    invasiveVentilationScore: invasiveVentilation,
    vasopressorScore: vasopressorUse,
    glasgowComaScore: 15 - glasgowComaScore >= 3 ? 1 : 0,
    pao2Fio2Score: pao2Fio2 < 200 ? 1 : 0,
  };
};

export default calculatePhoenixScore;