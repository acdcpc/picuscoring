import React, { useState, useEffect } from 'react';
import ScoreCalculator from './ScoreCalculator'; // Adjust path as needed

const scoringSystems = [
  { id: 'prism3', name: 'PRISM-3' },
  { id: 'pelod2', name: 'PELOD-2' },
  { id: 'psofa', name: 'pSOFA' },
  { id: 'pim3', name: 'PIM-3' },
  { id: 'comfortb', name: 'COMFORT-B' },
  { id: 'sospd', name: 'SOS-PD' },
  { id: 'phoenix', name: 'Phoenix' },
];

const NewAssessment = ({ patientData }) => {
  console.log('NewAssessment component loaded');
  console.log('scoringSystems:', scoringSystems);

  const [scoreType, setScoreType] = useState('');
  const [inputValues, setInputValues] = useState({});

  // Handler for form inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setInputValues((prev) => ({ ...prev, [name]: val }));
  };

  useEffect(() => {
    console.log('Rendering NewAssessment JSX');
  }, []);

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

      {/* Example form inputs for COMFORT-B */}
      {scoreType === 'comfortb' && (
        <div>
          <label>
            Alertness (1-5):
            <input
              type="number"
              name="alertness"
              value={inputValues.alertness || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Calmness (1-5):
            <input
              type="number"
              name="calmness"
              value={inputValues.calmness || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Respiratory Response (1-5):
            <input
              type="number"
              name="respiratory"
              value={inputValues.respiratory || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Is Ventilated:
            <input
              type="checkbox"
              name="isVentilated"
              checked={inputValues.isVentilated || false}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Movement (1-5):
            <input
              type="number"
              name="movement"
              value={inputValues.movement || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Muscle Tone (1-5):
            <input
              type="number"
              name="muscleTone"
              value={inputValues.muscleTone || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
          <label>
            Facial Tension (1-5):
            <input
              type="number"
              name="facialTension"
              value={inputValues.facialTension || ''}
              onChange={handleInputChange}
              min="1"
              max="5"
            />
          </label>
        </div>
      )}

      {/* Add forms for other score types as needed */}
      {scoreType === 'prism3' && (
        <div>
          <label>
            Glasgow Coma Score (3-15):
            <input
              type="number"
              name="gcs"
              value={inputValues.gcs || ''}
              onChange={handleInputChange}
              min="3"
              max="15"
            />
          </label>
          <label>
            Systolic BP (mmHg):
            <input
              type="number"
              name="systolicBP"
              value={inputValues.systolicBP || ''}
              onChange={handleInputChange}
            />
          </label>
          {/* Add more fields as required for PRISM-3 */}
        </div>
      )}

      {/* Render ScoreCalculator */}
      {scoreType && (
        <ScoreCalculator
          scoreType={scoreType}
          patientData={patientData}
          inputValues={inputValues}
        />
      )}
    </div>
  );
};

export default NewAssessment;