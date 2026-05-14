export const validateCreatePoll = (formData) => {
  const errors = {};
  let valid = true;

  if (!formData.title || formData.title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long.';
    valid = false;
  } else if (formData.title.trim().length > 300) {
    errors.title = 'Title must not exceed 300 characters.';
    valid = false;
  }
  if (formData.description && formData.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters.';
    valid = false;
  }

  if (!formData.options || formData.options.length < 2) {
    errors.options = 'At least 2 options are required.';
    valid = false;
  } else if (formData.options.length > 8) {
    errors.options = 'No more than 8 options are allowed.';
    valid = false;
  } else {
    formData.options.forEach((opt, index) => {
      if (!opt || opt.trim().length === 0) {
        if (!errors.optionsList) errors.optionsList = [];
        errors.optionsList[index] = 'Option cannot be empty.';
        valid = false;
      } else if (opt.trim().length > 150) {
        if (!errors.optionsList) errors.optionsList = [];
        errors.optionsList[index] = 'Option must not exceed 150 characters.';
        valid = false;
      }
    });
  }

  const allowedTimers = [30, 60, 600, 1200, 1800];
  if (!allowedTimers.includes(Number(formData.timerDuration))) {
    errors.timerDuration = 'Invalid timer duration selected.';
    valid = false;
  }

  return { valid, errors };
};
