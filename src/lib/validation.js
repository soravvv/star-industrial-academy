/**
 * Client-side validation for the registration form.
 *
 * The rules deliberately mirror the API (local-api/server.py) so anything that
 * passes here is also accepted by the server. Keeping this a pure function (no
 * React, no DOM) makes it trivial to unit-test — see validation.test.js.
 */

export const FULL_NAME_MIN_LENGTH = 2;
export const FULL_NAME_MAX_LENGTH = 100;

/** Same pattern the API uses: something@something.something, no spaces. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ERROR_MESSAGES = Object.freeze({
  fullNameRequired: 'Enter your full name.',
  fullNameLength: `Full name must be between ${FULL_NAME_MIN_LENGTH} and ${FULL_NAME_MAX_LENGTH} characters.`,
  emailRequired: 'Enter your email address.',
  emailInvalid: 'Enter a valid email address, like name@example.com.',
  programRequired: 'Choose the program you are interested in.',
  consentRequired: 'Tick the box to agree before submitting.',
});

/**
 * @typedef {object} RegistrationValues
 * @property {string} fullName
 * @property {string} email
 * @property {string} program
 * @property {boolean} consent
 */

/**
 * Validates the form values.
 *
 * @param {RegistrationValues} values
 * @param {readonly string[]} allowedPrograms  Program names the dropdown offers.
 * @returns {Partial<Record<keyof RegistrationValues, string>>}
 *   One error message per invalid field. An empty object means the form is valid.
 */
export function validateRegistration(values, allowedPrograms) {
  const errors = {};
  const fullName = values.fullName.trim();
  const email = values.email.trim();

  if (!fullName) {
    errors.fullName = ERROR_MESSAGES.fullNameRequired;
  } else if (fullName.length < FULL_NAME_MIN_LENGTH || fullName.length > FULL_NAME_MAX_LENGTH) {
    errors.fullName = ERROR_MESSAGES.fullNameLength;
  }

  if (!email) {
    errors.email = ERROR_MESSAGES.emailRequired;
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = ERROR_MESSAGES.emailInvalid;
  }

  if (!allowedPrograms.includes(values.program)) {
    errors.program = ERROR_MESSAGES.programRequired;
  }

  if (values.consent !== true) {
    errors.consent = ERROR_MESSAGES.consentRequired;
  }

  return errors;
}
