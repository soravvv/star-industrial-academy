import { useEffect, useRef, useState } from 'react';
import logoUrl from '../../assets/star_logo.svg';
import { BRAND, NAVIGATION, SECTION_IDS } from '../../content/siteContent.js';
import { cx } from '../../lib/cx.js';
import buttons from '../../styles/buttons.module.css';
import styles from './Header.module.css';

const NAV_ID = 'primary-navigation';

/**
 * Viewport width at which the inline navigation replaces the menu button.
 * Must match the breakpoint in Header.module.css.
 */
const DESKTOP_NAV_QUERY = '(min-width: 768px)';

/**
 * Sticky site header with logo and primary navigation.
 *
 * On mobile the links sit behind a toggle button. The menu:
 * - exposes its state with aria-expanded / aria-controls,
 * - closes when a link is chosen, when Escape is pressed (focus returns to
 *   the toggle), and when the window is widened to desktop size.
 */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleRef = useRef(null);

  const closeMenu = () => setIsMenuOpen(false);

  // Escape closes the open menu and returns focus to the button that opened it.
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Reset the menu if the viewport grows to desktop width while it is open.
  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_NAV_QUERY);

    function handleChange(event) {
      if (event.matches) setIsMenuOpen(false);
    }

    desktopQuery.addEventListener('change', handleChange);
    return () => desktopQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <header id={SECTION_IDS.top} className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href={`#${SECTION_IDS.top}`} onClick={closeMenu}>
          <img src={logoUrl} alt={`${BRAND.name} — home`} width="170" height="32" />
        </a>

        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          aria-label="Main menu"
          aria-expanded={isMenuOpen}
          aria-controls={NAV_ID}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>

        <nav id={NAV_ID} aria-label="Primary" className={cx(styles.nav, isMenuOpen && styles.navOpen)}>
          <ul className={styles.navList}>
            {NAVIGATION.links.map((link) => (
              <li key={link.href}>
                <a className={styles.navLink} href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className={styles.navCta}>
              <a className={buttons.primary} href={NAVIGATION.cta.href} onClick={closeMenu}>
                {NAVIGATION.cta.label}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
