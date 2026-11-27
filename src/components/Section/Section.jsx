import { cx } from '../../lib/cx.js';
import styles from './Section.module.css';

/**
 * Shared wrapper for every content section below the hero: provides the
 * anchor id, the <h2> (linked via aria-labelledby so screen readers announce
 * the section by name), background tone and centred container.
 *
 * @param {object} props
 * @param {string} props.id                 Anchor id used by in-page links.
 * @param {string} props.title              Section heading text.
 * @param {string} [props.intro]            Optional paragraph under the heading.
 * @param {'page' | 'dark'} [props.tone]    Background colour scheme.
 * @param {'stacked' | 'split'} [props.layout]
 *   `stacked`: heading above content. `split`: heading on the left, content
 *   on the right from desktop width up (stacked on smaller screens).
 * @param {import('react').ReactNode} props.children
 */
export default function Section({ id, title, intro, tone = 'page', layout = 'stacked', children }) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={cx(styles.section, styles[tone])}>
      <div className={cx(styles.inner, layout === 'split' && styles.split)}>
        <header className={styles.header}>
          <h2 id={headingId} className={styles.title}>
            {title}
          </h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
