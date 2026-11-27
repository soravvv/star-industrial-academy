import { BRAND, FOOTER } from '../../content/siteContent.js';
import styles from './Footer.module.css';

/** Site footer: brand line, quick links and copyright. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <p className={styles.brand}>{BRAND.name}</p>
          <p className={styles.tagline}>{BRAND.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <ul className={styles.links}>
            {FOOTER.links.map((link) => (
              <li key={link.href}>
                <a className={styles.link} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <p className={styles.copyright}>{BRAND.copyright}</p>
      </div>
    </footer>
  );
}
