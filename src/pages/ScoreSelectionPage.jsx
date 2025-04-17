import React from 'react';
import { useParams, Link } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const ScoreSelectionPage = () => {
  const { patientId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Select Scoring System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scoringSystems.map((system) => (
          <Link
            key={system.id}
            to={`/patients/${patientId}/score/${system.id}`}
            className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-lg font-medium">{system.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScoreSelectionPage;