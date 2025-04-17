/**
 * COMFORT-B Sedation Scale Calculator
 * 
 * This module implements the COMFORT Behavioral Scale (COMFORT-B) for assessing
 * distress, pain, and sedation levels in pediatric intensive care patients.
 * 
 * Based on research from:
 * - van Dijk M, et al. The COMFORT Behavior Scale: A tool for assessing pain and sedation in infants.
 * - Ista E, et al. Assessment of sedation levels in pediatric intensive care patients.
 */

/**
 * Calculate COMFORT-B score based on behavioral observations
 * 
 * @param {Object} inputValues - Behavioral parameters
 * @returns {Object} - Calculated score and assessment
 */
export const calculateComfortBScore = (inputValues) => {
  // Validate inputs
  if (!inputValues || typeof inputValues !== 'object') {
    throw new Error('Invalid input: inputValues must be an object');
  }

  // Calculate scores for each component
  const alertnessScore = calculateAlertnessScore(inputValues.alertness);
  const calmnessScore = calculateCalmnessScore(inputValues.calmness);
  const respiratoryScore = calculateRespiratoryScore(inputValues.respiratory, inputValues.isVentilated);
  const movementScore = calculateMovementScore(inputValues.movement);
  const muscleToneScore = calculateMuscleToneScore(inputValues.muscleTone);
  const facialTensionScore = calculateFacialTensionScore(inputValues.facialTension);
  
  // Calculate total score
  const totalScore = alertnessScore + calmnessScore + respiratoryScore + 
                    movementScore + muscleToneScore + facialTensionScore;
  
  // Determine sedation level
  const sedationLevel = getSedationLevel(totalScore);
  
  // Determine clinical interpretation
  const clinicalInterpretation = getClinicalInterpretation(totalScore);
  
  return {
    alertnessScore,
    calmnessScore,
    respiratoryScore,
    movementScore,
    muscleToneScore,
    facialTensionScore,
    totalScore,
    sedationLevel,
    clinicalInterpretation
  };
};

/**
 * Calculate alertness score
 */
const calculateAlertnessScore = (alertness) => {
  if (alertness === undefined || alertness === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(alertness), 1), 5);
};

/**
 * Calculate calmness/agitation score
 */
const calculateCalmnessScore = (calmness) => {
  if (calmness === undefined || calmness === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(calmness), 1), 5);
};

/**
 * Calculate respiratory response score
 */
const calculateRespiratoryScore = (respiratory, isVentilated) => {
  if (respiratory === undefined || respiratory === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(respiratory), 1), 5);
};

/**
 * Calculate physical movement score
 */
const calculateMovementScore = (movement) => {
  if (movement === undefined || movement === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(movement), 1), 5);
};

/**
 * Calculate muscle tone score
 */
const calculateMuscleToneScore = (muscleTone) => {
  if (muscleTone === undefined || muscleTone === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(muscleTone), 1), 5);
};

/**
 * Calculate facial tension score
 */
const calculateFacialTensionScore = (facialTension) => {
  if (facialTension === undefined || facialTension === null) return 0;
  
  // Direct score from 1-5
  return Math.min(Math.max(parseInt(facialTension), 1), 5);
};

/**
 * Get sedation level based on total COMFORT-B score
 */
const getSedationLevel = (totalScore) => {
  if (totalScore < 10) return 'Over-sedation';
  if (totalScore >= 10 && totalScore <= 17) return 'Adequate sedation';
  if (totalScore > 17 && totalScore <= 22) return 'Mild distress';
  if (totalScore > 22 && totalScore <= 27) return 'Moderate distress';
  return 'Severe distress';
};

/**
 * Get clinical interpretation based on total COMFORT-B score
 */
const getClinicalInterpretation = (totalScore) => {
  if (totalScore < 10) {
    return 'Patient is over-sedated. Consider reducing sedative medications.';
  }
  
  if (totalScore >= 10 && totalScore <= 17) {
    return 'Patient has adequate sedation level. Continue current sedation regimen and reassess regularly.';
  }
  
  if (totalScore > 17 && totalScore <= 22) {
    return 'Patient shows mild distress. Consider non-pharmacological comfort measures and reassess.';
  }
  
  if (totalScore > 22 && totalScore <= 27) {
    return 'Patient shows moderate distress. Consider additional analgesia or sedation.';
  }
  
  return 'Patient shows severe distress. Immediate intervention required for pain/distress management.';
};

/**
 * COMFORT-B Scale Reference
 * 
 * Alertness:
 * 1 - Deeply asleep (eyes closed, no response to changes in environment)
 * 2 - Lightly asleep (eyes closed, responds to changes in environment)
 * 3 - Drowsy (closes eyes frequently, less responsive to environment)
 * 4 - Awake and alert (responsive to environment)
 * 5 - Hyper-alert (exaggerated responses to environmental stimuli)
 * 
 * Calmness/Agitation:
 * 1 - Calm (appears serene and tranquil)
 * 2 - Slightly anxious (shows slight anxiety)
 * 3 - Anxious (appears agitated but can be calmed down)
 * 4 - Very anxious (appears very agitated, difficult to calm down)
 * 5 - Panicky (severe distress with disorientation)
 * 
 * Respiratory Response (ventilated patient):
 * 1 - No spontaneous respiration
 * 2 - Spontaneous respiration with little or no response to ventilation
 * 3 - Occasional cough or resistance to ventilator
 * 4 - Actively breathes against ventilator or coughs regularly
 * 5 - Fights ventilator, coughing or choking
 * 
 * Respiratory Response (non-ventilated patient):
 * 1 - Quiet breathing, no audible sounds
 * 2 - Occasional slight increase in respiratory rate
 * 3 - Frequent slight increase in respiratory rate
 * 4 - Sustained moderate increase in respiratory rate
 * 5 - Tachypnea with gasping or severe respiratory distress
 * 
 * Physical Movement:
 * 1 - No movement
 * 2 - Occasional slight movement
 * 3 - Frequent slight movement
 * 4 - Vigorous movement limited to extremities
 * 5 - Vigorous movement including torso and head
 * 
 * Muscle Tone:
 * 1 - Muscles totally relaxed; no muscle tone
 * 2 - Reduced muscle tone
 * 3 - Normal muscle tone
 * 4 - Increased muscle tone and flexion of fingers and toes
 * 5 - Extreme muscle rigidity and flexion of fingers and toes
 * 
 * Facial Tension:
 * 1 - Facial muscles totally relaxed
 * 2 - Facial muscle tone normal; no facial muscle tension
 * 3 - Tension evident in some facial muscles
 * 4 - Tension evident throughout facial muscles
 * 5 - Facial muscles contorted and grimacing
 */

export default calculateComfortBScore;