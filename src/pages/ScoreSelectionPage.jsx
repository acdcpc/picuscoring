import React from 'react';
import { useParams, Link } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const ScoreSelectionPage = () => {
  const { patientId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
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
        <h1 className="text-2xl font-bold">Select a Scoring System</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scoringSystems.map((system) => (
          <Link
            key={system.id}
            to={`/patients/${patientId}/score/${system.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4"
          >
            <h2 className="text-lg font-semibold">{system.fullName} ({system.name})</h2>
            <p className="text-gray-600">{system.description}</p>
            <p className="text-gray-600 mt-2">
              <span className="font-medium">Purpose:</span> {system.purpose}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Age Groups:</span>{' '}
              {system.ageGroups.map((group) => `${group.name} (${group.range})`).join(', ')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScoreSelectionPage;