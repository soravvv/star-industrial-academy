/**
 * Joins class names, skipping falsy values.
 *
 * @example cx(styles.nav, isOpen && styles.navOpen) // "nav_x1 navOpen_x2" or "nav_x1"
 * @param {...(string | false | null | undefined)} classNames
 * @returns {string}
 */
export function cx(...classNames) {
  return classNames.filter(Boolean).join(' ');
}
