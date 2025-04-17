import React, { useEffect } from 'react';
import calculatePRISM3Score from '../../utils/prism3Calculator';
import calculateSOFAScore from '../../utils/sofaCalculator';
import calculateCOMFORTBScore from '../../utils/comfortBCalculator';
import calculatePIM3Score from '../../utils/pim3Calculator';
import calculatePELOD2Score from '../../utils/pelod2Calculator';
import calculateSOSPDScore from '../../utils/sospdCalculator';
import calculatePhoenixScore from '../../utils/phoenixCalculator';

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  console.log('ScoreCalculator - scoreType:', scoreType);

  const calculateScore = () => {
    const normalizedScoreType = scoreType?.toLowerCase();

    switch (normalizedScoreType) {
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
      case 'sospd':
        return calculateSOSPDScore(inputValues);
      case 'phoenix':
        return calculatePhoenixScore(inputValues);
      default:
        console.error('Unrecognized scoreType:', scoreType);
        return null;
    }
  };

  const scoreResult = calculateScore();

  useEffect(() => {
    if (scoreResult) {
      setCalculatedScore(scoreResult);
    } else {
      console.warn('ScoreCalculator - No score result calculated for scoreType:', scoreType);
    }
  }, [scoreResult, setCalculatedScore, scoreType]);

  const renderScoreResult = () => {
    if (!scoreResult) return <p>No score calculated</p>;

    const normalizedScoreType = scoreType?.toLowerCase();

    switch (normalizedScoreType) {
      case 'prism3':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">PRISM-III Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Mortality Risk: {scoreResult.mortalityRisk}% ({scoreResult.riskCategory})</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Neurologic Score: {scoreResult.neurologicScore}</h4>
                <p>Glasgow Coma Score: {scoreResult.glasgowComaScore || 'N/A'}</p>
                <p>Pupils Fixed: {scoreResult.pupilsFixedScore || 'N/A'}</p>
              </div>
              <div>
                <h4 className="font-medium">Non-Neurologic Score: {scoreResult.nonNeurologicScore}</h4>
                <p>Heart Rate: {scoreResult.heartRateScore || 'N/A'}</p>
                <p>Systolic BP: {scoreResult.bloodPressureScore || 'N/A'}</p>
                <p>Temperature: {scoreResult.temperatureScore || 'N/A'}</p>
                <p>Respiratory Rate: {scoreResult.respiratoryRateScore || 'N/A'}</p>
                <p>PaO2: {scoreResult.pao2Score || 'N/A'}</p>
                <p>PaCO2: {scoreResult.paco2Score || 'N/A'}</p>
                <p>pH: {scoreResult.phScore || 'N/A'}</p>
                <p>Glucose: {scoreResult.glucoseScore || 'N/A'}</p>
                <p>Potassium: {scoreResult.potassiumScore || 'N/A'}</p>
                <p>Creatinine: {scoreResult.creatinineScore || 'N/A'}</p>
                <p>Urea: {scoreResult.ureaScore || 'N/A'}</p>
                <p>White Blood Cells: {scoreResult.whiteBloodCellsScore || 'N/A'}</p>
                <p>Platelets: {scoreResult.plateletsScore || 'N/A'}</p>
                <p>Prothrombin Time: {scoreResult.prothrombinTimeScore || 'N/A'}</p>
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
      case 'sospd':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">SOS-PD Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Delirium Status: {scoreResult.deliriumPresent ? 'Present' : 'Absent'}</p>
            <p className="mb-2">Delirium Type: {scoreResult.deliriumType}</p>
            <p className="mb-4">{scoreResult.clinicalInterpretation}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <p>Anxiety: {scoreResult.anxietyScore}</p>
                <p>Agitation: {scoreResult.agitationScore}</p>
                <p>Hallucinations: {scoreResult.hallucinationsScore}</p>
                <p>Inconsolable Crying: {scoreResult.inconsolableCryingScore}</p>
                <p>Altered Consciousness: {scoreResult.alteredConsciousnessScore}</p>
                <p>Tremors: {scoreResult.tremorsScore || 0}</p>
              </div>
              <div>
                <p>Motor Restlessness: {scoreResult.motorRestlessnessScore || 0}</p>
                <p>Sleep Disturbance: {scoreResult.sleepDisturbanceScore || 0}</p>
                <p>Irritability: {scoreResult.irritabilityScore || 0}</p>
                <p>Sweating: {scoreResult.sweatingScore || 0}</p>
                <p>Grimacing: {scoreResult.grimacingScore || 0}</p>
                <p>Increased Muscle Tension: {scoreResult.increasedMuscleTensionScore || 0}</p>
              </div>
              <div>
                <p>Startle Response: {scoreResult.startleResponseScore || 0}</p>
                <p>Poor Eye Contact: {scoreResult.poorEyeContactScore || 0}</p>
                <p>Disorientation: {scoreResult.disorientationScore || 0}</p>
                <p>Incoherent Speech: {scoreResult.incoherentSpeechScore || 0}</p>
                <p>Withdrawal: {scoreResult.withdrawalScore || 0}</p>
              </div>
            </div>
          </div>
        );
      case 'phoenix':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2">Phoenix Sepsis Score: {scoreResult.totalScore}</h3>
            <p className="mb-2">Sepsis Status: {scoreResult.sepsisStatus}</p>
            <p className="mb-2">Mortality Risk: {scoreResult.mortalityRisk}%</p>
            <p className="mb-4">{scoreResult.clinicalInterpretation}</p>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div>
                <h4 className="font-medium">General</h4>
                <p>Age Category: {scoreResult.ageCategory}</p>
                <p>Systemic Infection: {scoreResult.systemicInfectionScore}</p>
              </div>
              <div>
                <h4 className="font-medium">Respiratory (Score: {scoreResult.respiratoryScore})</h4>
                <p>PaO2: {scoreResult.pao2 || 'N/A'} mmHg</p>
                <p>SpO2: {scoreResult.spo2 || 'N/A'} %</p>
                <p>FiO2: {scoreResult.fio2 || 'N/A'} %</p>
                <p>Oxygenation Ratio: {scoreResult.oxygenationRatio.toFixed(1)}</p>
                <p>Respiratory Support: {scoreResult.respiratorySupport}</p>
              </div>
              <div>
                <h4 className="font-medium">Cardiovascular (Score: {scoreResult.cardiovascularScore})</h4>
                <p>Vasoactive Medications: {scoreResult.vasoactiveMedications}</p>
                <p>Lactate: {scoreResult.lactateLevel} mmol/L</p>
                <p>MAP: {scoreResult.meanArterialPressure} mmHg</p>
              </div>
              <div>
                <h4 className="font-medium">Coagulation (Score: {scoreResult.coagulationScore})</h4>
                <p>Platelets: {scoreResult.plateletCount} x10^3/µL</p>
                <p>INR: {scoreResult.inr}</p>
                <p>D-dimer: {scoreResult.dDimer} mg/L FEU</p>
                <p>Fibrinogen: {scoreResult.fibrinogen} mg/dL</p>
              </div>
              <div>
                <h4 className="font-medium">Neurological (Score: {scoreResult.neurologicScore})</h4>
                <p>Glasgow Coma Score: {scoreResult.glasgowComaScore}</p>
                <p>Pupils Fixed Bilaterally: {scoreResult.pupilsFixed}</p>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Unknown score type: {scoreType}</p>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {renderScoreResult()}
    </div>
  );
};

export default ScoreCalculator;