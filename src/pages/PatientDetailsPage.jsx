import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const PatientDetailsPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [totalRiskScore, setTotalRiskScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patientRef = doc(db, "patients", patientId);
        const patientSnap = await getDoc(patientRef);
        if (patientSnap.exists()) {
          const patientData = patientSnap.data();
          const ageInMonths = patientData.ageInMonths || 0;
          let ageCategory = 'neonate';
          if (ageInMonths >= 1 && ageInMonths < 12) ageCategory = 'infant';
          else if (ageInMonths >= 12 && ageInMonths < 144) ageCategory = 'child';
          else if (ageInMonths >= 144) ageCategory = 'adolescent';
          setPatient({ id: patientSnap.id, ...patientData, ageCategory });
        }
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    };

    const fetchAssessments = async () => {
      try {
        const assessmentsQuery = query(
          collection(db, "assessments"),
          where("patientId", "==", patientId)
        );
        const assessmentsSnap = await getDocs(assessmentsQuery);
        const assessmentsData = assessmentsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAssessments(assessmentsData);

        // Calculate total risk score
        const scoreTypes = ['prism3', 'pelod2', 'sofa', 'pim3', 'comfortb', 'sospd', 'phoenix'];
        let totalWeightedRisk = 0;
        let weightsSum = 0;

        scoreTypes.forEach(scoreType => {
          const latestAssessment = assessmentsData
            .filter(assessment => assessment.scoreType === scoreType)
            .sort((a, b) => new Date(b.date + ' ' + b.time) - new Date(a.date + ' ' + a.time))[0];

          if (latestAssessment && latestAssessment.calculatedScore) {
            let riskValue = 0;
            let weight = 1; // Default weight

            switch (scoreType) {
              case 'prism3':
              case 'pelod2':
                riskValue = parseFloat(latestAssessment.calculatedScore.mortalityRisk) || 0;
                weight = 1.5; // Higher weight for mortality predictors
                break;
              case 'sofa':
                riskValue = parseFloat(latestAssessment.calculatedScore.mortalityRisk) || 0;
                weight = 1.2;
                break;
              case 'pim3':
                riskValue = parseFloat(latestAssessment.calculatedScore.mortalityRisk) || 0;
                weight = 1.5;
                break;
              case 'comfortb':
                riskValue = latestAssessment.calculatedScore.totalScore >= 12 ? 30 : (latestAssessment.calculatedScore.totalScore >= 8 ? 15 : 0);
                weight = 0.8; // Lower weight for sedation
                break;
              case 'sospd':
                riskValue = latestAssessment.calculatedScore.deliriumPresent ? 40 : 0;
                weight = 1.0;
                break;
              case 'phoenix':
                riskValue = parseFloat(latestAssessment.calculatedScore.mortalityRisk) || 0;
                weight = 1.3;
                break;
              default:
                riskValue = 0;
            }

            totalWeightedRisk += riskValue * weight;
            weightsSum += weight;
          }
        });

        if (weightsSum > 0) {
          const normalizedRisk = (totalWeightedRisk / weightsSum).toFixed(1);
          setTotalRiskScore(normalizedRisk);
        }
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
    fetchAssessments();
  }, [patientId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!patient) {
    return <div className="container mx-auto px-4 py-8">Patient not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link to="/patients" className="mr-2">
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
          <h1 className="text-2xl font-bold">{patient.name}</h1>
        </div>
        <button
          onClick={() => navigate(`/patients/${patientId}/new-assessment`)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          New Assessment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Patient Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">
              Age: {patient.ageInMonths ? `${patient.ageInMonths / 12} years` : 'N/A'}
            </p>
            <p className="text-gray-600">DOB: {patient.dob || 'N/A'}</p>
            <p className="text-gray-600">MRN: {patient.mrn || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-600">Gender: {patient.gender || 'N/A'}</p>
            <p className="text-gray-600">Weight: {patient.weight || 'N/A'}</p>
            <p className="text-gray-600">Height: {patient.height || 'N/A'}</p>
          </div>
        </div>
      </div>

      {totalRiskScore && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Total Risk Score</h2>
          <p className="text-2xl font-bold text-red-600">{totalRiskScore}%</p>
          <p className="text-gray-600">Aggregated risk based on latest assessments across all scoring systems.</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-medium mb-4">Recent Scores</h2>
        {assessments.length > 0 ? (
          <div className="space-y-4">
            {assessments.map((assessment) => (
              <div key={assessment.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-md font-medium">{assessment.scoreType.toUpperCase()}</h3>
                    <p className="text-gray-600">
                      {assessment.calculatedScore?.totalScore || 'N/A'} - {assessment.date} {assessment.time}
                    </p>
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
        ) : (
          <p className="text-gray-500">No assessments found.</p>
        )}
      </div>
    </div>
  );
};

export default PatientDetailsPage;