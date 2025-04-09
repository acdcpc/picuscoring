import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  
  // Mock patient data for prototype
  const patient = {
    id: patientId,
    name: patientId === '1' ? 'John Doe' : patientId === '2' ? 'Jane Smith' : 'Michael Johnson',
    age: patientId === '1' ? '8 years' : patientId === '2' ? '5 years' : '10 years',
    dob: patientId === '1' ? '01/15/2017' : patientId === '2' ? '03/22/2020' : '11/05/2015',
    mrn: patientId === '1' ? '12345' : patientId === '2' ? '67890' : '24680',
    gender: patientId === '1' ? 'Male' : patientId === '2' ? 'Female' : 'Male',
    weight: patientId === '1' ? '26 kg' : patientId === '2' ? '18 kg' : '32 kg',
    height: patientId === '1' ? '128 cm' : patientId === '2' ? '110 cm' : '142 cm',
  };
  
  // Mock assessment data for prototype
  const assessments = [
    {
      id: '1',
      type: 'PRISM-3',
      value: 15,
      risk: 'High Risk',
      date: '04/03/2025',
      time: '08:30'
    },
    {
      id: '2',
      type: 'SOFA',
      value: 8,
      risk: 'Moderate',
      date: '04/02/2025',
      time: '20:15'
    },
    {
      id: '3',
      type: 'COMFORT-B',
      value: 12,
      risk: 'Adequate',
      date: '04/02/2025',
      time: '14:45'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/patients" className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Patient Details</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Edit
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{patient.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Age: {patient.age} (DOB: {patient.dob})</p>
            <p className="text-gray-600">MRN: {patient.mrn}</p>
            <p className="text-gray-600">Gender: {patient.gender}</p>
          </div>
          <div>
            <p className="text-gray-600">Weight: {patient.weight}</p>
            <p className="text-gray-600">Height: {patient.height}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Recent Scores</h2>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{assessment.type}: {assessment.value} ({assessment.risk})</h3>
                  <p className="text-sm text-gray-500">Time: {assessment.date} {assessment.time}</p>
                </div>
                <Link 
                  to={`/patients/${patientId}/results/${assessment.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link 
          to={`/patients/${patientId}/new-assessment`}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          New Assessment
        </Link>
      </div>
    </div>
  );
};

export default PatientDetailsPage;
