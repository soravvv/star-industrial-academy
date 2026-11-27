/**
 * Small decorative line icons (24×24, drawn with `currentColor`).
 * They sit next to visible text, so they are hidden from screen readers.
 */
const ICON_PATHS = {
  // Open book — applied knowledge
  knowledge: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  // Clock — flexible pacing
  pacing: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  // Rising bar chart — progress you can track
  progress: (
    <>
      <path d="M4 20h16" />
      <path d="M7 16v-3M12 16V9M17 16V5" />
    </>
  ),
};

/**
 * @param {object} props
 * @param {keyof typeof ICON_PATHS} props.name
 * @param {string} [props.className]
 */
export default function Icon({ name, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
