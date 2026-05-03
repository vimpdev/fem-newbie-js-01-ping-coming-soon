const emailInput = document.querySelector('.form__input');
const errorMessage = document.querySelector('.form__message');
const form = document.querySelector('.form');
const dialog = document.querySelector('.dialog');

// Track if the field currently has an error (use for lazy validation)
let hasError = false;

/**
 * Updates UI based on validation result
 * @param {boolean} isValid - validation state
 * @param {string} message - error message to display (if invalid)
 */
function updateUI(isValid, message) {
  if (!isValid) {
    // Show error message
    errorMessage.removeAttribute('hidden');
    errorMessage.textContent = message;

    // Apply error styles and accessibility state
    emailInput.classList.add('form__input--error');
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    // Hide error message
    errorMessage.setAttribute('hidden', '');
    errorMessage.textContent = '';

    // Remove error styles and accessibility state
    emailInput.classList.remove('form__input--error');
    emailInput.removeAttribute('aria-invalid');
  }
}

/**
 * Resets UI to initial (clean) state
 */
function resetUI() {
  errorMessage.setAttribute('hidden', '');
  errorMessage.textContent = '';
  emailInput.classList.remove('form__input--error');
  emailInput.removeAttribute('aria-invalid');
}

/**
 * Validates email using native Constraint Validation API
 * Updates UI and internal error state
 * @returns {boolean} isValid
 */
function validateEmail() {
  let isValid = true;
  let message = '';

  // Use native validation rules (required, type, pattern, etc.)
  if (!emailInput.checkValidity()) {
    isValid = false;

    // Custom messages based on failure type
    if (emailInput.validity.valueMissing) {
      message = 'Whoops! It looks like you forgot to add your email';
    } else {
      message = 'Please provide a valid email address';
    }
  }

  updateUI(isValid, message);
  hasError = !isValid;
  return isValid;
}


/**
 * Handle form submission
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isValid = validateEmail();

  if (isValid) {
    dialog.showModal();
  } else {
    // Focus input for correction
    emailInput.focus();
  }
});


/**
 * Validate on blur (only if user typed something)
 * Prevents showing error on empty untouched field
 */
emailInput.addEventListener('blur', () => {
  if (emailInput.value === '') return;

  validateEmail();
});

/**
 * Lazy validation:
 * Re-validate only if an error is already present
 * (avoids aggressive validation while typing)
 */
emailInput.addEventListener('input', () => {
  if (hasError) {
    validateEmail();
  }
});


/**
 * Handle dialog close
 * - Reset form state after successful submission
 * - Restore focus to input (prevents focus returning to submit button)
 */
dialog.addEventListener('close', () => {
  form.reset();
  resetUI();
  hasError = false;
  emailInput.focus();
});