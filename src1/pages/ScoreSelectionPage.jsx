import React from 'react';
import { useParams, Link } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const ScoreSelectionPage = () => {
  const { patientId } = useParams();
  
  // Mock patient data for prototype
  const patient = {
    id: patientId,
    name: patientId === '1' ? 'John Doe' : patientId === '2' ? 'Jane Smith' : 'Michael Johnson',
    mrn: patientId === '1' ? '12345' : patientId === '2' ? '67890' : '24680',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to={`/patients/${patientId}`} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">New Assessment</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Patient: {patient.name}</h2>
        <p className="text-gray-600 mb-6">MRN: {patient.mrn}</p>
        
        <h3 className="text-lg font-medium mb-4">Select Score Type:</h3>
        
        <div className="space-y-4">
          {scoringSystems.map((system) => (
            <div key={system.id} className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer">
              <Link to={`/patients/${patientId}/score/${system.id}`} className="block">
                <div className="flex items-start">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-3 mt-1"></div>
                  <div>
                    <h4 className="font-medium">{system.name} Score</h4>
                    <p className="text-sm text-gray-600">{system.purpose}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreSelectionPage;
