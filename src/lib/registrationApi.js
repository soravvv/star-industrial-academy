/**
 * Sends a registration-of-interest request.
 *
 * API contract (see local-api/README.md):
 *   POST {url}  JSON { fullName, email, program, consent: true }
 *   201 → { status: 'received', requestId, message }
 *   400 / 422 → invalid body or fields
 *
 * When `url` is null (a hosted build with no approved endpoint) the request is
 * NOT sent anywhere; the caller gets a "local" result so the UI can show an
 * honest preview confirmation instead.
 */

export const SUBMISSION_MODE = Object.freeze({
  /** The request was accepted by a real API. */
  API: 'api',
  /** No API configured — validated in the browser only, nothing transmitted. */
  LOCAL: 'local',
});

const DEFAULT_TIMEOUT_MS = 10_000;

export const SUBMISSION_ERROR_MESSAGES = Object.freeze({
  unavailable:
    "We couldn't reach the registration service. Check your connection and try again in a moment.",
  rejected: "Some details weren't accepted. Please check the form and try again.",
  server: 'Something went wrong on our side. Please try again in a moment.',
});

/** An error whose `message` is safe to show to the user. */
export class RegistrationError extends Error {
  /**
   * @param {'unavailable' | 'rejected' | 'server'} code
   */
  constructor(code) {
    super(SUBMISSION_ERROR_MESSAGES[code]);
    this.name = 'RegistrationError';
    this.code = code;
  }
}

/**
 * @typedef {object} RegistrationPayload
 * @property {string} fullName
 * @property {string} email
 * @property {string} program
 * @property {true} consent
 *
 * @typedef {object} RegistrationResult
 * @property {'api' | 'local'} mode
 * @property {string | null} requestId  Server reference, when one was returned.
 */

/**
 * @param {RegistrationPayload} payload
 * @param {object} options
 * @param {string | null} options.url          Endpoint, or null for local-confirmation mode.
 * @param {typeof fetch} [options.fetchImpl]   Injected in tests.
 * @param {number} [options.timeoutMs]         Abort the request after this long.
 * @returns {Promise<RegistrationResult>}
 * @throws {RegistrationError}
 */
export async function sendRegistration(
  payload,
  { url, fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS },
) {
  if (!url) {
    return { mode: SUBMISSION_MODE.LOCAL, requestId: null };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch {
    // Network failure, CORS rejection, server not running, or timeout.
    throw new RegistrationError('unavailable');
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.ok) {
    const body = await response.json().catch(() => ({}));
    return { mode: SUBMISSION_MODE.API, requestId: body.requestId ?? null };
  }

  if (response.status === 400 || response.status === 422) {
    throw new RegistrationError('rejected');
  }

  throw new RegistrationError('server');
}
