import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScoreInputForm from '../components/scoring/ScoreInputForm';
import scoringSystems from '../data/scoringSystems';

const ScoreInputPage = () => {
  const { patientId, scoreType } = useParams();
  const [loading, setLoading] = useState(true);
  
  // Find the selected scoring system
  const selectedSystem = scoringSystems.find(system => system.id === scoreType);
  
  // Mock patient data for prototype
  const patient = {
    id: patientId,
    name: patientId === '1' ? 'John Doe' : patientId === '2' ? 'Jane Smith' : 'Michael Johnson',
    age: patientId === '1' ? '8 years' : patientId === '2' ? '5 years' : '10 years',
    ageInMonths: patientId === '1' ? 96 : patientId === '2' ? 60 : 120,
    ageCategory: patientId === '1' ? 'child' : patientId === '2' ? 'child' : 'child',
  };
  
  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to={`/patients/${patientId}/new-assessment`} className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold">{selectedSystem?.name} Score</h1>
        <button className="ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Help
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Patient: {patient.name}</h2>
          <p className="text-gray-600">Age: {patient.age}</p>
          {scoreType === 'prism3' && (
            <p className="text-gray-600">Age Category: {
              patient.age.includes('years') ? 
                parseInt(patient.age) < 2 ? 'Infant (31 days - 2 years)' : 
                parseInt(patient.age) < 13 ? 'Child (2 years - 12 years)' : 
                'Adolescent (13 years and up)' : 
                'Neonate (0-30 days)'
            }</p>
          )}
        </div>
        
        <ScoreInputForm />
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">About {selectedSystem?.name}</h2>
        <p className="text-gray-700 mb-4">{selectedSystem?.description}</p>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Purpose:</h3>
          <p className="text-gray-700">{selectedSystem?.purpose}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Components:</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {selectedSystem?.components.map((component, index) => (
              <li key={index}>{component}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-medium mb-2">Timeframe:</h3>
          <p className="text-gray-700">{selectedSystem?.timeframe}</p>
        </div>
      </div>
    </div>
  );
};

export default ScoreInputPage;
