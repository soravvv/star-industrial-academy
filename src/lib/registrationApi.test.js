import { describe, expect, it, vi } from 'vitest';
import {
  RegistrationError,
  SUBMISSION_ERROR_MESSAGES,
  SUBMISSION_MODE,
  sendRegistration,
} from './registrationApi.js';

const PAYLOAD = Object.freeze({
  fullName: 'Taylor Example',
  email: 'taylor@example.test',
  program: 'Quality Fundamentals',
  consent: true,
});
const URL = 'http://localhost:8765/api/register';

/** Builds a fake `fetch` that resolves with the given status and JSON body. */
const fakeFetch = (status, body = {}) =>
  vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });

describe('sendRegistration', () => {
  it('sends nothing and reports local mode when no URL is configured', async () => {
    const fetchImpl = vi.fn();
    const result = await sendRegistration(PAYLOAD, { url: null, fetchImpl });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result).toEqual({ mode: SUBMISSION_MODE.LOCAL, requestId: null });
  });

  it('POSTs the payload as JSON and returns the request id on 201', async () => {
    const fetchImpl = fakeFetch(201, { status: 'received', requestId: 'abc123' });
    const result = await sendRegistration(PAYLOAD, { url: URL, fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith(
      URL,
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(PAYLOAD),
      }),
    );
    expect(result).toEqual({ mode: SUBMISSION_MODE.API, requestId: 'abc123' });
  });

  it.each([400, 422])('maps HTTP %i to a "rejected" error', async (status) => {
    const promise = sendRegistration(PAYLOAD, { url: URL, fetchImpl: fakeFetch(status) });
    await expect(promise).rejects.toMatchObject({
      code: 'rejected',
      message: SUBMISSION_ERROR_MESSAGES.rejected,
    });
  });

  it('maps other failures to a "server" error', async () => {
    const promise = sendRegistration(PAYLOAD, { url: URL, fetchImpl: fakeFetch(500) });
    await expect(promise).rejects.toMatchObject({ code: 'server' });
  });

  it('maps a network failure to an "unavailable" error', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    const promise = sendRegistration(PAYLOAD, { url: URL, fetchImpl });

    await expect(promise).rejects.toBeInstanceOf(RegistrationError);
    await expect(promise).rejects.toMatchObject({ code: 'unavailable' });
  });

  it('aborts and reports "unavailable" when the server is too slow', async () => {
    // A fetch that never resolves on its own, only when aborted.
    const fetchImpl = vi.fn(
      (_url, { signal }) =>
        new Promise((_resolve, reject) => {
          signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );
    const promise = sendRegistration(PAYLOAD, { url: URL, fetchImpl, timeoutMs: 10 });

    await expect(promise).rejects.toMatchObject({ code: 'unavailable' });
  });
});
