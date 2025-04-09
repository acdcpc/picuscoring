import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import ScoreCalculator from '../components/scoring/ScoreCalculator';
import scoringSystems from '../data/scoringSystems';

const ScoreResultsPage = () => {
  const { patientId, assessmentId } = useParams();
  const location = useLocation();
  const [scoreData, setScoreData] = useState(null);
  const [patient, setPatient] = useState(null);
  const [calculatedScore, setCalculatedScore] = useState(null);

  useEffect(() => {
    if (location.state && location.state.scoreType && location.state.formValues) {
      setScoreData({
        scoreType: location.state.scoreType,
        formValues: location.state.formValues,
      });
    }
  }, [location]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientRef = doc(db, "patients", patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          setPatient(patientSnap.data());
        } else {
          setPatient({ id: patientId, name: "Unknown Patient", ageInMonths: 0, ageCategory: "unknown" });
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
        setPatient({ id: patientId, name: "Error Loading", ageInMonths: 0, ageCategory: "unknown" });
      }
    };
    fetchPatient();
  }, [patientId]);

  const getAssessmentData = () => {
    return {
      id: assessmentId || "new",
      type: scoreData?.scoreType || "Unknown",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const assessment = getAssessmentData();

  const handleSave = async () => {
    try {
      const assessmentData = {
        patientId,
        scoreType: scoreData?.scoreType || "Unknown",
        formValues: scoreData?.formValues || {},
        calculatedScore: calculatedScore || {},
        date: assessment.date,
        time: assessment.time,
      };
      const newAssessmentId = assessmentId === "new" ? uuidv4() : assessmentId;
      await setDoc(doc(db, "assessments", newAssessmentId), assessmentData);
      alert("Assessment saved successfully!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Failed to save assessment.");
    }
  };

  if (!patient) {
    return <div className="container mx-auto px-4 py-8">Loading patient data...</div>;
  }

  const selectedSystem = scoreData
    ? scoringSystems.find((system) => system.id === scoreData.scoreType)
    : { name: "Unknown Score" };

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
          <h1 className="text-2xl font-bold">Score Results</h1>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Patient: {patient.name}</h2>
          <p className="text-gray-600">Assessment Date: {assessment.date}</p>
          <p className="text-gray-600">Assessment Time: {assessment.time}</p>
        </div>

        {scoreData ? (
          <ScoreCalculator
            scoreType={scoreData.scoreType}
            patientData={patient}
            inputValues={scoreData.formValues}
            setCalculatedScore={setCalculatedScore} // Pass setter to store score
          />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No score data available</p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <div className="space-x-2">
            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              View Details
            </button>
            <Link
              to={`/patients/${patientId}/new-assessment`}
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              New Score
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Clinical Recommendations</h2>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">Based on this score:</h3>
          <ul className="list-disc pl-5 text-blue-700 space-y-2">
            <li>Continue monitoring vital signs every 2 hours</li>
            <li>Consider arterial blood gas analysis in 4 hours</li>
            <li>Review medication regimen for possible adjustments</li>
            <li>Ensure adequate fluid balance and nutrition</li>
            <li>Reassess score in 12 hours or with clinical changes</li>
          </ul>
          <p className="mt-4 text-sm text-blue-600 italic">
            Note: These are general recommendations. Clinical judgment should always prevail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreResultsPage;