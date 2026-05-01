import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GitBranch, Link, Mail, Phone, MapPin, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, X, Menu, FileText, Award, Image } from 'lucide-react';
import './App.css';
const Github = GitBranch;
const Linkedin = Link;

/* encode only spaces and special chars that browsers choke on, preserving slashes */
const p = (path) => path.split('/').map(seg => encodeURIComponent(seg)).join('/');

const SECTIONS = ['about','experience','research','projects','conferences','awards','contact'];
const NAV_LABELS = ['About','Experience','Research','Projects','Conferences','Awards','Contact'];

/* ─── DATA ─── */
const SKILLS = {
  'Languages': ['Java', 'Python', 'C#', 'JavaScript', 'PowerShell', 'R', 'MATLAB'],
  'Web & UI': ['React', '.NET', 'ASP.NET', 'Blazor', 'HTML', 'CSS', 'Tailwind', 'Bootstrap'],
  'Databases & Cloud': ['SQL', 'MySQL', 'PostgreSQL', 'Azure', 'AWS', 'MS SQL Server'],
  'ML & AI': ['TensorFlow', 'Keras', 'PyTorch', 'Scikit-Learn', 'Bayesian Networks', 'OpenCV', 'Pandas', 'NumPy'],
};

/* Experience — text only, no images */
const EXPERIENCE = [
  {
    role: 'Software Developer',
    org: 'Specialty Print Communications',
    date: 'Jun 2025 – Present',
    bullets: [
      'Designed and developed a full-scale internal portal using PowerShell, .NET, C#, Razor, Python, JavaScript, SQL, and REST APIs.',
      'Deployed and managed applications on IIS server.',
      'Worked in an Agile environment with regular sprints, code reviews, and CI/CD practices.',
    ],
  },
  {
    role: 'Deep Learning Researcher & NIH R25 Scholar',
    org: 'Clemson University',
    date: 'Jun – Aug 2024',
    bullets: [
      'Created Explainable AI techniques for CNNs that improved bacteria classification interpretability by over 80%.',
      'Applied LIME, Grad-CAM, and Integrated Gradients on the TF-Flowers dataset with 3,670 images.',
    ],
  },
  {
    role: 'Machine Learning Researcher',
    org: 'ACS Technologies',
    date: 'Sep 2023 – Feb 2024',
    bullets: [
      'Led AI research using Bayesian networks and Logistic Regression, providing predictive insights to stakeholders.',
      'Handled imbalanced datasets using UnderSampling and OverSampling techniques.',
    ],
  },
  {
    role: 'Software Developer Intern',
    org: 'McLeod Hospital',
    date: 'Jun – Aug 2023',
    bullets: [
      'Built a full-stack hospital management app called Morgue Tracker to handle patient admissions and releases.',
      'Used C#, ASP.NET, and MS SQL Server for a secure backend.',
      'Designed the UI with HTML, CSS, Bootstrap, and Razor views.',
    ],
  },
  {
    role: 'Machine Learning Researcher',
    org: 'Cell Biology Education Consortium',
    date: 'Jan – Jun 2023',
    bullets: [
      'Modeled networks using NumPy, Pandas, and Scikit-learn and shared findings with stakeholders.',
      'Compared Naive Bayes and Causal networks and reached about 90% accuracy with K-Fold validation.',
    ],
  },
];

