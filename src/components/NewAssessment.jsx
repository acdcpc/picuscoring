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

// Define fields for each score type
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
    { name: 'pao2_fio2', label: 'PaO2/FiO2 Ratio', type: 'number', min: 0 },
    { name: 'platelets', label: 'Platelet Count (x10^9/L)', type: 'number', min: 0 },
    { name: 'bilirubin', label: 'Bilirubin (mg/dL)', type: 'number', min: 0 },
    { name: 'map', label: 'Mean Arterial Pressure (mmHg)', type: 'number', min: 0 },
    { name: 'gcs', label: 'Glasgow Coma Score', type: 'number', min: 3, max: 15 },
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
    { name: 'respiratoryRate', label: 'Respiratory Rate (breaths/min)', type: 'number', min: 0 },
    { name: 'spo2', label: 'SpO2 (%)', type: 'number', min: 0, max: 100 },
    { name: 'fio2', label: 'FiO2 (%)', type: 'number', min: 21, max: 100 },
    { name: 'oxygenTherapy', label: 'Oxygen Therapy', type: 'select', options: ['yes', 'no'] },
    { name: 'invasiveVentilation', label: 'Invasive Ventilation', type: 'select', options: ['yes', 'no'] },
  ],
};

const NewAssessment = ({ patientData }) => {
  console.log('NewAssessment component loaded');
  console.log('scoringSystems:', scoringSystems);

  const [scoreType, setScoreType] = useState('');
  const [formValues, setFormValues] = useState({});
  const [calculatedScore, setCalculatedScore] = useState(null); // Store the calculated score

  useEffect(() => {
    console.log('Rendering NewAssessment JSX');
  }, []);

  // Reset form values when score type changes
  useEffect(() => {
    setFormValues({});
    setCalculatedScore(null);
  }, [scoreType]);

  // Handle form submission
  const handleSubmit = (values) => {
    // Trigger score calculation by updating the state
    setCalculatedScore(null); // Reset previous score
    setFormValues(values); // Update form values
    // The ScoreCalculator will use the updated formValues to calculate the score
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

      {/* Render ScoreInputForm */}
      {scoreType && (
        <ScoreInputForm
          fields={fields}
          onSubmit={handleSubmit}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      )}

      {/* Render ScoreCalculator */}
      {scoreType && (
        <ScoreCalculator
          scoreType={scoreType}
          patientData={patientData}
          inputValues={formValues}
          setCalculatedScore={setCalculatedScore} // Pass setter to update the score
        />
      )}

      {/* Display the calculated score */}
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