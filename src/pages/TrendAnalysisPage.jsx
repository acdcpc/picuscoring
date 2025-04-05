import React from 'react';
import { useParams, Link } from 'react-router-dom';

const TrendAnalysisPage = () => {
  const { patientId } = useParams();
  
  // Mock patient data for prototype
  const patient = {
    id: patientId,
    name: patientId === '1' ? 'John Doe' : patientId === '2' ? 'Jane Smith' : 'Michael Johnson',
  };
  
  // Mock assessment data for prototype
  const assessments = [
    {
      id: '1',
      type: 'PRISM-3',
      value: 15,
      date: '04/03/2025',
      time: '10:15'
    },
    {
      id: '2',
      type: 'SOFA',
      value: 8,
      date: '04/02/2025',
      time: '20:15'
    },
    {
      id: '3',
      type: 'COMFORT-B',
      value: 12,
      date: '04/02/2025',
      time: '14:45'
    },
    {
      id: '4',
      type: 'PRISM-3',
      value: 18,
      date: '04/01/2025',
      time: '09:30'
    },
    {
      id: '5',
      type: 'SOFA',
      value: 10,
      date: '03/31/2025',
      time: '22:00'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to={`/patients/${patientId}`} className="mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Score Trends</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Filter
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Patient: {patient.name}</h2>
          <p className="text-gray-600">Date Range: Last 7 days</p>
        </div>
        
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <div className="text-center mb-2">
            <h3 className="font-medium">Score Trend Visualization</h3>
          </div>
          <div className="h-64 flex items-center justify-center border bg-white">
            <p className="text-gray-500">
              [Line Chart of Scores]
              <br />
              X-axis: Time
              <br />
              Y-axis: Score Value
              <br /><br />
              Legend:
              <br />
              — PRISM-3
              <br />
              — SOFA
              <br />
              — COMFORT-B
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Score History:</h3>
          <div className="space-y-2">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <span className="font-medium mr-2">{assessment.date} {assessment.time}</span>
                  <span className="text-gray-600">-</span>
                  <span className="ml-2">{assessment.type}: {assessment.value}</span>
                </div>
                <Link 
                  to={`/patients/${patientId}/results/${assessment.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysisPage;
