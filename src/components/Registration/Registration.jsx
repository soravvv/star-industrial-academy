import { REGISTRATION_API_URL } from '../../config.js';
import { PROGRAM_NAMES, REGISTRATION, SECTION_IDS } from '../../content/siteContent.js';
import Section from '../Section/Section.jsx';
import RegistrationForm from './RegistrationForm.jsx';

/**
 * Registration section. Wires configuration into the form, so the form itself
 * stays free of environment details and easy to reuse or test.
 */
export default function Registration() {
  return (
    <Section
      id={SECTION_IDS.register}
      title={REGISTRATION.heading}
      intro={REGISTRATION.paragraph}
      tone="dark"
      layout="split"
    >
      <RegistrationForm apiUrl={REGISTRATION_API_URL} programs={PROGRAM_NAMES} />
    </Section>
  );
}
