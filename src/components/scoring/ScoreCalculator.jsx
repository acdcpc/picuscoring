import React, { useEffect } from 'react';
import calculatePRISM3Score from '../../utils/prism3Calculator';
import calculateSOFAScore from '../../utils/sofaCalculator';
import calculateCOMFORTBScore from '../../utils/comfortBCalculator';
import calculatePIM3Score from '../../utils/pim3Calculator';
import calculatePELOD2Score from '../../utils/pelod2Calculator';

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  const calculateScore = () => {
    switch (scoreType) {
      case 'prism3':
        return calculatePRISM3Score(inputValues, patientData.ageCategory);
      case 'sofa':
        return calculateSOFAScore(inputValues, true, patientData.ageInMonths);
      case 'comfortb':
        return calculateCOMFORTBScore(inputValues);
      case 'pim3':
        return calculatePIM3Score(inputValues);
      case 'pelod2':
        return calculatePELOD2Score(inputValues, patientData.ageInMonths);
      default:
        return null;
    }
  };

  const scoreResult = calculateScore();

  useEffect(() => {
    if (scoreResult) {
      setCalculatedScore(scoreResult);
    }
  }, [scoreResult, setCalculatedScore]);

  const renderScoreResult = () => {
    if (!scoreResult) return <p>No score calculated</p>;

    switch (scoreType) {
      case 'prism3':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">PRISM-III Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Mortality Risk: {scoreResult.mortalityRisk}% ({scoreResult.riskCategory})</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Neurologic Score: {scoreResult.neurologicScore}</h4>
              </div>
              <div>
                <h4 className="font-medium">Non-Neurologic Score: {scoreResult.nonNeurologicScore}</h4>
              </div>
            </div>
          </div>
        );
      case 'sofa':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">SOFA Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Severity: {scoreResult.severityCategory}</p>
            <p className="mb-2">Mortality Risk: {scoreResult.mortalityRisk}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p>Respiratory: {scoreResult.respiratoryScore}</p>
                <p>Coagulation: {scoreResult.coagulationScore}</p>
              </div>
              <div>
                <p>Liver: {scoreResult.liverScore}</p>
                <p>Cardiovascular: {scoreResult.cardiovascularScore}</p>
              </div>
              <div>
                <p>Neurological: {scoreResult.neurologicalScore}</p>
                <p>Renal: {scoreResult.renalScore}</p>
              </div>
            </div>
          </div>
        );
      case 'comfortb':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">COMFORT-B Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Sedation Level: {scoreResult.sedationLevel}</p>
            <p className="mb-4">{scoreResult.clinicalInterpretation}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p>Alertness: {scoreResult.alertnessScore}</p>
                <p>Calmness: {scoreResult.calmnessScore}</p>
              </div>
              <div>
                <p>Respiratory: {scoreResult.respiratoryScore}</p>
                <p>Movement: {scoreResult.movementScore}</p>
              </div>
              <div>
                <p>Muscle Tone: {scoreResult.muscleToneScore}</p>
                <p>Facial Tension: {scoreResult.facialTensionScore}</p>
              </div>
            </div>
          </div>
        );
      case 'pim3':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">PIM-3 Score</h3>
            <p className="text-3xl font-bold mb-2">{scoreResult.mortalityRisk}%</p>
            <p className="mb-2">Risk Category: {scoreResult.riskCategory}</p>
            <p className="text-sm text-gray-600">Logit: {scoreResult.logit.toFixed(4)}</p>
          </div>
        );
      case 'pelod2':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">PELOD-2 Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Mortality Risk: {scoreResult.mortalityRisk}%</p>
            <p className="mb-2">Severity: {scoreResult.severityCategory}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p>Neurological: {scoreResult.neurologicalScore}</p>
                <p>Cardiovascular: {scoreResult.cardiovascularScore}</p>
              </div>
              <div>
                <p>Renal: {scoreResult.renalScore}</p>
                <p>Respiratory: {scoreResult.respiratoryScore}</p>
              </div>
              <div>
                <p>Hematological: {scoreResult.hematologicalScore}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Unknown score type</p>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {renderScoreResult()}
    </div>
  );
};

export default ScoreCalculator;