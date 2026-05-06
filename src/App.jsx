import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GitBranch, Link, Mail, Phone, MapPin, ExternalLink, ChevronDown, ChevronLeft, ChevronRight, X, Menu, FileText, Image as ImageIcon } from 'lucide-react';
import './App.css';
const Github = GitBranch;
const Linkedin = Link;

const enc = (path) => path.split('/').map(seg => encodeURIComponent(seg)).join('/');

const SECTIONS   = ['about','experience','research','projects','conferences','awards','contact'];
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
  { num:'01', title:'Unveiling the Black Box: XAI for CNN Explainability', org:'NIH R25 Scholar · Clemson University',
    body:'Applied LIME, Grad-CAM, and Integrated Gradients to a 2D CNN trained on the TF-Flowers dataset. Reached 75.3% accuracy after 10 epochs and improved bacteria classification interpretability by more than 80%.',
    tags:['Deep Learning','XAI','LIME','Grad-CAM','CNNs','Python'],
    pdf:'/Images/ResearchPosters/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson.pdf' },
  { num:'02', title:'Predicting Customer Status via Bayesian Networks', org:'ACS Technologies · Francis Marion University',
    body:'Used Bayesian networks with K-Fold validation on an imbalanced dataset. Implemented UnderSampling (86.14% accuracy) and OverSampling (87.05% accuracy) to improve predictions for the minority class.',
    tags:['Bayesian Networks','Imbalanced Data','Pgmpy','Pandas','Scikit-learn'],
    pdf:'/Images/ResearchPosters/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS.pdf' },
  { num:'03', title:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks', org:'Cell Biology Education Consortium',
    body:'Compared Naive Bayes and Causal Bayesian models on Wix analytics data with 3,369 entries. Both models reached about 90% accuracy predicting session durations with 10-fold validation.',
    tags:['Naive Bayes','Causal Networks','K-Fold','Web Analytics','Python'],
    pdf:'/Images/ResearchPosters/Comparing Naive Bayes and NonNaive Network_CBEC.pdf' },
  { num:'04', title:'Comparing Logistic Regression & Bayesian Networks', org:'Undergraduate Mathematics Conference 2024',
    body:"Presented at FMU's 2024 Undergraduate Mathematics Conference. Compared Logistic Regression and Bayesian Network models for customer status prediction and explored flexibility, interpretability, and missing data handling.",
    tags:['Logistic Regression','Bayesian Networks','One-Hot Encoding','statsmodels'],
    pdf:'/Images/ResearchPosters/Comparing logistic regression and bayesian network for predictive modeling_FMU.pdf' },
];

