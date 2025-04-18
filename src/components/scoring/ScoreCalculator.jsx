import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
const { auth, db } = require('../../firebase');

const ScoreCalculator = ({ patientData, onScoreCalculated }) => {
  const [scoreType, setScoreType] = useState('Phoenix');
  const [formData, setFormData] = useState({
    oxygenMeasurement: 'SpO2',
    spo2: '',
    fio2: '',
    respiratorySupport: 'none',
    vasoactiveMedications: 'none',
    lactate: '',
    map: '',
    platelets: '',
    inr: '',
    dDimer: '',
    fibrinogen: '',
    gcs: '',
    pupils: 'reactive',
    systemicInfection: '0',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculatePhoenixScore = () => {
    let score = 0;
    const {
      spo2,
      respiratorySupport,
      vasoactiveMedications,
      lactate,
      map,
      platelets,
      inr,
      dDimer,
      fibrinogen,
      gcs,
      pupils,
      systemicInfection,
    } = formData;

    // Oxygenation (SpO2 < 75% in room air or need for mechanical ventilation)
    if (spo2 && parseFloat(spo2) < 75) score += 2;
    if (respiratorySupport === 'imv') score += 2;

    // Cardiovascular (Vasoactive medications or MAP < threshold)
    if (vasoactiveMedications === '2_or_more') score += 2;
    else if (vasoactiveMedications !== 'none') score += 1;
    if (map && parseFloat(map) < 40) score += 2;

    // Coagulation (Platelets < 100, INR > 1.5, D-dimer > 2, Fibrinogen < 100)
    if (platelets && parseFloat(platelets) < 100) score += 1;
    if (inr && parseFloat(inr) > 1.5) score += 1;
    if (dDimer && parseFloat(dDimer) > 2) score += 1;
    if (fibrinogen && parseFloat(fibrinogen) < 100) score += 1;

    // Neurological (GCS < 11 or non-reactive pupils)
    if (gcs && parseInt(gcs) < 11) score += 2;
    if (pupils === 'non_reactive') score += 2;

    // Systemic Infection
    if (systemicInfection === '1') score += 2;

    // Sepsis Status
    const sepsisStatus = score >= 2 ? 'Sepsis Present' : 'No Sepsis';

    // Mortality Risk (approximate, based on Phoenix score ranges)
    let mortalityRisk = 'Low';
    if (score >= 8) mortalityRisk = 'High (~50%)';
    else if (score >= 4) mortalityRisk = 'Moderate (~20-30%)';
    else if (score >= 2) mortalityRisk = 'Low (~5-10%)';

    return { score, sepsisStatus, mortalityRisk };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      if (!auth.currentUser) {
        throw new Error('User must be authenticated to save assessment');
      }

      const result = calculatePhoenixScore();
      setResult(result);

      // Save assessment to Firestore
      const assessmentData = {
        patientId: patientData.id,
        type: scoreType,
        score: result.score,
        sepsisStatus: result.sepsisStatus,
        mortalityRisk: result.mortalityRisk,
        formData,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
      };

      await addDoc(collection(db, 'assessments'), assessmentData);
      console.log('Assessment saved successfully');

      if (onScoreCalculated) {
        onScoreCalculated(result);
      }
    } catch (err) {
      console.error('Error calculating or saving score:', err);
      setError(err.message || 'Failed to calculate or save score');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Score Calculator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Score Type</label>
          <select
            name="scoreType"
            value={scoreType}
            onChange={(e) => setScoreType(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="Phoenix">Phoenix</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Oxygen Measurement</label>
          <select
            name="oxygenMeasurement"
            value={formData.oxygenMeasurement}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="SpO2">SpO2</option>
            <option value="PaO2/FiO2">PaO2/FiO2</option>
          </select>
        </div>
        {formData.oxygenMeasurement === 'SpO2' && (
          <div>
            <label className="block text-gray-700 mb-1">SpO2 (%)</label>
            <input
              type="number"
              name="spo2"
              value={formData.spo2}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Enter SpO2"
            />
          </div>
        )}
        {formData.oxygenMeasurement === 'PaO2/FiO2' && (
          <div>
            <label className="block text-gray-700 mb-1">FiO2 (%)</label>
            <input
              type="number"
              name="fio2"
              value={formData.fio2}
              onChange={handleInputChange}
              className="border rounded-md px-3 py-2 w-full"
              placeholder="Enter FiO2"
            />
          </div>
        )}
        <div>
          <label className="block text-gray-700 mb-1">Respiratory Support</label>
          <select
            name="respiratorySupport"
            value={formData.respiratorySupport}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="none">None</option>
            <option value="supplemental">Supplemental O2</option>
            <option value="imv">IMV</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Vasoactive Medications</label>
          <select
            name="vasoactiveMedications"
            value={formData.vasoactiveMedications}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="none">None</option>
            <option value="one">One</option>
            <option value="2_or_more">Two or more</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Lactate (mmol/L)</label>
          <input
            type="number"
            name="lactate"
            value={formData.lactate}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter lactate"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">MAP (mmHg)</label>
          <input
            type="number"
            name="map"
            value={formData.map}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter MAP"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Platelets (x10^9/L)</label>
          <input
            type="number"
            name="platelets"
            value={formData.platelets}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter platelets"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">INR</label>
          <input
            type="number"
            name="inr"
            value={formData.inr}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter INR"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">D-dimer (mg/L)</label>
          <input
            type="number"
            name="dDimer"
            value={formData.dDimer}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter D-dimer"
            step="0.1"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Fibrinogen (mg/dL)</label>
          <input
            type="number"
            name="fibrinogen"
            value={formData.fibrinogen}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter fibrinogen"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">GCS</label>
          <input
            type="number"
            name="gcs"
            value={formData.gcs}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
            placeholder="Enter GCS"
            min="3"
            max="15"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Pupils</label>
          <select
            name="pupils"
            value={formData.pupils}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="reactive">Reactive</option>
            <option value="non_reactive">Non-reactive</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Systemic Infection</label>
          <select
            name="systemicInfection"
            value={formData.systemicInfection}
            onChange={handleInputChange}
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Calculate Score
        </button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-md font-semibold">Results</h3>
          <p>Total Score: {result.score}</p>
          <p>Sepsis Status: {result.sepsisStatus}</p>
          <p>Mortality Risk: {result.mortalityRisk}</p>
        </div>
      )}
    </div>
  );
};

export default ScoreCalculator;