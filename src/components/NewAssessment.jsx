import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';
import ScoreCalculator from './scoring/ScoreCalculator';

const NewAssessment = () => {
  console.log('NewAssessment component rendered');
  console.log('scoringSystems:', scoringSystems);

  const { patientId } = useParams();
  const [scoreType, setScoreType] = useState('');
  const [inputValues, setInputValues] = useState({});
  const [calculatedScore, setCalculatedScore] = useState(null);

  const handleInputChange = (fieldName, value) => {
    setInputValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // The ScoreCalculator will handle the calculation
  };

  const selectedScoringSystem = scoringSystems?.find((system) => system.id === scoreType.toLowerCase());

  if (!scoringSystems) {
    return (
      <div className="p-6 text-red-600">
        <h2 className="text-xl font-bold">Error</h2>
        <p>Scoring systems data is not available. Please check the data source.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">New Assessment for Patient ID: {patientId}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Select Scoring System</label>
          <select
            value={scoreType}
            onChange={(e) => setScoreType(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select a scoring system</option>
            {scoringSystems.map((system) => (
              <option key={system.id} value={system.id}>
                {system.name}
              </option>
            ))}
          </select>
        </div>

        {selectedScoringSystem && (
          <div className="space-y-4">
            {selectedScoringSystem.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 font-medium mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    value={inputValues[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select an option</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={inputValues[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    min={field.min}
                    max={field.max}
                    className="w-full p-2 border rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Calculate Score
        </button>
      </form>

      {scoreType && (
        <div className="mt-6">
          <ScoreCalculator
            scoreType={scoreType}
            patientData={{ id: patientId, ageCategory: inputValues.ageCategory }}
            inputValues={inputValues}
            setCalculatedScore={setCalculatedScore}
          />
        </div>
      )}
    </div>
  );
};

export default NewAssessment;