const PROJECTS = [
  { name:'Sign-Me-In', date:'Jul 2023 – Apr 2024', assoc:'Francis Marion University',
    body:"Secure student sign-in app for FDTC's Math Hub. Replaced an Excel-based system with a clean interface and manager dashboard tracking student visits and operational hours.",
    stack:['C#','.NET 8','Blazor','Azure SQL','Entity Framework'],
    screenshots:['/Images/Projects/signmein_screen1.jpeg','/Images/Projects/signmein_screen2.jpeg','/Images/Projects/signmein_screen3.jpeg','/Images/Projects/signmein_screen4.jpeg','/Images/Projects/signmein_screen5.jpeg'],
    pdf:'/Images/ResearchPosters/SignMeIn_FDTC.pdf' },
  { name:'Morgue Tracker', date:'Jun – Aug 2023', assoc:'McLeod Hospital',
    body:'Full-stack hospital management system built during my internship at McLeod Hospital to track patient admissions and releases with a secure backend.',
    stack:['C#','ASP.NET','MS SQL Server','Bootstrap','Razor'],
    screenshots:['/Images/Projects/morguetracker_screen1.jpeg','/Images/Projects/morguetracker_screen2.jpeg','/Images/Projects/morguetracker_screen3.jpeg','/Images/Projects/morguetracker_screen4.jpeg'],
    pdf:null },
  { name:'Pizza Shop Accounting', date:'Aug 2022 – May 2023', assoc:'Francis Marion University',
    body:'Desktop accounting system with full CRUD, reporting, and Agile delivery. Java Swing UI with a MySQL backend, built following Agile and Scrum practices.',
    stack:['Java','JavaFX','MySQL','JUnit','Agile/Scrum'],
    screenshots:['/Images/Projects/pizzashop_screen1.jpeg','/Images/Projects/pizzashop_screen2.jpeg','/Images/Projects/pizzashop_screen3.jpeg','/Images/Projects/pizzashop_screen4.jpeg','/Images/Projects/pizzashop_screen5.jpeg','/Images/Projects/pizzashop_screen6.jpg'],
    pdf:null },
  { name:'Base Conversion', date:'Jan 2023 – May 2023', assoc:'Francis Marion University',
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

const CONFERENCES = [
  { name:'NIH R25 Research Symposium', location:'Greenville & Columbia, SC · Omaha, NE', date:'Summer 2024',
    topic:'Unveiling the Black Box: XAI for CNN Explainability',
    images:['/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Greenville_SC_1.jpeg','/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_1.jpeg','/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Columbia_SC_2.jpeg','/Images/Conference/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_Omaha_NE_1.jpeg'],
    award:'/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg',
    awardLabel:'🏆 1st Place — Best Presentation Award · NIH R25 Symposium, Jul 2024' },
  { name:'ACS / SC EPSCoR Conference', location:'Nashville, TN & Columbia, SC', date:'2023–2024',
    topic:'Predicting Customer Status via Bayesian Networks',
    images:['/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_1.jpg','/Images/Conference/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_Nashville_TN_2.jpg'],
    award:'/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg',
    awardLabel:'🏆 1st Place — SC EPSCoR Poster Presentation Competition · Columbia, SC' },
  { name:'NCUWM — National Conference for Undergraduate Women in Mathematics', location:'Lincoln, NE', date:'2023',
    topic:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images:CBEC_LNE, award:null, awardLabel:null },
  { name:'Math Conference — Tampa', location:'Tampa, FL', date:'2023',
    topic:'AI Consulting for CBEC: Naive Bayes vs. Causal Networks',
    images:CBEC_TFL, award:null, awardLabel:null },
  { name:'FMU Undergraduate Math Conference', location:'Florence, SC', date:'April 2024',
    topic:'Comparing Logistic Regression & Bayesian Networks',
    images:['/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_1.jpg','/Images/Conference/Comparing logistic regression and bayesian network for predictive modeling_FMU_Florence_SC_2.jpg'],
    award:null, awardLabel:null },
];

const AWARDS = [
  { title:'Best Presentation Award — 1st Place', issuer:'NIH R25 · USC School of Medicine Greenville Symposium', date:'Jul 2024', type:'award',
    image:'/Images/Awards/Unveiling the Black Box Evaluating Explainable Artificial Intelligence Techniques for Convolutional Neural Network Explainability_NIHClemson_1stplace.jpeg' },
  { title:'First Place Undergraduate Student Winner', issuer:'SC EPSCoR Poster Presentation Competition — Columbia, SC', date:'Apr 9, 2024', type:'award',
    image:'/Images/Awards/Predicting Customer Status through Bayesian Networks with Imbalanced Data Handling_ACS_1stplace.jpeg' },
  { title:'FMU Math-Engineering and Computing (RCR)', issuer:'CITI Program', date:'May 2024', expires:'May 2029', credentialId:'62817679', type:'certification', image:null },
  { title:'Certified Member (CM)', issuer:'Kappa Mu Epsilon',                                 type:'honor', date:'Sep 2023', image:null },
  { title:'Certified Member (CM)', issuer:'Upsilon Pi Epsilon',                                type:'honor', date:'Apr 2023', image:null },
  { title:'Certified Member (CM)', issuer:'National Society of Leadership and Success (NSLS)', type:'honor', date:'Aug 2022', image:null },
  { title:'Certified Member (CM)', issuer:'Phi Theta Kappa Honor Society International',       type:'honor', date:'Apr 2021', image:null },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.1) {
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

/* ─── SHARED ─── */
const FadeUp = ({ children, delay = 0, style }) => {
  const [ref, inView] = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:28 }} animate={inView?{opacity:1,y:0}:{}}
      transition={{ duration:0.65, delay, ease:[0.22,1,0.36,1] }} style={style}>
      {children}
    </motion.div>
  );
};

const SectionLabel = ({ children, light }) => (
  <div className="section-label">
    <div className="section-label-bar" style={{ background: light?'#c9a84c':'#b85c38' }} />
    <span style={{ color: light?'#c9a84c':'#b85c38' }}>{children}</span>
  </div>
);

function Carousel({ images, height = 260 }) {
  const [idx, setIdx] = useState(0);
  if (!images || images.length === 0) return (
    <div className="carousel-empty" style={{ height }}>
      <ImageIcon size={32} strokeWidth={1} color="#b85c38" />
      <span>No photos available</span>
    </div>
  );
  const go = (dir, e) => { e.stopPropagation(); setIdx(i => (i + dir + images.length) % images.length); };
  return (
    <div className="carousel" style={{ height }}>
      <AnimatePresence mode="wait">
        <motion.img key={images[idx]} src={enc(images[idx])} alt="" className="carousel-img"
          initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.25 }} />
      </AnimatePresence>
      {images.length > 1 && <>
        <button className="car-btn left" onClick={e => go(-1,e)}><ChevronLeft size={16}/></button>
        <button className="car-btn right" onClick={e => go(1,e)}><ChevronRight size={16}/></button>
        <div className="car-dots">
          {images.map((_,i) => <span key={i} className={`cdot${i===idx?' on':''}`} onClick={e=>{e.stopPropagation();setIdx(i);}} />)}
        </div>
        <div className="car-counter">{idx+1} / {images.length}</div>
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
    <motion.nav className={`nav${sc?' scrolled':''}`} initial={{ y:-80 }} animate={{ y:0 }} transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
      <a href="#hero" className="nav-logo">BP<span>.</span></a>
      <ul className="nav-links">
        {SECTIONS.map((id,i) => <li key={id}><a href={`#${id}`} className={`nav-link${active===id?' on':''}`}>{NAV_LABELS[i]}</a></li>)}
      </ul>
      <button className="hamburger" onClick={()=>setOpen(true)}><Menu size={20}/></button>
    </motion.nav>
    <AnimatePresence>
      {open && <motion.div className="mobile-menu" initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:0.35,ease:[0.22,1,0.36,1]}}>
        <button className="mobile-close" onClick={()=>setOpen(false)}><X size={22}/></button>
        {SECTIONS.map((id,i) => <motion.a key={id} href={`#${id}`} className="mobile-link" onClick={()=>setOpen(false)} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}>{NAV_LABELS[i]}</motion.a>)}
      </motion.div>}
    </AnimatePresence>
  </>);
}

