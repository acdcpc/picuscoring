import React from 'react';
import { Link } from 'react-router-dom';

const PatientListPage = () => {
  // Mock patient data for prototype
  const patients = [
    {
      id: '1',
      name: 'John Doe',
      age: '8 years',
      mrn: '12345',
      lastScore: { type: 'PRISM-3', value: 15, time: '2 hours ago' }
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: '5 years',
      mrn: '67890',
      lastScore: { type: 'COMFORT-B', value: 12, time: '5 hours ago' }
    },
    {
      id: '3',
      name: 'Michael Johnson',
      age: '10 years',
      mrn: '24680',
      lastScore: { type: 'SOFA', value: 8, time: 'Yesterday, 14:30' }
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Add Patient
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <label className="text-sm text-gray-600 mr-2">Sort by:</label>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>Recent</option>
              <option>Name</option>
              <option>Age</option>
              <option>Score</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 mr-2">Filter:</label>
            <select className="border rounded-md px-2 py-1 text-sm">
              <option>All</option>
              <option>High Risk</option>
              <option>Medium Risk</option>
              <option>Low Risk</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {patients.map((patient) => (
          <Link 
            key={patient.id}
            to={`/patients/${patient.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <h2 className="text-lg font-semibold">{patient.name}, {patient.age}</h2>
              <p className="text-gray-600">MRN: {patient.mrn}</p>
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm">
                  Last Score: {patient.lastScore.type} ({patient.lastScore.value})
                </p>
                <p className="text-sm text-gray-500">{patient.lastScore.time}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PatientListPage;