/* Research — poster PDF viewer only, no conference photos */
const RESEARCH = [
  {
    num: '01',
    title: 'Unveiling the Black Box: XAI for CNN Explainability',
    org: 'NIH R25 Scholar · Clemson University',
    body: 'Applied LIME, Grad-CAM, and Integrated Gradients to a 2D CNN trained on the TF-Flowers dataset. Reached 75.3% accuracy after 10 epochs and improved bacteria classification interpretability by more than 80%.',
    tags: ['Deep Learning', 'XAI', 'LIME', 'Grad-CAM', 'CNNs', 'Python'],
    pdf: '/Images/ResearchPosters/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson.pdf',
  },
  {
    num: '02',
    title: 'Predicting Customer Status via Bayesian Networks',
    org: 'ACS Technologies · Francis Marion University',
    body: 'Used Bayesian networks with K-Fold validation on an imbalanced dataset. Implemented UnderSampling (86.14% accuracy) and OverSampling (87.05% accuracy) to improve predictions for the minority class.',
    tags: ['Bayesian Networks', 'Imbalanced Data', 'Pgmpy', 'Pandas', 'Scikit-learn'],
    pdf: '/Images/ResearchPosters/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS.pdf',
  },
  {
    num: '03',
    title: 'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    org: 'Cell Biology Education Consortium',
    body: 'Compared Naive Bayes and Causal Bayesian models on Wix analytics data with 3,369 entries. Both models reached about 90% accuracy predicting session durations with 10-fold validation.',
    tags: ['Naive Bayes', 'Causal Networks', 'K-Fold', 'Web Analytics', 'Python'],
    pdf: '/Images/ResearchPosters/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC.pdf',
  },
  {
    num: '04',
    title: 'Comparing Logistic Regression & Bayesian Networks',
    org: 'Undergraduate Mathematics Conference 2024',
    body: "Presented at FMU's 2024 Undergraduate Mathematics Conference. Compared Logistic Regression and Bayesian Network models for customer status prediction.",
    tags: ['Logistic Regression', 'Bayesian Networks', 'One-Hot Encoding', 'statsmodels'],
    pdf: '/Images/ResearchPosters/Comparing logistic regression and bayesian network for predictive modeling_FMU.pdf',
  },
];

/* Projects — project screenshots from Images/Projects/ only */
const PROJECTS = [
  {
    name: 'Sign-Me-In',
    date: 'Jul 2023 – Apr 2024',
    body: "A secure student sign-in app built for FDTC's Math Hub. Replaced an Excel-based system with a clean interface and manager dashboard tracking student visits and operational hours.",
    stack: ['C#', '.NET 8', 'Blazor', 'Azure SQL', 'Entity Framework'],
    screenshots: [
      '/Images/Projects/signmein_screen1.jpeg',
      '/Images/Projects/signmein_screen2.jpeg',
      '/Images/Projects/signmein_screen3.jpeg',
      '/Images/Projects/signmein_screen4.jpeg',
      '/Images/Projects/signmein_screen5.jpeg',
    ],
    pdf: '/Images/ResearchPosters/SignMeIn_FDTC.pdf',
  },
  {
    name: 'Morgue Tracker',
    date: 'Jun – Aug 2023',
    body: 'A full-stack hospital management system built during my internship at McLeod Hospital to track patient admissions and releases.',
    stack: ['C#', 'ASP.NET', 'MS SQL Server', 'Bootstrap', 'Razor'],
    screenshots: [
      '/Images/Projects/morguetracker_screen1.jpeg',
      '/Images/Projects/morguetracker_screen2.jpeg',
      '/Images/Projects/morguetracker_screen3.jpeg',
      '/Images/Projects/morguetracker_screen4.jpeg',
    ],
    pdf: null,
  },
  {
    name: 'Customer Status Prediction',
    date: 'Jan – Apr 2024',
    body: 'A machine learning project using logistic regression and Bayesian networks to model customer retention with imbalanced dataset handling.',
    stack: ['Python', 'Scikit-learn', 'Pgmpy', 'Pandas', 'Matplotlib'],
    screenshots: [],
    pdf: null,
  },
  {
    name: 'Pizza Shop Accounting',
    date: 'Aug 2022 – May 2023',
    body: 'A desktop accounting system with full CRUD, reporting, and Agile delivery. Built with a Java Swing UI and MySQL backend.',
    stack: ['Java', 'JavaFX', 'MySQL', 'JUnit', 'Agile/Scrum'],
    screenshots: [
      '/Images/Projects/pizzashop_screen1.jpeg',
      '/Images/Projects/pizzashop_screen2.jpeg',
      '/Images/Projects/pizzashop_screen3.jpeg',
      '/Images/Projects/pizzashop_screen4.jpeg',
      '/Images/Projects/pizzashop_screen5.jpeg',
      '/Images/Projects/pizzashop_screen6.jpg',
    ],
    pdf: null,
  },
  {
    name: 'Base Conversion',
    date: 'Jan 2023 – May 2023',
    body: 'A number base conversion tool that converts between decimal, binary, and hexadecimal. Built to understand how digital systems represent numbers across bases.',
    stack: ['Python', 'Mathematics', 'Pandas'],
    screenshots: [],
    pdf: null,
  },
];