/* ─── HERO ─── */
function Hero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0,500], [0,60]);
  return (
    <section id="hero" className="hero">
      <div className="hero-deco a"/><div className="hero-deco b"/>
      <div className="hero-text">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.55}}>
          <SectionLabel>Developer · Researcher</SectionLabel>
        </motion.div>
        <motion.h1 className="hero-name" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:0.75,delay:0.1,ease:[0.22,1,0.36,1]}}>
          Bhakti<br /><em>Patel.</em>
        </motion.h1>
        <motion.p className="hero-sub" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.65,delay:0.2}}>
          Full-Stack Engineer &amp; Applied AI Researcher<br />based in Itasca, IL.
        </motion.p>
        <motion.p className="hero-desc" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.65,delay:0.35}}>
          I build software that solves real problems and research AI systems people can understand and trust. I love working across the full stack and making complex technology accessible.
        </motion.p>
        <motion.div className="hero-cta" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.55,delay:0.5}}>
          <a href="#contact" className="btn-primary">Get in Touch</a>
          <a href="https://github.com/Bhakti3001" target="_blank" rel="noreferrer" className="btn-outline">View GitHub</a>
        </motion.div>
      </div>
      <div className="hero-img-col">
        <div className="hero-img-bg"/>
        <motion.img src="/Images/Headshot/headshot.jpg" alt="Bhakti Patel" className="hero-photo" style={{y:imgY}}
          initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{duration:0.9,delay:0.25,ease:[0.22,1,0.36,1]}}/>
        <motion.div className="stat-card dark" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.8}}>
          <span className="stat-num">3.92</span><span className="stat-lbl">GPA</span>
        </motion.div>
        <motion.div className="stat-card rust" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.95}}>
          <span className="stat-num">4+</span><span className="stat-lbl light">Research Papers</span>
        </motion.div>
      </div>
      <motion.div className="scroll-hint" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}>
        <span>Scroll</span>
        <motion.div animate={{y:[0,6,0]}} transition={{repeat:Infinity,duration:1.6}}><ChevronDown size={13} color="#8c8078"/></motion.div>
      </motion.div>
    </section>
  );
}

/* ─── MARQUEE ─── */
function Marquee() {
  const items = ['Full-Stack Development','·','Machine Learning','·','XAI Research','·','Cloud Deployment','·','Bayesian Networks','·','Neural Networks','·','Agile & Scrum','·'];
  const d = [...items,...items];
  return (
    <div className="marquee-wrap">
      <motion.div className="marquee-track" animate={{x:['0%','-50%']}} transition={{repeat:Infinity,duration:28,ease:'linear'}}>
        {d.map((t,i) => <span key={i} style={{color:t==='·'?'#b85c38':'rgba(245,240,232,0.55)'}}>{t}</span>)}
      </motion.div>
    </div>
  );
}

