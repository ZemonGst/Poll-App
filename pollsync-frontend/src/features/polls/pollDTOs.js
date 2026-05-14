export const toCreatePollDTO = (formData) => {
  return {
    title: formData.title.trim(),
    description: formData.description?.trim() || '',
    options: formData.options.filter((o) => o.trim()).map((o) => ({ text: o.trim() })),
    visibility: 'public',
    pollType: formData.isMultipleChoice ? 'multiple-choice' : 'single-choice',
    allowAnonymousVotes: formData.isAnonymousAllowed,
    timerDuration: Number(formData.timerDuration),
    showLeaderboard: formData.showLeaderboard,
    showAdvancedAnalytics: formData.showAnalytics,
  };
};
