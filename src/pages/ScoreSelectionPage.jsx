import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const ScoreSelectionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const handleScoreSelection = (scoreType) => {
    navigate(`/patients/${patientId}/score/${scoreType}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to={`/patients/${patientId}`} className="mr-2">
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
          <h1 className="text-2xl font-bold">Select Scoring System</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Available Scoring Systems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scoringSystems.map((system) => (
            <button
              key={system.id}
              onClick={() => handleScoreSelection(system.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-center"
            >
              {system.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreSelectionPage;