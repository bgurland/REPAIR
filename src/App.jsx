import { useState, useRef, useEffect } from "react";

// ─── VIMEO EMBED ─────────────────────────────────────────────────────────────
// Note: iframes are blocked in the Claude.ai sandbox on mobile.
// This tap-to-open design works for mobile testing; the full embed
// will render correctly once deployed to Netlify.
// Private/unlisted Vimeo videos need the hash in the URL.
const VIMEO_URLS = {
  "743819969":  "https://vimeo.com/743819969/0ab020862e",
  "743821060":  "https://vimeo.com/743821060",
  "1175949349": "https://vimeo.com/1175949349",
  "1180494424": "https://vimeo.com/1180494424",
};

const VimeoEmbed = ({ videoId, title }) => (
  <div style={{ margin: "16px 0" }}>
    <a
      href={VIMEO_URLS[videoId] || `https://vimeo.com/${videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "block", textDecoration: "none" }}
    >
      <div
        style={{ borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}
        style={{
          background: "linear-gradient(135deg, #1a2e3b, #2d7d6f)",
          padding: "32px 16px",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative ring */}
        <div style={{
          position: "absolute", width: 140, height: 140, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)", top: -30, right: -30,
        }} />
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
        }}>
          <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{title}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
            Tap to watch on Vimeo ↗
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.12)", borderRadius: 20,
          padding: "6px 16px", border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Open video</span>
        </div>
      </div>
    </a>
  </div>
);

// ─── COLORS & DESIGN TOKENS ──────────────────────────────────────────────────
const C = {
  teal: "#2d7d6f",
  tealLight: "#e8f5f2",
  tealMid: "#4a9d8f",
  sage: "#6b8f71",
  sageLt: "#eef4ef",
  coral: "#e07a5f",
  coralLt: "#fdf1ee",
  navy: "#1a2e3b",
  navyMid: "#2c4a5e",
  slate: "#4a6278",
  muted: "#7a8fa6",
  bg: "#f7f9fb",
  card: "#ffffff",
  border: "#dde7ef",
  warn: "#f4a261",
  warnLt: "#fff7ee",
  red: "#c0392b",
  redLt: "#fdf0ef",
};


// ─── READ ALOUD ──────────────────────────────────────────────────────────────
const useReadAloud = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const clean = text.replace(/[🌿📖🔍🩺🥦📊🏥🚨💬🌱✓→•⭐🩸⚖️🔄🚫😣🌡️💧🚽⬇️⚡😣🫁🔬]/gu, '').replace(/\s+/g, ' ').trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 0.9;
    utt.pitch = 1;
    utt.lang = 'en-US';
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return { speak, stop, speaking };
};

const ReadAloudBtn = ({ getText, speaking, onSpeak }) => (
  <button
    onClick={onSpeak}
    title={speaking ? "Stop reading" : "Read aloud"}
    style={{
      position: "fixed", bottom: 72, right: 16, zIndex: 50,
      width: 48, height: 48, borderRadius: "50%",
      background: speaking ? C.coral : C.teal,
      color: "#fff", border: "none",
      fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      transition: "background 0.2s",
    }}>
    {speaking ? "⏹" : "🔊"}
  </button>
);

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Card = ({ children, style = {}, className = "" }) => (
  <div style={{ ...style }}
    style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

const Callout = ({ icon, title, body, color = C.teal, bg = C.tealLight }) => (
  <div  style={{ background: bg, borderLeft: `4px solid ${color}` }}>
    {icon && <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>}
    {title && <div style={{ fontWeight: 600, marginBottom: 4 }} style={{ color, fontSize: 14 }}>{title}</div>}
    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{body}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ color: C.navy, fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{title}</h2>
    {subtitle && <p style={{ color: C.muted, fontSize: 16, marginTop: 4 }}>{subtitle}</p>}
  </div>
);

const Pill = ({ label, active, onClick }) => (
  <button onClick={onClick}
        style={{
      background: active ? C.teal : "transparent",
      color: active ? "#fff" : C.slate,
      border: `1.5px solid ${active ? C.teal : C.border}`,
      fontSize: 16,
      whiteSpace: "nowrap",
    }}>
    {label}
  </button>
);

const TabBar = ({ tabs, active, onChange }) => (
  <div  style={{ scrollbarWidth: "none" }}>
    {tabs.map(t => <Pill key={t.id} label={t.label} active={active === t.id} onClick={() => onChange(t.id)} />)}
  </div>
);

const ProgressBar = ({ value, max, color = C.teal }) => (
  <div  style={{ height: 8, background: C.border }}>
    <div  style={{ width: `${(value / max) * 100}%`, background: color }} />
  </div>
);

const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false }) => {
  const styles = {
    primary: { background: C.teal, color: "#fff", border: "none" },
    secondary: { background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}` },
    danger: { background: C.red, color: "#fff", border: "none" },
    ghost: { background: C.tealLight, color: C.teal, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
            style={{ fontSize: 16, minHeight: 54, ...styles[variant], opacity: disabled ? 0.5 : 1 }}>
      {children}
    </button>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "prolapse", label: "Understanding Prolapse", icon: "📖" },
  { id: "symptoms", label: "Symptom Explorer", icon: "🔍" },
  { id: "imaging", label: "Imaging Guide", icon: "🩻" },
  { id: "lifestyle", label: "Lifestyle", icon: "🥦" },
  { id: "calculators", label: "My Scores", icon: "📊" },
  { id: "surgical", label: "Surgery", icon: "🏥" },
  { id: "redflags", label: "Red Flags", icon: "🚨" },
];

// ─── HOME ────────────────────────────────────────────────────────────────────
const HomeSection = ({ onNav }) => (
  <div>
    <div  style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.navyMid})` }}>
      <div style={{ fontSize: 42, marginBottom: 8 }}>🌿</div>
      <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>REPAIR</h1>
      <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 13, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>
        Rectal prolapse · Education · Patient Awareness · Information · Resource
      </div>
      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.5 }}>
        Your personal guide to pelvic floor health, bowel wellness, and rectal prolapse — from Stanford's colorectal surgery team.
      </p>
    </div>

    <Callout icon="💬" title="You're not alone" body="Millions of people live with pelvic floor symptoms — and most never talk about them. This app is a safe, shame-free place to learn, prepare, and feel more in control." />

    <div style={{ color: C.navy, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Explore</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {NAV.filter(n => n.id !== "home").map(n => (
        <button key={n.id} onClick={() => onNav(n.id)}
                    style={{ background: C.card, border: `1px solid ${C.border}`, minHeight: 90, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ fontSize: 24, marginBottom: 4 }}>{n.icon}</div>
          <div style={{ color: C.navy, fontSize: 16, fontWeight: 600, lineHeight: 1.3 }}>{n.label}</div>
        </button>
      ))}
    </div>

    <Card style={{ background: C.sageLt, border: `1px solid ${C.sage}22` }}>
      <div style={{ color: C.sage, fontSize: 16, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>Stanford Colorectal Surgery</div>
      <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>
        Content created by Dr. Brooke Gurland and reviewed by a multidisciplinary team. This app educates — it does not diagnose or replace your healthcare team.
      </div>
      <div style={{ color: C.sage, fontSize: 16, lineHeight: 1.6, borderTop: `1px solid ${C.sage}33`, paddingTop: 8 }}>
        <strong>REPAIR</strong> — <span style={{ fontStyle: "italic" }}>Rectal prolapse Education and Patient Awareness Information Resource</span>
      </div>
    </Card>
  </div>
);

// ─── PROLAPSE EXPLAINER ──────────────────────────────────────────────────────
const ProlapseSection = () => {
  const [tab, setTab] = useState("what");
  const tabs = [
    { id: "what", label: "What Is It?" },
    { id: "grading", label: "Grading" },
    { id: "why", label: "Why It Happens" },
    { id: "eval", label: "Evaluation" },
    { id: "treatment", label: "Tx Options" },
  ];

  return (
    <div>
      <SectionHeader title="Understanding Rectal Prolapse" subtitle="Plain-language explanations to help you feel informed, not overwhelmed." />
      <Callout body="Rectal prolapse is more common than most people know — and far more treatable than most people fear. Understanding what's happening in your body is the first step." />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "what" && (
        <div>
          <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
            Rectal prolapse occurs when part or all of the rectum slips out of its normal position and protrudes through the anal opening — or folds inward on itself. Think of the rectum like a sock: prolapse is like the sock starting to turn inside out.
          </p>
          <p style={{ color: C.navy, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>▶ Watch this animation first</p>
          <VimeoEmbed videoId="743819969" title="Rectal Prolapse & Rectocele" />
          <Card>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Internal vs External</div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>
              <strong>Internal prolapse (intussusception):</strong> The rectum folds inward on itself but stays inside the body. Patients cannot see it — it's diagnosed through imaging or examination. Symptoms include incomplete evacuation, straining, and a feeling of blockage. <em>Internal prolapse is real and can significantly affect quality of life.</em>
            </div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7 }}>
              <strong>External prolapse:</strong> The rectum protrudes through the anal opening and is visible. This ranges from the inner lining (mucosal prolapse) to the full thickness of the rectal wall (complete external prolapse).
            </div>
          </Card>
        </div>
      )}

      {tab === "grading" && (
        <div>
          <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>Rectal prolapse is graded by how far the rectum descends. Understanding your grade helps your team choose the right approach.</p>
          <VimeoEmbed videoId="743821060" title="Degrees of Rectal Prolapse" />
          <Callout icon="⚠️" color={C.warn} bg={C.warnLt} title="Important" body="Imaging can both underestimate and overestimate the degree of prolapse. A physical examination is always needed before treatment decisions are made." />
          {[
            { grade: "I", desc: "Internal intussusception — rectum folds slightly inward, stays high up", sig: "Generally not clinically significant on its own" },
            { grade: "II", desc: "Internal intussusception reaching the upper anal canal", sig: "Generally not clinically significant on its own" },
            { grade: "III", desc: "Internal intussusception reaching the lower anal canal", sig: "Clinically significant — needs confirmation with physical exam" },
            { grade: "IV", desc: "Internal intussusception reaching or protruding to the anal verge", sig: "Clinically significant — needs confirmation with physical exam" },
            { grade: "V", desc: "Full external prolapse — rectum protrudes completely outside the body", sig: "Visible externally; requires clinical evaluation" },
          ].map(r => (
            <Card key={r.grade}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div  style={{ width: 36, height: 36, background: C.tealLight, color: C.teal, fontWeight: 800, fontSize: 15 }}>G{r.grade}</div>
                <div>
                  <div style={{ color: C.navy, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.desc}</div>
                  <div style={{ color: C.muted, fontSize: 13 }}>{r.sig}</div>
                </div>
              </div>
            </Card>
          ))}
          <Callout body="A grade on a scan is not a diagnosis on its own. Your surgeon will examine you, review your symptoms, and consider the full picture before recommending any treatment." icon="💡" />
        </div>
      )}

      {tab === "why" && (
        <div>
          <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>Prolapse develops when the structures that hold the rectum in place are weakened or stretched. Common contributing factors:</p>
          {["Chronic constipation and long-term straining", "Weakened pelvic floor muscles (from childbirth, aging, or other causes)", "Prior pelvic surgery", "Connective tissue disorders or joint hypermobility", "Neurological conditions affecting pelvic nerves", "Long-term laxative use or repeated enemas"].map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ color: C.teal, fontSize: 18, marginTop: 2 }}>•</div>
              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{f}</div>
            </div>
          ))}
          <Callout body="Prolapse can affect anyone — men, women, and people of all ages — though it is more common in older women. You did nothing wrong." icon="🤝" />
        </div>
      )}

      {tab === "eval" && (
        <div>
          <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>A healthcare provider will typically take a thorough approach to evaluation:</p>
          {[
            { step: "1", title: "Symptom History", body: "A detailed conversation about what you're experiencing, how long it's been happening, and how it affects your daily life. Scoring tools (like those in the 'My Scores' section) help quantify this." },
            { step: "2", title: "Physical Examination", body: "Often includes examination while straining, to see how the rectum behaves under pressure. This may feel vulnerable — the team performs this regularly and is experienced with patient comfort." },
            { step: "3", title: "Imaging Studies", body: "Depending on findings, your team may order defecography, dynamic MRI, or other studies. See the Imaging Guide section for what to expect." },
            { step: "4", title: "Specialist Referral", body: "You may be referred to a colorectal surgeon, urogynecologist, pelvic floor PT, or gastroenterologist — or a multidisciplinary team." },
          ].map(s => (
            <Card key={s.step}>
              <div style={{ display: "flex", gap: 12 }}>
                <div  style={{ width: 32, height: 32, background: C.teal, color: "#fff", fontWeight: 800, fontSize: 14 }}>{s.step}</div>
                <div>
                  <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6 }}>{s.body}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "treatment" && (
        <div>
          <Callout body="Treatment depends on the type and severity of prolapse, associated symptoms, and your overall health and goals. There are many options — from lifestyle and pelvic floor PT to minimally invasive surgery. You don't have to manage this alone." icon="🌱" />
          <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>General treatment categories (from conservative to surgical):</p>
          {[
            { label: "Lifestyle & Diet", desc: "High-fiber diet, hydration, proper toilet positioning, straining avoidance. Often the foundation of any treatment plan." },
            { label: "Pelvic Floor Physical Therapy", desc: "Highly effective for both strengthening and relaxing pelvic floor muscles. Recommended before and after surgery in most cases." },
            { label: "Bowel Retraining", desc: "Establishing regular, effective bowel habits to reduce straining and improve evacuation." },
            { label: "Non-Surgical Procedures", desc: "Depending on your specific anatomy and symptoms, your team may discuss certain non-surgical approaches." },
            { label: "Surgery — Rectopexy", desc: "For significant internal or external prolapse, surgery to secure the rectum to the tailbone (rectopexy) is the primary treatment. See the Surgery section to learn more." },
          ].map((t, i) => (
            <Card key={i}>
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{t.label}</div>
              <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6 }}>{t.desc}</div>
            </Card>
          ))}
          <Card style={{ background: C.coralLt, borderColor: `${C.coral}44` }}>
            <div style={{ color: C.coral, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>📸 Photo Guidance</div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>If you have external prolapse, consider taking a photo when tissue is out and bringing it to your appointment. Look for concentric rings (full-thickness prolapse) vs. radial folds (mucosal prolapse). This helps your surgeon significantly.</div>
          </Card>
          <div style={{ color: C.muted, fontSize: 16, textAlign: "center" }}>This app does not recommend specific treatments. Your healthcare team will work with you to find the approach that fits your situation.</div>
        </div>
      )}
    </div>
  );
};

// ─── SYMPTOMS ────────────────────────────────────────────────────────────────
const SYMPTOMS = [
  {
    id: "evacuation", icon: "🚽", label: "Incomplete Evacuation / Straining",
    desc: "Feeling like you can't fully empty your bowel, needing to strain, or spending a long time on the toilet.",
    why: "This may be related to internal rectal prolapse (intussusception), where the rectum folds inward and creates an obstruction. It can also reflect pelvic floor muscle coordination problems or slow transit.",
    lifestyle: "Toilet positioning (raising knees with a step stool), bowel habit training, high-fiber diet, and pelvic floor PT can all help.",
    doctor: "If straining is your primary complaint and it hasn't improved with lifestyle changes, or if it's significantly affecting your quality of life.",
    redFlag: false,
    animationId: "1175949349", animationTitle: "Constipation & Dyssynergic Defecation",
  },
  {
    id: "bulge", icon: "🔵", label: "Rectal Bulge or Tissue Coming Out",
    desc: "Feeling a bulge in the rectal area, or seeing or feeling tissue outside the body.",
    why: "This may represent external rectal prolapse (the rectum protruding through the anal opening) or rectocele. The severity ranges from occasional protrusion with straining to persistent prolapse.",
    lifestyle: "Avoid straining. Optimize fiber and hydration. Avoid prolonged sitting on the toilet.",
    doctor: "Always — any visible tissue coming out of the rectum should be evaluated by a healthcare provider.",
    redFlag: false,
    animationId: "743819969", animationTitle: "Rectal Prolapse & Rectocele",
  },
  {
    id: "incontinence", icon: "💧", label: "Fecal Leakage / Incontinence",
    desc: "Inability to control gas, liquid, or solid stool. Urgency that doesn't give you time to reach the toilet.",
    why: "Rectal prolapse can stretch the anal sphincter over time, reducing its ability to maintain closure. Nerve damage or sphincter injury can also contribute.",
    lifestyle: "Dietary adjustments to regulate stool consistency. Pelvic floor PT for sphincter strengthening. Avoiding constipation (paradoxically, constipation can worsen leakage of liquid stool around impacted stool).",
    doctor: "Fecal incontinence is very treatable — please don't suffer in silence. If it's affecting your daily activities, your team needs to know.",
    redFlag: false,
  },
  {
    id: "pressure", icon: "⬇️", label: "Pelvic Pressure or Heaviness",
    desc: "A sensation of pressure, heaviness, or dragging in the pelvis or rectum. Feeling like something is falling out.",
    why: "This sensation often reflects downward displacement of pelvic organs, including the rectum, and is common with prolapse of any degree.",
    lifestyle: "Avoiding prolonged standing, high-impact activity during symptomatic periods. Core and pelvic floor PT.",
    doctor: "If this sensation is persistent or worsening, or if it's combined with other symptoms.",
    redFlag: false,
  },
  {
    id: "mucus", icon: "💛", label: "Mucus Discharge or Rectal Bleeding",
    desc: "Mucus coming from the rectum, or blood on toilet paper, in the bowl, or mixed with stool.",
    why: "Mucus discharge is common with rectal prolapse — the prolapsed tissue secretes mucus. Rectal bleeding can have many causes and must be evaluated.",
    lifestyle: "Mucus alone, in the context of known prolapse, is often related to the prolapse itself. Bleeding always deserves evaluation.",
    doctor: "Any rectal bleeding — especially new bleeding, bleeding mixed with stool, or dark blood — should be evaluated promptly. Do not assume it's always related to prolapse.",
    redFlag: true,
  },
];

const SymptomsSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Symptom Explorer" subtitle="Tap any symptom to learn more about what it means and when to seek care." />
      <Callout body="Millions of people live with these symptoms — and most never talk about them. You're not alone in what you're experiencing." icon="💙" />
      {SYMPTOMS.map(s => (
        <div key={s.id}>
          <button onClick={() => setOpen(open === s.id ? null : s.id)}
                        style={{ background: open === s.id ? C.tealLight : C.card, border: `1.5px solid ${open === s.id ? C.teal : C.border}` }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <span style={{ color: C.navy, fontWeight: 600, fontSize: 16, flex: 1 }}>{s.label}</span>
            <span style={{ color: C.muted, fontSize: 18 }}>{open === s.id ? "▲" : "▼"}</span>
          </button>
          {open === s.id && (
            <Card style={{ marginTop: -8, marginBottom: 16, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
              <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</div>
              <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Why it happens</div>
              <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 12 }}>{s.why}</div>
              <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Lifestyle factors</div>
              <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 12 }}>{s.lifestyle}</div>
              {s.animationId && <VimeoEmbed videoId={s.animationId} title={s.animationTitle} />}
              <div  style={{ background: s.redFlag ? C.redLt : C.warnLt, border: `1px solid ${s.redFlag ? C.red : C.warn}44` }}>
                <div style={{ color: s.redFlag ? C.red : C.coral, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
                  {s.redFlag ? "🚨 When to seek care — promptly" : "🩺 When to call your doctor"}
                </div>
                <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{s.doctor}</div>
              </div>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── IMAGING ─────────────────────────────────────────────────────────────────
// Ultrasound is a single grouped entry with sub-cards for each probe type.
const ULTRASOUND_PROBES = [
  {
    label: "Endoanal Ultrasound",
    icon: "🔵",
    what: "A small probe placed gently inside the anal canal to image the sphincter muscles in cross-section.",
    why: "To evaluate the internal and external anal sphincter for tears, thinning, or scarring — the most important study for assessing the cause of fecal incontinence.",
    expect: "Brief and minimally uncomfortable. A small enema beforehand is sometimes recommended. The provider guides you through each step.",
  },
  {
    label: "Endovaginal (Transvaginal) Ultrasound",
    icon: "🟣",
    what: "A probe placed in the vagina to image the pelvic floor from a different angle.",
    why: "Provides excellent views of the posterior compartment, rectovaginal septum, and sphincter complex — often used alongside other imaging when multicompartment prolapse is suspected.",
    expect: "Routine and well-tolerated. Your provider will explain the procedure before starting.",
  },
  {
    label: "Transperineal (Perineal) Ultrasound",
    icon: "🟢",
    what: "A probe placed on the skin of the perineum (the area between the vaginal opening and anus) — no internal insertion required.",
    why: "A non-invasive way to view pelvic floor movement, bladder neck, and rectal descent in real time. Increasingly used as a first-line study because it is comfortable and well-tolerated.",
    expect: "Completely external — no probe insertion. Gel is applied to the skin. You may be asked to squeeze, strain, or cough during imaging.",
  },
];

const IMAGING = [
  { id: "defec", icon: "📡", label: "Conventional Defecography", what: "An X-ray study that watches how the rectum empties in real time.", why: "To evaluate rectal prolapse, rectocele, and obstructed defecation.", what_happens: "A contrast material (similar in consistency to stool) is placed in the rectum. You sit on a special commode and are asked to squeeze, strain, and evacuate while X-ray images are taken.", prep: "Usually requires a bowel prep (enema) beforehand. Ask your team.", expect: "Not painful, but can feel vulnerable. The staff who perform this study do it regularly and are experienced with patient comfort." },
  { id: "mri", icon: "🧲", label: "MRI Defecography (Dynamic Pelvic MRI)", what: "An MRI-based version of defecography — no radiation.", why: "Provides excellent visualization of all three pelvic compartments (bladder, uterus/vagina, and rectum) simultaneously. Often preferred when multiple issues are suspected.", what_happens: "Gel is placed in the rectum (sometimes also the vagina and bladder). You lie inside an MRI machine and perform squeeze, strain, and evacuation maneuvers.", prep: "No radiation involved. The table may be narrow.", expect: "Evacuation in a scanner can feel awkward — this is completely normal and expected. The images are read afterward by a radiologist." },
  { id: "ultrasound", icon: "🔊", label: "Pelvic Ultrasound", what: "Ultrasound imaging of the anal sphincter and pelvic floor using one or more probe approaches.", why: "Used to evaluate sphincter integrity (fecal incontinence), pelvic floor muscle function, and multicompartment prolapse. Three probe types are used depending on what's being assessed.", isUltrasound: true },
  { id: "manometry", icon: "📏", label: "Anorectal Manometry", what: "A pressure measurement study of the rectum and anal canal.", why: "To assess how well the sphincter muscles and rectum coordinate during squeezing and relaxation — particularly useful for evaluating obstructed defecation and incontinence.", what_happens: "A thin, flexible tube is placed in the rectum. You are asked to squeeze, push, and relax while pressures are recorded. Sometimes a small balloon is inflated to test rectal sensation.", prep: "Instructions vary — ask your team. Usually straightforward preparation.", expect: "Mild discomfort is possible but the study is not painful. Usually 30–60 minutes. The provider will guide you through each step." },
  { id: "transit", icon: "⏱️", label: "Colonic Transit Study", what: "A test measuring how long it takes stool to move through the colon.", why: "To determine whether slow colonic transit is contributing to constipation.", what_happens: "Sitz Marker Study: swallow a capsule with tiny radio-opaque markers; an X-ray is taken several days later to see where they are. SmartPill: a swallowable wireless capsule that transmits motility data as it travels through the GI tract.", prep: "You may need to stop laxatives and certain medications for several days. Follow your team's instructions carefully.", expect: "Straightforward. Beyond swallowing the capsule, the study itself requires no procedures." },
];

const ImagingSection = () => {
  const [open, setOpen] = useState(null);
  const [probeOpen, setProbeOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Imaging Guide" subtitle="Understanding what each test involves helps reduce anxiety and helps you prepare." />
      <Callout body="Imaging tests for pelvic floor and bowel problems can feel unfamiliar or even embarrassing. Knowing what to expect makes the experience much easier." icon="💙" />
      {IMAGING.map(s => (
        <div key={s.id}>
          <button onClick={() => setOpen(open === s.id ? null : s.id)}
                        style={{ background: open === s.id ? C.tealLight : C.card, border: `1.5px solid ${open === s.id ? C.teal : C.border}` }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ color: C.navy, fontWeight: 600, fontSize: 16, flex: 1, lineHeight: 1.3 }}>{s.label}</span>
            <span style={{ color: C.muted }}>{open === s.id ? "▲" : "▼"}</span>
          </button>
          {open === s.id && (
            <Card style={{ marginTop: -8, marginBottom: 16 }}>
              {s.isUltrasound ? (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>What it is</div>
                    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{s.what}</div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Why it's ordered</div>
                    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{s.why}</div>
                  </div>
                  <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>Three probe approaches — tap each to learn more:</div>
                  {ULTRASOUND_PROBES.map(p => (
                    <div key={p.label}>
                      <button onClick={() => setProbeOpen(probeOpen === p.label ? null : p.label)}
                                                style={{ background: probeOpen === p.label ? C.tealLight : C.bg, border: `1.5px solid ${probeOpen === p.label ? C.teal : C.border}`, minHeight: 54 }}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <span style={{ color: C.navy, fontWeight: 600, fontSize: 16, flex: 1 }}>{p.label}</span>
                        <span style={{ color: C.muted, fontSize: 14 }}>{probeOpen === p.label ? "▲" : "▼"}</span>
                      </button>
                      {probeOpen === p.label && (
                        <div  style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                          {[["What it is", p.what], ["Why it's ordered", p.why], ["What to expect", p.expect]].map(([k, v]) => (
                            <div key={k} style={{ marginBottom: 12 }}>
                              <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</div>
                              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{v}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                [["What it is", s.what], ["Why it's ordered", s.why], ["What happens", s.what_happens], ["Preparation", s.prep], ["What to expect", s.expect]].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 12 }}>
                    <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{k}</div>
                    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{v}</div>
                  </div>
                ))
              )}
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── LIFESTYLE ────────────────────────────────────────────────────────────────
const LIFESTYLE_PILLARS = [
  { id: "nutrition", icon: "🥦", label: "Whole-Food Nutrition", color: "#4a9d6f", desc: "A plant-predominant diet rich in fiber is one of the most powerful things you can do for bowel health.", tips: ["Target 25–30g dietary fiber daily (most people eat 10–15g)", "High-fiber foods: legumes, whole grains, fruits with skin, vegetables, nuts, psyllium husk", "Hydration: 6–8 glasses of water daily — fiber without water worsens constipation", "Fermented foods (yogurt, kefir, kimchi) support gut microbiome diversity", "Add ground flaxseed to oatmeal or smoothies. One cup cooked lentils = ~15g fiber"] },
  { id: "activity", icon: "🏃", label: "Physical Activity", color: "#e07a5f", desc: "Regular movement stimulates colonic motility and supports pelvic floor muscle tone.", tips: ["Even 20–30 minutes of walking daily can improve bowel function", "Avoid heavy lifting and high-impact activity during periods of significant prolapse", "Discuss appropriate activity levels with your pelvic floor PT or surgeon", "Core strengthening — gently and correctly — supports pelvic floor function"] },
  { id: "sleep", icon: "😴", label: "Restorative Sleep", color: "#9b59b6", desc: "Poor sleep disrupts gut motility, pain processing, and immune function — all relevant to bowel health.", tips: ["Aim for 7–9 hours of quality sleep nightly", "Irregular bowel timing often correlates with disrupted sleep schedules", "Sleep deprivation can worsen pain sensitivity around pelvic symptoms", "Establishing a consistent sleep-wake time also helps regulate bowel timing"] },
  { id: "stress", icon: "🧘", label: "Stress Management", color: "#e6a817", desc: "The gut and brain are deeply connected. Chronic stress directly affects bowel motility and pelvic floor tension.", tips: ["Mindfulness and breathing exercises can reduce pelvic floor guarding/tension", "The gut-brain axis is real: anxiety and IBS-like symptoms often overlap with prolapse", "Consider mindfulness-based stress reduction (MBSR) programs", "Your pelvic floor PT can teach relaxation techniques specific to your pelvic floor"] },
  { id: "substances", icon: "🚭", label: "Avoidance of Risky Substances", color: "#c0392b", desc: "Certain substances directly worsen bowel function, pelvic floor health, and surgical outcomes.", tips: ["Smoking significantly worsens constipation and impairs wound healing", "Alcohol dehydrates and disrupts bowel motility", "Caffeine in excess can worsen urgency and loose stools", "If you smoke and are considering surgery, quitting before your procedure dramatically improves outcomes"] },
  { id: "social", icon: "🤝", label: "Social Connection", color: "#2980b9", desc: "Pelvic floor disorders cause shame and isolation. Meaningful connection is genuinely therapeutic.", tips: ["Many people with prolapse feel isolated — you are not alone", "Peer support groups exist for pelvic floor disorders and can be deeply validating", "Involving a trusted person (partner, friend, family member) in your care journey improves outcomes", "If symptoms are causing depression or anxiety, please tell your healthcare team — support is available"] },
];

const LifestyleSection = () => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Lifestyle Medicine" subtitle="Lifestyle changes are not a consolation prize — they are the foundation of pelvic floor health." />
      <Callout body="The six pillars of lifestyle medicine each connect directly to pelvic floor and bowel health. Small, consistent changes make a real difference." icon="🌱" />
      <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
        <strong>Bowel habit training tips:</strong> Use the gastrocolic reflex — try sitting on the toilet 20–30 minutes after breakfast. Don't ignore the urge. Limit toilet time to 5–10 minutes. Raise your knees with a step stool to relax the anorectal angle.
      </div>
      <VimeoEmbed videoId="1175949349" title="Constipation & Dyssynergic Defecation" />
      <div style={{ color: C.navy, fontSize: 16, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>The 6 Lifestyle Medicine Pillars</div>
      {LIFESTYLE_PILLARS.map(p => (
        <div key={p.id}>
          <button onClick={() => setOpen(open === p.id ? null : p.id)}
                        style={{ background: open === p.id ? "#f0f7f5" : C.card, border: `1.5px solid ${open === p.id ? p.color : C.border}` }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.navy, fontWeight: 600, fontSize: 14 }}>{p.label}</div>
              <div style={{ color: C.muted, fontSize: 16, marginTop: 2 }}>{p.desc.substring(0, 60)}...</div>
            </div>
            <span style={{ color: C.muted }}>{open === p.id ? "▲" : "▼"}</span>
          </button>
          {open === p.id && (
            <Card style={{ marginTop: -8, marginBottom: 16, borderLeft: `4px solid ${p.color}` }}>
              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</div>
              {p.tips.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <div style={{ color: p.color, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✓</div>
                  <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6 }}>{t}</div>
                </div>
              ))}
            </Card>
          )}
        </div>
      ))}
      <Card style={{ background: C.tealLight }}>
        <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>🏋️ Pelvic Floor Physical Therapy</div>
        <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>
          PT is one of the most effective interventions for bowel and bladder dysfunction. Important: for some people the pelvic floor is too tight (not too weak) — a PT can assess your specific needs and give tailored exercises. Always ask for a referral if you haven't seen one.
        </div>
      </Card>
    </div>
  );
};

// ─── CALCULATORS ─────────────────────────────────────────────────────────────

// ── IMPACT Bowel Function Short Form (PFDC Consensus, 2020) ──────────────────
// Q1: Bristol Stool Scale, Q2: Difficult BM frequency, Q3–Q6: Constipation symptoms,
// Q7: Constipation sub-items, Q8: Fecal incontinence, Q9: Urgency,
// Q10: Pain with stool, Q11: Prolapse sensation, Q12: Bleeding

const BRISTOL_TYPES = [
  { type: 1, label: "Type 1", desc: "Separate hard lumps (hard to pass)" },
  { type: 2, label: "Type 2", desc: "Sausage-shaped but lumpy" },
  { type: 3, label: "Type 3", desc: "Like a sausage, with cracks on the surface" },
  { type: 4, label: "Type 4", desc: "Like a sausage — smooth and soft ✓ Ideal" },
  { type: 5, label: "Type 5", desc: "Soft blobs with clear-cut edges" },
  { type: 6, label: "Type 6", desc: "Fluffy, ragged edges — mushy stool" },
  { type: 7, label: "Type 7", desc: "Watery, no solid pieces — entirely liquid" },
];

const FREQ_3 = [
  { label: "Occasionally", value: "occasionally" },
  { label: "Sometimes", value: "sometimes" },
  { label: "Usually", value: "usually" },
  { label: "Always", value: "always" },
];

const SEV_INFREQ = [
  { label: "Not at all severe (I go almost every day)", value: "not_severe" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe (I go 1–2 times per week)", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe (up to 4 weeks without going)", value: "extreme" },
];

const SEV_STRAIN = [
  { label: "Not at all severe (I push a little)", value: "not_severe" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe (I bear down hard)", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe (push on belly, grunt, bear down very hard)", value: "extreme" },
];

const SEV_EMPTY = [
  { label: "Not at all severe (most of my bowel movement comes out)", value: "not_severe" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe (there is still a lot of stool in me)", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe (constant pressure / keep going back to bathroom)", value: "extreme" },
];

const SEV_URGE = [
  { label: "Not at all severe (I have a pretty good sense when I have to go)", value: "not_severe" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe (only a vague sense I might have to go)", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe (I don't have any sensation in the pelvic area)", value: "extreme" },
];

const BOTHER_5 = [
  { label: "Not at all bothersome", value: "not" },
  { label: "A little bothersome", value: "little" },
  { label: "Somewhat bothersome", value: "somewhat" },
  { label: "Very bothersome", value: "very" },
  { label: "Extremely bothersome", value: "extreme" },
];

const CONSTIP_ITEMS = [
  { key: "c_discomfort", label: "7a. Discomfort in your abdomen" },
  { key: "c_pain", label: "7b. Pain in your abdomen" },
  { key: "c_bloating", label: "7c. Bloating in your abdomen" },
  { key: "c_cramps", label: "7d. Stomach cramps" },
  { key: "c_burning", label: "7e. Rectal burning during or after a bowel movement" },
  { key: "c_hard", label: "7f. Bowel movements that were too hard" },
  { key: "c_small", label: "7g. Bowel movements that were too small" },
  { key: "c_false", label: "7h. Feeling like you had to pass a bowel movement but you couldn't (false alarm)" },
];
const SEV_4 = [
  { label: "Absent", value: 0 },
  { label: "Mild", value: 1 },
  { label: "Moderate", value: 2 },
  { label: "Severe", value: 3 },
  { label: "Very Severe", value: 4 },
];

// FI frequency for Q8
const FI_FREQ = [
  { label: "Rarely (< 1×/month)", value: "rarely" },
  { label: "Sometimes (< 1×/week)", value: "sometimes" },
  { label: "Weekly (but < 1×/day)", value: "weekly" },
  { label: "Daily (1×/day or more)", value: "daily" },
];
const FI_SEV = [
  { label: "None", value: "none" },
  { label: "Stain only", value: "stain" },
  { label: "More than a stain", value: "more" },
  { label: "Entire bowel movement", value: "entire" },
];

// Pain scale for Q10
const SEV_PAIN_LAST = [
  { label: "I haven't experienced this", value: "none" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe", value: "extreme" },
];

const SEV_PAIN_NOW = [
  { label: "No pain", value: "none" },
  { label: "Mild", value: "mild" },
  { label: "Somewhat severe", value: "somewhat" },
  { label: "Severe", value: "severe" },
  { label: "Extremely severe", value: "extreme" },
];

const BLEED_FREQ = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Usually", value: "usually" },
  { label: "Always", value: "always" },
];

// Summarizer helpers
const summarizeBristol = (t) => {
  if (!t) return null;
  if (t <= 2) return { label: "Hard / constipated stool (Types 1–2)", color: C.coral, note: "Types 1–2 suggest slow transit or insufficient fiber and hydration." };
  if (t <= 4) return { label: "Normal, well-formed stool (Types 3–4)", color: C.teal, note: "Types 3–4 are ideal." };
  if (t <= 5) return { label: "Somewhat soft stool (Type 5)", color: C.warn, note: "Type 5 may indicate slightly fast transit or sensitivity." };
  return { label: "Loose / liquid stool (Types 6–7)", color: C.coral, note: "Types 6–7 may suggest inflammation, infection, or other causes worth discussing with your team." };
};

// ── IMPACT Domain Scoring ─────────────────────────────────────────────────────
// The IMPACT Bowel Function Short Form does not produce a single composite score.
// Instead, we score each domain 0–4 based on bother level, which is the most
// clinically actionable output for patient-facing use.
// Domain scores: 0 = none, 1 = a little, 2 = somewhat, 3 = very, 4 = extreme

const botherScore = (val) => {
  const map = { not: 0, little: 1, somewhat: 2, very: 3, extreme: 4 };
  return map[val] ?? 0;
};

const freqScore = (val) => {
  const map = { occasionally: 1, sometimes: 2, usually: 3, always: 4 };
  return map[val] ?? 0;
};

const calcIMPACTDomains = (ans) => {
  // Constipation domain: average bother of answered constipation questions
  const conItems = [];
  if (ans.q3 === "yes" && ans.q3_bother) conItems.push(botherScore(ans.q3_bother));
  if (ans.q4 === "yes" && ans.q4_bother) conItems.push(botherScore(ans.q4_bother));
  if (ans.q5 === "yes" && ans.q5_bother) conItems.push(botherScore(ans.q5_bother));
  if (ans.q6 === "yes" && ans.q6_bother) conItems.push(botherScore(ans.q6_bother));
  const constipScore = conItems.length > 0 ? Math.round(conItems.reduce((a,b)=>a+b,0)/conItems.length * 10)/10 : null;

  // Fecal incontinence domain: worst bother across 8a/8b/8c
  const fiItems = [];
  if (ans.q8a === "yes" && ans.q8a_bother) fiItems.push(botherScore(ans.q8a_bother));
  if (ans.q8b === "yes" && ans.q8b_bother) fiItems.push(botherScore(ans.q8b_bother));
  if (ans.q8c === "yes" && ans.q8c_bother) fiItems.push(botherScore(ans.q8c_bother));
  const fiScore = fiItems.length > 0 ? Math.max(...fiItems) : null;

  // Urgency
  const urgScore = (ans.q9 === "yes" && ans.q9_bother) ? botherScore(ans.q9_bother) : null;

  // Pain
  const painScore = (ans.q10 === "yes" && ans.q10_bother) ? botherScore(ans.q10_bother) : null;

  // Prolapse sensation
  const prolapseScore = (ans.q11 === "yes" && ans.q11_bother) ? botherScore(ans.q11_bother) : null;

  return { constipScore, fiScore, urgScore, painScore, prolapseScore };
};

const domainBand = (score) => {
  if (score === null) return null;
  if (score === 0) return { label: "Not bothersome", color: C.teal, bg: C.tealLight };
  if (score === 1) return { label: "A little bothersome", color: C.teal, bg: C.tealLight };
  if (score === 2) return { label: "Somewhat bothersome", color: C.warn, bg: C.warnLt };
  if (score === 3) return { label: "Very bothersome", color: C.coral, bg: C.coralLt };
  return { label: "Extremely bothersome", color: C.red, bg: C.redLt };
};

const impactSummaryText = (ans) => {
  const flags = [];
  if (ans.q3 === "yes" && ans.q3_bother && ["very","extreme"].includes(ans.q3_bother)) flags.push("significant infrequent bowel movements");
  if (ans.q5 === "yes" && ans.q5_bother && ["very","extreme"].includes(ans.q5_bother)) flags.push("significant straining");
  if (ans.q6 === "yes" && ans.q6_bother && ["very","extreme"].includes(ans.q6_bother)) flags.push("significant incomplete evacuation");
  if (ans.q8 === "yes") flags.push("accidental bowel leakage or gas");
  if (ans.q9 === "yes" && ans.q9_bother && ["very","extreme"].includes(ans.q9_bother)) flags.push("urgency");
  if (ans.q10 === "yes") flags.push("pain with stool");
  if (ans.q11 === "yes") flags.push("tissue bulging / prolapse sensation");
  if (ans.q12 && ans.q12 !== "never") flags.push("rectal bleeding");
  if (flags.length === 0) return "Your responses suggest few bothersome bowel symptoms at this time. Bring this completed survey to your appointment to share with your team.";
  return `Your responses highlight: ${flags.join(", ")}. These are important to discuss with your healthcare team. Bring this completed survey to your appointment.`;
};

// Option button component
const OptBtn = ({ label, selected, onClick, color = C.teal }) => (
  <button onClick={onClick}
        style={{ background: selected ? color : C.tealLight, border: `1.5px solid ${selected ? color : C.border}`, minHeight: 52 }}>
    <div  style={{ width: 18, height: 18, border: `2px solid ${selected ? "#fff" : color}`, background: selected ? "#fff" : "transparent" }} />
    <span style={{ color: selected ? "#fff" : C.navy, fontSize: 13 }}>{label}</span>
  </button>
);

const YesNoGate = ({ question, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ color: C.navy, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{question}</div>
    <div style={{ display: "flex", gap: 12 }}>
      {["yes","no"].map(v => (
        <button key={v} onClick={() => onChange(v)}
                    style={{ background: value === v ? C.teal : C.tealLight, color: value === v ? "#fff" : C.navy, border: `1.5px solid ${value === v ? C.teal : C.border}`, fontWeight: 600, fontSize: 16, minHeight: 52 }}>
          {v === "yes" ? "YES" : "NO"}
        </button>
      ))}
    </div>
  </div>
);

const SubLabel = ({ text }) => (
  <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 14 }}>{text}</div>
);

// ─── IMPACT SURVEY COMPONENT ─────────────────────────────────────────────────
const IMPACTSurvey = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [ans, setAns] = useState({});
  const totalSteps = 12;

  const set = (key, val) => setAns(prev => ({ ...prev, [key]: val }));

  const canProceed = () => {
    if (step === 1) return !!ans.bristol;
    if (step === 2) return !!ans.q2;
    if (step === 3) {
      if (ans.q3 === "no") return true;
      if (ans.q3 === "yes") return ans.q3_freq && ans.q3_sev && ans.q3_bother;
      return false;
    }
    if (step === 4) {
      if (ans.q4 === "no") return true;
      if (ans.q4 === "yes") return ans.q4_sev && ans.q4_bother;
      return false;
    }
    if (step === 5) {
      if (ans.q5 === "no") return true;
      if (ans.q5 === "yes") return ans.q5_freq && ans.q5_sev && ans.q5_bother;
      return false;
    }
    if (step === 6) {
      if (ans.q6 === "no") return true;
      if (ans.q6 === "yes") return ans.q6_freq && ans.q6_sev && ans.q6_bother;
      return false;
    }
    if (step === 7) {
      if (ans.q7 === "no") return true;
      return ans.q7 === "yes" && CONSTIP_ITEMS.every(it => ans[it.key] !== undefined);
    }
    if (step === 8) {
      if (ans.q8 === "no") return true;
      if (ans.q8 === "yes") {
        const solid = ans.q8a !== "no" ? (ans.q8a_freq && ans.q8a_sev && ans.q8a_bother) : true;
        const liquid = ans.q8b !== "no" ? (ans.q8b_freq && ans.q8b_sev && ans.q8b_bother) : true;
        const gas = ans.q8c !== "no" ? (ans.q8c_freq && ans.q8c_bother) : true;
        return ans.q8a !== undefined && ans.q8b !== undefined && ans.q8c !== undefined && solid && liquid && gas;
      }
      return false;
    }
    if (step === 9) {
      if (ans.q9 === "no") return true;
      return ans.q9 === "yes" && ans.q9_bother;
    }
    if (step === 10) {
      if (ans.q10 === "no") return true;
      return ans.q10 === "yes" && ans.q10_last && ans.q10_now && ans.q10_bother;
    }
    if (step === 11) {
      if (ans.q11 === "no") return true;
      return ans.q11 === "yes" && ans.q11_bother;
    }
    if (step === 12) return !!ans.q12;
    return false;
  };

  const next = () => {
    if (step < totalSteps) setStep(s => s + 1);
    else onComplete(ans);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ color: C.muted, fontSize: 12 }}>Question {step} of {totalSteps}</div>
        <div  style={{ background: C.tealLight, color: C.teal, fontSize: 13, fontWeight: 700 }}>IMPACT Bowel Survey</div>
      </div>
      <ProgressBar value={step} max={totalSteps} />

      {step === 1 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q1. What does your stool usually look like?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>Please think about your typical bowel movements over the last 3 months.</div>
          {BRISTOL_TYPES.map(t => (
            <OptBtn key={t.type} label={`${t.label}: ${t.desc}`} selected={ans.bristol === t.type} onClick={() => set("bristol", t.type)} />
          ))}
        </Card>
      )}

      {step === 2 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q2. How often do you have an uncomfortable or difficult bowel movement?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>During a typical month.</div>
          {[
            { label: "Never", value: "never" },
            { label: "Daily", value: "daily" },
            { label: "A few times per week", value: "few_week" },
            { label: "Once per week", value: "once_week" },
            { label: "Once every 2 weeks", value: "biweekly" },
            { label: "Once a month", value: "monthly" },
          ].map(o => <OptBtn key={o.value} label={o.label} selected={ans.q2 === o.value} onClick={() => set("q2", o.value)} />)}
        </Card>
      )}

      {step === 3 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q3. Do you have difficulty with infrequent bowel movements?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>(Less than 1 bowel movement every 3 days)</div>
          <YesNoGate question="" value={ans.q3} onChange={v => set("q3", v)} />
          {ans.q3 === "yes" && (
            <div>
              <SubLabel text="How often do you experience this?" />
              {FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_freq === o.value} onClick={() => set("q3_freq", o.value)} />)}
              <SubLabel text="How severe is this symptom for you?" />
              {SEV_INFREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_sev === o.value} onClick={() => set("q3_sev", o.value)} />)}
              <SubLabel text="How much does this symptom bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_bother === o.value} onClick={() => set("q3_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 4 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q4. Do you ever lack the urge to have a bowel movement?</div>
          <YesNoGate question="" value={ans.q4} onChange={v => set("q4", v)} />
          {ans.q4 === "yes" && (
            <div>
              <SubLabel text="How severe is this for you?" />
              {SEV_URGE.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q4_sev === o.value} onClick={() => set("q4_sev", o.value)} />)}
              <SubLabel text="How much does this bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q4_bother === o.value} onClick={() => set("q4_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 5 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q5. Do you feel you need to strain too hard to have a bowel movement?</div>
          <YesNoGate question="" value={ans.q5} onChange={v => set("q5", v)} />
          {ans.q5 === "yes" && (
            <div>
              <SubLabel text="How often do you experience this?" />
              {FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_freq === o.value} onClick={() => set("q5_freq", o.value)} />)}
              <SubLabel text="How severe is this for you?" />
              {SEV_STRAIN.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_sev === o.value} onClick={() => set("q5_sev", o.value)} />)}
              <SubLabel text="How much does this bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_bother === o.value} onClick={() => set("q5_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 6 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q6. Do you feel you have not completely emptied your bowels after a bowel movement?</div>
          <YesNoGate question="" value={ans.q6} onChange={v => set("q6", v)} />
          {ans.q6 === "yes" && (
            <div>
              <SubLabel text="How often do you experience this?" />
              {FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_freq === o.value} onClick={() => set("q6_freq", o.value)} />)}
              <SubLabel text="How severe is this for you?" />
              {SEV_EMPTY.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_sev === o.value} onClick={() => set("q6_sev", o.value)} />)}
              <SubLabel text="How much does this bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_bother === o.value} onClick={() => set("q6_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 7 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q7. Do you sometimes have symptoms of constipation?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>If yes, please rate how severe these have been in the past 2 weeks.</div>
          <YesNoGate question="" value={ans.q7} onChange={v => set("q7", v)} />
          {ans.q7 === "yes" && (
            <div>
              {CONSTIP_ITEMS.map(it => (
                <div key={it.key} style={{ marginBottom: 16 }}>
                  <div style={{ color: C.navy, fontSize: 16, fontWeight: 600, marginBottom: 6 }}>{it.label}</div>
                  <div >
                    {SEV_4.map(o => (
                      <button key={o.value} onClick={() => set(it.key, o.value)}
                                                style={{ background: ans[it.key] === o.value ? C.teal : C.tealLight, color: ans[it.key] === o.value ? "#fff" : C.navy, border: `1.5px solid ${ans[it.key] === o.value ? C.teal : C.border}`, fontSize: 16, fontWeight: ans[it.key] === o.value ? 700 : 400 }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {step === 8 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q8. Do you sometimes have accidental gas or bowel leakage?</div>
          <YesNoGate question="" value={ans.q8} onChange={v => set("q8", v)} />
          {ans.q8 === "yes" && (
            <div>
              <Callout body="Many people with pelvic floor conditions experience some leakage. Your honest answers help your team understand your needs." icon="💙" />

              <div style={{ color: C.navy, fontWeight: 600, fontSize: 16, marginBottom: 6, marginTop: 8 }}>8A. Do you usually lose well-formed stool beyond your control?</div>
              <YesNoGate question="" value={ans.q8a} onChange={v => set("q8a", v)} />
              {ans.q8a === "yes" && (
                <div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}>
                  <SubLabel text="How often?" />
                  {FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_freq === o.value} onClick={() => set("q8a_freq", o.value)} />)}
                  <SubLabel text="How much do you leak?" />
                  {FI_SEV.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_sev === o.value} onClick={() => set("q8a_sev", o.value)} />)}
                  <SubLabel text="How much does this bother you?" />
                  {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_bother === o.value} onClick={() => set("q8a_bother", o.value)} />)}
                </div>
              )}

              <div style={{ color: C.navy, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>8B. Do you usually lose loose or liquid stool beyond your control?</div>
              <YesNoGate question="" value={ans.q8b} onChange={v => set("q8b", v)} />
              {ans.q8b === "yes" && (
                <div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}>
                  <SubLabel text="How often?" />
                  {FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_freq === o.value} onClick={() => set("q8b_freq", o.value)} />)}
                  <SubLabel text="How much do you leak?" />
                  {FI_SEV.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_sev === o.value} onClick={() => set("q8b_sev", o.value)} />)}
                  <SubLabel text="How much does this bother you?" />
                  {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_bother === o.value} onClick={() => set("q8b_bother", o.value)} />)}
                </div>
              )}

              <div style={{ color: C.navy, fontWeight: 600, fontSize: 16, marginBottom: 6 }}>8C. Do you usually lose gas from the rectum beyond your control?</div>
              <YesNoGate question="" value={ans.q8c} onChange={v => set("q8c", v)} />
              {ans.q8c === "yes" && (
                <div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}>
                  <SubLabel text="How often?" />
                  {FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8c_freq === o.value} onClick={() => set("q8c_freq", o.value)} />)}
                  <SubLabel text="How much does this bother you?" />
                  {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8c_bother === o.value} onClick={() => set("q8c_bother", o.value)} />)}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {step === 9 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q9. Do you experience a strong sense of urgency and have to rush to the bathroom for a bowel movement?</div>
          <YesNoGate question="" value={ans.q9} onChange={v => set("q9", v)} />
          {ans.q9 === "yes" && (
            <div>
              <SubLabel text="How much does this bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q9_bother === o.value} onClick={() => set("q9_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 10 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Q10. Do you usually have pain when you pass your stool?</div>
          <YesNoGate question="" value={ans.q10} onChange={v => set("q10", v)} />
          {ans.q10 === "yes" && (
            <div>
              <SubLabel text="During the last month, on average, how severe was the pain?" />
              {SEV_PAIN_LAST.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_last === o.value} onClick={() => set("q10_last", o.value)} />)}
              <SubLabel text="Rate the level of your rectal/anal pain right now." />
              {SEV_PAIN_NOW.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_now === o.value} onClick={() => set("q10_now", o.value)} />)}
              <SubLabel text="How much suffering does this cause you?" />
              {[
                { label: "None", value: "none" },
                { label: "Mild suffering", value: "mild" },
                { label: "Somewhat severe suffering", value: "somewhat" },
                { label: "Severe suffering", value: "severe" },
                { label: "Extremely severe suffering", value: "extreme" },
              ].map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_bother === o.value} onClick={() => set("q10_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 11 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q11. Does part of your bowel ever pass through the rectum and bulge outside during or after a bowel movement?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>This is known as rectal prolapse — tissue that comes out of the rectum.</div>
          <YesNoGate question="" value={ans.q11} onChange={v => set("q11", v)} />
          {ans.q11 === "yes" && (
            <div>
              <SubLabel text="How much does this bother you?" />
              {BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q11_bother === o.value} onClick={() => set("q11_bother", o.value)} />)}
            </div>
          )}
        </Card>
      )}

      {step === 12 && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Q12. During the past month, how often have you had bleeding during or after a bowel movement?</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>Due to your bowel habits.</div>
          {BLEED_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q12 === o.value} onClick={() => set("q12", o.value)} />)}
          {ans.q12 && ans.q12 !== "never" && (
            <Callout icon="🩸" color={C.red} bg={C.redLt} body="Rectal bleeding should always be evaluated by your healthcare team — please mention this at your appointment or contact your provider." />
          )}
        </Card>
      )}

      <button onClick={next} disabled={!canProceed()}
                style={{ background: canProceed() ? C.teal : C.border, color: "#fff", border: "none", fontSize: 16, opacity: canProceed() ? 1 : 0.5 }}>
        {step < totalSteps ? "Next question →" : "Complete survey ✓"}
      </button>
      {step > 1 && (
        <button onClick={() => setStep(s => s - 1)}
                    style={{ background: "none", color: C.muted, border: `1px solid ${C.border}`, fontSize: 13 }}>
          ← Back
        </button>
      )}
    </div>
  );
};

// ─── IMPACT RESULTS ───────────────────────────────────────────────────────────
const DomainBar = ({ label, icon, score, detail }) => {
  if (score === null) return null;
  const band = domainBand(score);
  const pct = (score / 4) * 100;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ color: C.navy, fontSize: 16, fontWeight: 600 }}>{icon} {label}</div>
        <div style={{ borderRadius: 20, padding: "3px 10px", background: band.bg, color: band.color, fontSize: 13, fontWeight: 700 }}>{band.label}</div>
      </div>
      <div style={{ height: 10, background: C.border, borderRadius: 5, overflow: "hidden", marginBottom: 4 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: band.color, borderRadius: 5, transition: "width 0.5s" }} />
      </div>
      {detail && <div style={{ color: C.muted, fontSize: 16, lineHeight: 1.5 }}>{detail}</div>}
    </div>
  );
};

const IMPACTResults = ({ ans, onRetake }) => {
  const bristol = summarizeBristol(ans.bristol);
  const summaryText = impactSummaryText(ans);
  const hasLeakage = ans.q8 === "yes" && (ans.q8a === "yes" || ans.q8b === "yes" || ans.q8c === "yes");
  const hasConstip = ans.q3 === "yes" || ans.q5 === "yes" || ans.q6 === "yes" || ans.q7 === "yes";
  const { constipScore, fiScore, urgScore, painScore, prolapseScore } = calcIMPACTDomains(ans);

  const hasDomainScores = [constipScore, fiScore, urgScore, painScore, prolapseScore].some(s => s !== null);

  return (
    <div>
      <div style={{ color: C.teal, fontWeight: 800, fontSize: 17, marginBottom: 4 }}>Your IMPACT Bowel Survey Results</div>
      <div style={{ color: C.muted, fontSize: 16, marginBottom: 16 }}>IMPACT Bowel Function Short Form — PFDC Consortium Endorsed</div>

      {/* Bristol stool type */}
      <Card style={{ border: `2px solid ${bristol?.color || C.border}` }}>
        <div style={{ color: C.muted, fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Stool Type (Bristol Scale)</div>
        <div style={{ color: bristol?.color || C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
          Type {ans.bristol} — {BRISTOL_TYPES.find(t => t.type === ans.bristol)?.desc}
        </div>
        {bristol && <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.5 }}>{bristol.note}</div>}
      </Card>

      {/* Domain bother scores — visual bars */}
      {hasDomainScores && (
        <Card>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Symptom Bother by Domain</div>
          <div style={{ color: C.muted, fontSize: 16, marginBottom: 16 }}>
            Based on your responses. Scale: Not bothersome → Extremely bothersome.
          </div>
          <DomainBar label="Constipation / Evacuation" icon="🚽" score={constipScore}
            detail={constipScore !== null ? `Average bother across your constipation symptoms` : null} />
          <DomainBar label="Fecal Leakage / Incontinence" icon="💧" score={fiScore}
            detail={fiScore !== null ? `Most bothersome leakage type reported` : null} />
          <DomainBar label="Urgency" icon="⚡" score={urgScore} />
          <DomainBar label="Rectal / Anal Pain" icon="😣" score={painScore} />
          <DomainBar label="Prolapse Sensation" icon="⬇️" score={prolapseScore} />
          <div style={{ color: C.muted, fontSize: 13, marginTop: 8, lineHeight: 1.5 }}>
            These domain scores are based on your bother ratings. They are not diagnostic — share them with your healthcare team.
          </div>
        </Card>
      )}

      {/* Leakage detail */}
      {hasLeakage && (
        <Card style={{ border: `2px solid ${C.coral}` }}>
          <div style={{ color: C.coral, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>💧 Leakage Detail</div>
          {ans.q8a === "yes" && <div style={{ color: C.navy, fontSize: 16, marginBottom: 4 }}>• Solid stool — {ans.q8a_freq} / bother: {ans.q8a_bother}</div>}
          {ans.q8b === "yes" && <div style={{ color: C.navy, fontSize: 16, marginBottom: 4 }}>• Liquid stool — {ans.q8b_freq} / bother: {ans.q8b_bother}</div>}
          {ans.q8c === "yes" && <div style={{ color: C.navy, fontSize: 13 }}>• Gas — {ans.q8c_freq} / bother: {ans.q8c_bother}</div>}
        </Card>
      )}

      {/* Bleeding flag */}
      {ans.q12 && ans.q12 !== "never" && (
        <Card style={{ border: `2px solid ${C.red}` }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🩸 Rectal Bleeding</div>
          <div style={{ color: C.navy, fontSize: 16, marginBottom: 6 }}>Frequency: {ans.q12}</div>
          <div style={{ color: C.red, fontSize: 16, fontWeight: 600 }}>Please make sure to mention this to your healthcare team at your appointment.</div>
        </Card>
      )}

      {/* Summary for team */}
      <Card style={{ background: C.tealLight, border: `2px solid ${C.teal}` }}>
        <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>💬 Summary for your healthcare team</div>
        <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{summaryText}</div>
      </Card>

      <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginBottom: 12 }}>
        IMPACT Bowel Function Short Form — Endorsed by ASCRS, AUGS, ICS, SUFU (Bordeianou et al., Dis Colon Rectum 2020)
      </div>

      <button onClick={onRetake}
                style={{ background: C.tealLight, color: C.teal, border: `1px solid ${C.teal}`, fontSize: 16, fontWeight: 600 }}>
        ↩ Retake survey
      </button>

      {hasLeakage && <VimeoEmbed videoId="743819969" title="Fecal Incontinence — Understanding the Condition" />}
      {hasConstip && <VimeoEmbed videoId="1175949349" title="Constipation & Dyssynergic Defecation" />}
    </div>
  );
};

const CalculatorShell = ({ title, total, max, children }) => (
  <div>
    <div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{title}</div>
    <ProgressBar value={total} max={max} />
    <div style={{ color: C.muted, fontSize: 16, textAlign: "right", marginBottom: 16 }}>Score so far: {total}/{max}</div>
    {children}
  </div>
);

const ScoreResult = ({ label, score, max, band, msg }) => (
  <Card style={{ background: C.tealLight, border: `2px solid ${band.color}` }}>
    <div style={{ textAlign: "center", marginBottom: 12 }}>
      <div style={{ color: C.muted, fontSize: 16, marginBottom: 4 }}>{label}</div>
      <div style={{ color: band.color, fontSize: 48, fontWeight: 900, lineHeight: 1 }}>{score}</div>
      <div style={{ color: C.muted, fontSize: 12 }}>out of {max}</div>
      <div style={{ display: "inline-block", borderRadius: 20, padding: "4px 12px", marginTop: 8 }} style={{ background: band.color, color: "#fff", fontSize: 16, fontWeight: 700 }}>{band.label}</div>
    </div>
    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6, marginBottom: 10 }}>{msg}</div>
    <Callout icon="💬" body="This score is a starting point for conversation — not a diagnosis. Share it with your healthcare team." color={C.slate} bg="#f0f4f8" />
  </Card>
);

const CalculatorsSection = ({ scores, setScores, primarySymptom, setPrimarySymptom }) => {
  const [active, setActive] = useState("primary");
  const [impactAnswers, setImpactAnswers] = useState(null); // null = not started, {} = in progress, completed = has answers
  const [impactDone, setImpactDone] = useState(false);
  const [surgRisk, setSurgRisk] = useState([]);
  const [recRisk, setRecRisk] = useState([]);

  const SURG_RISKS = ["Age over 75", "Active heart disease or recent cardiac event", "Poorly controlled diabetes", "BMI over 35", "Active smoking", "Severe lung disease (COPD, requiring oxygen)", "Kidney disease", "Prior pelvic or abdominal radiation", "Blood thinning medications", "Prior abdominal surgery with complications"];
  const REC_RISKS = [
    { id: "prior", label: "Prior rectal prolapse repair", why: "Previous repair is one of the strongest predictors of recurrence. Scar tissue affects tissue quality and repair durability." },
    { id: "age80", label: "Age over 80", why: "Connective tissue weakens with age; supporting structures are less able to hold a repair long-term." },
    { id: "hypermobility", label: "Connective tissue disorder / joint hypermobility", why: "People with generalized connective tissue laxity (Ehlers-Danlos, etc.) have higher recurrence risk — not due to anything they did, but a biological difference in tissue quality." },
    { id: "straining", label: "Chronic straining / constipation", why: "Ongoing straining puts direct mechanical pressure on the surgical site. This is one of the most modifiable recurrence risk factors. Optimizing bowel habits before surgery significantly improves outcomes." },
    { id: "obesity", label: "BMI ≥ 30", why: "Excess intra-abdominal pressure works against the repair over time. Even modest weight loss before surgery can meaningfully reduce pressure." },
  ];

  const SYMPTOM_OPTS = [
    { id: "incontinence", label: "💧 Leakage or inability to control stool or gas (fecal incontinence)" },
    { id: "ods", label: "🚽 Difficulty emptying / straining / incomplete evacuation (obstructed defecation)" },
    { id: "constipation", label: "📉 Infrequent bowel movements / constipation" },
    { id: "prolapse", label: "⬇️ Sensation of bulging, pressure, or tissue coming out" },
    { id: "multiple", label: "⚖️ Multiple symptoms equally — hard to pick one" },
  ];

  const tabs = [
    { id: "primary", label: "Primary Symptom" },
    { id: "impact", label: "Bowel Survey" },
    { id: "surgical", label: "Surgical Risk" },
    { id: "recurrence", label: "Recurrence Risk" },
  ];

  const handleImpactComplete = (ans) => {
    setImpactAnswers(ans);
    setImpactDone(true);
    setScores(prev => ({ ...prev, impact: ans, impactDone: true }));
  };

  return (
    <div>
      <SectionHeader title="My Symptom Scores" subtitle="These validated tools help you and your team understand your symptoms." />
      <Callout icon="📋" body="Complete these questionnaires before your appointment. Your answers give your healthcare team a clear, objective picture of your symptom burden — and help you have a more productive conversation." />
      <TabBar tabs={tabs} active={active} onChange={setActive} />

      {active === "primary" && (
        <div>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>What bothers you most?</div>
          <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
            Before completing the questionnaires, it helps to identify which symptom is affecting your quality of life the most. Your most bothersome symptom matters — especially if you're considering surgery.
          </div>
          {SYMPTOM_OPTS.map(o => (
            <button key={o.id} onClick={() => setPrimarySymptom(o.id)}
                            style={{ background: primarySymptom === o.id ? C.tealLight : C.card, border: `2px solid ${primarySymptom === o.id ? C.teal : C.border}` }}>
              <div  style={{ width: 22, height: 22, border: `2px solid ${primarySymptom === o.id ? C.teal : C.border}`, background: primarySymptom === o.id ? C.teal : "transparent" }} />
              <span style={{ color: C.navy, fontSize: 16, lineHeight: 1.4 }}>{o.label}</span>
            </button>
          ))}
          {primarySymptom && (
            <Callout icon="💡" title="Why this matters" color={C.teal} bg={C.tealLight} body={
              primarySymptom === "incontinence" ? "Leakage and incontinence symptoms have a stronger response to surgical repair. This is an important framing for your pre-op conversation."
              : primarySymptom === "ods" || primarySymptom === "constipation" ? "Constipation and difficult evacuation improve in approximately 60–70% of patients after surgical repair — meaning some patients may not see improvement. A frank conversation about realistic expectations is essential."
              : primarySymptom === "prolapse" ? "Surgical repair directly addresses the structural problem of prolapse. Functional symptoms (bowel habits, continence) may follow their own trajectory."
              : "You're experiencing several significant symptoms. The survey below will help capture your full picture — bringing these results to your appointment gives your team a comprehensive view."
            } />
          )}
          {primarySymptom && (
            <button onClick={() => setActive("impact")}
                            style={{ background: C.teal, color: "#fff", border: "none", fontSize: 14 }}>
              Continue to Bowel Survey →
            </button>
          )}
        </div>
      )}

      {active === "impact" && (
        <div>
          <Callout body="This is the IMPACT Bowel Function Short Form — the same validated questionnaire used in research and endorsed by the Pelvic Floor Disorders Consortium. Your answers will be private and shared only when you choose." icon="🔬" />
          {impactDone && impactAnswers
            ? <IMPACTResults ans={impactAnswers} onRetake={() => { setImpactDone(false); setImpactAnswers(null); }} />
            : <IMPACTSurvey onComplete={handleImpactComplete} />
          }
        </div>
      )}

      {active === "surgical" && (
        <div>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Pre-Op Surgical Risk Checklist</div>
          <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>Select any factors that apply to you. This is not a validated risk score — it's an educational checklist to help you start an informed conversation with your surgeon.</div>
          {SURG_RISKS.map(r => (
            <button key={r} onClick={() => setSurgRisk(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])}
                            style={{ background: surgRisk.includes(r) ? C.tealLight : C.card, border: `1.5px solid ${surgRisk.includes(r) ? C.teal : C.border}`, minHeight: 54 }}>
              <div style={{ width: 20, height: 20, border: `2px solid ${surgRisk.includes(r) ? C.teal : C.border}`, background: surgRisk.includes(r) ? C.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {surgRisk.includes(r) && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
              </div>
              <span style={{ color: C.navy, fontSize: 13 }}>{r}</span>
            </button>
          ))}
          <Card style={{ background: C.tealLight, marginTop: 8 }}>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{surgRisk.length === 0 ? "✅ No risk factors identified" : `${surgRisk.length} factor${surgRisk.length > 1 ? "s" : ""} identified`}</div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>
              {surgRisk.length === 0 ? "Reassuring — your team will do their own full assessment." : surgRisk.length <= 2 ? "These are worth discussing with your surgical team so they can plan accordingly." : "Your surgeon will want to know about these and may recommend additional pre-operative preparation."}
            </div>
          </Card>
          <Callout body='Your surgeon uses the ACS NSQIP Surgical Risk Calculator to estimate your personal complication risk. Sharing this checklist with them is a great way to start that conversation.' icon="🏥" />
        </div>
      )}

      {active === "recurrence" && (
        <div>
          <Callout body="Rectal prolapse can come back after surgery — and knowing your risk factors helps you and your surgeon make the best plan. Some factors can be improved before surgery." icon="🔄" />
          {REC_RISKS.map(r => (
            <div key={r.id}>
              <button onClick={() => setRecRisk(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])}
                                style={{ background: recRisk.includes(r.id) ? C.coralLt : C.card, border: `1.5px solid ${recRisk.includes(r.id) ? C.coral : C.border}`, minHeight: 54 }}>
                <div style={{ width: 20, height: 20, border: `2px solid ${recRisk.includes(r.id) ? C.coral : C.border}`, background: recRisk.includes(r.id) ? C.coral : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {recRisk.includes(r.id) && <span style={{ color: "#fff", fontSize: 12 }}>✓</span>}
                </div>
                <span style={{ color: C.navy, fontSize: 13 }}>{r.label}</span>
              </button>
              {recRisk.includes(r.id) && (
                <div style={{ background: C.coralLt, border: `1px solid ${C.coral}44` }}>
                  <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6 }}>{r.why}</div>
                  {(r.id === "straining" || r.id === "obesity") && <div style={{ color: C.coral, fontSize: 16, fontWeight: 700, marginTop: 4 }}>⭐ This factor may be improvable before surgery. Ask your team.</div>}
                </div>
              )}
            </div>
          ))}
          <Card style={{ background: C.tealLight }}>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{recRisk.length} factor{recRisk.length !== 1 ? "s" : ""} identified</div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>Every person's recurrence risk is different. Bring this checklist to your appointment — the more your team knows, the better they can plan with you.</div>
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── SURGICAL ────────────────────────────────────────────────────────────────
const SurgicalSection = () => {
  const [tab, setTab] = useState("rectopexy");
  const [meshPref, setMeshPref] = useState(null);
  const tabs = [
    { id: "rectopexy", label: "Rectopexy" },
    { id: "expectations", label: "What to Expect" },
    { id: "mesh", label: "Mesh Education" },
    { id: "questions", label: "Questions to Ask" },
  ];

  return (
    <div>
      <SectionHeader title="Surgical Education" subtitle="If surgery has been recommended, understanding what's involved helps you feel prepared and ask better questions." />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {tab === "rectopexy" && (
        <div>
          <Callout body="If your surgeon has recommended surgery for rectal prolapse, understanding what's involved can help you feel more prepared and ask better questions." icon="🏥" />
          <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>
            <strong>Rectopexy</strong> is one of the most common surgical approaches to rectal prolapse. The rectum is secured (fixed) to the sacrum (tailbone) to prevent it from prolapsing. It can usually be done laparoscopically (keyhole surgery) or robotically.
          </div>
          <p style={{ color: C.navy, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>▶ Watch this animation</p>
          <VimeoEmbed videoId="1180494424" title="Rectopexy Surgical Animation" />
          <Card>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>General recovery themes</div>
            {["Hospital stay varies by approach and individual", "Bowel function may be temporarily altered after surgery", "Pelvic floor PT is often recommended post-operatively", "Lifestyle optimization (fiber, straining avoidance) remains important after repair", "Symptoms should be reassessed at follow-up — improvement may be gradual"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ color: C.teal }}>→</div>
                <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{t}</div>
              </div>
            ))}
          </Card>
          <div style={{ color: C.muted, fontSize: 16, textAlign: "center" }}>This app does not recommend which approach is right for any individual. That decision is made with your surgical team.</div>
        </div>
      )}

      {tab === "expectations" && (
        <div>
          <Callout icon="⭐" title="One of the most important things to understand" color={C.coral} bg={C.coralLt} body="Fixing the anatomy does not guarantee fixing the function. This is something your surgical team should discuss with you openly before any procedure." />
          {[
            { title: "Fecal Incontinence", icon: "💧", good: true, body: "Surgery for rectal prolapse is more likely to result in meaningful improvement in fecal incontinence symptoms. If leakage, urgency, or inability to control gas or stool is your most bothersome symptom, repair has a stronger track record of helping." },
            { title: "Constipation & Difficult Evacuation", icon: "🚽", good: false, body: "Improvement in constipation and obstructed defecation after prolapse repair is less predictable. Approximately 60–70% of patients see improvement — which means 30–40% may not, and some may find these symptoms unchanged or even temporarily worse after surgery. If straining or incomplete evacuation is your primary complaint, it is essential to discuss this honestly with your surgeon before proceeding." },
          ].map(s => (
            <Card key={s.title} style={{ border: `2px solid ${s.good ? C.teal : C.warn}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{s.icon}</span>
                <div style={{ color: C.navy, fontWeight: 700, fontSize: 15 }}>{s.title}</div>
                <div style={{ background: s.good ? C.tealLight : C.warnLt, color: s.good ? C.teal : C.warn, fontSize: 13, fontWeight: 700 }}>{s.good ? "More predictable" : "Less predictable"}</div>
              </div>
              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7 }}>{s.body}</div>
            </Card>
          ))}
          <Card style={{ background: C.tealLight, border: `2px solid ${C.teal}` }}>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>⭐ Before surgery, make sure you have discussed:</div>
            {["Which symptom bothers you most (incontinence vs. constipation vs. prolapse sensation)", "What the realistic likelihood of improvement is for that specific symptom", "What happens if symptoms don't improve after repair", "What non-surgical options remain available if surgery is not fully effective"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <div style={{ color: C.teal, flexShrink: 0 }}>✓</div>
                <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{t}</div>
              </div>
            ))}
          </Card>
          <Callout body="If your repair doesn't completely resolve symptoms, that is not a failure — it means your body needs additional support. Pelvic floor PT, lifestyle optimization, and follow-up care all remain part of the picture." icon="💙" />
        </div>
      )}

      {tab === "mesh" && (
        <div>
          <Callout body="Not all rectopexy procedures use mesh. Your surgeon will explain which approach is being recommended for you and why. The information below supports an informed conversation." icon="ℹ️" />
          <Card>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>What is mesh and why is it used?</div>
            <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7 }}>Mesh is a material used in some rectopexy procedures to reinforce the repair and secure the rectum in its correct position. Mesh used in rectal prolapse surgery is different from mesh used in vaginal prolapse repair. The complication profile and evidence base are distinct and should be discussed specifically with your surgical team.</div>
          </Card>
          {[
            { type: "Synthetic Mesh", icon: "🔩", desc: "Made from permanent synthetic material (such as polypropylene). Durable and widely used.", erosion: "~1.8% erosion rate in large studies", recurrence: "~3.7% at follow-up", color: C.navyMid },
            { type: "Biologic Mesh", icon: "🧬", desc: "Made from processed animal or human tissue. Gradually absorbed and replaced by the body's own tissue over time.", erosion: "~0.7% erosion rate in large studies", recurrence: "~4.0% at follow-up", color: C.teal },
            { type: "Suture Rectopexy (No Mesh)", icon: "🪡", desc: "The rectum is secured using sutures alone — no mesh material is implanted. A valid surgical option for many patients.", erosion: "No mesh — no erosion risk", recurrence: "Comparable outcomes in many studies", color: C.sage },
          ].map(m => (
            <Card key={m.type}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{m.icon}</span>
                <div style={{ color: m.color, fontWeight: 700, fontSize: 14 }}>{m.type}</div>
              </div>
              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>{m.desc}</div>
              <div>
                <div><div style={{ color: C.muted, fontSize: 13, textTransform: "uppercase" }}>Erosion</div><div style={{ color: C.navy, fontSize: 16, fontWeight: 600 }}>{m.erosion}</div></div>
                <div><div style={{ color: C.muted, fontSize: 13, textTransform: "uppercase" }}>Recurrence</div><div style={{ color: C.navy, fontSize: 16, fontWeight: 600 }}>{m.recurrence}</div></div>
              </div>
            </Card>
          ))}
          <Callout icon="⏰" color={C.warn} bg={C.warnLt} title="Important timing note" body="When mesh erosion does occur, it typically appears years after surgery — requiring long-term follow-up with your surgical team." />
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>My mesh preference for discussion:</div>
          {[
            { id: "discuss", label: "I would like to discuss mesh options with my surgeon" },
            { id: "avoid", label: "I would prefer to discuss suture rectopexy (no mesh) as an option" },
            { id: "open", label: "I am open to whatever my surgeon recommends" },
          ].map(o => (
            <button key={o.id} onClick={() => setMeshPref(o.id)}
                            style={{ background: meshPref === o.id ? C.tealLight : C.card, border: `1.5px solid ${meshPref === o.id ? C.teal : C.border}`, minHeight: 54 }}>
              <div  style={{ width: 20, height: 20, border: `2px solid ${meshPref === o.id ? C.teal : C.border}`, background: meshPref === o.id ? C.teal : "transparent" }} />
              <span style={{ color: C.navy, fontSize: 13 }}>{o.label}</span>
            </button>
          ))}
          {meshPref && <Callout body="This preference will be noted for your appointment discussion." icon="📋" />}
        </div>
      )}

      {tab === "questions" && (
        <div>
          <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>Empowered patients get better care. Use this list to prepare for your surgical consultation:</div>
          {[
            "What type of rectopexy are you recommending and why?",
            "Will mesh be used? What are the implications of each option for my situation?",
            "What is the expected recurrence rate for my specific situation?",
            "My most bothersome symptom is [incontinence / constipation / prolapse] — how likely is surgery to improve this specifically?",
            "What happens to my bowel function after surgery?",
            "What if my bowel symptoms don't improve after repair — what options remain?",
            "What should I do before surgery to optimize my outcome?",
            "What does recovery look like, and when can I return to normal activity?",
            "Should I see a pelvic floor physical therapist before or after surgery?",
            "What is your personal experience and complication rate with this procedure?",
          ].map((q, i) => (
            <Card key={i}>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flexShrink: 0 }} style={{ color: C.teal, fontWeight: 800, fontSize: 14 }}>Q{i + 1}</div>
                <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{q}</div>
              </div>
            </Card>
          ))}
          <Callout body="Surgery is one part of the picture. The lifestyle work — fiber, movement, pelvic floor PT, stress management — remains important before and after any procedure." icon="🌿" />
        </div>
      )}
    </div>
  );
};

// ─── RED FLAGS ────────────────────────────────────────────────────────────────
const RedFlagsSection = () => (
  <div>
    <SectionHeader title="Red Flags — When to Seek Care" subtitle="Calm and directive guidance for symptoms that need prompt attention." />
    <Callout icon="💙" body="This section is not meant to alarm you — it's meant to keep you safe. Most pelvic floor symptoms are not emergencies. But some warrant prompt attention, and knowing the difference matters." />
    {[
      { icon: "🩸", label: "Rectal Bleeding", desc: "New bleeding, blood mixed with stool, dark tarry stool, or significant fresh blood. Do not assume it's always related to hemorrhoids or prolapse without evaluation.", urgency: "Contact your healthcare team or seek care today" },
      { icon: "⚖️", label: "Unexplained Weight Loss", desc: "Significant unintentional weight loss combined with bowel changes deserves prompt evaluation.", urgency: "Contact your healthcare team" },
      { icon: "🔄", label: "Sudden Change in Bowel Habits", desc: "A persistent change in bowel habit lasting more than 3 weeks (new constipation, diarrhea, or change in stool caliber) without clear cause.", urgency: "Contact your healthcare team" },
      { icon: "🚫", label: "Tissue That Cannot Be Reduced", desc: "If tissue is prolapsed outside the body and cannot be gently pushed back in, or if it becomes dark, purple, or extremely swollen.", urgency: "Seek emergency care immediately" },
      { icon: "😣", label: "Severe Pain", desc: "New or severe anorectal pain, especially if combined with fever or inability to have a bowel movement.", urgency: "Seek emergency care or contact your team immediately" },
      { icon: "🌡️", label: "Fever with Anorectal Symptoms", desc: "Fever combined with anorectal pain, swelling, or discharge may indicate infection that requires urgent treatment.", urgency: "Seek emergency care or contact your team immediately" },
    ].map(f => (
      <Card key={f.label} style={{ border: `2px solid ${C.red}44` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 26 }}>{f.icon}</span>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 15 }}>{f.label}</div>
        </div>
        <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6, marginBottom: 8 }}>{f.desc}</div>
        <div style={{ background: C.redLt }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 12 }}>Action: {f.urgency}</div>
        </div>
      </Card>
    ))}
    <Card style={{ background: C.navyMid }}>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>When in doubt</div>
      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.6 }}>If you're unsure whether a symptom is a red flag, it's always better to contact your healthcare team than to wait. You know your body — trust that instinct.</div>
    </Card>
  </div>
);

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are a warm, knowledgeable patient education assistant for a pelvic floor health app created by a colorectal surgeon specializing in rectal prolapse, bowel dysfunction, and pelvic floor health at Stanford.

