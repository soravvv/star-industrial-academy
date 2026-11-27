import Benefits from './components/Benefits/Benefits.jsx';
import Faq from './components/Faq/Faq.jsx';
import Footer from './components/Footer/Footer.jsx';
import Header from './components/Header/Header.jsx';
import Hero from './components/Hero/Hero.jsx';
import HowItWorks from './components/HowItWorks/HowItWorks.jsx';
import Programs from './components/Programs/Programs.jsx';
import Registration from './components/Registration/Registration.jsx';
import { SECTION_IDS } from './content/siteContent.js';
import styles from './App.module.css';

/** The whole landing page, top to bottom. */
export default function App() {
  return (
    <>
      {/* First focusable element: lets keyboard users jump past the header. */}
      <a className={styles.skipLink} href={`#${SECTION_IDS.main}`}>
        Skip to main content
      </a>

      <Header />

      {/* tabIndex={-1} lets the skip link move focus here. */}
      <main id={SECTION_IDS.main} className={styles.main} tabIndex={-1}>
        <Hero />
        <Benefits />
        <Programs />
        <HowItWorks />
        <Registration />
        <Faq />
      </main>

      <Footer />
    </>
  );
}
