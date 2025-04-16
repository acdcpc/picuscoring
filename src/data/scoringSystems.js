const scoringSystems = [
  {
    id: 'prism3',
    name: 'PRISM-3',
    fields: [
      { name: 'heartRate', label: 'Heart Rate (bpm)', type: 'number' },
      { name: 'bloodPressure', label: 'Systolic Blood Pressure (mmHg)', type: 'number' },
      { name: 'temperature', label: 'Temperature (°C)', type: 'number' },
      { name: 'pupilsFixed', label: 'Pupils Fixed', type: 'select', options: ['No', 'Yes'] },
      { name: 'glasgowComaScore', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
    ],
  },
  {
    id: 'pelod2',
    name: 'PELOD-2',
    fields: [
      { name: 'glasgowComaScore', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
      { name: 'lactate', label: 'Lactate (mmol/L)', type: 'number' },
      { name: 'meanArterialPressure', label: 'Mean Arterial Pressure (mmHg)', type: 'number' },
      { name: 'creatinine', label: 'Creatinine (µmol/L)', type: 'number' },
      { name: 'pao2Fio2', label: 'PaO2/FiO2 Ratio', type: 'number' },
    ],
  },
  {
    id: 'sofa',
    name: 'SOFA',
    fields: [
      { name: 'respiration', label: 'PaO2/FiO2 Ratio', type: 'number' },
      { name: 'coagulation', label: 'Platelets (x10^3/µL)', type: 'number' },
      { name: 'liver', label: 'Bilirubin (mg/dL)', type: 'number' },
      { name: 'cardiovascular', label: 'Mean Arterial Pressure (mmHg)', type: 'number' },
      { name: 'glasgowComaScore', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
      { name: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number' },
    ],
  },
  {
    id: 'pim3',
    name: 'PIM-3',
    fields: [
      { name: 'pupilsFixed', label: 'Pupils Fixed', type: 'select', options: ['No', 'Yes'] },
      { name: 'baseExcess', label: 'Base Excess (mmol/L)', type: 'number' },
      { name: 'systolicBP', label: 'Systolic Blood Pressure (mmHg)', type: 'number' },
      { name: 'fio2', label: 'FiO2 (%)', type: 'number' },
      { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number' },
    ],
  },
  {
    id: 'comfortb',
    name: 'COMFORT-B',
    fields: [
      { name: 'alertness', label: 'Alertness (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'calmness', label: 'Calmness (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'respiratoryResponse', label: 'Respiratory Response (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'movement', label: 'Movement (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'muscleTone', label: 'Muscle Tone (1-5)', type: 'number', min: 1, max: 5 },
      { name: 'facialTension', label: 'Facial Tension (1-5)', type: 'number', min: 1, max: 5 },
    ],
  },
  {
    id: 'sospd',
    name: 'SOS-PD',
    fields: [
      { name: 'anxiety', label: 'Anxiety (0-1)', type: 'number', min: 0, max: 1 },
      { name: 'agitation', label: 'Agitation (0-1)', type: 'number', min: 0, max: 1 },
      { name: 'hallucinations', label: 'Hallucinations (0-1)', type: 'number', min: 0, max: 1 },
      { name: 'inconsolableCrying', label: 'Inconsolable Crying (0-1)', type: 'number', min: 0, max: 1 },
      { name: 'alteredConsciousness', label: 'Altered Consciousness (0-1)', type: 'number', min: 0, max: 1 },
    ],
  },
  {
    id: 'phoenix',
    name: 'PHOENIX Sepsis Score',
    fields: [
      { name: 'respiratoryDysfunction', label: 'Respiratory Dysfunction (0-2)', type: 'number', min: 0, max: 2 },
      { name: 'cardiovascularDysfunction', label: 'Cardiovascular Dysfunction (0-2)', type: 'number', min: 0, max: 2 },
      { name: 'renalDysfunction', label: 'Renal Dysfunction (0-2)', type: 'number', min: 0, max: 2 },
      { name: 'neurologicDysfunction', label: 'Neurologic Dysfunction (0-2)', type: 'number', min: 0, max: 2 },
      { name: 'systemicInfection', label: 'Systemic Infection (0-1)', type: 'number', min: 0, max: 1 },
    ],
  },
];

export default scoringSystems;