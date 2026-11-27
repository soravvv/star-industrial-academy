import { HOW_IT_WORKS, SECTION_IDS } from '../../content/siteContent.js';
import layout from '../../styles/layout.module.css';
import Section from '../Section/Section.jsx';
import styles from './HowItWorks.module.css';

/** Three numbered steps from interest to next-step information. */
export default function HowItWorks() {
  return (
    <Section id={SECTION_IDS.howItWorks} title={HOW_IT_WORKS.heading}>
      {/* An ordered list already announces "1 of 3" etc., so the visual
          "01" numbers are hidden from screen readers to avoid repetition. */}
      <ol className={layout.cardGrid}>
        {HOW_IT_WORKS.steps.map((step) => (
          <li key={step.number} className={styles.step}>
            <span className={styles.number} aria-hidden="true">
              {step.number}
            </span>
            <h3 className={styles.title}>{step.title}</h3>
          </li>
        ))}
      </ol>
    </Section>
  );
}
