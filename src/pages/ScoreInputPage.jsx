import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import scoringSystems from '../data/scoringSystems';
import ScoreInputForm from '../components/scoring/ScoreInputForm';

const ScoreInputPage = () => {
  const { patientId, scoreType } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});

  // Debug logging
  console.log('ScoreInputPage - patientId:', patientId, 'scoreType:', scoreType);
  console.log('Scoring Systems:', scoringSystems);

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

  const handleSubmit = async (formData) => {
    try {
      const assessmentId = `assessment-${Date.now()}`;
      const assessmentData = {
        patientId,
        scoreType,
        formValues: formData,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      await setDoc(doc(db, 'assessments', assessmentId), assessmentData);
      // Normalize scoreType for navigation (remove hyphens, ensure lowercase)
      const normalizedScoreType = scoreType.toLowerCase().replace(/-/g, '');
      navigate(`/patients/${patientId}/results/${assessmentId}`, {
        state: {
          scoreType: normalizedScoreType,
          formValues: formData,
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
        <ScoreInputForm
          fields={selectedSystem.fields}
          onSubmit={handleSubmit}
          formValues={formValues}
          setFormValues={setFormValues}
        />
      </div>
    </div>
  );
};

export default ScoreInputPage;