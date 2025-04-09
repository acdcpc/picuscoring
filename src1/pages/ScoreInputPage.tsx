
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const SCORE_FIELDS = {
  prism3: ["PH", "HCO3", "PCO2", "PO2", "INR", "APTT"],
  comfortb: ["Alertness", "Calmness", "Respiratory Response", "Crying", "Facial Tension", "Muscle Tone"],
};

const ScoreInputPage = () => {
  const { patientId, scoreType } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");
  const [ageMonths, setAgeMonths] = useState("");
  const [scoreInputs, setScoreInputs] = useState({});

  const fields = SCORE_FIELDS[scoreType?.toLowerCase()] || [];

  const handleChange = (field, value) => {
    setScoreInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const assessmentId = uuidv4();
    const data = {
      patientId,
      patientName,
      ageMonths,
      scoreType,
      scoreInputs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(`${patientId}-${assessmentId}`, JSON.stringify(data));
    navigate(`/patients/${patientId}/results/${assessmentId}`);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Enter Score: {scoreType?.toUpperCase()}</h1>

      <label className="block mb-2">
        Patient Name:
        <input type="text" className="w-full border p-2 mt-1 rounded" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
      </label>

      <label className="block mb-4">
        Age (in months):
        <input type="number" className="w-full border p-2 mt-1 rounded" value={ageMonths} onChange={(e) => setAgeMonths(e.target.value)} />
      </label>

      <h2 className="text-lg font-semibold mb-2">Score Inputs:</h2>
      {fields.length === 0 ? (
        <p className="text-red-500">Invalid score type: {scoreType}</p>
      ) : (
        fields.map((field) => (
          <div key={field} className="mb-2">
            <label className="block">
              {field}
              <input type="number" className="w-full border p-2 mt-1 rounded" value={scoreInputs[field] || ""} onChange={(e) => handleChange(field, e.target.value)} />
            </label>
          </div>
        ))
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={handleSubmit}>Save and View Result</button>
    </div>
  );
};

export default ScoreInputPage;