/* Conferences — Images/Conference/ photos + Images/Awards/ for applicable ones */
const CONFERENCES = [
  {
    name: 'NIH R25 Research Symposium',
    location: 'Greenville, SC',
    date: 'Summer 2024',
    topic: 'Unveiling the Black Box: XAI for CNN Explainability',
    images: [
      '/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Greenville_SC_1.jpeg',
      '/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_1.jpeg',
      '/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_2.jpeg',
      '/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Omaha_NE_1.jpeg',
    ],
    award: '/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg',
    awardLabel: '1st Place — Best Presentation Award · NIH R25 Symposium, Jul 2024',
  },
  {
    name: 'ACS / SC EPSCoR Conference',
    location: 'Nashville, TN & Columbia, SC',
    date: '2023–2024',
    topic: 'Predicting Customer Status via Bayesian Networks',
    images: [
      '/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_1.jpg',
      '/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_2.jpg',
    ],
    award: '/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg',
    awardLabel: '1st Place — SC EPSCoR Poster Presentation Competition · Columbia, SC, Apr 2024',
  },
  {
    name: 'NCUWM — National Conference for Undergraduate Women in Mathematics',
    location: 'Lincoln, NE',
    date: '2023',
    topic: 'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images: [
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_1.jpg',
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_2.jpg',
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_3.jpg',
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_4.jpg',
    ],
    award: null,
    awardLabel: null,
  },
  {
    name: 'Math Conference — Tampa',
    location: 'Tampa, FL',
    date: '2023',
    topic: 'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images: [
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_1.jpg',
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_2.jpg',
      '/Images/Conference/Comparing Naïve Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_3.jpg',
    ],
    award: null,
    awardLabel: null,
  },
  {
    name: 'FMU Undergraduate Math Conference',
    location: 'Florence, SC',
    date: 'April 2024',
    topic: 'Comparing Logistic Regression & Bayesian Networks',
    images: [
      '/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_1.jpg',
      '/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_2.jpg',
    ],
    award: null,
    awardLabel: null,
  },
];

/* Awards — Images/Awards/ only */
const AWARDS = [
  {
    title: 'Best Presentation Award — 1st Place',
    issuer: 'NIH R25 · USC School of Medicine Greenville Symposium',
    date: 'Jul 2024',
    type: 'award',
    image: '/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg',
  },
  {
    title: 'First Place Undergraduate Student Winner',
    issuer: 'SC EPSCoR Poster Presentation Competition — Columbia, SC',
    date: 'Apr 9, 2024',
    type: 'award',
    image: '/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg',
  },
  {
    title: 'FMU Math-Engineering and Computing (RCR)',
    issuer: 'CITI Program',
    date: 'May 2024',
    expires: 'May 2029',
    credentialId: '62817679',
    type: 'certification',
    image: null,
  },
  {
    title: 'Certified Member (CM)',
    issuer: 'Kappa Mu Epsilon',
    date: 'Sep 2023',
    type: 'honor',
    image: null,
  },
  {
    title: 'Certified Member (CM)',
    issuer: 'Upsilon Pi Epsilon',
    date: 'Apr 2023',
    type: 'honor',
    image: null,
  },
  {
    title: 'Certified Member (CM)',
    issuer: 'The National Society of Leadership and Success (NSLS)',
    date: 'Aug 2022',
    type: 'honor',
    image: null,
  },
  {
    title: 'Certified Member (CM)',
    issuer: 'Phi Theta Kappa Honor Society International',
    date: 'Apr 2021',
    type: 'honor',
    image: null,
  },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useScrollSpy() {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const handler = () => {
      let current = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return active;
}

const FadeUp = ({ children, delay = 0, style }) => {
  const [ref, inView] = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  );
};

const SectionLabel = ({ children, light }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.6rem' }}>
    <div style={{ width: 28, height: 1, background: light ? '#c9a84c' : '#b85c38', flexShrink: 0 }} />
    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: light ? '#c9a84c' : '#b85c38' }}>{children}</span>
  </div>
);

