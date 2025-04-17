import React, { useState, useEffect } from 'react';
import ScoreCalculator from './scoring/ScoreCalculator';
import ScoreInputForm from './scoring/ScoreInputForm';

const scoringSystems = [
  { id: 'prism3', name: 'PRISM-3' },
  { id: 'pelod2', name: 'PELOD-2' },
  { id: 'psofa', name: 'pSOFA' },
  { id: 'pim3', name: 'PIM-3' },
  { id: 'comfortb', name: 'COMFORT-B' },
  { id: 'sospd', name: 'SOS-PD' },
  { id: 'phoenix', name: 'Phoenix' },
];

const scoreFields = {
  prism3: [
    { name: 'gcs', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
    { name: 'systolicBP', label: 'Systolic BP (mmHg)', type: 'number', min: 0 },
    { name: 'heartRate', label: 'Heart Rate (bpm)', type: 'number', min: 0 },
    { name: 'temperature', label: 'Temperature (°C)', type: 'number', min: 30, max: 45 },
    { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number', min: 0 },
    { name: 'paco2', label: 'PaCO2 (mmHg)', type: 'number', min: 0 },
    { name: 'glucose', label: 'Glucose (mg/dL)', type: 'number', min: 0 },
    { name: 'potassium', label: 'Potassium (mEq/L)', type: 'number', min: 0 },
    { name: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', min: 0 },
    { name: 'wbc', label: 'White Blood Cell Count (x10^9/L)', type: 'number', min: 0 },
    { name: 'platelets', label: 'Platelet Count (x10^9/L)', type: 'number', min: 0 },
    { name: 'ph', label: 'pH', type: 'number', min: 6.5, max: 8.0 },
  ],
  pelod2: [
    { name: 'gcs', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
    { name: 'pupillaryReaction', label: 'Pupillary Reaction', type: 'select', options: ['normal', 'both_fixed'] },
    { name: 'lactate', label: 'Lactate (mmol/L)', type: 'number', min: 0 },
    { name: 'pao2_fio2', label: 'PaO2/FiO2 Ratio', type: 'number', min: 0 },
    { name: 'paco2', label: 'PaCO2 (mmHg)', type: 'number', min: 0 },
    { name: 'invasiveVentilation', label: 'Invasive Ventilation', type: 'select', options: ['yes', 'no'] },
    { name: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', min: 0 },
    { name: 'wbc', label: 'White Blood Cell Count (x10^9/L)', type: 'number', min: 0 },
    { name: 'platelets', label: 'Platelet Count (x10^9/L)', type: 'number', min: 0 },
  ],
  psofa: [
    { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number', min: 0 },
    { name: 'spo2', label: 'SpO2 (%)', type: 'number', min: 0, max: 100 },
    { name: 'fio2', label: 'FiO2 (%)', type: 'number', min: 21, max: 100 },
    { name: 'oxygenMeasurement', label: 'Oxygen Measurement', type: 'select', options: ['PaO2', 'SpO2'] },
    { name: 'mechanicalVentilation', label: 'Mechanical Ventilation', type: 'select', options: ['yes', 'no'] },
    { name: 'platelets', label: 'Platelet Count (x10^9/L)', type: 'number', min: 0 },
    { name: 'bilirubin', label: 'Bilirubin (mg/dL)', type: 'number', min: 0 },
    { name: 'meanArterialPressure', label: 'Mean Arterial Pressure (mmHg)', type: 'number', min: 0 },
    { name: 'dopamine', label: 'Dopamine (μg/kg/min)', type: 'number', min: 0 },
    { name: 'dobutamine', label: 'Dobutamine (μg/kg/min)', type: 'number', min: 0 },
    { name: 'epinephrine', label: 'Epinephrine (μg/kg/min)', type: 'number', min: 0 },
    { name: 'norepinephrine', label: 'Norepinephrine (μg/kg/min)', type: 'number', min: 0 },
    { name: 'glasgowComaScore', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
    { name: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', min: 0 },
  ],
  pim3: [
    { name: 'systolicBP', label: 'Systolic BP (mmHg)', type: 'number', min: 0 },
    { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number', min: 0 },
    { name: 'fio2', label: 'FiO2 (%)', type: 'number', min: 21, max: 100 },
    { name: 'baseExcess', label: 'Base Excess (mEq/L)', type: 'number' },
    { name: 'pupillaryReaction', label: 'Pupillary Reaction', type: 'select', options: ['normal', 'both_fixed'] },
    { name: 'mechanicalVentilation', label: 'Mechanical Ventilation', type: 'select', options: ['yes', 'no'] },
  ],
  comfortb: [
    { name: 'alertness', label: 'Alertness', type: 'number', min: 1, max: 5 },
    { name: 'calmness', label: 'Calmness', type: 'number', min: 1, max: 5 },
    { name: 'respiratory', label: 'Respiratory Response', type: 'number', min: 1, max: 5 },
    { name: 'isVentilated', label: 'Is Ventilated', type: 'select', options: ['yes', 'no'] },
    { name: 'movement', label: 'Movement', type: 'number', min: 1, max: 5 },
    { name: 'muscleTone', label: 'Muscle Tone', type: 'number', min: 1, max: 5 },
    { name: 'facialTension', label: 'Facial Tension', type: 'number', min: 1, max: 5 },
  ],
  sospd: [
    { name: 'respiratoryRate', label: 'Respiratory Rate (breaths/min)', type: 'number', min: 0 },
    { name: 'spo2', label: 'SpO2 (%)', type: 'number', min: 0, max: 100 },
    { name: 'fio2', label: 'FiO2 (%)', type: 'number', min: 21, max: 100 },
    { name: 'oxygenTherapy', label: 'Oxygen Therapy', type: 'select', options: ['yes', 'no'] },
  ],
  phoenix: [
    { name: 'oxygenMeasurement', label: 'Oxygen Measurement', type: 'select', options: ['PaO2', 'SpO2'] },
    { name: 'pao2', label: 'PaO2 (mmHg)', type: 'number', min: 0 },
    { name: 'spo2', label: 'SpO2 (%)', type: 'number', min: 0, max: 100 },
    { name: 'respiratorySupport', label: 'Respiratory Support', type: 'select', options: ['none', 'non_imv', 'imv'] },
    { name: 'vasoactiveMedications', label: 'Vasoactive Medications', type: 'select', options: ['0', '1', '2_or_more'] },
    { name: 'lactate', label: 'Lactate (mmol/L)', type: 'number', min: 0 },
    { name: 'map', label: 'Mean Arterial Pressure (mmHg)', type: 'number', min: 0 },
    { name: 'platelets', label: 'Platelets (x10³ μL)', type: 'number', min: 0 },
    { name: 'inr', label: 'INR', type: 'number', min: 0 },
    { name: 'dDimer', label: 'D-dimer (mg/L FEU)', type: 'number', min: 0 },
    { name: 'fibrinogen', label: 'Fibrinogen (mg/dL)', type: 'number', min: 0 },
    { name: 'gcs', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
    { name: 'pupils', label: 'Pupillary Reaction', type: 'select', options: ['reactive', 'fixed'] },
    { name: 'systemicInfection', label: 'Systemic Infection', type: 'select', options: ['0', '1'] },
  ],
};

const NewAssessment = ({ patientData = { id: 'default', ageCategory: '5 to <12 years' } }) => {
  console.log('NewAssessment patientData:', patientData);

  const [scoreType, setScoreType] = useState('');
  const [formValues, setFormValues] = useState({});
  const [calculatedScore, setCalculatedScore] = useState(null);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setFormValues({});
    setCalculatedScore(null);
    setFormError('');
  }, [scoreType]);

  const handleSubmit = (values) => {
    console.log('NewAssessment formValues:', values);
    const requiredFields = scoreFields[scoreType] || [];
    const missingFields = requiredFields
      .filter(field => values[field.name] === undefined || values[field.name] === '')
      .map(field => field.label);
    
    if (missingFields.length > 0) {
      setFormError(`Please fill in: ${missingFields.join(', ')}`);
      setCalculatedScore(null);
      return;
    }

    setFormError('');
    setCalculatedScore(null);
    setFormValues(values);
  };

  const fields = scoreType ? scoreFields[scoreType] || [] : [];

  return (
    <div>
      <h2>New Assessment</h2>
      <label>
        Select Score Type:
        <select value={scoreType} onChange={(e) => setScoreType(e.target.value)}>
          <option value="">Select a score</option>
          {scoringSystems.map((system) => (
            <option key={system.id} value={system.id}>
              {system.name}
            </option>
          ))}
        </select>
      </label>

      {scoreType && (
        <>
          <ScoreInputForm
            fields={fields}
            onSubmit={handleSubmit}
            formValues={formValues}
            setFormValues={setFormValues}
          />
          {formError && (
            <p className="text-red-600 mt-2">{formError}</p>
          )}
        </>
      )}

      {scoreType && (
        <ScoreCalculator
          scoreType={scoreType}
          patientData={patientData}
          inputValues={formValues}
          setCalculatedScore={setCalculatedScore}
        />
      )}

      {calculatedScore && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Score Result</h3>
          {calculatedScore.error ? (
            <p className="text-red-600">Error: {calculatedScore.error}</p>
          ) : (
            <div>
              <p className="text-gray-700">
                Total Score: {calculatedScore.totalScore || 'N/A'}
              </p>
              {calculatedScore.mortalityRisk && (
                <p className="text-gray-700">
                  Mortality Risk: {calculatedScore.mortalityRisk}%
                </p>
              )}
              {calculatedScore.sepsisStatus && (
                <p className="text-gray-700">
                  Sepsis Status: {calculatedScore.sepsisStatus}
                </p>
              )}
              {calculatedScore.severityCategory && (
                <p className="text-gray-700">
                  Severity: {calculatedScore.severityCategory}
                </p>
              )}
              {calculatedScore.deliriumPresent !== undefined && (
                <p className="text-gray-700">
                  Delirium Present: {calculatedScore.deliriumPresent ? 'Yes' : 'No'}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewAssessment;