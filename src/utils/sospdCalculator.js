/**
 * SOS-PD Score Calculator
 * 
 * This module implements the SOS-PD score for assessing delirium in pediatric patients.
 */

/**
 * Calculate SOS-PD score based on symptoms
 * 
 * @param {Object} inputValues - Symptom parameters
 * @returns {Object} - Delirium assessment
 */
export const calculateSospdScore = (inputValues) => {
  // Validate inputs
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  // Extract values (0 or 1), default to 0 if not provided
  const anxiety = parseInt(inputValues.anxiety) || 0;
  const agitation = parseInt(inputValues.agitation) || 0;
  const hallucinations = parseInt(inputValues.hallucinations) || 0;
  const inconsolableCrying = parseInt(inputValues.inconsolableCrying) || 0;
  const alteredConsciousness = parseInt(inputValues.alteredConsciousness) || 0;
  const tremors = parseInt(inputValues.tremors) || 0;
  const motorRestlessness = parseInt(inputValues.motorRestlessness) || 0;
  const sleepDisturbance = parseInt(inputValues.sleepDisturbance) || 0;
  const irritability = parseInt(inputValues.irritability) || 0;
  const sweating = parseInt(inputValues.sweating) || 0;
  const grimacing = parseInt(inputValues.grimacing) || 0;
  const increasedMuscleTension = parseInt(inputValues.increasedMuscleTension) || 0;
  const startleResponse = parseInt(inputValues.startleResponse) || 0;
  const poorEyeContact = parseInt(inputValues.poorEyeContact) || 0;
  const disorientation = parseInt(inputValues.disorientation) || 0;
  const incoherentSpeech = parseInt(inputValues.incoherentSpeech) || 0;
  const withdrawal = parseInt(inputValues.withdrawal) || 0;

  // Calculate total score
  const totalScore =
    anxiety +
    agitation +
    hallucinations +
    inconsolableCrying +
    alteredConsciousness +
    tremors +
    motorRestlessness +
    sleepDisturbance +
    irritability +
    sweating +
    grimacing +
    increasedMuscleTension +
    startleResponse +
    poorEyeContact +
    disorientation +
    incoherentSpeech +
    withdrawal;

  // Determine delirium status
  const deliriumPresent = totalScore >= 4;
  let deliriumType = 'None';
  let clinicalInterpretation = 'No delirium detected.';

  if (deliriumPresent) {
    if (agitation >= 1 || anxiety >= 1 || motorRestlessness >= 1 || irritability >= 1) {
      deliriumType = 'Hyperactive';
      clinicalInterpretation = 'Hyperactive delirium detected. Consider calming interventions.';
    }
    if (alteredConsciousness >= 1 || poorEyeContact >= 1 || withdrawal >= 1) {
      deliriumType = deliriumType === 'Hyperactive' ? 'Mixed' : 'Hypoactive';
      clinicalInterpretation = deliriumType === 'Mixed'
        ? 'Mixed delirium detected. Requires comprehensive management.'
        : 'Hypoactive delirium detected. Monitor for worsening symptoms.';
    }
  }

  return {
    totalScore,
    deliriumPresent,
    deliriumType,
    clinicalInterpretation,
    anxietyScore: anxiety,
    agitationScore: agitation,
    hallucinationsScore: hallucinations,
    inconsolableCryingScore: inconsolableCrying,
    alteredConsciousnessScore: alteredConsciousness,
    tremorsScore: tremors,
    motorRestlessnessScore: motorRestlessness,
    sleepDisturbanceScore: sleepDisturbance,
    irritabilityScore: irritability,
    sweatingScore: sweating,
    grimacingScore: grimacing,
    increasedMuscleTensionScore: increasedMuscleTension,
    startleResponseScore: startleResponse,
    poorEyeContactScore: poorEyeContact,
    disorientationScore: disorientation,
    incoherentSpeechScore: incoherentSpeech,
    withdrawalScore: withdrawal,
  };
};

export default calculateSospdScore;