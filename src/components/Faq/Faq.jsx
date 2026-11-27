import { FAQ, SECTION_IDS } from '../../content/siteContent.js';
import Section from '../Section/Section.jsx';
import styles from './Faq.module.css';

/**
 * Frequently asked questions as native <details>/<summary> disclosures.
 * The browser provides keyboard support (Tab to focus, Enter/Space to toggle)
 * and announces the expanded/collapsed state — no JavaScript needed.
 */
export default function Faq() {
  return (
    <Section id={SECTION_IDS.faqs} title={FAQ.heading}>
      <div className={styles.list}>
        {FAQ.items.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>
              <span>{item.question}</span>
              <span className={styles.marker} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
