/**
 * Build-time configuration. Vite replaces `import.meta.env.*` when it bundles
 * the app, so nothing here is secret and nothing should be.
 *
 * Registration endpoint resolution:
 *   1. VITE_REGISTRATION_API_URL, if set (see .env.example).
 *   2. Otherwise, in `npm run dev`, the bundled local API.
 *   3. Otherwise (a production build with no URL) → `null`, which puts the
 *      form in "local confirmation" mode: personal details are never sent.
 *      A deployed site must never point at localhost.
 */

const LOCAL_DEV_API_URL = 'http://localhost:8765/api/register';

const configuredUrl = import.meta.env.VITE_REGISTRATION_API_URL?.trim();

/** @type {string | null} */
export const REGISTRATION_API_URL =
  configuredUrl || (import.meta.env.DEV ? LOCAL_DEV_API_URL : null);
