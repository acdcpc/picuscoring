const calculateSOSPDScore = (inputValues) => {
  // Extract values (0 or 1)
  const anxiety = parseInt(inputValues.anxiety) || 0;
  const agitation = parseInt(inputValues.agitation) || 0;
  const hallucinations = parseInt(inputValues.hallucinations) || 0;
  const inconsolableCrying = parseInt(inputValues.inconsolableCrying) || 0;
  const alteredConsciousness = parseInt(inputValues.alteredConsciousness) || 0;

  // Calculate total score
  const totalScore = anxiety + agitation + hallucinations + inconsolableCrying + alteredConsciousness;

  // Determine delirium status
  const deliriumPresent = totalScore >= 4;
  let deliriumType = 'None';
  let clinicalInterpretation = 'No delirium detected.';

  if (deliriumPresent) {
    if (agitation >= 1 || anxiety >= 1) {
      deliriumType = 'Hyperactive';
      clinicalInterpretation = 'Hyperactive delirium detected. Consider calming interventions.';
    }
    if (alteredConsciousness >= 1) {
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
  };
};

export default calculateSOSPDScore;