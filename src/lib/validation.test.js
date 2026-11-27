import { describe, expect, it } from 'vitest';
import { ERROR_MESSAGES, validateRegistration } from './validation.js';

const PROGRAMS = ['Quality Fundamentals', 'Production Operations'];

const VALID = Object.freeze({
  fullName: 'Taylor Example',
  email: 'taylor@example.test',
  program: 'Quality Fundamentals',
  consent: true,
});

const validate = (overrides) => validateRegistration({ ...VALID, ...overrides }, PROGRAMS);

describe('validateRegistration', () => {
  it('returns no errors for valid input', () => {
    expect(validate({})).toEqual({});
  });

  it('requires a full name, ignoring surrounding spaces', () => {
    expect(validate({ fullName: '   ' }).fullName).toBe(ERROR_MESSAGES.fullNameRequired);
  });

  it('enforces the 2–100 character name length used by the API', () => {
    expect(validate({ fullName: 'A' }).fullName).toBe(ERROR_MESSAGES.fullNameLength);
    expect(validate({ fullName: 'A'.repeat(101) }).fullName).toBe(ERROR_MESSAGES.fullNameLength);
    expect(validate({ fullName: 'Al' })).toEqual({});
  });

  it('requires an email address', () => {
    expect(validate({ email: '' }).email).toBe(ERROR_MESSAGES.emailRequired);
  });

  it.each(['taylor', 'taylor@', 'taylor@example', 'tay lor@example.test'])(
    'rejects the malformed email %j',
    (email) => {
      expect(validate({ email }).email).toBe(ERROR_MESSAGES.emailInvalid);
    },
  );

  it('only accepts programs from the allowed list', () => {
    expect(validate({ program: '' }).program).toBe(ERROR_MESSAGES.programRequired);
    expect(validate({ program: 'Underwater Welding' }).program).toBe(
      ERROR_MESSAGES.programRequired,
    );
  });

  it('requires consent', () => {
    expect(validate({ consent: false }).consent).toBe(ERROR_MESSAGES.consentRequired);
  });

  it('reports every invalid field at once', () => {
    const errors = validateRegistration(
      { fullName: '', email: '', program: '', consent: false },
      PROGRAMS,
    );
    expect(Object.keys(errors)).toEqual(['fullName', 'email', 'program', 'consent']);
  });
});
