import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import scoringSystems from '../data/scoringSystems';

const ScoreInputPage = () => {
  const { patientId, scoreType } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});

  // Find the selected scoring system
  const selectedSystem = scoringSystems.find((system) => system.id === scoreType) || {
    id: scoreType,
    name: 'Unknown Score',
    fields: [],
  };

  // Check if the scoring system is valid
  if (!scoringSystems.find((system) => system.id === scoreType)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error: Scoring System Not Found</h1>
        <p className="text-gray-600">
          The scoring system "{scoreType}" is not recognized. Please select a valid scoring system.
        </p>
        <Link to={`/patients/${patientId}/new-assessment`} className="text-blue-600 hover:underline">
          Go Back
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const assessmentId = `assessment-${Date.now()}`;
      const assessmentData = {
        patientId,
        scoreType,
        formValues,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      await setDoc(doc(db, 'assessments', assessmentId), assessmentData);
      navigate(`/patients/${patientId}/results/${assessmentId}`, {
        state: {
          scoreType,
          formValues,
        },
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to={`/patients/${patientId}/new-assessment`} className="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">{selectedSystem.name} Input</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-medium mb-4">Enter Score Parameters</h2>
          <div className="space-y-4">
            {selectedSystem.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
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
                    name={field.name}
                    value={formValues[field.name] || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    min={field.min}
                    max={field.max}
                  />
                )}
              </div>
            ))}
            {selectedSystem.fields.length === 0 && (
              <p className="text-gray-500">No fields defined for this score type.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Calculate Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreInputPage;