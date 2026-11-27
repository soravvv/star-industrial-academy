import { PROGRAMS, SECTION_IDS } from '../../content/siteContent.js';
import layout from '../../styles/layout.module.css';
import Section from '../Section/Section.jsx';
import styles from './Programs.module.css';

/** The three learning paths on offer. */
export default function Programs() {
  return (
    <Section id={SECTION_IDS.programs} title={PROGRAMS.heading}>
      <ul className={layout.cardGrid}>
        {PROGRAMS.items.map((program) => (
          <li key={program.name}>
            <article className={styles.card}>
              <h3 className={styles.name}>{program.name}</h3>
              {/* Visually above the name (see CSS `order`), but after it in
                  the markup so screen readers hear the name first. */}
              <p className={styles.duration}>{program.duration}</p>
              <p className={styles.description}>{program.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