function ImageCarousel({ images, height = 240, contain = false }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return null;
  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  return (
    <div className="carousel-wrap" style={{ height }}>
      <AnimatePresence mode="wait">
        <motion.img key={images[idx]} src={p(images[idx])} alt="" className="carousel-img"
          style={{ objectFit: contain ? 'contain' : 'cover', background: contain ? '#111' : 'transparent' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
      </AnimatePresence>
      {images.length > 1 && (
        <>
          <button className="carousel-btn carousel-btn-left" onClick={prev}><ChevronLeft size={16} /></button>
          <button className="carousel-btn carousel-btn-right" onClick={next}><ChevronRight size={16} /></button>
          <div className="carousel-dots">
            {images.map((_, i) => (
              <span key={i} className={`carousel-dot${i === idx ? ' active' : ''}`} onClick={(e) => { e.stopPropagation(); setIdx(i); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const activeSection = useScrollSpy();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <>
      <motion.nav className="nav" initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}
        style={{ background: scrolled ? 'rgba(245,240,232,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(18px)' : 'none', borderBottom: scrolled ? '1px solid #e8e2d8' : '1px solid transparent' }}>
        <a href="#hero" className="nav-logo">BP<span style={{ color: '#b85c38' }}>.</span></a>
        <ul className="nav-links">
          {SECTIONS.map((id, i) => (
            <li key={id}><a href={`#${id}`} className={`nav-link${activeSection === id ? ' nav-link-active' : ''}`}>{NAV_LABELS[i]}</a></li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setOpen(true)}><Menu size={21} /></button>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.38, ease: [0.22,1,0.36,1] }}>
            <button className="mobile-close" onClick={() => setOpen(false)}><X size={22} /></button>
            {SECTIONS.map((id, i) => (
              <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="mobile-link"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                {NAV_LABELS[i]}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── HERO ─── */
function Hero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 500], [0, 70]);
  return (
    <section id="hero" className="hero">
      <div className="hero-deco-circle" />
      <div className="hero-deco-circle2" />
      <div className="hero-text">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <SectionLabel>Developer · Researcher</SectionLabel>
        </motion.div>
        <motion.h1 className="hero-name" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: [0.22,1,0.36,1] }}>
          Bhakti<br /><em>Patel.</em>
        </motion.h1>
        <motion.p className="hero-subtitle" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.22 }}>
          Full-Stack Engineer &amp; Applied AI Researcher<br />based in Itasca, IL.
        </motion.p>
        <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.38 }}>
          I build software that solves real problems and research AI systems that people can actually understand and trust. I love working across the full stack and finding ways to make complex technology accessible.
        </motion.p>
        <motion.div className="hero-cta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.52 }}>
          <a href="#contact" className="btn-primary">Get in Touch</a>
          <a href="https://github.com/Bhakti3001" target="_blank" rel="noreferrer" className="btn-outline">View GitHub</a>
        </motion.div>
      </div>
      <div className="hero-image-col">
        <div className="hero-bg-rect" />
        <motion.img src="/Images/Headshot/headshot.jpg" alt="Bhakti Patel" className="hero-photo" style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.28, ease: [0.22,1,0.36,1] }} />
        <motion.div className="stat-card stat-card-dark" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.82, duration: 0.65 }}>
          <span className="stat-num">3.92</span><span className="stat-label">GPA</span>
        </motion.div>
        <motion.div className="stat-card stat-card-rust" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.96, duration: 0.65 }}>
          <span className="stat-num">4+</span><span className="stat-label" style={{ color: 'rgba(245,240,232,0.7)' }}>Research Papers</span>
        </motion.div>
      </div>
      <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}>
        <span className="scroll-text">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ChevronDown size={13} color="#8c8078" /></motion.div>
      </motion.div>
    </section>
  );
}

