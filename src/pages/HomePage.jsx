import React from 'react';
import { Link } from 'react-router-dom';
import scoringSystems from '../data/scoringSystems';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">PICU Score App</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {scoringSystems.map((system) => (
          <div 
            key={system.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{system.name}</h2>
            <p className="text-gray-600 mb-4">{system.purpose}</p>
            <Link 
              to={`/patients/demo/score/${system.id}`}
              className="text-blue-600 hover:text-blue-800"
            >
              Calculate Score →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Patients</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {/* Demo patients */}
          <Link 
            to="/patients/1" 
            className="flex-shrink-0 bg-gray-100 rounded-md p-3 hover:bg-gray-200"
          >
            Patient 1
          </Link>
          <Link 
            to="/patients/2" 
            className="flex-shrink-0 bg-gray-100 rounded-md p-3 hover:bg-gray-200"
          >
            Patient 2
          </Link>
          <Link 
            to="/patients/3" 
            className="flex-shrink-0 bg-gray-100 rounded-md p-3 hover:bg-gray-200"
          >
            Patient 3
          </Link>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link 
          to="/patients" 
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View All Patients
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
