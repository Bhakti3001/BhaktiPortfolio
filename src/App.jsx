import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GitBranch, Link, Mail, Phone, MapPin, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, X, Menu, FileText, Image as ImageIcon } from 'lucide-react';
import './App.css';
const Github = GitBranch;
const Linkedin = Link;
const base = import.meta.env.BASE_URL;
const enc = (path) => (base + path.replace(/^\//, '')).split('/').map(s => encodeURIComponent(s)).join('/');const SECTIONS   = ['about','experience','research','projects','conferences','awards','contact'];
const NAV_LABELS = ['About','Experience','Research','Projects','Conferences','Awards','Contact'];

const SKILLS = {
  'Languages':         ['Java','Python','C#','JavaScript','PowerShell','R','MATLAB'],
  'Web & UI':          ['React','.NET','ASP.NET','Blazor','HTML','CSS','Tailwind','Bootstrap'],
  'Databases & Cloud': ['SQL','MySQL','PostgreSQL','Azure','AWS','MS SQL Server'],
  'ML & AI':           ['TensorFlow','Keras','PyTorch','Scikit-Learn','Bayesian Networks','OpenCV','Pandas','NumPy'],
};

const EXPERIENCE = [
  { role:'Software Developer', org:'Specialty Print Communications', date:'Jun 2025 – Present',
    bullets:['Designed and developed a full-scale internal portal using PowerShell, .NET, C#, Razor, Python, JavaScript, SQL, and REST APIs.','Deployed and managed applications on IIS server.','Worked in an Agile environment with regular sprints, code reviews, and CI/CD practices.'] },
  { role:'Deep Learning Researcher & NIH R25 Scholar', org:'Clemson University', date:'Jun – Aug 2024',
    bullets:['Created Explainable AI techniques for CNNs that improved bacteria classification interpretability by over 80%.','Applied LIME, Grad-CAM, and Integrated Gradients on the TF-Flowers dataset with 3,670 images.'] },
  { role:'Machine Learning Researcher', org:'ACS Technologies', date:'Sep 2023 – Feb 2024',
    bullets:['Led AI research using Bayesian networks and Logistic Regression, providing predictive insights to stakeholders.','Handled imbalanced datasets using UnderSampling and OverSampling techniques.'] },
  { role:'Software Developer Intern', org:'McLeod Hospital', date:'Jun – Aug 2023',
    bullets:['Built a full-stack hospital management app called Morgue Tracker to handle patient admissions and releases.','Used C#, ASP.NET, and MS SQL Server for a secure backend.','Designed the UI with HTML, CSS, Bootstrap, and Razor views.'] },
  { role:'Machine Learning Researcher', org:'Cell Biology Education Consortium', date:'Jan – Jun 2023',
    bullets:['Modeled networks using NumPy, Pandas, and Scikit-learn and shared findings with stakeholders.','Compared Naive Bayes and Causal networks and reached about 90% accuracy with K-Fold validation.'] },
];

const RESEARCH = [
  { num:'01', color:'#b85c38',
    title:'Unveiling the Black Box: XAI for CNN Explainability',
    org:'NIH R25 Scholar · Clemson University',
    body:'Applied LIME, Grad-CAM, and Integrated Gradients to a 2D CNN trained on the TF-Flowers dataset. Reached 75.3% accuracy after 10 epochs and improved bacteria classification interpretability by over 80%.',
    tags:['Deep Learning','XAI','LIME','Grad-CAM','CNNs','Python'],
    pdf:'/Images/ResearchPosters/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson.pdf' },
  { num:'02', color:'#7a8c6e',
    title:'Predicting Customer Status via Bayesian Networks',
    org:'ACS Technologies · Francis Marion University',
    body:'Used Bayesian networks with K-Fold validation on an imbalanced dataset. Implemented UnderSampling (86.14% acc.) and OverSampling (87.05% acc.) to improve minority class predictions.',
    tags:['Bayesian Networks','Imbalanced Data','Pgmpy','Pandas','Scikit-learn'],
    pdf:'/Images/ResearchPosters/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS.pdf' },
  { num:'03', color:'#c9a84c',
    title:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    org:'Cell Biology Education Consortium',
    body:'Compared Naive Bayes and Causal Bayesian models on Wix analytics data with 3,369 entries. Both models reached about 90% accuracy predicting session durations with 10-fold validation.',
    tags:['Naive Bayes','Causal Networks','K-Fold','Web Analytics','Python'],
    pdf:'/Images/ResearchPosters/Comparing Naive Bayes and NonNaive Network_CBEC.pdf' },
  { num:'04', color:'#6b8fad',
    title:'Comparing Logistic Regression & Bayesian Networks',
    org:'Undergraduate Mathematics Conference 2024',
    body:"Presented at FMU's 2024 Undergraduate Mathematics Conference. Compared Logistic Regression and Bayesian Network models for customer status prediction — exploring flexibility, interpretability, and missing data handling.",
    tags:['Logistic Regression','Bayesian Networks','One-Hot Encoding','statsmodels'],
    pdf:'/Images/ResearchPosters/Comparing logistic regression and bayesian network for predictive modeling_FMU.pdf' },
];

const PROJECTS = [
  { name:'Sign-Me-In', date:'Jul 2023 – Apr 2024', assoc:'Francis Marion University', accent:'#b85c38',
    body:"Secure student sign-in app for FDTC's Math Hub. Replaced an Excel-based system with a clean interface and manager dashboard tracking student visits and operational hours.",
    stack:['C#','.NET 8','Blazor','Azure SQL','Entity Framework'],
    screenshots:['/Images/Projects/signmein_screen1.jpeg','/Images/Projects/signmein_screen2.jpeg','/Images/Projects/signmein_screen3.jpeg','/Images/Projects/signmein_screen4.jpeg','/Images/Projects/signmein_screen5.jpeg'],
    pdf:'/Images/ResearchPosters/SignMeIn_FDTC.pdf' },
  { name:'Morgue Tracker', date:'Jun – Aug 2023', assoc:'McLeod Hospital', accent:'#7a8c6e',
    body:'Full-stack hospital management system built during my internship at McLeod Hospital to track patient admissions and releases with a secure backend.',
    stack:['C#','ASP.NET','MS SQL Server','Bootstrap','Razor'],
    screenshots:['/Images/Projects/morguetracker_screen1.jpeg','/Images/Projects/morguetracker_screen2.jpeg','/Images/Projects/morguetracker_screen3.jpeg','/Images/Projects/morguetracker_screen4.jpeg'],
    pdf:null },
  { name:'Pizza Shop Accounting', date:'Aug 2022 – May 2023', assoc:'Francis Marion University', accent:'#c9a84c',
    body:'Desktop accounting system with full CRUD, reporting, and Agile delivery. Java Swing UI with a MySQL backend built following Agile and Scrum practices.',
    stack:['Java','JavaFX','MySQL','JUnit','Agile/Scrum'],
    screenshots:['/Images/Projects/pizzashop_screen1.jpeg','/Images/Projects/pizzashop_screen2.jpeg','/Images/Projects/pizzashop_screen3.jpeg','/Images/Projects/pizzashop_screen4.jpeg','/Images/Projects/pizzashop_screen5.jpeg','/Images/Projects/pizzashop_screen6.jpg'],
    pdf:null },
  { name:'Base Conversion', date:'Jan 2023 – May 2023', assoc:'Francis Marion University', accent:'#6b8fad',
    body:'A number base conversion tool converting between decimal, binary, and hexadecimal. Built to explore how digital systems represent numbers across different bases.',
    stack:['Python','Mathematics','Pandas'],
    screenshots:[], pdf:null },
];

const CBEC_LNE = [
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_1.jpg',
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_2.jpg',
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_3.jpg',
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Lincoln_NE_4.jpg',
];
const CBEC_TFL = [
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_1.jpg',
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_2.jpg',
  '/Images/Conference/Comparing Naive Bayes and NonNaive Network Mitigate Limitations in Collected Data_CBEC_Tampa_FL_3.jpg',
];

/* One card per location/event appearance */
const CONFERENCES = [
  { id:'nih-greenville', accent:'#b85c38',
    name:'NIH R25 Symposium', subtitle:'USC School of Medicine Greenville',
    location:'Greenville, SC', date:'Jul 2024',
    topic:'Unveiling the Black Box: XAI for CNN Explainability',
    images:['/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Greenville_SC_1.jpeg'],
    award:'/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg',
    awardLabel:'🏆 1st Place — Best Presentation Award · NIH R25' },
  { id:'epscor-columbia', accent:'#b85c38',
    name:'SC EPSCoR Annual Conference', subtitle:'Columbia Metropolitan Convention Center',
    location:'Columbia, SC', date:'Apr 2024',
    topic:'Unveiling the Black Box: XAI for CNN Explainability',
    images:['/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_1.jpeg','/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_2.jpeg'],
    award:'/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg',
    awardLabel:'🏆 1st Place — Undergraduate Poster Competition' },
  { id:'nsf-omaha', accent:'#b85c38',
    name:'NSF EPSCoR Conference', subtitle:'Nebraska',
    location:'Omaha, NE', date:'2024',
    topic:'Unveiling the Black Box: XAI for CNN Explainability',
    images:['/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Omaha_NE_1.jpeg'],
    award:null, awardLabel:null },
  { id:'acs-nashville', accent:'#7a8c6e',
    name:'ACS Research Conference', subtitle:'ACS Technologies',
    location:'Nashville, TN', date:'2023',
    topic:'Predicting Customer Status via Bayesian Networks',
    images:['/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_1.jpg','/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_2.jpg'],
    award:null, awardLabel:null },
  { id:'ncuwm', accent:'#c9a84c',
    name:'NCUWM', subtitle:'National Conference for Undergraduate Women in Mathematics',
    location:'Lincoln, NE', date:'2023',
    topic:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images:CBEC_LNE, award:null, awardLabel:null },
  { id:'math-tampa', accent:'#c9a84c',
    name:'Math Conference', subtitle:'Tampa',
    location:'Tampa, FL', date:'2023',
    topic:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images:CBEC_TFL, award:null, awardLabel:null },
  { id:'fmu-math', accent:'#6b8fad',
    name:'FMU Undergraduate Math Conference', subtitle:'Francis Marion University',
    location:'Florence, SC', date:'Apr 2024',
    topic:'Comparing Logistic Regression & Bayesian Networks',
    images:['/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_1.jpg','/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_2.jpg'],
    award:null, awardLabel:null },
];

const AWARDS = [
  { title:'Best Presentation Award — 1st Place', issuer:'NIH R25 · USC School of Medicine Greenville Symposium',
    date:'Jul 2024', type:'award',
    image:'/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg' },
  { title:'First Place Undergraduate Student Winner', issuer:'SC EPSCoR Poster Presentation Competition — Columbia, SC',
    date:'Apr 9, 2024', type:'award',
    image:'/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg' },
  { title:'FMU Math-Engineering and Computing (RCR)', issuer:'CITI Program', date:'May 2024', expires:'May 2029', credentialId:'62817679', type:'certification', image:null },
  { title:'Certified Member (CM)', issuer:'Kappa Mu Epsilon',                                  type:'honor', date:'Sep 2023', image:null },
  { title:'Certified Member (CM)', issuer:'Upsilon Pi Epsilon',                                 type:'honor', date:'Apr 2023', image:null },
  { title:'Certified Member (CM)', issuer:'National Society of Leadership and Success (NSLS)',  type:'honor', date:'Aug 2022', image:null },
  { title:'Certified Member (CM)', issuer:'Phi Theta Kappa Honor Society International',        type:'honor', date:'Apr 2021', image:null },
];

/* ─── HOOKS ─── */
function useInView(t = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: t });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [t]);
  return [ref, inView];
}

function useScrollSpy() {
  const [active, setActive] = useState('about');
  useEffect(() => {
    const fn = () => {
      let cur = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 130) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener('scroll', fn, { passive: true });
    fn();
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return active;
}

const FadeUp = ({ children, delay = 0, style }) => {
  const [ref, inView] = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.68, delay, ease: [0.22, 1, 0.36, 1] }} style={style}>
      {children}
    </motion.div>
  );
};

const Chip = ({ children, color }) => <span className="sec-label-text" style={{ color }}>{children}</span>;
const SectionLabel = ({ children, light }) => (
  <div className="sec-label"><div className="sec-label-bar" style={{ background: light ? '#c9a84c' : '#b85c38' }} /><Chip color={light ? '#c9a84c' : '#b85c38'}>{children}</Chip></div>
);

function Carousel({ images, height = 300 }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return (
    <div className="car-empty" style={{ height }}><ImageIcon size={28} strokeWidth={1} /><span>No photos</span></div>
  );
  const go = (d, e) => { e.stopPropagation(); setIdx(i => (i + d + images.length) % images.length); };
  return (
    <div className="car" style={{ height }}>
      <AnimatePresence mode="wait">
        <motion.img key={images[idx]} src={enc(images[idx])} alt="" className="car-img"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
      </AnimatePresence>
      {images.length > 1 && <>
        <button className="car-btn car-l" onClick={e => go(-1, e)}><ChevronLeft size={15} /></button>
        <button className="car-btn car-r" onClick={e => go(1, e)}><ChevronRight size={15} /></button>
        <div className="car-dots">{images.map((_, i) => <span key={i} className={`cdot${i === idx ? ' on' : ''}`} onClick={e => { e.stopPropagation(); setIdx(i); }} />)}</div>
        <div className="car-ct">{idx + 1}/{images.length}</div>
      </>}
    </div>
  );
}

/* ─── NAV ─── */
function Nav() {
  const [sc, setSc] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy();
  useEffect(() => { const fn = () => setSc(window.scrollY > 50); window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn); }, []);
  return (<>
    <motion.nav className={`nav${sc ? ' sc' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.22,1,0.36,1] }}>
      <a href="#hero" className="nav-logo">BP<span>.</span></a>
      <ul className="nav-list">{SECTIONS.map((id, i) => <li key={id}><a href={`#${id}`} className={`nav-a${active === id ? ' on' : ''}`}>{NAV_LABELS[i]}</a></li>)}</ul>
      <button className="burger" onClick={() => setOpen(true)}><Menu size={20} /></button>
    </motion.nav>
    <AnimatePresence>
      {open && <motion.div className="mob-menu" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}>
        <button className="mob-close" onClick={() => setOpen(false)}><X size={22} /></button>
        {SECTIONS.map((id, i) => <motion.a key={id} href={`#${id}`} className="mob-a" onClick={() => setOpen(false)} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.045 }}>{NAV_LABELS[i]}</motion.a>)}
      </motion.div>}
    </AnimatePresence>
  </>);
}

/* ─── HERO ─── */
function Hero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 500], [0, 55]);
  return (
    <section id="hero" className="hero">
      <div className="hero-blob a" /><div className="hero-blob b" />
      <div className="hero-text">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><SectionLabel>Developer · Researcher</SectionLabel></motion.div>
        <motion.h1 className="hero-h1" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1, ease: [0.22,1,0.36,1] }}>Bhakti<br /><em>Patel.</em></motion.h1>
        <motion.p className="hero-sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>Full-Stack Engineer &amp; Applied AI Researcher based in Itasca, IL.</motion.p>
        <motion.p className="hero-desc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.32 }}>I build software that solves real problems and research AI systems people can understand and trust.</motion.p>
        <motion.div className="hero-btns" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
          <a href="#contact" className="btn-fill">Get in Touch</a>
          <a href="https://github.com/Bhakti3001" target="_blank" rel="noreferrer" className="btn-ghost">View GitHub</a>
        </motion.div>
      </div>
      <div className="hero-img">
        <div className="hero-bg" />
        <motion.img src={enc('/Images/Headshot/headshot.jpg')} alt="Bhakti Patel" className="hero-photo" style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.22, ease: [0.22,1,0.36,1] }} />
        <motion.div className="h-stat dark" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.78 }}>
          <span className="hs-n">3.92</span><span className="hs-l">GPA</span>
        </motion.div>
        <motion.div className="h-stat rust" initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.92 }}>
          <span className="hs-n">4+</span><span className="hs-l lo">Research Papers</span>
        </motion.div>
      </div>
      <motion.div className="s-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <span>Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ChevronDown size={12} color="#8c8078" /></motion.div>
      </motion.div>
    </section>
  );
}