/* ─── ABOUT ─── */
function About() {
  return (
    <section id="about" className="about">
      <div>
        <FadeUp><SectionLabel light>About Me</SectionLabel>
          <h2 className="section-heading light">Building things<br /><em>that matter.</em></h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="about-body">I graduated with a double major in CS and Mathematics from <span className="gold">Francis Marion University</span> with a 3.92 GPA, now working as a Software Developer at Specialty Print Communications.</p>
          <p className="about-body">Whether doing NIH-funded deep learning research at Clemson or building hospital systems during my internship, I bring the same care and curiosity to every project.</p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="contact-links">
            {[{icon:<Mail size={12}/>,label:'pbhakti302@gmail.com',href:'mailto:pbhakti302@gmail.com'},{icon:<Phone size={12}/>,label:'(843) 230-1051',href:'tel:8432301051'},{icon:<MapPin size={12}/>,label:'Itasca, IL 60143',href:null},{icon:<Linkedin size={12}/>,label:'LinkedIn Profile',href:'https://linkedin.com/in/bhakti-patel-454726153'},{icon:<Github size={12}/>,label:'github.com/Bhakti3001',href:'https://github.com/Bhakti3001'}].map(({icon,label,href})=>(
              <a key={label} href={href||'#'} target={href?.startsWith('http')?'_blank':'_self'} rel="noreferrer" className="contact-link">
                <span>{icon}</span>{label}
              </a>
            ))}
          </div>
        </FadeUp>
      </div>
      <div className="skills-col">
        {Object.entries(SKILLS).map(([cat,tags],i)=>(
          <FadeUp key={cat} delay={i*0.08}>
            <div className="skill-block">
              <p className="skill-cat">{cat}</p>
              <div className="skill-tags">{tags.map(t=><span key={t} className="skill-tag">{t}</span>)}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ─── */
function Experience() {
  return (
    <section id="experience" className="experience">
      <FadeUp><SectionLabel>Work History</SectionLabel>
        <h2 className="section-heading">Where I've<br /><em>been.</em></h2>
      </FadeUp>
      <div className="timeline">
        <div className="tl-line"/>
        {EXPERIENCE.map((e,i)=>(
          <FadeUp key={i} delay={i*0.06}>
            <div className="tl-item">
              <div className="tl-dot"/>
              <div className="tl-date">{e.date}</div>
              <div className="tl-body">
                <h3 className="tl-role">{e.role}</h3>
                <div className="tl-org">{e.org}</div>
                <ul className="tl-bullets">
                  {e.bullets.map((b,j)=><li key={j}><span className="dash">—</span>{b}</li>)}
                </ul>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ─── RESEARCH ─── */
function Research() {
  const [active, setActive] = useState(null);
  return (
    <section id="research" className="research">
      <FadeUp><SectionLabel>Publications & Posters</SectionLabel>
        <h2 className="section-heading">Research<br /><em>work.</em></h2>
      </FadeUp>
      <div className="card-grid four">
        {RESEARCH.map((r,i)=>(
          <FadeUp key={i} delay={i*0.08}>
            <motion.div className="card" whileHover={{y:-4}} transition={{duration:0.25}} onClick={()=>setActive(i)}>
              <div className="card-top"><span className="card-num">{r.num}</span><ExternalLink size={14} className="card-ext"/></div>
              <h3 className="card-title">{r.title}</h3>
              <p className="card-org">{r.org}</p>
              <p className="card-body">{r.body}</p>
              <div className="tag-row">{r.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
              <div className="card-hint"><FileText size={12}/> View Research Poster</div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active!==null && (
          <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}>
            <motion.div className="modal pdf-modal" initial={{scale:0.92,y:24}} animate={{scale:1,y:0}} exit={{scale:0.92,y:24}} transition={{ease:[0.22,1,0.36,1],duration:0.35}} onClick={e=>e.stopPropagation()}>
              <div className="modal-header">
                <div><p className="modal-org">{RESEARCH[active].org}</p><h3 className="modal-title">{RESEARCH[active].title}</h3></div>
                <div className="modal-actions">
                  <a href={enc(RESEARCH[active].pdf)} target="_blank" rel="noreferrer" className="btn-sm"><FileText size={13}/> Download</a>
                  <button className="close-btn" onClick={()=>setActive(null)}><X size={16}/></button>
                </div>
              </div>
              <iframe src={enc(RESEARCH[active].pdf)} title={RESEARCH[active].title} className="pdf-frame"/>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── PROJECTS ─── */
function Projects() {
  const [active, setActive] = useState(null);
  return (
    <section id="projects" className="projects">
      <FadeUp><SectionLabel>Selected Work</SectionLabel>
        <h2 className="section-heading">Projects<br /><em>built.</em></h2>
      </FadeUp>
      <div className="card-grid four">
        {PROJECTS.map((proj,i)=>(
          <FadeUp key={i} delay={i*0.07}>
            <motion.div className="card proj-card" whileHover={{y:-4}} transition={{duration:0.25}} onClick={()=>setActive(i)}>
              <div className="card-img">
                {proj.screenshots.length>0
                  ? <><img src={enc(proj.screenshots[0])} alt={proj.name} className="card-img-inner"/>
                      {proj.screenshots.length>1 && <div className="img-badge">{proj.screenshots.length} screenshots</div>}</>
                  : <div className="card-img-empty"><ImageIcon size={26} strokeWidth={1}/><span>No preview</span></div>}
              </div>
              <div className="card-content">
                <div className="card-top"><span className="card-num">{String(i+1).padStart(2,'0')}</span><ExternalLink size={14} className="card-ext"/></div>
                <h3 className="card-title">{proj.name}</h3>
                <p className="card-org">{proj.assoc} · {proj.date}</p>
                <p className="card-body">{proj.body}</p>
                <div className="tag-row">{proj.stack.map(t=><span key={t} className="tag">{t}</span>)}</div>
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active!==null && (
          <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}>
            <motion.div className="modal" initial={{scale:0.92,y:24}} animate={{scale:1,y:0}} exit={{scale:0.92,y:24}} transition={{ease:[0.22,1,0.36,1],duration:0.35}} onClick={e=>e.stopPropagation()} style={{padding:0,maxHeight:'90vh',overflowY:'auto'}}>
              <button className="close-btn abs" onClick={()=>setActive(null)}><X size={16}/></button>
              <Carousel images={PROJECTS[active].screenshots} height={300}/>
              <div className="modal-body">
                <h3 className="modal-title">{PROJECTS[active].name}</h3>
                <p className="modal-org">{PROJECTS[active].assoc} · {PROJECTS[active].date}</p>
                <p className="modal-text">{PROJECTS[active].body}</p>
                <div className="tag-row" style={{marginBottom:PROJECTS[active].pdf?'1.4rem':0}}>
                  {PROJECTS[active].stack.map(t=><span key={t} className="tag">{t}</span>)}
                </div>
                {PROJECTS[active].pdf && <div className="modal-pdf-row">
                  <p className="modal-pdf-lbl">Research Poster</p>
                  <a href={enc(PROJECTS[active].pdf)} target="_blank" rel="noreferrer" className="btn-sm"><FileText size={13}/> View Poster</a>
                </div>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONFERENCES ─── */
function Conferences() {
  const [active, setActive] = useState(null);
  return (
    <section id="conferences" className="conferences">
      <FadeUp><SectionLabel>Events Attended</SectionLabel>
        <h2 className="section-heading">Conferences<br /><em>attended.</em></h2>
      </FadeUp>
      <div className="card-grid">
        {CONFERENCES.map((c,i)=>(
          <FadeUp key={i} delay={i*0.07}>
            <motion.div className="card conf-card" whileHover={{y:-4}} transition={{duration:0.25}} onClick={()=>setActive(i)}>
              <div className="card-img">
                {c.images.length>0
                  ? <><img src={enc(c.images[0])} alt={c.name} className="card-img-inner"/>
                      {c.award && <div className="award-badge">🏆</div>}
                      {c.images.length>1 && <div className="img-badge">{c.images.length} photos</div>}</>
                  : <div className="card-img-empty"><ImageIcon size={26} strokeWidth={1}/><span>No photos</span></div>}
              </div>
              <div className="card-content">
                <p className="card-meta"><MapPin size={11}/> {c.location} · {c.date}</p>
                <h3 className="card-title">{c.name}</h3>
                <p className="card-body">{c.topic}</p>
                <div className="card-hint">
                  <ImageIcon size={11}/> {c.images.length>0?`${c.images.length} photo${c.images.length>1?'s':''}` : 'No photos'}
                  {c.award && <span className="award-chip">🏆 Award</span>}
                </div>
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
      <AnimatePresence>
        {active!==null && (
          <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setActive(null)}>
            <motion.div className="modal" initial={{scale:0.92,y:24}} animate={{scale:1,y:0}} exit={{scale:0.92,y:24}} transition={{ease:[0.22,1,0.36,1],duration:0.35}} onClick={e=>e.stopPropagation()} style={{padding:0,maxHeight:'90vh',overflowY:'auto'}}>
              <button className="close-btn abs" onClick={()=>setActive(null)}><X size={16}/></button>
              <Carousel images={CONFERENCES[active].images} height={300}/>
              <div className="modal-body">
                <p className="modal-org">{CONFERENCES[active].location} · {CONFERENCES[active].date}</p>
                <h3 className="modal-title">{CONFERENCES[active].name}</h3>
                <p className="modal-text">{CONFERENCES[active].topic}</p>
                {CONFERENCES[active].award && <div className="award-in-modal">
                  <p className="modal-pdf-lbl">{CONFERENCES[active].awardLabel}</p>
                  <img src={enc(CONFERENCES[active].award)} alt="Award" className="award-photo"/>
                </div>}
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
  const [lb, setLb] = useState(null);
  return (
    <section id="awards" className="awards-section">
      <FadeUp><SectionLabel>Certifications & Honors</SectionLabel>
        <h2 className="section-heading" style={{textAlign:'center'}}>Awards &<br /><em>recognition.</em></h2>
      </FadeUp>
      <div className="award-grid">
        {AWARDS.map((a,i)=>(
          <FadeUp key={i} delay={i*0.07}>
            <div className={`award-card${a.image?' clickable':''}`} onClick={()=>a.image&&setLb(a.image)}>
              <div className="award-icon">
                {a.image
                  ? <img src={enc(a.image)} alt={a.title} className="award-thumb"/>
                  : <span className="award-emoji">{a.type==='award'?'🏆':a.type==='certification'?'📜':'🏅'}</span>}
              </div>
              <div className="award-info">
                <h4 className="award-title">{a.title}</h4>
                <p className="award-issuer">{a.issuer}</p>
                <p className="award-date">{a.date}{a.expires?` · Expires ${a.expires}`:''}</p>
                {a.credentialId && <p className="award-cred">ID: {a.credentialId}</p>}
                {a.image && <p className="award-hint">Click to view</p>}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={0.1} style={{width:'100%',maxWidth:680,margin:'4rem auto 0'}}>
        <SectionLabel>Education</SectionLabel>
        <div className="edu-card">
          <div className="edu-bar"/>
          <h3 className="edu-degree">Bachelor of Science in<br />Computer Science &amp; Mathematics</h3>
          <p className="edu-school">Francis Marion University · Aug 2021 – Dec 2024</p>
          <div className="edu-stats">
            {[['3.92','GPA'],['Dec 2024','Graduated'],['Dual','Major']].map(([v,l])=>(
              <div key={l} className="edu-stat"><span className="edu-val">{v}</span><span className="edu-lbl">{l}</span></div>
            ))}
          </div>
          <p className="edu-honors">Certified member of Upsilon Pi Epsilon (CS Honor Society) &amp; Kappa Mu Epsilon (Mathematics Honor Society)</p>
        </div>
      </FadeUp>

      <AnimatePresence>
        {lb && <motion.div className="overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setLb(null)}>
          <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} transition={{ease:[0.22,1,0.36,1],duration:0.3}} onClick={e=>e.stopPropagation()} style={{position:'relative',maxWidth:560,width:'100%'}}>
            <button className="close-btn abs" onClick={()=>setLb(null)}><X size={16}/></button>
            <img src={enc(lb)} alt="Award" style={{width:'100%',display:'block'}}/>
          </motion.div>
        </motion.div>}
      </AnimatePresence>
    </section>
  );
}

/* ─── CONTACT ─── */
function Contact() {
  return (
    <section id="contact" className="contact">
      <FadeUp><SectionLabel>Let's Connect</SectionLabel>
        <h2 className="contact-heading">Let's build<br />something<br /><em>great.</em></h2>
      </FadeUp>
      <FadeUp delay={0.12}>
        <div className="contact-items">
          {[{label:'Email',val:'pbhakti302@gmail.com',href:'mailto:pbhakti302@gmail.com'},{label:'Phone',val:'(843) 230-1051',href:'tel:8432301051'},{label:'Location',val:'Itasca, IL 60143',href:null},{label:'LinkedIn',val:'bhakti-patel-454726153',href:'https://linkedin.com/in/bhakti-patel-454726153'},{label:'GitHub',val:'Bhakti3001',href:'https://github.com/Bhakti3001'}].map(({label,val,href},i,arr)=>(
            <div key={label} className="contact-item" style={{borderBottom:i<arr.length-1?'1px solid #e8e2d8':'none'}}>
              <span className="contact-lbl">{label}</span>
              {href ? <a href={href} target={href.startsWith('http')?'_blank':'_self'} rel="noreferrer" className="contact-val">{val}</a> : <span className="contact-val">{val}</span>}
            </div>
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

function Footer() {
  return <footer className="footer"><span className="footer-name">Bhakti Patel</span><span className="footer-copy">© 2025 · Designed &amp; Built with ♥</span></footer>;
}

export default function App() {
  return <div><Nav/><Hero/><Marquee/><About/><Experience/><Research/><Projects/><Conferences/><Awards/><Contact/><Footer/></div>;
}