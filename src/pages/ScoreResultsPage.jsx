import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import ScoreCalculator from '../components/scoring/ScoreCalculator';

const ScoreResultsPage = () => {
  const { patientId, assessmentId } = useParams();
  const location = useLocation();
  const [assessment, setAssessment] = useState(null);
  const [calculatedScore, setCalculatedScore] = useState(null);

  // Get scoreType and formValues from location state
  const { scoreType, formValues } = location.state || {};

  // Dummy patient data (replace with actual patient data fetching if needed)
  const patientData = {
    ageCategory: 'child',
    ageInMonths: 60,
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const docRef = doc(db, 'assessments', assessmentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAssessment(docSnap.data());
        } else {
          console.error('No such assessment!');
        }
      } catch (error) {
        console.error('Error fetching assessment:', error);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  if (!assessment) {
    return <div>Loading...</div>;
  }

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
          <h1 className="text-2xl font-bold">Assessment Results</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="mb-2">Assessment Date: {assessment.date}</p>
        <p className="mb-4">Assessment Time: {assessment.time}</p>
        {scoreType && formValues ? (
          <ScoreCalculator
            scoreType={scoreType}
            patientData={patientData}
            inputValues={formValues}
            setCalculatedScore={setCalculatedScore}
          />
        ) : (
          <p>Error: Missing score type or form values</p>
        )}
      </div>
    </div>
  );
};

export default ScoreResultsPage;