/* ─── MARQUEE ─── */
function Marquee() {
  const items = ['Full-Stack Development','·','Machine Learning','·','XAI Research','·','Cloud Deployment','·','Bayesian Networks','·','Neural Networks','·','Agile & Scrum','·'];
  const doubled = [...items, ...items];
  return (
    <div className="marquee-wrap">
      <motion.div className="marquee-track" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 28, ease: 'linear' }}>
        {doubled.map((item, i) => <span key={i} className="marquee-item" style={{ color: item === '·' ? '#b85c38' : 'rgba(245,240,232,0.55)' }}>{item}</span>)}
      </motion.div>
    </div>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section id="about" className="about">
      <div>
        <FadeUp>
          <SectionLabel light>About Me</SectionLabel>
          <h2 className="section-heading" style={{ color: '#f5f0e8' }}>Building things<br /><em style={{ color: '#c9a84c' }}>that matter.</em></h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="about-body">I graduated with a double major in CS and Mathematics from <span style={{ color: '#c9a84c' }}>Francis Marion University</span> with a 3.92 GPA, and I am now working as a Software Developer at Specialty Print Communications.</p>
          <p className="about-body">Whether I was doing NIH-funded deep learning research at Clemson or building a hospital management system during my internship, I try to bring the same care and curiosity to every project.</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="contact-links">
            {[
              { icon: <Mail size={12}/>, label: 'pbhakti302@gmail.com', href: 'mailto:pbhakti302@gmail.com' },
              { icon: <Phone size={12}/>, label: '(843) 230-1051', href: 'tel:8432301051' },
              { icon: <MapPin size={12}/>, label: 'Itasca, IL 60143', href: null },
              { icon: <Linkedin size={12}/>, label: 'LinkedIn Profile', href: 'https://linkedin.com/in/bhakti-patel-454726153' },
              { icon: <Github size={12}/>, label: 'github.com/Bhakti3001', href: 'https://github.com/Bhakti3001' },
            ].map(({ icon, label, href }) => (
              <a key={label} href={href || '#'} target={href?.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="contact-link">
                <span style={{ opacity: 0.55 }}>{icon}</span>{label}
              </a>
            ))}
          </div>
        </FadeUp>
      </div>
      <div className="skills-col">
        {Object.entries(SKILLS).map(([cat, tags], i) => (
          <FadeUp key={cat} delay={i * 0.09}>
            <div className="skill-block">
              <div className="skill-cat">{cat}</div>
              <div className="skill-tags">{tags.map(t => <span key={t} className="skill-tag">{t}</span>)}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE — text only, zero images ─── */
function Experience() {
  return (
    <section id="experience" className="experience">
      <FadeUp>
        <SectionLabel>Work History</SectionLabel>
        <h2 className="section-heading">Where I've<br /><em>been.</em></h2>
      </FadeUp>
      <div className="timeline">
        <div className="timeline-line" />
        {EXPERIENCE.map((exp, i) => (
          <FadeUp key={i} delay={i * 0.07}>
            <div className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-date">{exp.date}</div>
              <div className="timeline-content">
                <h3 className="timeline-role">{exp.role}</h3>
                <div className="timeline-org">{exp.org}</div>
                <ul className="timeline-bullets">
                  {exp.bullets.map((b, j) => <li key={j}><span className="bullet-dash">—</span>{b}</li>)}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── RESEARCH — embedded PDF viewer, no photos ─── */
function Research() {
  const [active, setActive] = useState(null);
  return (
    <section id="research" className="research">
      <FadeUp>
        <SectionLabel>Publications & Posters</SectionLabel>
        <h2 className="section-heading">Research<br /><em>work.</em></h2>
      </FadeUp>
      <div className="research-grid">
        {RESEARCH.map((r, i) => (
          <FadeUp key={i} delay={i * 0.09}>
            <motion.div className="research-card" whileHover={{ y: -5 }} transition={{ duration: 0.3 }} onClick={() => setActive(i)}>
              <div className="research-card-body-wrap">
                <div className="card-num">{r.num}</div>
                <h3 className="card-title">{r.title}</h3>
                <div className="card-org">{r.org}</div>
                <p className="card-body">{r.body}</p>
                <div className="card-tags">{r.tags.map(t => <span key={t} className="card-tag">{t}</span>)}</div>
                <div className="card-pdf-hint"><FileText size={11} /> View Research Poster</div>
              </div>
              <ExternalLink size={13} color="#8c8078" style={{ position: 'absolute', top: '1.4rem', right: '1.4rem', opacity: 0.3 }} />
            </motion.div>
          </FadeUp>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="modal-box modal-box-large modal-box-pdf"
              initial={{ scale: 0.9, y: 28 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 28 }}
              transition={{ ease: [0.22,1,0.36,1], duration: 0.38 }}
              onClick={e => e.stopPropagation()}>
              <div className="modal-pdf-header">
                <div>
                  <div className="card-org" style={{ marginBottom: '0.2rem' }}>{RESEARCH[active].org}</div>
                  <h3 className="modal-title" style={{ marginBottom: 0 }}>{RESEARCH[active].title}</h3>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexShrink: 0 }}>
                  <a href={p(RESEARCH[active].pdf)} target="_blank" rel="noreferrer" className="pdf-btn">
                    <FileText size={14} /> Download
                  </a>
                  <button className="modal-close-inline" onClick={() => setActive(null)}><X size={17} /></button>
                </div>
              </div>
              <iframe src={p(RESEARCH[active].pdf)} title={RESEARCH[active].title} className="pdf-iframe" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── PROJECTS — project screenshots only ─── */
function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="projects">
      <FadeUp>
        <SectionLabel>Selected Work</SectionLabel>
        <h2 className="section-heading">Projects<br /><em>built.</em></h2>
      </FadeUp>
      <div className="projects-grid">
        {PROJECTS.map((proj, i) => (
          <FadeUp key={i} delay={i * 0.07}>
            <ProjectCard proj={proj} idx={i} onClick={() => setActive(i)} />
          </FadeUp>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="modal-box modal-box-large"
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 24 }}
              transition={{ ease: [0.22,1,0.36,1], duration: 0.38 }}
              onClick={e => e.stopPropagation()}
              style={{ padding: 0, maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setActive(null)}><X size={17} /></button>
              {PROJECTS[active].screenshots.length > 0
                ? <ImageCarousel images={PROJECTS[active].screenshots} height={300} contain />
                : <div style={{ height: 120, background: '#1a1612', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(245,240,232,0.3)', textTransform: 'uppercase' }}>No screenshots available</span>
                  </div>
              }
              <div className="modal-body-wrap" style={{ paddingTop: '1.5rem' }}>
                <h3 className="modal-title">{PROJECTS[active].name}</h3>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.58rem', letterSpacing: '0.1em', color: '#b85c38', marginBottom: '0.9rem' }}>{PROJECTS[active].date}</div>
                <p className="modal-body-text">{PROJECTS[active].body}</p>
                <div className="project-stack" style={{ marginBottom: PROJECTS[active].pdf ? '1.5rem' : 0 }}>
                  {PROJECTS[active].stack.map(t => <span key={t} className="project-tag" style={{ borderColor: 'rgba(26,22,18,0.14)', color: '#8c8078' }}>{t}</span>)}
                </div>
                {PROJECTS[active].pdf && (
                  <div className="modal-pdf-section">
                    <div className="modal-pdf-label">Research Poster</div>
                    <div className="modal-pdf-links">
                      <a href={p(PROJECTS[active].pdf)} target="_blank" rel="noreferrer" className="pdf-btn"><FileText size={14} /> View Poster</a>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ proj, idx, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="project-card" style={{ background: hov ? '#f0ebe0' : '#e8e2d8', cursor: 'pointer', border: hov ? '2px solid #b85c38' : '2px solid transparent', transition: 'all 0.25s' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick}>
      {proj.screenshots.length > 0 && (
        <div className="project-screenshot-wrap">
          <img src={p(proj.screenshots[0])} alt={proj.name} className="project-screenshot" style={{ objectFit: 'contain', background: '#fff' }} />
          <div className="project-screenshot-hint" style={{ opacity: hov ? 1 : 0, color: '#b85c38', background: 'rgba(245,240,232,0.92)' }}>
            {proj.screenshots.length > 1 ? `View ${proj.screenshots.length} screenshots` : 'View screenshot'}
          </div>
        </div>
      )}
      <div className="project-num" style={{ color: 'rgba(26,22,18,0.07)' }}>{String(idx + 1).padStart(2, '0')}</div>
      <h3 className="project-title" style={{ color: '#1a1612' }}>{proj.name}</h3>
      <div className="project-date" style={{ color: '#b85c38' }}>{proj.date}</div>
      <p className="project-body" style={{ color: '#8c8078' }}>{proj.body}</p>
      <div className="project-stack">
        {proj.stack.map(t => <span key={t} className="project-tag" style={{ borderColor: 'rgba(26,22,18,0.14)', color: '#8c8078' }}>{t}</span>)}
      </div>
    </div>
  );
}

/* ─── CONFERENCES — conference photos + award photo ─── */
function Conferences() {
  const [active, setActive] = useState(null);
  return (
    <section id="conferences" className="research" style={{ background: '#f5f0e8' }}>
      <FadeUp>
        <SectionLabel>Events Attended</SectionLabel>
        <h2 className="section-heading">Conferences<br /><em>attended.</em></h2>
      </FadeUp>
      <div className="research-grid">
        {CONFERENCES.map((c, i) => (
          <FadeUp key={i} delay={i * 0.07}>
            <motion.div className="research-card" style={{ background: '#ede8de' }} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} onClick={() => setActive(i)}>
              {c.images[0] && (
                <div className="research-card-img">
                  <img src={p(c.images[0])} alt={c.name} />
                </div>
              )}
              <div className="research-card-body-wrap">
                <h3 className="card-title">{c.name}</h3>
                <div className="card-org">{c.location} · {c.date}</div>
                <p className="card-body">{c.topic}</p>
                <div className="card-pdf-hint">
                  <Image size={11} /> {c.images.length} photo{c.images.length !== 1 ? 's' : ''}
                  {c.award && <span style={{ marginLeft: '0.75rem' }}>🏆 Award</span>}
                </div>
              </div>
              <ExternalLink size={13} color="#8c8078" style={{ position: 'absolute', top: '1.4rem', right: '1.4rem', opacity: 0.3 }} />
            </motion.div>
          </FadeUp>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActive(null)}>
            <motion.div className="modal-box modal-box-large"
              initial={{ scale: 0.9, y: 28 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 28 }}
              transition={{ ease: [0.22,1,0.36,1], duration: 0.38 }}
              onClick={e => e.stopPropagation()}
              style={{ padding: 0, maxHeight: '90vh', overflowY: 'auto' }}>
              <button className="modal-close" onClick={() => setActive(null)}><X size={17} /></button>
              <ImageCarousel images={CONFERENCES[active].images} height={280} />
              <div className="modal-body-wrap">
                <div className="card-org" style={{ marginBottom: '0.5rem' }}>{CONFERENCES[active].location} · {CONFERENCES[active].date}</div>
                <h3 className="modal-title">{CONFERENCES[active].name}</h3>
                <p className="modal-body-text" style={{ marginBottom: CONFERENCES[active].award ? '1.5rem' : 0 }}>{CONFERENCES[active].topic}</p>
                {CONFERENCES[active].award && (
                  <div className="conf-award-wrap">
                    <div className="modal-pdf-label">🏆 {CONFERENCES[active].awardLabel}</div>
                    <img src={p(CONFERENCES[active].award)} alt="Award" className="conf-award-img" />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── AWARDS ─── */
function Awards() {
  const [activeImg, setActiveImg] = useState(null);
  return (
    <section id="awards" className="education" style={{ background: '#f5f0e8' }}>
      <FadeUp>
        <SectionLabel>Certifications & Honors</SectionLabel>
        <h2 className="section-heading" style={{ color: '#1a1612', textAlign: 'center' }}>Awards &<br /><em>recognition.</em></h2>
      </FadeUp>
      <div className="awards-grid">
        {AWARDS.map((a, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <div className={`award-card${a.image ? ' award-card-clickable' : ''}`} onClick={() => a.image && setActiveImg(a.image)}>
              {a.image
                ? <div className="award-thumb-wrap"><img src={p(a.image)} alt={a.title} className="award-thumb" /></div>
                : <div className="award-icon">{a.type === 'certification' ? <Award size={20} color="#c9a84c" /> : a.type === 'award' ? '🏆' : '🏅'}</div>
              }
              <div className="award-content">
                <h4 className="award-title">{a.title}</h4>
                <div className="award-issuer">{a.issuer}</div>
                <div className="award-date">{a.date}{a.expires ? ` · Expires ${a.expires}` : ''}</div>
                {a.credentialId && <div className="award-cred">Credential ID: {a.credentialId}</div>}
                {a.image && <div className="award-view-hint">Click to view</div>}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.15} style={{ width: '100%', maxWidth: 680, margin: '4rem auto 0' }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#b85c38', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: 28, height: 1, background: '#b85c38' }} /> Education
        </div>
        <div className="edu-card" style={{ borderColor: 'rgba(26,22,18,0.1)' }}>
          <div className="edu-card-line" style={{ background: '#b85c38' }} />
          <h3 className="edu-degree" style={{ color: '#1a1612' }}>Bachelor of Science in<br />Computer Science &amp; Mathematics</h3>
          <div className="edu-school" style={{ color: '#b85c38' }}>Francis Marion University · Aug 2021 – Dec 2024</div>
          <div className="edu-stats">
            {[['3.92', 'GPA'], ['Dec 2024', 'Graduated'], ['Dual', 'Major']].map(([v, l]) => (
              <div key={l} className="edu-stat">
                <span className="edu-stat-val" style={{ color: '#1a1612' }}>{v}</span>
                <span className="edu-stat-label" style={{ color: 'rgba(26,22,18,0.4)' }}>{l}</span>
              </div>
            ))}
          </div>
          <p className="edu-honors" style={{ color: 'rgba(26,22,18,0.5)' }}>Certified member of Upsilon Pi Epsilon (CS Honor Society)<br />&amp; Kappa Mu Epsilon (Mathematics Honor Society)</p>
        </div>
      </FadeUp>

      <AnimatePresence>
        {activeImg && (
          <motion.div className="modal-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveImg(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} transition={{ ease: [0.22,1,0.36,1], duration: 0.35 }} onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: 600, width: '100%' }}>
              <button className="modal-close" onClick={() => setActiveImg(null)}><X size={17} /></button>
              <img src={p(activeImg)} alt="Award" style={{ width: '100%', display: 'block' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <section id="contact" className="contact">
      <FadeUp>
        <SectionLabel>Let's Connect</SectionLabel>
        <h2 className="contact-heading">Let's build<br />something<br /><em>great.</em></h2>
      </FadeUp>
      <FadeUp delay={0.14}>
        <div className="contact-items">
          {[
            { label: 'Email', val: 'pbhakti302@gmail.com', href: 'mailto:pbhakti302@gmail.com' },
            { label: 'Phone', val: '(843) 230-1051', href: 'tel:8432301051' },
            { label: 'Location', val: 'Itasca, IL 60143', href: null },
            { label: 'LinkedIn', val: 'bhakti-patel-454726153', href: 'https://linkedin.com/in/bhakti-patel-454726153' },
            { label: 'GitHub', val: 'Bhakti3001', href: 'https://github.com/Bhakti3001' },
          ].map(({ label, val, href }, i, arr) => (
            <div key={label} className="contact-item" style={{ borderBottom: i < arr.length - 1 ? '1px solid #e8e2d8' : 'none' }}>
              <span className="contact-label">{label}</span>
              {href
                ? <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" className="contact-val">{val}</a>
                : <span className="contact-val" style={{ cursor: 'default' }}>{val}</span>}
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="footer">
      <span className="footer-name">Bhakti Patel</span>
      <span className="footer-copy">© 2025 · Designed &amp; Built with ♥</span>
    </footer>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Experience />
      <Research />
      <Projects />
      <Conferences />
      <Awards />
      <Contact />
      <Footer />
    </div>
  );
}