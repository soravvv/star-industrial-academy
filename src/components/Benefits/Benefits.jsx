import { BENEFITS, SECTION_IDS } from '../../content/siteContent.js';
import layout from '../../styles/layout.module.css';
import Icon from '../Icon/Icon.jsx';
import Section from '../Section/Section.jsx';
import styles from './Benefits.module.css';

/** "Why Star" — three reasons to choose the academy. */
export default function Benefits() {
  return (
    <Section id={SECTION_IDS.whyStar} title={BENEFITS.heading}>
      <ul className={layout.cardGrid}>
        {BENEFITS.items.map((benefit) => (
          <li key={benefit.title}>
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.iconBadge}>
                  <Icon name={benefit.icon} />
                </span>
                <h3 className={styles.title}>{benefit.title}</h3>
              </div>
              <p className={styles.description}>{benefit.description}</p>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
