import heroImageUrl from '../../assets/industrial_hero.webp';
import { HERO } from '../../content/siteContent.js';
import buttons from '../../styles/buttons.module.css';
import styles from './Hero.module.css';

/** Opening section: the page's only <h1>, calls to action and hero artwork. */
export default function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{HERO.eyebrow}</p>
          <h1 id="hero-heading" className={styles.title}>
            {HERO.headline}
          </h1>
          <p className={styles.lead}>{HERO.paragraph}</p>

          <div className={styles.actions}>
            <a className={buttons.primary} href={HERO.primaryCta.href}>
              {HERO.primaryCta.label}
            </a>
            <a className={buttons.text} href={HERO.secondaryCta.href}>
              {HERO.secondaryCta.label}
            </a>
          </div>

          <ul className={styles.ribbon} aria-label="Program highlights">
            {HERO.ribbon.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          {/* Above the fold: load with high priority. Explicit width/height
              reserve space so the layout doesn't jump while it loads.
              `fetchpriority` is lowercase on purpose: React 18 doesn't know
              the camelCase prop yet and passes lowercase attributes through. */}
          <img
            src={heroImageUrl}
            alt={HERO.image.alt}
            width="900"
            height="680"
            fetchpriority="high"
          />
        </div>
      </div>
    </section>
  );
}
