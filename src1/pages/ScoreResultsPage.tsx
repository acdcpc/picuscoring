
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ScoreResultsPage = () => {
  const { patientId, assessmentId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem(`${patientId}-${assessmentId}`);
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [patientId, assessmentId]);

  if (!data) return <div className="p-4 text-red-500">No result found!</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Results: {data.scoreType?.toUpperCase()}</h1>
      <p className="mb-2"><strong>Patient Name:</strong> {data.patientName}</p>
      <p className="mb-2"><strong>Age (months):</strong> {data.ageMonths}</p>
      <p className="mb-4"><strong>Timestamp:</strong> {new Date(data.timestamp).toLocaleString()}</p>
      <h2 className="text-lg font-semibold mb-2">Score Inputs:</h2>
      <ul className="list-disc pl-6">
        {Object.entries(data.scoreInputs || {}).map(([key, value]) => (
          <li key={key}><strong>{key}:</strong> {value}</li>
        ))}
      </ul>
    </div>
  );
};

export default ScoreResultsPage;
