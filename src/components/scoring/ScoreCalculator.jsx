import React, { useEffect, useState } from 'react';
import calculatePRISM3Score from '../../utils/prism3Calculator';
import calculatePSOFAScore from '../../utils/pSofaCalculator';
import calculateCOMFORTBScore from '../../utils/comfortBCalculator';
import calculatePIM3Score from '../../utils/pim3Calculator';
import calculatePELOD2Score from '../../utils/pelod2Calculator';
import calculateSOSPDScore from '../../utils/sospdCalculator';
import calculatePhoenixScore from '../../utils/phoenixCalculator';

const ScoreCalculator = ({ scoreType, patientData, inputValues, setCalculatedScore }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const calculateScore = () => {
    const normalizedScoreType = scoreType?.toLowerCase();

    switch (normalizedScoreType) {
      case 'prism3':
        return calculatePRISM3Score(inputValues, patientData.ageCategory);
      case 'psofa':
        return calculatePSOFAScore(inputValues);
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

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderScoreResult = () => {
    if (!scoreResult) return <p className="text-gray-600">No score calculated</p>;

    const normalizedScoreType = scoreType?.toLowerCase();

    switch (normalizedScoreType) {
      case 'prism3':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">PRISM-III Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Mortality Risk: {scoreResult.mortalityRisk}% ({scoreResult.riskCategory})</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('neurologic')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Neurologic Score: {scoreResult.neurologicScore}
                  <span>{expandedSections.neurologic ? '▲' : '▼'}</span>
                </button>
                {expandedSections.neurologic && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Glasgow Coma Score: {scoreResult.glasgowComaScore || 'N/A'}</p>
                    <p>Pupils Fixed: {scoreResult.pupilsFixedScore || 'N/A'}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('nonNeurologic')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Non-Neurologic Score: {scoreResult.nonNeurologicScore}
                  <span>{expandedSections.nonNeurologic ? '▲' : '▼'}</span>
                </button>
                {expandedSections.nonNeurologic && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
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
                )}
              </div>
            </div>
          </div>
        );
      case 'psofa':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">pSOFA Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Severity: {scoreResult.severityCategory}</p>
              <p className="text-gray-600 mb-2">Mortality Risk: {scoreResult.mortalityRisk}%</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('general')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  General
                  <span>{expandedSections.general ? '▲' : '▼'}</span>
                </button>
                {expandedSections.general && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Age Category: {scoreResult.ageCategory}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('respiratory')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Respiratory Score: {scoreResult.respiratoryScore}
                  <span>{expandedSections.respiratory ? '▲' : '▼'}</span>
                </button>
                {expandedSections.respiratory && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Oxygenation Ratio: {scoreResult.oxygenationRatio.toFixed(1)}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('coagulation')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Coagulation Score: {scoreResult.coagulationScore}
                  <span>{expandedSections.coagulation ? '▲' : '▼'}</span>
                </button>
                {expandedSections.coagulation && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Platelets: {scoreResult.platelets} x10^3/µL</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('liver')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Liver Score: {scoreResult.liverScore}
                  <span>{expandedSections.liver ? '▲' : '▼'}</span>
                </button>
                {expandedSections.liver && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Bilirubin: {scoreResult.bilirubin} mg/dL</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('cardiovascular')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Cardiovascular Score: {scoreResult.cardiovascularScore}
                  <span>{expandedSections.cardiovascular ? '▲' : '▼'}</span>
                </button>
                {expandedSections.cardiovascular && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Mean Arterial Pressure: {scoreResult.meanArterialPressure} mmHg</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('neurological')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Neurological Score: {scoreResult.neurologicalScore}
                  <span>{expandedSections.neurological ? '▲' : '▼'}</span>
                </button>
                {expandedSections.neurological && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Glasgow Coma Score: {scoreResult.glasgowComaScore}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('renal')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Renal Score: {scoreResult.renalScore}
                  <span>{expandedSections.renal ? '▲' : '▼'}</span>
                </button>
                {expandedSections.renal && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Creatinine: {scoreResult.creatinine} mg/dL</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'comfortb':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">COMFORT-B Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Sedation Level: {scoreResult.sedationLevel}</p>
              <p className="text-gray-600 mb-2">{scoreResult.clinicalInterpretation}</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('comfortbDetails')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Detailed Scores
                  <span>{expandedSections.comfortbDetails ? '▲' : '▼'}</span>
                </button>
                {expandedSections.comfortbDetails && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Alertness: {scoreResult.alertnessScore}</p>
                    <p>Calmness: {scoreResult.calmnessScore}</p>
                    <p>Respiratory Response: {scoreResult.respiratoryScore}</p>
                    <p>Movement: {scoreResult.movementScore}</p>
                    <p>Muscle Tone: {scoreResult.muscleToneScore}</p>
                    <p>Facial Tension: {scoreResult.facialTensionScore}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'pim3':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">PIM-3 Score</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">{scoreResult.mortalityRisk}%</p>
              <p className="text-gray-600 mb-2">Risk Category: {scoreResult.riskCategory}</p>
              <p className="text-sm text-gray-600">Logit: {scoreResult.logit.toFixed(4)}</p>
            </div>
          </div>
        );
      case 'pelod2':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">PELOD-2 Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Mortality Risk: {scoreResult.mortalityRisk}%</p>
              <p className="text-gray-600 mb-2">Severity: {scoreResult.severityCategory}</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('pelod2Details')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Detailed Scores
                  <span>{expandedSections.pelod2Details ? '▲' : '▼'}</span>
                </button>
                {expandedSections.pelod2Details && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Neurological: {scoreResult.neurologicalScore}</p>
                    <p>Cardiovascular: {scoreResult.cardiovascularScore}</p>
                    <p>Renal: {scoreResult.renalScore}</p>
                    <p>Respiratory: {scoreResult.respiratoryScore}</p>
                    <p>Hematological: {scoreResult.hematologicalScore}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'sospd':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">SOS-PD Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Delirium Status: {scoreResult.deliriumPresent ? 'Present' : 'Absent'}</p>
              <p className="text-gray-600 mb-2">Delirium Type: {scoreResult.deliriumType}</p>
              <p className="text-gray-600 mb-2">{scoreResult.clinicalInterpretation}</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('sospdDetails')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Detailed Scores
                  <span>{expandedSections.sospdDetails ? '▲' : '▼'}</span>
                </button>
                {expandedSections.sospdDetails && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Anxiety: {scoreResult.anxietyScore}</p>
                    <p>Agitation: {scoreResult.agitationScore}</p>
                    <p>Hallucinations: {scoreResult.hallucinationsScore}</p>
                    <p>Inconsolable Crying: {scoreResult.inconsolableCryingScore}</p>
                    <p>Altered Consciousness: {scoreResult.alteredConsciousnessScore}</p>
                    <p>Tremors: {scoreResult.tremorsScore || 0}</p>
                    <p>Motor Restlessness: {scoreResult.motorRestlessnessScore || 0}</p>
                    <p>Sleep Disturbance: {scoreResult.sleepDisturbanceScore || 0}</p>
                    <p>Irritability: {scoreResult.irritabilityScore || 0}</p>
                    <p>Sweating: {scoreResult.sweatingScore || 0}</p>
                    <p>Grimacing: {scoreResult.grimacingScore || 0}</p>
                    <p>Increased Muscle Tension: {scoreResult.increasedMuscleTensionScore || 0}</p>
                    <p>Startle Response: {scoreResult.startleResponseScore || 0}</p>
                    <p>Poor Eye Contact: {scoreResult.poorEyeContactScore || 0}</p>
                    <p>Disorientation: {scoreResult.disorientationScore || 0}</p>
                    <p>Incoherent Speech: {scoreResult.incoherentSpeechScore || 0}</p>
                    <p>Withdrawal: {scoreResult.withdrawalScore || 0}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'phoenix':
        return (
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Phoenix Sepsis Score: {scoreResult.totalScore}</h3>
              <p className="text-gray-600 mb-2">Sepsis Status: {scoreResult.sepsisStatus}</p>
              <p className="text-gray-600 mb-2">Mortality Risk: {scoreResult.mortalityRisk}%</p>
              <p className="text-gray-600 mb-2">{scoreResult.clinicalInterpretation}</p>
            </div>
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => toggleSection('phoenixGeneral')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  General
                  <span>{expandedSections.phoenixGeneral ? '▲' : '▼'}</span>
                </button>
                {expandedSections.phoenixGeneral && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Age Category: {scoreResult.ageCategory}</p>
                    <p>Systemic Infection: {scoreResult.systemicInfectionScore}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('phoenixRespiratory')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Respiratory (Score: {scoreResult.respiratoryScore})
                  <span>{expandedSections.phoenixRespiratory ? '▲' : '▼'}</span>
                </button>
                {expandedSections.phoenixRespiratory && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>PaO2: {scoreResult.pao2 || 'N/A'} mmHg</p>
                    <p>SpO2: {scoreResult.spo2 || 'N/A'} %</p>
                    <p>FiO2: {scoreResult.fio2 || 'N/A'} %</p>
                    <p>Oxygenation Ratio: {scoreResult.oxygenationRatio.toFixed(1)}</p>
                    <p>Respiratory Support: {scoreResult.respiratorySupport}</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('phoenixCardiovascular')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Cardiovascular (Score: {scoreResult.cardiovascularScore})
                  <span>{expandedSections.phoenixCardiovascular ? '▲' : '▼'}</span>
                </button>
                {expandedSections.phoenixCardiovascular && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Vasoactive Medications: {scoreResult.vasoactiveMedications}</p>
                    <p>Lactate: {scoreResult.lactateLevel} mmol/L</p>
                    <p>MAP: {scoreResult.meanArterialPressure} mmHg</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('phoenixCoagulation')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Coagulation (Score: {scoreResult.coagulationScore})
                  <span>{expandedSections.phoenixCoagulation ? '▲' : '▼'}</span>
                </button>
                {expandedSections.phoenixCoagulation && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Platelets: {scoreResult.plateletCount} x10^3/µL</p>
                    <p>INR: {scoreResult.inr}</p>
                    <p>D-dimer: {scoreResult.dDimer} mg/L FEU</p>
                    <p>Fibrinogen: {scoreResult.fibrinogen} mg/dL</p>
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={() => toggleSection('phoenixNeurological')}
                  className="w-full text-left bg-gray-100 p-3 rounded-lg font-medium text-gray-800 flex justify-between items-center"
                >
                  Neurological (Score: {scoreResult.neurologicScore})
                  <span>{expandedSections.phoenixNeurological ? '▲' : '▼'}</span>
                </button>
                {expandedSections.phoenixNeurological && (
                  <div className="p-3 bg-gray-50 rounded-b-lg">
                    <p>Glasgow Coma Score: {scoreResult.glasgowComaScore}</p>
                    <p>Pupils Fixed Bilaterally: {scoreResult.pupilsFixed}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <p className="text-gray-600">Unknown score type: {scoreType}</p>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {renderScoreResult()}
    </div>
  );
};

export default ScoreCalculator;