/* ─── MARQUEE ─── */
function Marquee() {
  const items = ['Full-Stack Development','·','Machine Learning','·','XAI Research','·','Cloud Deployment','·','Bayesian Networks','·','Neural Networks','·','Agile & Scrum','·'];
  const d = [...items,...items];
  return (
    <div className="mq"><motion.div className="mq-t" animate={{ x: ['0%','-50%'] }} transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}>
      {d.map((t, i) => <span key={i} style={{ color: t==='·'?'#b85c38':'rgba(245,240,232,0.55)' }}>{t}</span>)}
    </motion.div></div>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section id="about" className="about">
      <div>
        <FadeUp><SectionLabel light>About Me</SectionLabel><h2 className="sh light">Building things<br /><em>that matter.</em></h2></FadeUp>
        <FadeUp delay={0.1}>
          <p className="ab-p">I graduated with a double major in CS and Mathematics from <span className="gold">Francis Marion University</span> with a 3.92 GPA. I now work as a Software Developer at Specialty Print Communications while staying active in AI research.</p>
          <p className="ab-p">Whether I was doing NIH-funded deep learning research at Clemson or building hospital systems during my internship, I bring the same curiosity to everything I work on.</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="ab-links">
            {[{i:<Mail size={12}/>,l:'pbhakti302@gmail.com',h:'mailto:pbhakti302@gmail.com'},{i:<Phone size={12}/>,l:'(843) 230-1051',h:'tel:8432301051'},{i:<MapPin size={12}/>,l:'Itasca, IL 60143',h:null},{i:<Linkedin size={12}/>,l:'LinkedIn Profile',h:'https://linkedin.com/in/bhakti-patel-454726153'},{i:<Github size={12}/>,l:'github.com/Bhakti3001',h:'https://github.com/Bhakti3001'}].map(({i,l,h})=>(
              <a key={l} href={h||'#'} target={h?.startsWith('http')?'_blank':'_self'} rel="noreferrer" className="ab-a">{i}{l}</a>
            ))}
          </div>
        </FadeUp>
      </div>
      <div className="sk-grid">
        {Object.entries(SKILLS).map(([cat,tags],i)=>(
          <FadeUp key={cat} delay={i*0.08}>
            <div className="sk-blk"><p className="sk-cat">{cat}</p><div className="sk-tags">{tags.map(t=><span key={t}>{t}</span>)}</div></div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ─── */
function Experience() {
  return (
    <section id="experience" className="exp-s">
      <FadeUp><SectionLabel>Work History</SectionLabel><h2 className="sh">Where I've<br /><em>been.</em></h2></FadeUp>
      <div className="tl">
        <div className="tl-spine" />
        {EXPERIENCE.map((e, i) => (
          <FadeUp key={i} delay={i*0.06}>
            <div className="tl-row">
              <div className="tl-dot" />
              <div className="tl-when">{e.date}</div>
              <div className="tl-info">
                <h3 className="tl-role">{e.role}</h3>
                <p className="tl-org">{e.org}</p>
                <ul className="tl-buls">{e.bullets.map((b,j)=><li key={j}><span>—</span>{b}</li>)}</ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── RESEARCH — flip cards ─── */
function ResearchCard({ r, onOpen }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <FadeUp>
      <div className="flip-root" onMouseLeave={() => setFlipped(false)}>
        <motion.div className="flip-inner" animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.52, ease: [0.22,1,0.36,1] }}>
          <div className="flip-face front" style={{ '--ac': r.color }}>
            <div className="fc-num" style={{ color: r.color }}>{r.num}</div>
            <h3 className="fc-title">{r.title}</h3>
            <p className="fc-org">{r.org}</p>
            <div className="fc-tags">{r.tags.slice(0,4).map(t=><span key={t}>{t}</span>)}</div>
            <div className="fc-bar" style={{ background: r.color }} />
            <button className="fc-cta" onClick={() => setFlipped(true)} style={{ color: r.color }}>See details →</button>
          </div>
          <div className="flip-face back" style={{ '--ac': r.color }}>
            <div className="fc-bar-top" style={{ background: r.color }} />
            <p className="fc-back-body">{r.body}</p>
            <div className="fc-tags back-tags">{r.tags.map(t=><span key={t}>{t}</span>)}</div>
            <div className="fc-back-btns">
              <button className="btn-fill sm" style={{ background: r.color }} onClick={() => onOpen(r)}><FileText size={13}/> View Poster</button>
              <button className="fc-cta" style={{ color: r.color }} onClick={() => setFlipped(false)}>← Back</button>
            </div>
          </div>
        </motion.div>
      </div>
    </FadeUp>
  );
}

function Research() {
  const [active, setActive] = useState(null);
  return (
    <section id="research" className="research-s">
      <FadeUp><SectionLabel>Publications & Posters</SectionLabel><h2 className="sh">Research<br /><em>work.</em></h2>
        <p className="sec-hint">Hover a card to flip it and see details</p>
      </FadeUp>
      <div className="flip-grid">{RESEARCH.map(r => <ResearchCard key={r.num} r={r} onOpen={setActive} />)}</div>
      <AnimatePresence>
        {active && <motion.div className="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setActive(null)}>
          <motion.div className="modal pdf-modal" initial={{ scale:0.92,y:22 }} animate={{ scale:1,y:0 }} exit={{ scale:0.92,y:22 }} transition={{ ease:[0.22,1,0.36,1],duration:0.35 }} onClick={e=>e.stopPropagation()}>
            <div className="pdf-hdr" style={{ borderTop:`3px solid ${active.color}` }}>
              <div><p className="pdf-org">{active.org}</p><h3 className="pdf-title">{active.title}</h3></div>
              <div className="pdf-hdr-r">
                <a href={enc(active.pdf)} target="_blank" rel="noreferrer" className="btn-fill sm" style={{ background: active.color }}><FileText size={13}/> Download</a>
                <button className="x-btn" onClick={() => setActive(null)}><X size={16}/></button>
              </div>
            </div>
            <iframe src={enc(active.pdf)} title={active.title} className="pdf-frame" />
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ─── PROJECTS — image-first cards ─── */
function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="proj-s">
      <FadeUp><SectionLabel>Selected Work</SectionLabel><h2 className="sh">Projects<br /><em>built.</em></h2></FadeUp>
      <div className="proj-grid">
        {PROJECTS.map((proj, i) => (
          <FadeUp key={proj.name} delay={i*0.06}>
            <motion.div className="proj-card" whileHover={{ y:-5 }} transition={{ duration:0.25 }} onClick={() => setActive(i)} style={{ '--ac': proj.accent }}>
              <div className="pc-img">
                {proj.screenshots.length>0
                  ? <img src={enc(proj.screenshots[0])} alt={proj.name} className="pc-thumb" />
                  : <div className="pc-no-img"><ImageIcon size={26} strokeWidth={1}/><span>No preview</span></div>}
                <div className="pc-overlay"><span>View Project →</span></div>
                {proj.screenshots.length>1 && <div className="pc-badge">{proj.screenshots.length} screenshots</div>}
              </div>
              <div className="pc-body">
                <div className="pc-stripe" style={{ background: proj.accent }} />
                <h3 className="pc-name">{proj.name}</h3>
                <p className="pc-meta">{proj.assoc} · {proj.date}</p>
                <p className="pc-desc">{proj.body}</p>
                <div className="pc-tags">{proj.stack.map(t=><span key={t}>{t}</span>)}</div>
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active!==null && <motion.div className="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setActive(null)}>
          <motion.div className="modal" initial={{ scale:0.92,y:22 }} animate={{ scale:1,y:0 }} exit={{ scale:0.92,y:22 }} transition={{ ease:[0.22,1,0.36,1],duration:0.35 }} onClick={e=>e.stopPropagation()} style={{ padding:0,maxHeight:'90vh',overflowY:'auto' }}>
            <button className="x-btn abs" onClick={() => setActive(null)}><X size={16}/></button>
            <Carousel images={PROJECTS[active].screenshots} height={300} />
            <div className="modal-bdy" style={{ borderTop:`3px solid ${PROJECTS[active].accent}` }}>
              <h3 className="pm-name">{PROJECTS[active].name}</h3>
              <p className="pm-meta">{PROJECTS[active].assoc} · {PROJECTS[active].date}</p>
              <p className="pm-desc">{PROJECTS[active].body}</p>
              <div className="pc-tags" style={{ marginBottom: PROJECTS[active].pdf?'1.3rem':0 }}>{PROJECTS[active].stack.map(t=><span key={t}>{t}</span>)}</div>
              {PROJECTS[active].pdf && <div className="pm-pdf-row">
                <a href={enc(PROJECTS[active].pdf)} target="_blank" rel="noreferrer" className="btn-fill sm" style={{ background: PROJECTS[active].accent }}><FileText size={13}/> View Poster</a>
              </div>}
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONFERENCES — one card per event/location ─── */
function Conferences() {
  const [active, setActive] = useState(null);
  return (
    <section id="conferences" className="conf-s">
      <FadeUp><SectionLabel>Events Attended</SectionLabel><h2 className="sh">Conferences<br /><em>attended.</em></h2></FadeUp>
      <div className="conf-grid">
        {CONFERENCES.map((c, i) => (
          <FadeUp key={c.id} delay={i*0.05}>
            <motion.div className="conf-card" whileHover={{ y:-5 }} transition={{ duration:0.25 }} onClick={() => setActive(c)} style={{ '--ac': c.accent }}>
              <div className="cc-img">
                {c.images.length>0
                  ? <img src={enc(c.images[0])} alt={c.name} className="cc-thumb" />
                  : <div className="cc-no-img"><ImageIcon size={24} strokeWidth={1}/><span>No photos</span></div>}
                <div className="cc-loc-pill"><MapPin size={9}/>{c.location}</div>
                {c.award && <div className="cc-trophy">🏆</div>}
                {c.images.length>1 && <div className="cc-count">{c.images.length} photos</div>}
              </div>
              <div className="cc-body">
                <div className="cc-stripe" style={{ background: c.accent }} />
                <div className="cc-date">{c.date}</div>
                <h3 className="cc-name">{c.name}</h3>
                <p className="cc-sub">{c.subtitle}</p>
                <p className="cc-topic">{c.topic}</p>
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active && <motion.div className="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setActive(null)}>
          <motion.div className="modal" initial={{ scale:0.92,y:22 }} animate={{ scale:1,y:0 }} exit={{ scale:0.92,y:22 }} transition={{ ease:[0.22,1,0.36,1],duration:0.35 }} onClick={e=>e.stopPropagation()} style={{ padding:0,maxHeight:'90vh',overflowY:'auto' }}>
            <button className="x-btn abs" onClick={() => setActive(null)}><X size={16}/></button>
            <Carousel images={active.images} height={300} />
            <div className="modal-bdy" style={{ borderTop:`3px solid ${active.accent}` }}>
              <p className="cm-loc"><MapPin size={11}/>{active.location} · {active.date}</p>
              <h3 className="cm-name">{active.name}</h3>
              <p className="cm-sub">{active.subtitle}</p>
              <p className="cm-topic">{active.topic}</p>
              {active.award && <div className="cm-award">
                <p className="cm-award-lbl">{active.awardLabel}</p>
                <img src={enc(active.award)} alt="Award" className="cm-award-img" />
              </div>}
            </div>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ─── AWARDS ─── */
function Awards() {
  const [lb, setLb] = useState(null);
  const emoji = t => t==='award'?'🏆':t==='certification'?'📜':'🏅';
  return (
    <section id="awards" className="awards-s">
      <FadeUp><SectionLabel>Certifications & Honors</SectionLabel><h2 className="sh" style={{ textAlign:'center' }}>Awards &<br /><em>recognition.</em></h2></FadeUp>
      <div className="aw-grid">
        {AWARDS.map((a,i)=>(
          <FadeUp key={i} delay={i*0.06}>
            <motion.div className={`aw-card${a.image?' has-img':''}`} whileHover={{ y:-4 }} transition={{ duration:0.22 }} onClick={() => a.image&&setLb(a.image)}>
              <div className="aw-icon">{a.image?<img src={enc(a.image)} alt={a.title} className="aw-thumb"/>:<span className="aw-em">{emoji(a.type)}</span>}</div>
              <div className="aw-info">
                <h4 className="aw-title">{a.title}</h4>
                <p className="aw-issuer">{a.issuer}</p>
                <p className="aw-date">{a.date}{a.expires?` · Expires ${a.expires}`:''}</p>
                {a.credentialId&&<p className="aw-cred">ID: {a.credentialId}</p>}
                {a.image&&<p className="aw-hint">Click to enlarge</p>}
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <FadeUp delay={0.1} style={{ width:'100%',maxWidth:660,margin:'4rem auto 0' }}>
        <SectionLabel>Education</SectionLabel>
        <div className="edu-card">
          <div className="edu-stripe" />
          <h3 className="edu-deg">Bachelor of Science in<br />Computer Science &amp; Mathematics</h3>
          <p className="edu-sch">Francis Marion University · Aug 2021 – Dec 2024</p>
          <div className="edu-stats">
            {[['3.92','GPA'],['Dec 2024','Graduated'],['Dual','Major']].map(([v,l])=>(
              <div key={l} className="edu-stat"><span className="es-v">{v}</span><span className="es-l">{l}</span></div>
            ))}
          </div>
          <p className="edu-hon">Certified member of Upsilon Pi Epsilon (CS Honor Society) &amp; Kappa Mu Epsilon (Mathematics Honor Society)</p>
        </div>
      </FadeUp>
      <AnimatePresence>
        {lb&&<motion.div className="overlay" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={()=>setLb(null)}>
          <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }} exit={{ scale:0.9 }} transition={{ ease:[0.22,1,0.36,1],duration:0.3 }} onClick={e=>e.stopPropagation()} style={{ position:'relative',maxWidth:520,width:'100%' }}>
            <button className="x-btn abs" onClick={()=>setLb(null)}><X size={16}/></button>
            <img src={enc(lb)} alt="Award" style={{ width:'100%',display:'block' }}/>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <section id="contact" className="contact-s">
      <FadeUp><SectionLabel>Let's Connect</SectionLabel><h2 className="contact-h">Let's build<br />something<br /><em>great.</em></h2></FadeUp>
      <FadeUp delay={0.12}>
        <div className="ct-items">
          {[{l:'Email',v:'pbhakti302@gmail.com',h:'mailto:pbhakti302@gmail.com'},{l:'Phone',v:'(843) 230-1051',h:'tel:8432301051'},{l:'Location',v:'Itasca, IL 60143',h:null},{l:'LinkedIn',v:'bhakti-patel-454726153',h:'https://linkedin.com/in/bhakti-patel-454726153'},{l:'GitHub',v:'Bhakti3001',h:'https://github.com/Bhakti3001'}].map(({l,v,h},i,arr)=>(
            <div key={l} className="ct-row" style={{ borderBottom:i<arr.length-1?'1px solid rgba(245,240,232,0.08)':'none' }}>
              <span className="ct-lbl">{l}</span>
              {h?<a href={h} target={h.startsWith('http')?'_blank':'_self'} rel="noreferrer" className="ct-val">{v}</a>:<span className="ct-val">{v}</span>}
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><span className="ft-n">Bhakti Patel</span><span className="ft-c">© 2025 · Designed &amp; Built with ♥</span></footer>;
}

export default function App() {
  return <div><Nav/><Hero/><Marquee/><About/><Experience/><Research/><Projects/><Conferences/><Awards/><Contact/><Footer/></div>;
}