Your role is to educate patients about pelvic floor health, bowel dysfunction, rectal prolapse, fecal incontinence, constipation, obstructed defecation, imaging tests, lifestyle medicine, and surgical options in general terms. Help patients prepare thoughtful questions for their appointments.

This app uses the IMPACT Bowel Function Short Form — the validated questionnaire endorsed by the Pelvic Floor Disorders Consortium (ASCRS, AUGS, ICS, SUFU). It captures Bristol Stool type, constipation symptoms, fecal incontinence, urgency, pain, prolapse sensation, and bleeding. You can explain what this survey measures if patients ask.

Use warm, plain, empowering language. Normalize symptoms. Never use jargon without explanation.

You must NEVER diagnose any individual patient, recommend specific medications by name, recommend a specific surgical procedure for an individual, or interpret a patient's own test results.

For all clinical decisions, close with: "This is something your healthcare team can help you with — they know your full picture."

If a patient describes urgent symptoms (rectal bleeding, severe pain, tissue that won't go back in, fever with anorectal symptoms), immediately say: "These symptoms deserve prompt attention. Please contact your healthcare team or seek care today — don't wait."

Keep responses concise — 2–4 sentences for most answers. Then ask: "Would you like to know more?" to invite follow-up.

Tone: warm, knowledgeable, unhurried, empowering, never shaming or condescending.`;

const RED_FLAG_KEYWORDS = ["bleeding", "blood", "can't push back", "stuck outside", "severe pain", "fever", "emergency", "purple", "dark", "not going back"];

const Chatbot = ({ appState, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const bottomRef = useRef(null);

  const starters = [
    "What is the difference between internal and external prolapse?",
    "Why do I feel like I can't empty fully?",
    "What questions should I ask my surgeon about rectopexy?",
    "How does diet affect my pelvic floor?",
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const buildContext = () => {
    const lines = [];
    if (appState.section) lines.push(`Patient is in the "${appState.section}" section.`);
    if (appState.primarySymptom) lines.push(`Primary bothersome symptom: ${appState.primarySymptom}.`);
    return lines.length ? `\n\nPATIENT CONTEXT (use to personalize — do not repeat back verbatim):\n${lines.join("\n")}` : "";
  };

  const send = async (text) => {
    if (!text.trim()) return;
    setShowStarters(false);
    const isRedFlag = RED_FLAG_KEYWORDS.some(k => text.toLowerCase().includes(k));
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT + buildContext(),
          messages: newMessages,
        }),
      });
      const data = await res.json();
      let reply = data.content?.[0]?.text || "I'm sorry, I couldn't process that response.";
      if (isRedFlag) reply = "⚠️ What you're describing may need prompt attention. Please contact your healthcare team today or go to an emergency department if you're unsure. Don't wait.\n\n" + reply;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        <div style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div style={{ color: C.navy, fontWeight: 700, fontSize: 16 }}>Ask Our Team</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Here to educate — not to diagnose</div>
          </div>
          <button onClick={onClose} style={{ fontSize: 22, color: C.muted, background: "none", border: "none" }}>✕</button>
        </div>
        <div style={{ background: C.warnLt, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.slate, fontSize: 12 }}>I'm here to help you learn and prepare — not to diagnose or replace your healthcare team. For urgent symptoms, contact your provider directly.</div>
        </div>
        <div style={{ minHeight: 200 }}>
          {showStarters && messages.length === 0 && (
            <div>
              <div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>Ask me anything, or choose a topic:</div>
              {starters.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{ background: C.tealLight, border: `1px solid ${C.teal}33`, color: C.teal, fontSize: 13 }}>{s}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                maxWidth: "85%",
                background: m.role === "user" ? C.teal : C.tealLight,
                color: m.role === "user" ? "#fff" : C.navy,
                fontSize: 16, lineHeight: 1.7,
                borderBottomRightRadius: m.role === "user" ? 4 : 16,
                borderBottomLeftRadius: m.role === "user" ? 16 : 4,
              }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div>
              <div style={{ background: C.tealLight, color: C.muted, fontSize: 13 }}>Thinking…</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
              placeholder="Ask a question…" style={{ background: C.bg, border: `1.5px solid ${C.border}`, fontSize: 16, color: C.navy, minHeight: 54 }} />
            <button onClick={() => send(input)} disabled={!input.trim() || loading} style={{ background: C.teal, color: "#fff", border: "none", minHeight: 54, minWidth: 52, opacity: (!input.trim() || loading) ? 0.5 : 1, fontSize: 20 }}>↑</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PRINT / PDF SUMMARY ──────────────────────────────────────────────────────
const PrintSummary = ({ scores, primarySymptom, surgRisk = [], recRisk = [] }) => {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div id="print-summary" style={{ fontFamily: "Georgia, serif", maxWidth: 700, margin: "0 auto", padding: 32, color: "#1a2e3b" }}>
      <div style={{ textAlign: "center", marginBottom: 32, borderBottom: "2px solid #2d7d6f", paddingBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#2d7d6f" }}>REPAIR</div>
        <div style={{ fontSize: 16, color: "#4a6278" }}>Pre-Appointment Summary</div>
        <div style={{ fontSize: 16, color: "#7a8fa6", marginTop: 4 }}>Prepared: {now} · For discussion with your healthcare team — not a medical record</div>
      </div>
      {primarySymptom && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>1. My Primary Bothersome Symptom</div>
          <div style={{ fontSize: 16, color: "#1a2e3b" }}>The symptom that bothers me most: <strong>{primarySymptom}</strong></div>
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>2. My Bowel Survey (IMPACT)</div>
        {scores.impactDone
          ? <div>
              <div style={{ fontSize: 16, color: "#1a2e3b", lineHeight: 1.6, marginBottom: 10 }}>{impactSummaryText(scores.impact)}</div>
              {(() => {
                const d = calcIMPACTDomains(scores.impact);
                const rows = [
                  { label: "Constipation / Evacuation", icon: "🚽", score: d.constipScore },
                  { label: "Fecal Leakage / Incontinence", icon: "💧", score: d.fiScore },
                  { label: "Urgency", icon: "⚡", score: d.urgScore },
                  { label: "Rectal / Anal Pain", icon: "😣", score: d.painScore },
                  { label: "Prolapse Sensation", icon: "⬇️", score: d.prolapseScore },
                ].filter(r => r.score !== null);
                if (rows.length === 0) return null;
                return (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#4a6278", marginBottom: 6 }}>Domain Bother Scores (0 = none, 4 = extreme):</div>
                    {rows.map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginBottom: 4, padding: "4px 0", borderBottom: "1px solid #eee" }}>
                        <span style={{ color: "#1a2e3b" }}>{r.icon} {r.label}</span>
                        <span style={{ fontWeight: 700, color: r.score >= 3 ? "#c0392b" : r.score >= 2 ? "#f4a261" : "#2d7d6f" }}>{r.score}/4 — {domainBand(r.score).label}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          : <div style={{ color: "#7a8fa6", fontSize: 13 }}>IMPACT Bowel Function Survey not yet completed. Complete it in the 'Scores' section.</div>
        }
      </div>
      <div style={{ fontSize: 13, color: "#7a8fa6", textAlign: "center", marginTop: 32, borderTop: "1px solid #dde7ef", paddingTop: 16 }}>
        This document was generated by REPAIR, a patient education app from Stanford Colorectal Surgery. It is for educational purposes only and does not constitute medical advice or a medical record.
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scores, setScores] = useState({});
  const [primarySymptom, setPrimarySymptom] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const { speak, stop, speaking } = useReadAloud();

  const getPageText = () => {
    const el = document.getElementById("main-content");
    return el ? el.innerText : "";
  };

  const currentNav = NAV.find(n => n.id === section);

  const appState = { section, primarySymptom, scores };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "'Georgia', serif" }}>
      {/* TOP BAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: C.card, borderBottom: `1px solid ${C.border}`, padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", fontSize: 22, color: C.navy }}>☰</button>
          <div style={{ color: C.teal, fontWeight: 800, fontSize: 18 }}>🌿 REPAIR</div>
          <div style={{ width: 32 }} />
        </div>
        {section !== "home" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <button onClick={() => setSection("home")} style={{ background: "none", border: "none", color: C.muted, fontSize: 12 }}>Home</button>
            <span style={{ color: C.muted, fontSize: 12 }}>›</span>
            <span style={{ color: C.teal, fontSize: 16, fontWeight: 600 }}>{currentNav?.label}</span>
          </div>
        )}
      </div>

      {/* MENU DRAWER */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: C.card, padding: "48px 0 24px", overflowY: "auto" }}>
            <div style={{ padding: "0 24px 16px" }}>
              <div style={{ color: C.teal, fontWeight: 800, fontSize: 20 }}>🌿 REPAIR</div>
              <div style={{ color: C.muted, fontSize: 16, marginTop: 2 }}>Stanford Colorectal Surgery</div>
            </div>
            {NAV.map(n => (
              <button key={n.id} onClick={() => { setSection(n.id); setMenuOpen(false); }} style={{ background: section === n.id ? C.tealLight : "transparent", borderLeft: section === n.id ? `3px solid ${C.teal}` : "3px solid transparent", color: section === n.id ? C.teal : C.navy, fontWeight: section === n.id ? 700 : 400, fontSize: 15 }}>
                <span>{n.icon}</span><span>{n.label}</span>
              </button>
            ))}
            <div>
              <button onClick={() => { setShowPDF(true); setMenuOpen(false); }} style={{ background: C.tealLight, color: C.teal, border: "none", fontSize: 14 }}>
                📄 Generate My Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF SUMMARY */}
      {showPDF && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: C.bg, overflowY: "auto" }}>
          <div style={{ padding: 16 }}>
            <div>
              <div style={{ color: C.navy, fontWeight: 700, fontSize: 16 }}>Pre-Appointment Summary</div>
              <button onClick={() => setShowPDF(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 20 }}>✕</button>
            </div>
            <Callout body="Print or screenshot this page to bring to your appointment. Share it with your healthcare team — it helps them understand your full picture quickly." icon="📋" />
            <Btn onClick={() => window.print()}>🖨️ Print / Save as PDF</Btn>
            <PrintSummary scores={scores} primarySymptom={primarySymptom} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div style={{ padding: 18, paddingBottom: 120 }}>
        {section === "home" && <HomeSection onNav={setSection} />}
        {section === "prolapse" && <ProlapseSection />}
        {section === "symptoms" && <SymptomsSection />}
        {section === "imaging" && <ImagingSection />}
        {section === "lifestyle" && <LifestyleSection />}
        {section === "calculators" && <CalculatorsSection scores={scores} setScores={setScores} primarySymptom={primarySymptom} setPrimarySymptom={setPrimarySymptom} />}
        {section === "surgical" && <SurgicalSection />}
        {section === "redflags" && <RedFlagsSection />}
      </div>

      {/* BOTTOM NAV (key sections) */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "calculators", icon: "📊", label: "Scores" },
          { id: "surgical", icon: "🏥", label: "Surgery" },
          { id: "redflags", icon: "🚨", label: "Red Flags" },
        ].map(n => (
          <button key={n.id} onClick={() => setSection(n.id)} style={{ background: "none", border: "none", color: section === n.id ? C.teal : C.muted }}>
            <span style={{ fontSize: 22 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: section === n.id ? 700 : 400 }}>{n.label}</span>
          </button>
        ))}
        <button onClick={() => setChatOpen(true)} style={{ background: "none", border: "none", color: C.coral }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: C.teal, letterSpacing: 0.2 }}>Ask Our Team</span>
        </button>
      </div>

      {/* READ ALOUD BUTTON */}
      {!chatOpen && !menuOpen && !showPDF && (
        <ReadAloudBtn
          speaking={speaking}
          onSpeak={() => speaking ? stop() : speak(getPageText())}
        />
      )}

      {/* CHATBOT */}
      {chatOpen && <Chatbot appState={appState} onClose={() => setChatOpen(false)} />}
    </div>
  );
}
