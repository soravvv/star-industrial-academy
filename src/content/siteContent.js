/**
 * Every piece of approved page copy, taken from
 * INPUT_FILES/CONTENT_AND_DESIGN.md.
 *
 * Components render from this module, so a wording change is a one-line edit
 * here and never requires touching JSX or CSS.
 */

/** Anchor ids for in-page sections, shared by the navigation and the sections themselves. */
export const SECTION_IDS = Object.freeze({
  top: 'top',
  main: 'main-content',
  whyStar: 'why-star',
  programs: 'programs',
  howItWorks: 'how-it-works',
  register: 'register',
  faqs: 'faqs',
});

const href = (id) => `#${id}`;

export const BRAND = Object.freeze({
  name: 'Star Industrial Academy',
  tagline: 'Skills for the next shift.',
  copyright: '© 2026 Star Industrial Academy',
});

export const NAVIGATION = Object.freeze({
  links: [
    { label: 'Programs', href: href(SECTION_IDS.programs) },
    { label: 'Why Star', href: href(SECTION_IDS.whyStar) },
    { label: 'FAQs', href: href(SECTION_IDS.faqs) },
  ],
  cta: { label: 'Register', href: href(SECTION_IDS.register) },
});

export const HERO = Object.freeze({
  eyebrow: 'Career-ready learning',
  headline: 'Practical skills. Real industrial confidence.',
  paragraph:
    'Build foundational knowledge in quality, production and workplace operations through concise, instructor-led learning paths designed for growing professionals.',
  primaryCta: { label: 'Explore Programs', href: href(SECTION_IDS.programs) },
  secondaryCta: { label: 'Register Interest', href: href(SECTION_IDS.register) },
  ribbon: ['Three practical pathways', 'Flexible learning format', 'Guided activities'],
  image: {
    alt: 'Illustration of an industrial production line with control panels on a conveyor.',
  },
});

export const BENEFITS = Object.freeze({
  heading: 'Learn with a clear purpose',
  items: [
    {
      icon: 'knowledge',
      title: 'Applied knowledge',
      description: 'Learn using structured scenarios drawn from manufacturing workflows.',
    },
    {
      icon: 'pacing',
      title: 'Flexible pacing',
      description: 'Work through focused lessons around your schedule.',
    },
    {
      icon: 'progress',
      title: 'Progress you can track',
      description: 'Build skills through milestones and practice activities.',
    },
  ],
});

export const PROGRAMS = Object.freeze({
  heading: 'Choose your next learning path',
  items: [
    {
      name: 'Quality Fundamentals',
      duration: '4 weeks',
      description: 'Inspection basics, checklists and problem-solving.',
    },
    {
      name: 'Production Operations',
      duration: '5 weeks',
      description: 'Workflow planning, shift coordination and production records.',
    },
    {
      name: 'Industrial Data Essentials',
      duration: '3 weeks',
      description: 'Spreadsheet reporting, key metrics and clean data habits.',
    },
  ],
});

/**
 * Program names offered in the registration dropdown. Derived from PROGRAMS so
 * the two can never drift apart. They must also match the API's allow-list
 * (local-api/server.py), which rejects any other value with HTTP 422.
 */
export const PROGRAM_NAMES = Object.freeze(PROGRAMS.items.map((program) => program.name));

export const HOW_IT_WORKS = Object.freeze({
  heading: 'A straightforward path to getting started',
  steps: [
    { number: '01', title: 'Pick a program' },
    { number: '02', title: 'Share your interest' },
    { number: '03', title: 'Receive next-step information' },
  ],
});

export const REGISTRATION = Object.freeze({
  heading: 'Start your learning journey',
  paragraph:
    "Tell us which pathway interests you. We'll show a local confirmation when your request is accepted.",
  labels: {
    fullName: 'Full name',
    email: 'Email address',
    program: 'Program interest',
    programPlaceholder: 'Select a program',
    consent: 'I agree that my information may be used to respond to this interest request.',
  },
  submitLabel: 'Submit Interest',
  submittingLabel: 'Submitting…',
  resetLabel: 'Submit another request',
  successMessage: 'Thanks for your interest. Your request has been recorded.',
  // Shown instead of `successMessage` when no API is configured (hosted
  // preview), because in that mode nothing is actually recorded.
  previewSuccessMessage:
    'Thanks for your interest. This preview checked your details in your browser only. Nothing was sent or stored.',
  previewNotice:
    'Preview mode: your details are checked in your browser only and are not sent anywhere.',
});

export const FAQ = Object.freeze({
  heading: 'Frequently asked questions',
  items: [
    {
      question: 'Are programs suitable for beginners?',
      answer: 'Yes. Each pathway begins with core concepts and structured exercises.',
    },
    {
      question: 'Do I need prior manufacturing experience?',
      answer: 'No previous industrial work experience is required for the foundation pathways.',
    },
    {
      question: 'Does registration guarantee a seat?',
      answer: 'No. This form records interest; enrollment details are shared separately.',
    },
  ],
});

export const FOOTER = Object.freeze({
  links: [
    { label: 'Programs', href: href(SECTION_IDS.programs) },
    { label: 'Registration', href: href(SECTION_IDS.register) },
  ],
});
