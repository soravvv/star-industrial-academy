import { useEffect, useRef } from 'react';
import { REGISTRATION } from '../../content/siteContent.js';
import { useRegistrationForm } from '../../hooks/useRegistrationForm.js';
import { cx } from '../../lib/cx.js';
import { SUBMISSION_MODE } from '../../lib/registrationApi.js';
import buttons from '../../styles/buttons.module.css';
import styles from './RegistrationForm.module.css';

const { labels } = REGISTRATION;

/** Prefix for element ids so they cannot clash with anything else on the page. */
const idFor = (field) => `registration-${field}`;
const errorIdFor = (field) => `${idFor(field)}-error`;

/**
 * Registration-of-interest form. All state and submit logic live in
 * `useRegistrationForm`; this component only renders.
 *
 * Accessibility:
 * - every control has a visible <label>;
 * - invalid controls get aria-invalid and point at their error text with
 *   aria-describedby, so the error is read when the control is focused;
 * - the success message receives focus so it is announced.
 *
 * @param {object} props
 * @param {string | null} props.apiUrl  Endpoint, or null for local-confirmation (preview) mode.
 * @param {readonly string[]} props.programs
 */
export default function RegistrationForm({ apiUrl, programs }) {
  const { values, errors, status, result, submitError, handleChange, handleSubmit, reset } =
    useRegistrationForm({ apiUrl, allowedPrograms: programs });

  const successRef = useRef(null);
  const firstFieldRef = useRef(null);
  const focusFirstFieldAfterReset = useRef(false);

  // Move focus to whichever view just appeared so keyboard and screen-reader
  // users are never left on an element that no longer exists.
  useEffect(() => {
    if (status === 'success') {
      successRef.current?.focus();
    } else if (status === 'idle' && focusFirstFieldAfterReset.current) {
      focusFirstFieldAfterReset.current = false;
      firstFieldRef.current?.focus();
    }
  }, [status]);

  function handleReset() {
    focusFirstFieldAfterReset.current = true;
    reset();
  }

  if (status === 'success') {
    const isLocalOnly = result.mode === SUBMISSION_MODE.LOCAL;
    return (
      <div ref={successRef} className={styles.panel} role="status" tabIndex={-1}>
        <div className={styles.success}>
          <p className={styles.successMessage}>
            {isLocalOnly ? REGISTRATION.previewSuccessMessage : REGISTRATION.successMessage}
          </p>
          {result.requestId && (
            <p className={styles.reference}>Reference: {result.requestId}</p>
          )}
        </div>
        <button type="button" className={buttons.text} onClick={handleReset}>
          {REGISTRATION.resetLabel}
        </button>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';

  /** Common accessibility attributes for a control, based on its error state. */
  const a11yProps = (field) => ({
    id: idFor(field),
    name: field,
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? errorIdFor(field) : undefined,
  });

  return (
    // noValidate: we show our own accessible messages instead of the
    // browser's inconsistent tooltips. `required` is kept for semantics.
    <form className={styles.panel} noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
      {!apiUrl && <p className={styles.notice}>{REGISTRATION.previewNotice}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor={idFor('fullName')}>
          {labels.fullName}
        </label>
        <input
          {...a11yProps('fullName')}
          ref={firstFieldRef}
          className={styles.control}
          type="text"
          autoComplete="name"
          required
          value={values.fullName}
          onChange={handleChange}
        />
        <FieldError field="fullName" message={errors.fullName} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={idFor('email')}>
          {labels.email}
        </label>
        <input
          {...a11yProps('email')}
          className={styles.control}
          type="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          required
          value={values.email}
          onChange={handleChange}
        />
        <FieldError field="email" message={errors.email} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={idFor('program')}>
          {labels.program}
        </label>
        <select
          {...a11yProps('program')}
          className={cx(styles.control, styles.select)}
          required
          value={values.program}
          onChange={handleChange}
        >
          <option value="" disabled>
            {labels.programPlaceholder}
          </option>
          {programs.map((program) => (
            <option key={program} value={program}>
              {program}
            </option>
          ))}
        </select>
        <FieldError field="program" message={errors.program} />
      </div>

      <div className={styles.field}>
        <div className={styles.checkboxRow}>
          <input
            {...a11yProps('consent')}
            className={styles.checkbox}
            type="checkbox"
            required
            checked={values.consent}
            onChange={handleChange}
          />
          <label className={styles.checkboxLabel} htmlFor={idFor('consent')}>
            {labels.consent}
          </label>
        </div>
        <FieldError field="consent" message={errors.consent} />
      </div>

      {status === 'error' && (
        <p className={styles.alert} role="alert">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        className={cx(buttons.primary, buttons.fullWidth)}
        disabled={isSubmitting}
      >
        {isSubmitting ? REGISTRATION.submittingLabel : REGISTRATION.submitLabel}
      </button>
    </form>
  );
}

/**
 * Error text linked to its control via aria-describedby. Renders nothing when
 * there is no error.
 */
function FieldError({ field, message }) {
  if (!message) return null;
  return (
    <p id={errorIdFor(field)} className={styles.error}>
      {message}
    </p>
  );
}
