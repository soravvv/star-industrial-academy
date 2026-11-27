import { useState } from 'react';
import { sendRegistration } from '../lib/registrationApi.js';
import { validateRegistration } from '../lib/validation.js';

/** @typedef {import('../lib/validation.js').RegistrationValues} RegistrationValues */

/** @type {RegistrationValues} */
const INITIAL_VALUES = Object.freeze({ fullName: '', email: '', program: '', consent: false });

/** Field names in on-screen order; the first invalid one receives focus. */
const FIELD_ORDER = /** @type {const} */ (['fullName', 'email', 'program', 'consent']);

/**
 * @typedef {'idle' | 'submitting' | 'success' | 'error'} SubmitStatus
 *   idle       – waiting for input
 *   submitting – request in flight (submit button is disabled)
 *   success    – accepted; `result` holds the outcome
 *   error      – request failed; `submitError` holds a user-facing message
 */

/**
 * All state and behaviour for the registration form, kept separate from the
 * markup so RegistrationForm.jsx only has to describe what is on screen.
 *
 * Behaviour:
 * - Inputs are controlled (React state is the single source of truth).
 * - Errors appear after the first submit attempt, then update as the user
 *   types so each one disappears as soon as it is fixed.
 * - On a failed submit, keyboard focus moves to the first invalid field so
 *   screen-reader users hear the problem straight away.
 *
 * @param {object} options
 * @param {string | null} options.apiUrl              Endpoint, or null for local-confirmation mode.
 * @param {readonly string[]} options.allowedPrograms Values the program dropdown offers.
 */
export function useRegistrationForm({ apiUrl, allowedPrograms }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  /** @type {[SubmitStatus, Function]} */
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  /** Shared onChange handler for every field, keyed by the input's `name`. */
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    const nextValues = { ...values, [name]: type === 'checkbox' ? checked : value };

    setValues(nextValues);
    if (hasAttemptedSubmit) {
      setErrors(validateRegistration(nextValues, allowedPrograms));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'submitting') return; // ignore double-clicks

    setHasAttemptedSubmit(true);
    const validationErrors = validateRegistration(values, allowedPrograms);
    setErrors(validationErrors);

    const firstInvalidField = FIELD_ORDER.find((field) => validationErrors[field]);
    if (firstInvalidField) {
      focusField(event.currentTarget.elements.namedItem(firstInvalidField));
      return;
    }

    setStatus('submitting');
    setSubmitError('');
    try {
      const outcome = await sendRegistration(toPayload(values), { url: apiUrl });
      setResult(outcome);
      setStatus('success');
    } catch (error) {
      setSubmitError(error.message);
      setStatus('error');
    }
  }

  /** Clears the form so another request can be made. */
  function reset() {
    setValues(INITIAL_VALUES);
    setErrors({});
    setHasAttemptedSubmit(false);
    setResult(null);
    setSubmitError('');
    setStatus('idle');
  }

  return { values, errors, status, result, submitError, handleChange, handleSubmit, reset };
}

/**
 * Moves focus to a control and scrolls its label into view.
 *
 * A plain `.focus()` scrolls only the control itself, which can leave its
 * label hidden under the sticky header. Scrolling the label instead keeps
 * both visible (html's `scroll-padding-top` clears the header), and
 * `preventScroll` stops focus from scrolling a second time.
 *
 * @param {HTMLInputElement | HTMLSelectElement | null} control
 */
function focusField(control) {
  if (!control) return;
  const label = control.labels?.[0] ?? control;
  label.scrollIntoView({ block: 'start' });
  control.focus({ preventScroll: true });
}

/**
 * Converts form state into the API's request body.
 * @param {RegistrationValues} values
 */
function toPayload(values) {
  return {
    fullName: values.fullName.trim(),
    email: values.email.trim(),
    program: values.program,
    consent: true, // only reachable after validation confirmed consent === true
  };
}
