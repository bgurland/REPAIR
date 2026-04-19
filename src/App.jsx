import { useState, useRef, useEffect } from "react";

// ─── VIMEO EMBED ─────────────────────────────────────────────────────────────
const VIMEO_URLS = {
  "743819969":  "https://vimeo.com/743819969/0ab020862e",
  "743821060":  "https://vimeo.com/743821060",
  "1175949349": "https://vimeo.com/1175949349",
  "1180494424": "https://vimeo.com/1180494424",
};

const VimeoEmbed = ({ videoId, title }) => (
  <div style={{ margin: "16px 0" }}>
    <a href={VIMEO_URLS[videoId] || `https://vimeo.com/${videoId}`} target="_blank" rel="noopener noreferrer" style={{ display: "block", textDecoration: "none" }}>
      <div style={{ background: "linear-gradient(135deg, #1a2e3b, #2d7d6f)", padding: "32px 16px", cursor: "pointer", position: "relative", overflow: "hidden", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "absolute", width: 140, height: 140, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", top: -30, right: -30 }} />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 28, marginLeft: 4 }}>▶</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{title}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Tap to watch on Vimeo ↗</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 20, padding: "6px 16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>Open video</span>
        </div>
      </div>
    </a>
  </div>
);

// ─── COLORS ──────────────────────────────────────────────────────────────────
const C = {
  teal: "#2d7d6f", tealLight: "#e8f5f2", tealMid: "#4a9d8f",
  tealDeep: "#1f5a50",
  sage: "#6b8f71", sageLt: "#eef4ef",
  coral: "#e07a5f", coralLt: "#fdf1ee",
  navy: "#1a2e3b", navyMid: "#2c4a5e",
  slate: "#4a6278", muted: "#7a8fa6",
  bg: "#f6f4ef", card: "#ffffff", border: "#e4ded4", borderSoft: "#ede8df",
  warn: "#f4a261", warnLt: "#fff7ee",
  red: "#c0392b", redLt: "#fdf0ef",
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", ...style }}>
    {children}
  </div>
);

const Callout = ({ icon, title, body, color = C.teal, bg = C.tealLight }) => (
  <div style={{ background: bg, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
    {icon && <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>}
    {title && <div style={{ fontWeight: 600, marginBottom: 4, color, fontSize: 16 }}>{title}</div>}
    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{body}</div>
  </div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div style={{ marginBottom: 24 }}>
    <h2 style={{ color: C.navy, fontSize: 22, fontWeight: 700, lineHeight: 1.2 }}>{title}</h2>
    {subtitle && <p style={{ color: C.muted, fontSize: 16, marginTop: 4 }}>{subtitle}</p>}
  </div>
);

const ProgressBar = ({ value, max, color = C.teal }) => (
  <div style={{ height: 8, background: C.border, borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
    <div style={{ width: `${Math.round((value / max) * 100)}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.3s" }} />
  </div>
);

const Btn = ({ children, onClick, variant = "primary", disabled = false, style: extra = {} }) => {
  const s = {
    primary: { background: C.teal, color: "#fff", border: "none" },
    secondary: { background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}` },
    ghost: { background: C.tealLight, color: C.teal, border: "none" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ fontSize: 17, minHeight: 54, borderRadius: 14, padding: "12px 20px", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", width: "100%", fontFamily: "Georgia, serif", opacity: disabled ? 0.5 : 1, ...s[variant], ...extra }}>
      {children}
    </button>
  );
};

// ─── PRIVACY NOTE ─────────────────────────────────────────────────────────────
const PrivacyNote = ({ context = "default" }) => {
  const msgs = {
    home: "What you do here is yours. Nothing is saved, nothing is shared, and no one sees your answers unless you choose to show them.",
    survey: "Your answers stay on your device. Nothing is stored or sent anywhere unless you decide to print or share your summary.",
    results: "These results are private. They're yours to keep, share with your doctor, or discard — entirely your choice.",
    chat: "Your conversation is private and isn't recorded or saved after you close this window.",
  };
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#f0f7f5", border: `1px solid ${C.teal}33`, borderRadius: 12, padding: "10px 14px", marginBottom: 16 }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>🔒</span>
      <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.5 }}>{msgs[context] || msgs.home}</div>
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "prolapse", label: "Understanding Prolapse", icon: "📖" },
  { id: "symptoms", label: "Symptoms & My Score", icon: "🔍" },
  { id: "imaging", label: "Pelvic Floor Testing", icon: "🩻" },
  { id: "lifestyle", label: "Lifestyle", icon: "🥦" },
  { id: "surgical", label: "Considering Surgery", icon: "🏥" },
  { id: "redflags", label: "Red Flags", icon: "🚨" },
];

// ── TEXT TO SPEECH ───────────────────────────────────────────────────────────
const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);
  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    const clean = text.replace(/[🌿📖🔍🩻🥦📊🏥🚨💬🌱💙⚠️🔄🚫😣🌡️🩸⚖️✓→•🔬💧🚽⬇️⚡🫁📋🔒📅]/gu, "").replace(/\s+/g, " ").trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.9; utterance.pitch = 1; utterance.lang = "en-US";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => ["Samantha", "Karen", "Daniel", "Alex"].some(n => v.name.includes(n))) || voices.find(v => v.lang === "en-US" && v.localService) || voices[0];
      if (preferred) utterance.voice = preferred;
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
    };
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { trySpeak(); } else { window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.onvoiceschanged = null; trySpeak(); }; }
  };
  const stop = () => { window.speechSynthesis?.cancel(); setSpeaking(false); };
  return { speak, stop, speaking };
};

const SpeakBtn = ({ speaking, onSpeak }) => (
  <button onClick={onSpeak} style={{ background: speaking ? C.teal : C.tealLight, color: speaking ? "#fff" : C.teal, border: `1.5px solid ${C.teal}`, borderRadius: 20, padding: "6px 14px", fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
    <span>{speaking ? "⏹" : "🔊"}</span><span>{speaking ? "Stop" : "Read aloud"}</span>
  </button>
);

// ─── V2 CREDENTIALS STRIP ────────────────────────────────────────────────────
const CredentialsStrip = () => (
  <div style={{ background: C.tealDeep, color: "#fff", padding: "10px 16px", fontSize: 12.5, lineHeight: 1.4, textAlign: "center", letterSpacing: 0.2, flexShrink: 0 }}>
    Built by <span style={{ color: "#c8ebe3", fontWeight: 700, letterSpacing: 0.5 }}>colorectal surgeons &amp; pelvic floor specialists</span>
    <br />
    Educational only · Does not diagnose · Private by design
  </div>
);

// ─── V2 DIFFERENT CARD ───────────────────────────────────────────────────────
const DifferentCard = () => {
  const [expanded, setExpanded] = useState(false);
  if (expanded) {
    return (
      <div style={{ background: C.card, border: `1.5px solid ${C.teal}`, borderRadius: 14, padding: "18px 18px 16px", marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.teal}`, fontSize: 18, flexShrink: 0 }}>✨</div>
          <div style={{ color: C.tealDeep, fontWeight: 700, fontSize: 15 }}>How I'm different</div>
        </div>
        <div style={{ color: C.navy, fontSize: 15, lineHeight: 1.6, paddingTop: 10, borderTop: `1px solid ${C.borderSoft}` }}>
          I was <strong style={{ color: C.tealDeep }}>shaped by colorectal surgeons and pelvic floor specialists</strong> — not trained on the open internet.
          <br /><br />
          My answers stay within <strong style={{ color: C.tealDeep }}>what your specialist team wants you to know</strong>. When a question is outside what I'm trained on, I'll say so and point you back to your care team.
          <br /><br />
          I don't diagnose. I don't replace your doctor. I'm here to help you understand, prepare, and ask better questions.
        </div>
        <button onClick={() => setExpanded(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", textDecoration: "underline", textUnderlineOffset: 3, marginTop: 10, padding: 0 }}>← Close</button>
      </div>
    );
  }
  return (
    <button onClick={() => setExpanded(true)} style={{ background: C.tealLight, border: `1.5px solid rgba(45,125,111,0.25)`, borderRadius: 14, padding: "14px 16px", marginBottom: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, fontFamily: "Georgia, serif", textAlign: "left", width: "100%", transition: "all 0.15s ease" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.card, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${C.teal}`, fontSize: 18, flexShrink: 0 }}>✨</div>
      <div style={{ flex: 1, color: C.tealDeep, fontSize: 14.5, fontWeight: 600, lineHeight: 1.4 }}>Not just any chatbot — tap to see how I'm different</div>
      <div style={{ color: C.teal, fontSize: 18, flexShrink: 0 }}>›</div>
    </button>
  );
};

// ─── V2 TOPICS OVERLAY ───────────────────────────────────────────────────────
const TopicsOverlay = ({ onClose, onNav }) => (
  <div style={{ position: "absolute", inset: 0, background: C.bg, zIndex: 50, display: "flex", flexDirection: "column" }}>
    <div style={{ background: C.card, padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
      <button onClick={onClose} style={{ background: "none", border: "none", color: C.teal, fontSize: 16, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: 600 }}>← Back to chat</button>
      <div style={{ color: C.navy, fontWeight: 700, fontSize: 17 }}>Browse by topic</div>
    </div>
    <div style={{ padding: "18px 20px 8px", color: C.slate, fontSize: 14, lineHeight: 1.55 }}>
      You can also ask me about any of these — just tap to open.
    </div>
    <div style={{ padding: "8px 16px 20px", overflowY: "auto", flex: 1 }}>
      {[
        { id: "prolapse", icon: "📖", label: "Understanding prolapse & bowel dysfunction" },
        { id: "symptoms", icon: "🔍", label: "Symptoms & IMPACT score" },
        { id: "imaging", icon: "🩻", label: "Pelvic floor testing" },
        { id: "lifestyle", icon: "🥦", label: "Lifestyle & bowel habit training" },
        { id: "surgical", icon: "🏥", label: "Considering surgery" },
        { id: "redflags", icon: "🚨", label: "Red flags — when to seek care" },
      ].map(t => (
        <button key={t.id} onClick={() => { onNav(t.id); onClose(); }}
          style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "Georgia, serif", textAlign: "left", width: "100%" }}>
          <div style={{ fontSize: 22, width: 40, height: 40, borderRadius: "50%", background: C.sageLt, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.icon}</div>
          <div style={{ flex: 1, color: C.navy, fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{t.label}</div>
        </button>
      ))}
    </div>
  </div>
);

// ─── V2 HOME SECTION ─────────────────────────────────────────────────────────
const STARTERS = [
  { icon: "🔍", text: "Help me understand my symptoms or diagnosis", prompt: "I'd like to understand my symptoms or diagnosis better. Can you help me figure out what's happening?" },
  { icon: "📅", text: "I'm preparing for an appointment", prompt: "I'm preparing for an upcoming appointment. Can you help me get ready — including what questions to ask?" },
  { icon: "🥦", text: "What lifestyle changes can help?", prompt: "I want to know what lifestyle changes can help with my pelvic floor health." },
  { icon: "🏥", text: "I'm thinking about surgery", prompt: "I'm thinking about surgery and want to understand my options and what to expect." },
];

const HomeSection = ({ onStartChat, onNav }) => {
  const [showTopics, setShowTopics] = useState(false);

  return (
    <div style={{ flex: 1, background: C.bg, overflowY: "auto", padding: "20px 16px 12px", display: "flex", flexDirection: "column", position: "relative" }}>
      {showTopics && <TopicsOverlay onClose={() => setShowTopics(false)} onNav={onNav} />}

      {/* Intro card */}
      <div style={{ background: C.card, borderRadius: 20, padding: 20, marginBottom: 18, border: `1px solid ${C.border}`, boxShadow: "0 2px 10px rgba(26,46,59,0.05)" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 3px 10px rgba(45,125,111,0.3)", marginBottom: 12 }}>🌿</div>
        <div style={{ color: C.navy, fontSize: 20, fontWeight: 700, lineHeight: 1.3, marginBottom: 8 }}>You found me — good.</div>
        <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6 }}>
          I'm REPAIR, a pelvic floor companion built by <strong style={{ color: C.teal }}>colorectal surgeons and pelvic floor specialists</strong> to help you understand what's happening in your body, prepare for appointments, and feel less alone in this.
          <br /><br />
          I can also help you <strong style={{ color: C.teal }}>build a summary to bring to your appointment</strong> — just ask.
          <br /><br />
          Whatever brought you here, you don't have to figure this out alone.
        </div>
      </div>

      {/* How I'm different card */}
      <DifferentCard />

      {/* Starters */}
      <div style={{ color: C.muted, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, margin: "6px 4px 10px" }}>Where to begin</div>

      {STARTERS.map((s, i) => (
        <button key={i} onClick={() => onStartChat(s.prompt)}
          style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "Georgia, serif", textAlign: "left", width: "100%", transition: "all 0.15s ease" }}>
          <div style={{ fontSize: 20, width: 38, height: 38, borderRadius: "50%", background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.icon}</div>
          <div style={{ flex: 1, color: C.navy, fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>{s.text}</div>
          <div style={{ color: C.teal, fontSize: 18, flexShrink: 0 }}>›</div>
        </button>
      ))}

      <div style={{ textAlign: "center", marginTop: 8, paddingTop: 12, paddingBottom: 8 }}>
        <button onClick={() => setShowTopics(true)} style={{ background: C.tealLight, border: `1.5px solid ${C.teal}`, borderRadius: 12, color: C.teal, fontSize: 15, fontWeight: 600, fontFamily: "Georgia, serif", cursor: "pointer", padding: "12px 20px", width: "100%" }}>
          Browse topics on your own →
        </button>
      </div>    </div>
  );
};

// ─── PROLAPSE SECTION ────────────────────────────────────────────────────────
const PROLAPSE_CARDS = [
  {
    id: "what", icon: "📖", title: "What Is Rectal Prolapse?",
    content: () => (
      <div>
        <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>Rectal prolapse occurs when part or all of the rectum slips out of its normal position and protrudes through the anal opening — or folds inward on itself. Think of the rectum like a sock: prolapse is like the sock starting to turn inside out.</p>
        <p style={{ color: C.navy, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>▶ Watch this animation first</p>
        <VimeoEmbed videoId="743819969" title="Rectal Prolapse & Rectocele" />
        <Card style={{ borderRadius: 14, padding: 16, marginBottom: 12 }}>
          <div style={{ color: C.teal, fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Internal vs External</div>
          <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}><strong>Internal prolapse (intussusception):</strong> The rectum folds inward on itself but stays inside the body. Diagnosed through imaging or examination. Symptoms include incomplete evacuation, straining, and a feeling of blockage. <em>Internal prolapse is real and can significantly affect quality of life.</em></div>
          <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7 }}><strong>External prolapse:</strong> The rectum protrudes through the anal opening and is visible. This ranges from the inner lining (mucosal prolapse) to the full thickness of the rectal wall.</div>
        </Card>
      </div>
    ),
  },
  {
    id: "grading", icon: "📊", title: "How Prolapse Is Graded",
    content: () => (
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
          <Card key={r.grade} style={{ borderRadius: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.tealLight, color: C.teal, fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>G{r.grade}</div>
              <div><div style={{ color: C.navy, fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{r.desc}</div><div style={{ color: C.muted, fontSize: 13 }}>{r.sig}</div></div>
            </div>
          </Card>
        ))}
        <Callout body="A grade on a scan is not a diagnosis on its own. Your surgeon will examine you, review your symptoms, and consider the full picture before recommending any treatment." icon="💡" />
      </div>
    ),
  },
  {
    id: "why", icon: "❓", title: "Why Prolapse Happens",
    content: () => (
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
    ),
  },
  {
    id: "eval", icon: "🔎", title: "How Prolapse Is Evaluated",
    content: () => (
      <div>
        <p style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}>A healthcare provider will typically take a thorough approach to evaluation:</p>
        {[
          { step: "1", title: "Symptom History", body: "A detailed conversation about what you're experiencing, how long it's been happening, and how it affects your daily life." },
          { step: "2", title: "Physical Examination", body: "Often includes examination while straining, to see how the rectum behaves under pressure. This may feel vulnerable — the team performs this regularly." },
          { step: "photo", title: "📸 Photo Tip", body: "If you have external prolapse, consider taking a photo when tissue is out and bringing it to your appointment. Your surgeon can learn a lot from seeing what you see — even a photo on your phone helps.", isPhoto: true },
          { step: "3", title: "Imaging Studies", body: "Depending on findings, your team may order defecography, dynamic MRI, or other studies. See the Imaging section for what to expect." },
          { step: "4", title: "Specialist Referral", body: "You may be referred to a colorectal surgeon, urogynecologist, pelvic floor PT, or gastroenterologist — or a multidisciplinary team." },
        ].map(s => (
          <Card key={s.step} style={{ background: s.isPhoto ? C.coralLt : C.card, border: s.isPhoto ? `1px solid ${C.coral}44` : `1px solid ${C.border}`, borderRadius: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {!s.isPhoto && <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.teal, color: "#fff", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.step}</div>}
              <div>
                <div style={{ color: s.isPhoto ? C.coral : C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{s.title}</div>
                <div style={{ color: C.slate, fontSize: 17, lineHeight: 1.6 }}>{s.body}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "treatment", icon: "💊", title: "Treatment Options",
    content: () => (
      <div>
        <Callout body="Treatment depends on the type and severity of prolapse, associated symptoms, and your overall health and goals. There are many options — from lifestyle and pelvic floor PT to minimally invasive surgery. You don't have to manage this alone." icon="🌱" />
        {[
          { label: "Lifestyle & Diet", desc: "High-fiber diet, hydration, proper toilet positioning, straining avoidance. Often the foundation of any treatment plan." },
          { label: "Pelvic Floor Physical Therapy", desc: "Highly effective for both strengthening and relaxing pelvic floor muscles. Recommended before and after surgery in most cases." },
          { label: "Bowel Retraining", desc: "Establishing regular, effective bowel habits to reduce straining and improve evacuation." },
          { label: "Non-Surgical Procedures", desc: "Depending on your specific anatomy and symptoms, your team may discuss certain non-surgical approaches." },
          { label: "Surgery — Rectopexy", desc: "For significant internal or external prolapse, surgery to secure the rectum to the tailbone (rectopexy) is the primary treatment." },
        ].map((t, i) => (
          <Card key={i} style={{ borderRadius: 14, padding: 14, marginBottom: 10 }}>
            <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{t.label}</div>
            <div style={{ color: C.slate, fontSize: 17, lineHeight: 1.6 }}>{t.desc}</div>
          </Card>
        ))}
        <div style={{ color: C.muted, fontSize: 16, textAlign: "center" }}>This app does not recommend specific treatments. Your healthcare team will work with you to find the approach that fits your situation.</div>
      </div>
    ),
  },
];

const ProlapseSection = ({ speak, stop, speaking }) => {
  const [open, setOpen] = useState("what");
  return (
    <div>
      <SectionHeader title="Understanding Rectal Prolapse" subtitle="Plain-language explanations to help you feel informed, not overwhelmed." />
      <Callout body="Rectal prolapse is more common than most people know — and far more treatable than most people fear. Understanding what's happening in your body is the first step." />
      {PROLAPSE_CARDS.map(card => (
        <div key={card.id} style={{ marginBottom: 8 }}>
          <button onClick={() => setOpen(open === card.id ? null : card.id)} style={{ width: "100%", textAlign: "left", background: open === card.id ? C.tealLight : C.card, border: `1.5px solid ${open === card.id ? C.teal : C.border}`, borderRadius: open === card.id ? "16px 16px 0 0" : 16, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            <span style={{ fontSize: 22 }}>{card.icon}</span>
            <span style={{ color: C.navy, fontWeight: 700, fontSize: 16, flex: 1 }}>{card.title}</span>
            <span style={{ color: C.muted, fontSize: 18, transform: open === card.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
          </button>
          {open === card.id && (
            <div style={{ background: C.card, border: `1.5px solid ${C.teal}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16 }}>{card.content()}</div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── SYMPTOMS ────────────────────────────────────────────────────────────────
const SYMPTOMS = [
  { id: "evacuation", icon: "🚽", label: "Incomplete Evacuation / Straining", desc: "Feeling like you can't fully empty your bowel, needing to strain, or spending a long time on the toilet.", why: "This may be related to internal rectal prolapse (intussusception), where the rectum folds inward and creates an obstruction. It can also reflect pelvic floor muscle coordination problems or slow transit.", lifestyle: "Toilet positioning (raising knees with a step stool), bowel habit training, high-fiber diet, and pelvic floor PT can all help.", doctor: "If straining is your primary complaint and it hasn't improved with lifestyle changes, or if it's significantly affecting your quality of life.", redFlag: false, animationId: "1175949349", animationTitle: "Constipation & Dyssynergic Defecation" },
  { id: "bulge", icon: "🔵", label: "Rectal Bulge or Tissue Coming Out", desc: "Feeling a bulge in the rectal area, or seeing or feeling tissue outside the body.", why: "This may represent external rectal prolapse (the rectum protruding through the anal opening) or rectocele. The severity ranges from occasional protrusion with straining to persistent prolapse.", lifestyle: "Avoid straining. Optimize fiber and hydration. Avoid prolonged sitting on the toilet.", doctor: "Always — any visible tissue coming out of the rectum should be evaluated by a healthcare provider.", redFlag: false, animationId: "743819969", animationTitle: "Rectal Prolapse & Rectocele" },
  { id: "incontinence", icon: "💧", label: "Fecal Leakage / Incontinence", desc: "Inability to control gas, liquid, or solid stool. Urgency that doesn't give you time to reach the toilet.", why: "Rectal prolapse can stretch the anal sphincter over time, reducing its ability to maintain closure. Nerve damage or sphincter injury can also contribute.", lifestyle: "Dietary adjustments to regulate stool consistency. Pelvic floor PT for sphincter strengthening.", doctor: "Fecal incontinence is very treatable — please don't suffer in silence. If it's affecting your daily activities, your team needs to know.", redFlag: false },
  { id: "pressure", icon: "⬇️", label: "Pelvic Pressure or Heaviness", desc: "A sensation of pressure, heaviness, or dragging in the pelvis or rectum. Feeling like something is falling out.", why: "This sensation often reflects downward displacement of pelvic organs, including the rectum, and is common with prolapse of any degree.", lifestyle: "Avoiding prolonged standing, high-impact activity during symptomatic periods. Core and pelvic floor PT.", doctor: "If this sensation is persistent or worsening, or if it's combined with other symptoms.", redFlag: false },
  { id: "mucus", icon: "💛", label: "Mucus Discharge or Rectal Bleeding", desc: "Mucus coming from the rectum, or blood on toilet paper, in the bowl, or mixed with stool.", why: "Mucus discharge is common with rectal prolapse — the prolapsed tissue secretes mucus. Rectal bleeding can have many causes and must be evaluated.", lifestyle: "Mucus alone, in the context of known prolapse, is often related to the prolapse itself. Bleeding always deserves evaluation.", doctor: "Any rectal bleeding — especially new bleeding, bleeding mixed with stool, or dark blood — should be evaluated promptly. Do not assume it's always related to prolapse.", redFlag: true },
];

const SymptomsSection = ({ speak, stop, speaking, scores, setScores, primarySymptom, setPrimarySymptom }) => {
  const [showScores, setShowScores] = useState(false);
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Symptoms & My Score" subtitle="Explore your symptoms, then see how you score with our validated questionnaire." />
      <Callout body="Millions of people live with these symptoms — and most never talk about them. You're not alone in what you're experiencing." icon="💙" />
      {!showScores ? (
        <div>
          {SYMPTOMS.map(s => (
            <div key={s.id}>
              <button onClick={() => setOpen(open === s.id ? null : s.id)} style={{ width: "100%", textAlign: "left", background: open === s.id ? C.tealLight : C.card, border: `1.5px solid ${open === s.id ? C.teal : C.border}`, borderRadius: open === s.id ? "16px 16px 0 0" : 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "Georgia, serif", marginBottom: open === s.id ? 0 : 8 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ color: C.navy, fontWeight: 600, fontSize: 17, flex: 1 }}>{s.label}</span>
                <span style={{ color: C.muted, fontSize: 18 }}>{open === s.id ? "▲" : "▼"}</span>
              </button>
              {open === s.id && (
                <div style={{ background: C.card, border: `1.5px solid ${C.teal}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16, marginBottom: 8 }}>
                  <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>{s.desc}</div>
                  <div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Why it happens</div>
                  <div style={{ color: C.slate, fontSize: 17, lineHeight: 1.6, marginBottom: 12 }}>{s.why}</div>
                  <div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Lifestyle factors</div>
                  <div style={{ color: C.slate, fontSize: 17, lineHeight: 1.6, marginBottom: 12 }}>{s.lifestyle}</div>
                  {s.animationId && <VimeoEmbed videoId={s.animationId} title={s.animationTitle} />}
                  <div style={{ background: s.redFlag ? C.redLt : C.warnLt, border: `1px solid ${s.redFlag ? C.red : C.warn}44`, borderRadius: 10, padding: 14 }}>
                    <div style={{ color: s.redFlag ? C.red : C.coral, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>{s.redFlag ? "🚨 When to seek care — promptly" : "🩺 When to call your doctor"}</div>
                    <div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{s.doctor}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.navyMid})`, borderRadius: 20, padding: 24, marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Would you like to see how your symptoms score?</div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: 1.6, marginBottom: 20 }}>Our validated questionnaire takes about 5 minutes and gives your healthcare team a clear picture of your symptom burden.</div>
            <button onClick={() => setShowScores(true)} style={{ background: "#fff", color: C.teal, border: "none", borderRadius: 14, padding: "16px 32px", fontSize: 17, fontWeight: 700, cursor: "pointer", width: "100%", fontFamily: "Georgia, serif" }}>Yes — show me my score →</button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={() => setShowScores(false)} style={{ background: "none", border: "none", color: C.teal, fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, fontFamily: "Georgia, serif" }}>← Back to Symptom Explorer</button>
          <CalculatorsSection scores={scores} setScores={setScores} primarySymptom={primarySymptom} setPrimarySymptom={setPrimarySymptom} />
        </div>
      )}
    </div>
  );
};

// ─── IMAGING ─────────────────────────────────────────────────────────────────
const ULTRASOUND_PROBES = [
  { label: "Endoanal Ultrasound", icon: "🔵", what: "A small probe placed gently inside the anal canal to image the sphincter muscles in cross-section.", why: "To evaluate the internal and external anal sphincter for tears, thinning, or scarring — the most important study for assessing the cause of fecal incontinence.", expect: "Brief and minimally uncomfortable. A small enema beforehand is sometimes recommended. The provider guides you through each step." },
  { label: "Endovaginal (Transvaginal) Ultrasound", icon: "🟣", what: "A probe placed in the vagina to image the pelvic floor from a different angle.", why: "Provides excellent views of the posterior compartment, rectovaginal septum, and sphincter complex — often used alongside other imaging when multicompartment prolapse is suspected.", expect: "Routine and well-tolerated. Your provider will explain the procedure before starting." },
  { label: "Transperineal (Perineal) Ultrasound", icon: "🟢", what: "A probe placed on the skin of the perineum — no internal insertion required.", why: "A non-invasive way to view pelvic floor movement, bladder neck, and rectal descent in real time. Increasingly used as a first-line study.", expect: "Completely external — no probe insertion. Gel is applied to the skin. You may be asked to squeeze, strain, or cough during imaging." },
];

const IMAGING = [
  { id: "defec", icon: "📡", label: "Conventional Defecography", what: "An X-ray study that watches how the rectum empties in real time.", why: "To evaluate rectal prolapse, rectocele, and obstructed defecation.", what_happens: "A contrast material is placed in the rectum. You sit on a special commode and are asked to squeeze, strain, and evacuate while X-ray images are taken.", prep: "Usually requires a bowel prep (enema) beforehand. Ask your team.", expect: "Not painful, but can feel vulnerable. The staff who perform this study do it regularly and are experienced with patient comfort." },
  { id: "mri", icon: "🧲", label: "MRI Defecography (Dynamic Pelvic MRI)", what: "An MRI-based version of defecography — no radiation.", why: "Provides excellent visualization of all three pelvic compartments simultaneously. Often preferred when multiple issues are suspected.", what_happens: "Gel is placed in the rectum. You lie inside an MRI machine and perform squeeze, strain, and evacuation maneuvers.", prep: "No radiation involved. The table may be narrow.", expect: "Evacuation in a scanner can feel awkward — this is completely normal and expected." },
  { id: "ultrasound", icon: "🔊", label: "Pelvic Ultrasound", what: "Ultrasound imaging of the anal sphincter and pelvic floor using one or more probe approaches.", why: "Used to evaluate sphincter integrity, pelvic floor muscle function, and multicompartment prolapse.", isUltrasound: true },
  { id: "manometry", icon: "📏", label: "Anorectal Manometry", what: "A pressure measurement study of the rectum and anal canal.", why: "To assess how well the sphincter muscles and rectum coordinate — particularly useful for evaluating obstructed defecation and incontinence.", what_happens: "A thin, flexible tube is placed in the rectum. You are asked to squeeze, push, and relax while pressures are recorded.", prep: "Instructions vary — ask your team.", expect: "Mild discomfort is possible but the study is not painful. Usually 30–60 minutes." },
  { id: "transit", icon: "⏱️", label: "Colonic Transit Study", what: "A test measuring how long it takes stool to move through the colon.", why: "To determine whether slow colonic transit is contributing to constipation.", what_happens: "Sitz Marker Study: swallow a capsule with tiny markers; an X-ray is taken several days later. SmartPill: a wireless capsule that transmits motility data.", prep: "You may need to stop laxatives for several days. Follow your team's instructions.", expect: "Straightforward. Beyond swallowing the capsule, the study itself requires no procedures." },
];

const ImagingSection = ({ speak, stop, speaking }) => {
  const [open, setOpen] = useState(null);
  const [probeOpen, setProbeOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Pelvic Floor Testing" subtitle="Understanding what each test involves helps reduce anxiety and helps you prepare." />
      <Callout body="Imaging tests for pelvic floor and bowel problems can feel unfamiliar or even embarrassing. Knowing what to expect makes the experience much easier." icon="💙" />
      {IMAGING.map(s => (
        <div key={s.id}>
          <button onClick={() => setOpen(open === s.id ? null : s.id)} style={{ width: "100%", textAlign: "left", background: open === s.id ? C.tealLight : C.card, border: `1.5px solid ${open === s.id ? C.teal : C.border}`, borderRadius: open === s.id ? "16px 16px 0 0" : 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "Georgia, serif", marginBottom: open === s.id ? 0 : 8 }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <span style={{ color: C.navy, fontWeight: 600, fontSize: 16, flex: 1, lineHeight: 1.3 }}>{s.label}</span>
            <span style={{ color: C.muted }}>{open === s.id ? "▲" : "▼"}</span>
          </button>
          {open === s.id && (
            <div style={{ background: C.card, border: `1.5px solid ${C.teal}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16, marginBottom: 8 }}>
              {s.isUltrasound ? (
                <div>
                  <div style={{ marginBottom: 12 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 15, textTransform: "uppercase", marginBottom: 2 }}>What it is</div><div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{s.what}</div></div>
                  <div style={{ marginBottom: 16 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 15, textTransform: "uppercase", marginBottom: 2 }}>Why it's ordered</div><div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{s.why}</div></div>
                  <div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 10 }}>Three probe approaches — tap each to learn more:</div>
                  {ULTRASOUND_PROBES.map(p => (
                    <div key={p.label}>
                      <button onClick={() => setProbeOpen(probeOpen === p.label ? null : p.label)} style={{ width: "100%", textAlign: "left", background: probeOpen === p.label ? C.tealLight : C.bg, border: `1.5px solid ${probeOpen === p.label ? C.teal : C.border}`, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", minHeight: 54, marginBottom: 6, fontFamily: "Georgia, serif" }}>
                        <span style={{ fontSize: 18 }}>{p.icon}</span>
                        <span style={{ color: C.navy, fontWeight: 600, fontSize: 17, flex: 1 }}>{p.label}</span>
                        <span style={{ color: C.muted, fontSize: 14 }}>{probeOpen === p.label ? "▲" : "▼"}</span>
                      </button>
                      {probeOpen === p.label && (
                        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 10 }}>
                          {[["What it is", p.what], ["Why it's ordered", p.why], ["What to expect", p.expect]].map(([k, v]) => (
                            <div key={k} style={{ marginBottom: 12 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 14, textTransform: "uppercase", marginBottom: 2 }}>{k}</div><div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{v}</div></div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                [["What it is", s.what], ["Why it's ordered", s.why], ["What happens", s.what_happens], ["Preparation", s.prep], ["What to expect", s.expect]].map(([k, v]) => (
                  <div key={k} style={{ marginBottom: 12 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 15, textTransform: "uppercase", marginBottom: 2 }}>{k}</div><div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{v}</div></div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ─── LIFESTYLE ────────────────────────────────────────────────────────────────
const LIFESTYLE_PILLARS = [
  { id: "nutrition", icon: "🥦", label: "Whole-Food Nutrition", color: "#4a9d6f", desc: "A plant-predominant diet rich in fiber is one of the most powerful things you can do for bowel health.", tips: ["Target 25–30g dietary fiber daily (most people eat 10–15g)", "High-fiber foods: legumes, whole grains, fruits with skin, vegetables, nuts, psyllium husk", "Hydration: 6–8 glasses of water daily — fiber without water worsens constipation", "Fermented foods (yogurt, kefir, kimchi) support gut microbiome diversity", "Add ground flaxseed to oatmeal or smoothies. One cup cooked lentils = ~15g fiber"] },
  { id: "activity", icon: "🏃", label: "Physical Activity", color: "#e07a5f", desc: "Regular movement stimulates colonic motility and supports pelvic floor muscle tone.", tips: ["Even 20–30 minutes of walking daily can improve bowel function", "Avoid heavy lifting and high-impact activity during periods of significant prolapse", "Discuss appropriate activity levels with your pelvic floor PT or provider", "Core strengthening — gently and correctly — supports pelvic floor function"] },
  { id: "sleep", icon: "😴", label: "Restorative Sleep", color: "#9b59b6", desc: "Poor sleep disrupts gut motility, pain processing, and immune function — all relevant to bowel health.", tips: ["Aim for 7–9 hours of quality sleep nightly", "Irregular bowel timing often correlates with disrupted sleep schedules", "Sleep deprivation can worsen pain sensitivity around pelvic symptoms", "Establishing a consistent sleep-wake time also helps regulate bowel timing"] },
  { id: "stress", icon: "🧘", label: "Stress Management", color: "#e6a817", desc: "The gut and brain are deeply connected. Chronic stress directly affects bowel motility and pelvic floor tension.", tips: ["Mindfulness and breathing exercises can reduce pelvic floor guarding/tension", "The gut-brain axis is real: anxiety and IBS-like symptoms often overlap with prolapse", "Consider mindfulness-based stress reduction (MBSR) programs", "Your pelvic floor PT can teach relaxation techniques specific to your pelvic floor"] },
  { id: "substances", icon: "🚭", label: "Avoidance of Risky Substances", color: "#c0392b", desc: "Certain substances directly worsen bowel function, pelvic floor health, and surgical outcomes.", tips: ["Smoking significantly worsens constipation and impairs wound healing", "Alcohol dehydrates and disrupts bowel motility", "Caffeine in excess can worsen urgency and loose stools", "If you smoke and are considering surgery, quitting before your procedure dramatically improves outcomes"] },
  { id: "social", icon: "🤝", label: "Social Connection", color: "#2980b9", desc: "Pelvic floor disorders cause shame and isolation. Meaningful connection is genuinely therapeutic.", tips: ["Many people with prolapse feel isolated — you are not alone", "Peer support groups exist for pelvic floor disorders and can be deeply validating", "Involving a trusted person in your care journey improves outcomes", "If symptoms are causing depression or anxiety, please tell your healthcare team — support is available"] },
];

const LifestyleSection = ({ speak, stop, speaking }) => {
  const [open, setOpen] = useState(null);
  return (
    <div>
      <SectionHeader title="Lifestyle Medicine" subtitle="Lifestyle changes are not a consolation prize — they are the foundation of pelvic floor health." />
      <Callout body="The six pillars of lifestyle medicine each connect directly to pelvic floor and bowel health. Small, consistent changes make a real difference." icon="🌱" />
      <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 16 }}><strong>Bowel habit training tips:</strong> Use the gastrocolic reflex — try sitting on the toilet 20–30 minutes after breakfast. Don't ignore the urge. Limit toilet time to 5–10 minutes. Raise your knees with a step stool to relax the anorectal angle.</div>
      <VimeoEmbed videoId="1175949349" title="Constipation & Dyssynergic Defecation" />
      <div style={{ color: C.navy, fontSize: 17, fontWeight: 700, marginBottom: 12, marginTop: 8 }}>The 6 Lifestyle Medicine Pillars</div>
      {LIFESTYLE_PILLARS.map(p => (
        <div key={p.id}>
          <button onClick={() => setOpen(open === p.id ? null : p.id)} style={{ width: "100%", textAlign: "left", background: open === p.id ? "#f0f7f5" : C.card, border: `1.5px solid ${open === p.id ? p.color : C.border}`, borderRadius: open === p.id ? "16px 16px 0 0" : 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "Georgia, serif", marginBottom: open === p.id ? 0 : 8 }}>
            <span style={{ fontSize: 24 }}>{p.icon}</span>
            <div style={{ flex: 1 }}><div style={{ color: C.navy, fontWeight: 600, fontSize: 14 }}>{p.label}</div><div style={{ color: C.muted, fontSize: 16, marginTop: 2 }}>{p.desc.substring(0, 60)}...</div></div>
            <span style={{ color: C.muted }}>{open === p.id ? "▲" : "▼"}</span>
          </button>
          {open === p.id && (
            <div style={{ background: C.card, border: `1.5px solid ${p.color}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16, borderLeft: `4px solid ${p.color}`, marginBottom: 8 }}>
              <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7, marginBottom: 12 }}>{p.desc}</div>
              {p.tips.map((t, i) => (<div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}><div style={{ color: p.color, fontSize: 16, marginTop: 2, flexShrink: 0 }}>✓</div><div style={{ color: C.slate, fontSize: 17, lineHeight: 1.6 }}>{t}</div></div>))}
            </div>
          )}
        </div>
      ))}
      <Card style={{ background: C.tealLight, borderRadius: 16, padding: 16 }}>
        <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>🏋️ Pelvic Floor Physical Therapy</div>
        <div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>PT is one of the most effective interventions for bowel and bladder dysfunction. Important: for some people the pelvic floor is too tight (not too weak) — a PT can assess your specific needs and give tailored exercises. Always ask for a referral if you haven't seen one.</div>
      </Card>
    </div>
  );
};

// ─── IMPACT SCORING ───────────────────────────────────────────────────────────
const BRISTOL_TYPES = [
  { type: 1, label: "Type 1", desc: "Separate hard lumps (hard to pass)" },
  { type: 2, label: "Type 2", desc: "Sausage-shaped but lumpy" },
  { type: 3, label: "Type 3", desc: "Like a sausage, with cracks on the surface" },
  { type: 4, label: "Type 4", desc: "Like a sausage — smooth and soft ✓ Ideal" },
  { type: 5, label: "Type 5", desc: "Soft blobs with clear-cut edges" },
  { type: 6, label: "Type 6", desc: "Fluffy, ragged edges — mushy stool" },
  { type: 7, label: "Type 7", desc: "Watery, no solid pieces — entirely liquid" },
];
const FREQ_3 = [{ label: "Occasionally", value: "occasionally" }, { label: "Sometimes", value: "sometimes" }, { label: "Usually", value: "usually" }, { label: "Always", value: "always" }];
const SEV_INFREQ = [{ label: "Not at all severe (I go almost every day)", value: "not_severe" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe (I go 1–2 times per week)", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe (up to 4 weeks without going)", value: "extreme" }];
const SEV_STRAIN = [{ label: "Not at all severe (I push a little)", value: "not_severe" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe (I bear down hard)", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe (push on belly, grunt, bear down very hard)", value: "extreme" }];
const SEV_EMPTY = [{ label: "Not at all severe (most of my bowel movement comes out)", value: "not_severe" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe (there is still a lot of stool in me)", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe (constant pressure / keep going back to bathroom)", value: "extreme" }];
const SEV_URGE = [{ label: "Not at all severe (I have a pretty good sense when I have to go)", value: "not_severe" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe (only a vague sense I might have to go)", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe (I don't have any sensation in the pelvic area)", value: "extreme" }];
const BOTHER_5 = [{ label: "Not at all bothersome", value: "not" }, { label: "A little bothersome", value: "little" }, { label: "Somewhat bothersome", value: "somewhat" }, { label: "Very bothersome", value: "very" }, { label: "Extremely bothersome", value: "extreme" }];
const CONSTIP_ITEMS = [{ key: "c_discomfort", label: "7a. Discomfort in your abdomen" }, { key: "c_pain", label: "7b. Pain in your abdomen" }, { key: "c_bloating", label: "7c. Bloating in your abdomen" }, { key: "c_cramps", label: "7d. Stomach cramps" }, { key: "c_burning", label: "7e. Rectal burning during or after a bowel movement" }, { key: "c_hard", label: "7f. Bowel movements that were too hard" }, { key: "c_small", label: "7g. Bowel movements that were too small" }, { key: "c_false", label: "7h. Feeling like you had to pass a bowel movement but you couldn't (false alarm)" }];
const SEV_4 = [{ label: "Absent", value: 0 }, { label: "Mild", value: 1 }, { label: "Moderate", value: 2 }, { label: "Severe", value: 3 }, { label: "Very Severe", value: 4 }];
const FI_FREQ = [{ label: "Rarely (< 1×/month)", value: "rarely" }, { label: "Sometimes (< 1×/week)", value: "sometimes" }, { label: "Weekly (but < 1×/day)", value: "weekly" }, { label: "Daily (1×/day or more)", value: "daily" }];
const FI_SEV = [{ label: "None", value: "none" }, { label: "Stain only", value: "stain" }, { label: "More than a stain", value: "more" }, { label: "Entire bowel movement", value: "entire" }];
const SEV_PAIN_LAST = [{ label: "I haven't experienced this", value: "none" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe", value: "extreme" }];
const SEV_PAIN_NOW = [{ label: "No pain", value: "none" }, { label: "Mild", value: "mild" }, { label: "Somewhat severe", value: "somewhat" }, { label: "Severe", value: "severe" }, { label: "Extremely severe", value: "extreme" }];
const BLEED_FREQ = [{ label: "Never", value: "never" }, { label: "Rarely", value: "rarely" }, { label: "Occasionally", value: "occasionally" }, { label: "Usually", value: "usually" }, { label: "Always", value: "always" }];

const summarizeBristol = (t) => {
  if (!t) return null;
  if (t <= 2) return { label: "Hard / constipated stool (Types 1–2)", color: C.coral, note: "Types 1–2 suggest slow transit or insufficient fiber and hydration." };
  if (t <= 4) return { label: "Normal, well-formed stool (Types 3–4)", color: C.teal, note: "Types 3–4 are ideal." };
  if (t <= 5) return { label: "Somewhat soft stool (Type 5)", color: C.warn, note: "Type 5 may indicate slightly fast transit or sensitivity." };
  return { label: "Loose / liquid stool (Types 6–7)", color: C.coral, note: "Types 6–7 may suggest inflammation, infection, or other causes worth discussing with your team." };
};

const botherScore = (val) => ({ not: 0, little: 1, somewhat: 2, very: 3, extreme: 4 }[val] ?? 0);

const calcIMPACTDomains = (ans) => {
  const conItems = [];
  if (ans.q3 === "yes" && ans.q3_bother) conItems.push(botherScore(ans.q3_bother));
  if (ans.q4 === "yes" && ans.q4_bother) conItems.push(botherScore(ans.q4_bother));
  if (ans.q5 === "yes" && ans.q5_bother) conItems.push(botherScore(ans.q5_bother));
  if (ans.q6 === "yes" && ans.q6_bother) conItems.push(botherScore(ans.q6_bother));
  const constipScore = conItems.length > 0 ? Math.round(conItems.reduce((a, b) => a + b, 0) / conItems.length * 10) / 10 : null;
  const fiItems = [];
  if (ans.q8a === "yes" && ans.q8a_bother) fiItems.push(botherScore(ans.q8a_bother));
  if (ans.q8b === "yes" && ans.q8b_bother) fiItems.push(botherScore(ans.q8b_bother));
  if (ans.q8c === "yes" && ans.q8c_bother) fiItems.push(botherScore(ans.q8c_bother));
  const fiScore = fiItems.length > 0 ? Math.max(...fiItems) : null;
  const urgScore = (ans.q9 === "yes" && ans.q9_bother) ? botherScore(ans.q9_bother) : null;
  const painScore = (ans.q10 === "yes" && ans.q10_bother) ? botherScore(ans.q10_bother) : null;
  const prolapseScore = (ans.q11 === "yes" && ans.q11_bother) ? botherScore(ans.q11_bother) : null;
  return { constipScore, fiScore, urgScore, painScore, prolapseScore };
};

const calcIMPACT016 = (ans) => {
  if (!ans) return null;
  const items = [];
  [["q3","q3_bother"],["q4","q4_bother"],["q5","q5_bother"],["q6","q6_bother"]].forEach(([q, b]) => {
    if (ans[q] === "no") items.push(0);
    else if (ans[q] === "yes" && ans[b]) items.push(botherScore(ans[b]));
  });
  if (ans.q8 === "no") { items.push(0); }
  else if (ans.q8 === "yes") {
    const fi = [];
    [["q8a","q8a_bother"],["q8b","q8b_bother"],["q8c","q8c_bother"]].forEach(([q,b]) => {
      if (ans[q] === "no") fi.push(0);
      else if (ans[q] === "yes" && ans[b]) fi.push(botherScore(ans[b]));
    });
    if (fi.length > 0) items.push(Math.max(...fi));
  }
  [["q9","q9_bother"],["q10","q10_bother"],["q11","q11_bother"]].forEach(([q,b]) => {
    if (ans[q] === "no") items.push(0);
    else if (ans[q] === "yes" && ans[b]) items.push(botherScore(ans[b]));
  });
  if (items.length === 0) return null;
  const avg = items.reduce((a, b) => a + b, 0) / items.length;
  return Math.round((avg / 4) * 16);
};

const impactBand = (score16) => {
  if (score16 === null) return null;
  if (score16 <= 3) return { label: "Minimal / None", color: C.teal, msg: "Your responses suggest minimal bowel symptoms. Use this score as a baseline for future visits and share it with your team." };
  if (score16 <= 7) return { label: "Mild", color: C.sage, msg: "Your responses suggest mild bowel symptoms. Lifestyle measures — especially fiber, hydration, and bowel habit training — are the first line. Share this with your team." };
  if (score16 <= 11) return { label: "Moderate", color: C.warn, msg: "Your responses suggest moderate bowel symptoms that may be affecting your daily life. A comprehensive evaluation is worthwhile. Please share this score with your healthcare team." };
  return { label: "Significant", color: C.red, msg: "Your responses suggest significant bowel symptoms. You deserve a thorough evaluation and a clear management plan. Please share this score at your next appointment — you don't have to manage this alone." };
};

const domainBand = (score) => {
  if (score === null) return null;
  if (score <= 1) return { label: "Not bothersome", color: C.teal, bg: C.tealLight };
  if (score === 2) return { label: "Somewhat bothersome", color: C.warn, bg: C.warnLt };
  if (score === 3) return { label: "Very bothersome", color: C.coral, bg: C.coralLt };
  return { label: "Extremely bothersome", color: C.red, bg: C.redLt };
};

const impactSummaryText = (ans) => {
  const flags = [];
  if (ans.q3 === "yes" && ans.q3_bother && ["very", "extreme"].includes(ans.q3_bother)) flags.push("significant infrequent bowel movements");
  if (ans.q5 === "yes" && ans.q5_bother && ["very", "extreme"].includes(ans.q5_bother)) flags.push("significant straining");
  if (ans.q6 === "yes" && ans.q6_bother && ["very", "extreme"].includes(ans.q6_bother)) flags.push("significant incomplete evacuation");
  if (ans.q8 === "yes") flags.push("accidental bowel leakage or gas");
  if (ans.q9 === "yes" && ans.q9_bother && ["very", "extreme"].includes(ans.q9_bother)) flags.push("urgency");
  if (ans.q10 === "yes") flags.push("pain with stool");
  if (ans.q11 === "yes") flags.push("tissue bulging / prolapse sensation");
  if (ans.q12 && ans.q12 !== "never") flags.push("rectal bleeding");
  if (flags.length === 0) return "Your responses suggest few bothersome bowel symptoms at this time. Bring this completed survey to your appointment to share with your team.";
  return `Your responses highlight: ${flags.join(", ")}. These are important to discuss with your healthcare team. Bring this completed survey to your appointment.`;
};

const OptBtn = ({ label, selected, onClick, color = C.teal }) => (
  <button onClick={onClick} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 14, background: selected ? color : C.tealLight, border: `2px solid ${selected ? color : C.border}`, borderRadius: 12, padding: "14px 16px", marginBottom: 10, minHeight: 54, cursor: "pointer", fontFamily: "Georgia, serif" }}>
    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: `2.5px solid ${selected ? "#fff" : color}`, background: selected ? "#fff" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {selected && <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />}
    </div>
    <span style={{ color: selected ? "#fff" : C.navy, fontSize: 16, lineHeight: 1.4, flex: 1 }}>{label}</span>
  </button>
);

const YesNoGate = ({ question, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    {question ? <div style={{ color: C.navy, fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{question}</div> : null}
    <div style={{ display: "flex", gap: 12 }}>
      {["yes", "no"].map(v => (
        <button key={v} onClick={() => onChange(v)} style={{ flex: 1, padding: "14px 0", borderRadius: 12, cursor: "pointer", background: value === v ? C.teal : C.tealLight, color: value === v ? "#fff" : C.navy, border: `2px solid ${value === v ? C.teal : C.border}`, fontWeight: 700, fontSize: 18, minHeight: 54, fontFamily: "Georgia, serif" }}>
          {v === "yes" ? "YES" : "NO"}
        </button>
      ))}
    </div>
  </div>
);

const SubLabel = ({ text }) => (
  <div style={{ color: C.teal, fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, marginTop: 14 }}>{text}</div>
);

// ─── IMPACT SURVEY ────────────────────────────────────────────────────────────
const IMPACTSurvey = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [ans, setAns] = useState({});
  const totalSteps = 12;
  const answeredCount = Object.keys(ans).filter(k => ["bristol","q2","q3","q4","q5","q6","q7","q8","q9","q10","q11","q12"].includes(k)).length;
  const set = (key, val) => setAns(prev => ({ ...prev, [key]: val }));

  const canProceed = () => {
    if (step === 1) return !!ans.bristol;
    if (step === 2) return !!ans.q2;
    if (step === 3) { if (ans.q3 === "no") return true; if (ans.q3 === "yes") return ans.q3_freq && ans.q3_sev && ans.q3_bother; return false; }
    if (step === 4) { if (ans.q4 === "no") return true; if (ans.q4 === "yes") return ans.q4_sev && ans.q4_bother; return false; }
    if (step === 5) { if (ans.q5 === "no") return true; if (ans.q5 === "yes") return ans.q5_freq && ans.q5_sev && ans.q5_bother; return false; }
    if (step === 6) { if (ans.q6 === "no") return true; if (ans.q6 === "yes") return ans.q6_freq && ans.q6_sev && ans.q6_bother; return false; }
    if (step === 7) { if (ans.q7 === "no") return true; return ans.q7 === "yes" && CONSTIP_ITEMS.every(it => ans[it.key] !== undefined); }
    if (step === 8) { if (ans.q8 === "no") return true; if (ans.q8 === "yes") { const solid = ans.q8a !== "no" ? (ans.q8a_freq && ans.q8a_sev && ans.q8a_bother) : true; const liquid = ans.q8b !== "no" ? (ans.q8b_freq && ans.q8b_sev && ans.q8b_bother) : true; const gas = ans.q8c !== "no" ? (ans.q8c_freq && ans.q8c_bother) : true; return ans.q8a !== undefined && ans.q8b !== undefined && ans.q8c !== undefined && solid && liquid && gas; } return false; }
    if (step === 9) { if (ans.q9 === "no") return true; return ans.q9 === "yes" && ans.q9_bother; }
    if (step === 10) { if (ans.q10 === "no") return true; return ans.q10 === "yes" && ans.q10_last && ans.q10_now && ans.q10_bother; }
    if (step === 11) { if (ans.q11 === "no") return true; return ans.q11 === "yes" && ans.q11_bother; }
    if (step === 12) return !!ans.q12;
    return false;
  };

  const next = () => { if (step < totalSteps) setStep(s => s + 1); else onComplete(ans); };
  const showEarlyReport = step >= 9 && answeredCount >= 8;

  return (
    <div>
      <PrivacyNote context="survey" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ color: C.muted, fontSize: 13 }}>Question {step} of {totalSteps}</div>
        <div style={{ background: C.tealLight, color: C.teal, fontSize: 14, fontWeight: 700, borderRadius: 99, padding: "3px 10px" }}>IMPACT Bowel Survey</div>
      </div>
      <ProgressBar value={step} max={totalSteps} />

      {step === 1 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q1. What does your stool usually look like?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>Please think about your typical bowel movements over the last 3 months.</div>{BRISTOL_TYPES.map(t => (<OptBtn key={t.type} label={`${t.label}: ${t.desc}`} selected={ans.bristol === t.type} onClick={() => set("bristol", t.type)} />))}</Card>)}
      {step === 2 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q2. How often do you have an uncomfortable or difficult bowel movement?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>During a typical month.</div>{[{ label: "Never", value: "never" }, { label: "Daily", value: "daily" }, { label: "A few times per week", value: "few_week" }, { label: "Once per week", value: "once_week" }, { label: "Once every 2 weeks", value: "biweekly" }, { label: "Once a month", value: "monthly" }].map(o => <OptBtn key={o.value} label={o.label} selected={ans.q2 === o.value} onClick={() => set("q2", o.value)} />)}</Card>)}
      {step === 3 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q3. Do you have difficulty with infrequent bowel movements?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>(Less than 1 bowel movement every 3 days)</div><YesNoGate question="" value={ans.q3} onChange={v => set("q3", v)} />{ans.q3 === "yes" && (<div><SubLabel text="How often do you experience this?" />{FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_freq === o.value} onClick={() => set("q3_freq", o.value)} />)}<SubLabel text="How severe is this symptom for you?" />{SEV_INFREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_sev === o.value} onClick={() => set("q3_sev", o.value)} />)}<SubLabel text="How much does this symptom bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q3_bother === o.value} onClick={() => set("q3_bother", o.value)} />)}</div>)}</Card>)}
      {step === 4 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q4. Do you ever lack the urge to have a bowel movement?</div><YesNoGate question="" value={ans.q4} onChange={v => set("q4", v)} />{ans.q4 === "yes" && (<div><SubLabel text="How severe is this for you?" />{SEV_URGE.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q4_sev === o.value} onClick={() => set("q4_sev", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q4_bother === o.value} onClick={() => set("q4_bother", o.value)} />)}</div>)}</Card>)}
      {step === 5 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q5. Do you feel you need to strain too hard to have a bowel movement?</div><YesNoGate question="" value={ans.q5} onChange={v => set("q5", v)} />{ans.q5 === "yes" && (<div><SubLabel text="How often do you experience this?" />{FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_freq === o.value} onClick={() => set("q5_freq", o.value)} />)}<SubLabel text="How severe is this for you?" />{SEV_STRAIN.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_sev === o.value} onClick={() => set("q5_sev", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q5_bother === o.value} onClick={() => set("q5_bother", o.value)} />)}</div>)}</Card>)}
      {step === 6 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q6. Do you feel you have not completely emptied your bowels after a bowel movement?</div><YesNoGate question="" value={ans.q6} onChange={v => set("q6", v)} />{ans.q6 === "yes" && (<div><SubLabel text="How often do you experience this?" />{FREQ_3.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_freq === o.value} onClick={() => set("q6_freq", o.value)} />)}<SubLabel text="How severe is this for you?" />{SEV_EMPTY.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_sev === o.value} onClick={() => set("q6_sev", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q6_bother === o.value} onClick={() => set("q6_bother", o.value)} />)}</div>)}</Card>)}
      {step === 7 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q7. Do you sometimes have symptoms of constipation?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>If yes, please rate how severe these have been in the past 2 weeks.</div><YesNoGate question="" value={ans.q7} onChange={v => set("q7", v)} />{ans.q7 === "yes" && (<div>{CONSTIP_ITEMS.map(it => (<div key={it.key} style={{ marginBottom: 16 }}><div style={{ color: C.navy, fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{it.label}</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{SEV_4.map(o => (<button key={o.value} onClick={() => set(it.key, o.value)} style={{ background: ans[it.key] === o.value ? C.teal : C.tealLight, color: ans[it.key] === o.value ? "#fff" : C.navy, border: `1.5px solid ${ans[it.key] === o.value ? C.teal : C.border}`, borderRadius: 10, padding: "8px 12px", fontSize: 15, fontWeight: ans[it.key] === o.value ? 700 : 400, cursor: "pointer", fontFamily: "Georgia, serif" }}>{o.label}</button>))}</div></div>))}</div>)}</Card>)}
      {step === 8 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q8. Do you sometimes have accidental gas or bowel leakage?</div><YesNoGate question="" value={ans.q8} onChange={v => set("q8", v)} />{ans.q8 === "yes" && (<div><Callout body="Many people with pelvic floor conditions experience some leakage. Your honest answers help your team understand your needs." icon="💙" /><div style={{ color: C.navy, fontWeight: 600, fontSize: 17, marginBottom: 6, marginTop: 8 }}>8A. Do you usually lose well-formed stool beyond your control?</div><YesNoGate question="" value={ans.q8a} onChange={v => set("q8a", v)} />{ans.q8a === "yes" && (<div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}><SubLabel text="How often?" />{FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_freq === o.value} onClick={() => set("q8a_freq", o.value)} />)}<SubLabel text="How much do you leak?" />{FI_SEV.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_sev === o.value} onClick={() => set("q8a_sev", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8a_bother === o.value} onClick={() => set("q8a_bother", o.value)} />)}</div>)}<div style={{ color: C.navy, fontWeight: 600, fontSize: 17, marginBottom: 6 }}>8B. Do you usually lose loose or liquid stool beyond your control?</div><YesNoGate question="" value={ans.q8b} onChange={v => set("q8b", v)} />{ans.q8b === "yes" && (<div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}><SubLabel text="How often?" />{FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_freq === o.value} onClick={() => set("q8b_freq", o.value)} />)}<SubLabel text="How much do you leak?" />{FI_SEV.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_sev === o.value} onClick={() => set("q8b_sev", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8b_bother === o.value} onClick={() => set("q8b_bother", o.value)} />)}</div>)}<div style={{ color: C.navy, fontWeight: 600, fontSize: 17, marginBottom: 6 }}>8C. Do you usually lose gas from the rectum beyond your control?</div><YesNoGate question="" value={ans.q8c} onChange={v => set("q8c", v)} />{ans.q8c === "yes" && (<div style={{ paddingLeft: 8, borderLeft: `3px solid ${C.teal}`, marginBottom: 12 }}><SubLabel text="How often?" />{FI_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8c_freq === o.value} onClick={() => set("q8c_freq", o.value)} />)}<SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q8c_bother === o.value} onClick={() => set("q8c_bother", o.value)} />)}</div>)}</div>)}</Card>)}
      {step === 9 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q9. Do you experience a strong sense of urgency and have to rush to the bathroom for a bowel movement?</div><YesNoGate question="" value={ans.q9} onChange={v => set("q9", v)} />{ans.q9 === "yes" && (<div><SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q9_bother === o.value} onClick={() => set("q9_bother", o.value)} />)}</div>)}</Card>)}
      {step === 10 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>Q10. Do you usually have pain when you pass your stool?</div><YesNoGate question="" value={ans.q10} onChange={v => set("q10", v)} />{ans.q10 === "yes" && (<div><SubLabel text="During the last month, on average, how severe was the pain?" />{SEV_PAIN_LAST.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_last === o.value} onClick={() => set("q10_last", o.value)} />)}<SubLabel text="Rate the level of your rectal/anal pain right now." />{SEV_PAIN_NOW.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_now === o.value} onClick={() => set("q10_now", o.value)} />)}<SubLabel text="How much suffering does this cause you?" />{[{ label: "None", value: "none" }, { label: "Mild suffering", value: "mild" }, { label: "Somewhat severe suffering", value: "somewhat" }, { label: "Severe suffering", value: "severe" }, { label: "Extremely severe suffering", value: "extreme" }].map(o => <OptBtn key={o.value} label={o.label} selected={ans.q10_bother === o.value} onClick={() => set("q10_bother", o.value)} />)}</div>)}</Card>)}
      {step === 11 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q11. Does part of your bowel ever pass through the rectum and bulge outside during or after a bowel movement?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>This is known as rectal prolapse — tissue that comes out of the rectum.</div><YesNoGate question="" value={ans.q11} onChange={v => set("q11", v)} />{ans.q11 === "yes" && (<div><SubLabel text="How much does this bother you?" />{BOTHER_5.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q11_bother === o.value} onClick={() => set("q11_bother", o.value)} />)}</div>)}</Card>)}
      {step === 12 && (<Card style={{ borderRadius: 16, padding: 16 }}><div style={{ color: C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Q12. During the past month, how often have you had bleeding during or after a bowel movement?</div><div style={{ color: C.muted, fontSize: 16, marginBottom: 12 }}>Due to your bowel habits.</div>{BLEED_FREQ.map(o => <OptBtn key={o.value} label={o.label} selected={ans.q12 === o.value} onClick={() => set("q12", o.value)} />)}{ans.q12 && ans.q12 !== "never" && (<Callout icon="🩸" color={C.red} bg={C.redLt} body="Rectal bleeding should always be evaluated by your healthcare team — please mention this at your appointment or contact your provider." />)}</Card>)}

      <button onClick={next} disabled={!canProceed()} style={{ width: "100%", borderRadius: 14, padding: "16px 0", background: canProceed() ? C.teal : C.border, color: "#fff", border: "none", fontSize: 17, fontWeight: 700, cursor: canProceed() ? "pointer" : "not-allowed", marginTop: 8, opacity: canProceed() ? 1 : 0.5, fontFamily: "Georgia, serif" }}>
        {step < totalSteps ? "Next question →" : "Show My Report ✓"}
      </button>
      {showEarlyReport && step < totalSteps && (
        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button onClick={() => onComplete(ans)} style={{ background: "none", border: "none", color: C.teal, fontSize: 15, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontFamily: "Georgia, serif" }}>Show my report now (Q{step}–12 optional) →</button>
        </div>
      )}
      {step > 1 && (<button onClick={() => setStep(s => s - 1)} style={{ width: "100%", borderRadius: 14, padding: "10px 0", marginTop: 8, background: "none", color: C.muted, border: `1px solid ${C.border}`, fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>← Back</button>)}
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
        <div style={{ color: C.navy, fontSize: 17, fontWeight: 600 }}>{icon} {label}</div>
        <div style={{ borderRadius: 20, padding: "3px 10px", background: band.bg, color: band.color, fontSize: 15, fontWeight: 700 }}>{band.label}</div>
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
  const score16 = calcIMPACT016(ans);
  const band = impactBand(score16);
  const [shared, setShared] = useState(false);

  // ── V2: Web Share API replaces broken copy button ──
  const summaryForShare = `IMPACT Bowel Survey Results\nComposite Score: ${score16}/16 — ${band?.label || "N/A"}\n${band?.msg || ""}\n\nSymptom Domains:\n${[["Constipation/Evacuation","🚽",constipScore],["Fecal Leakage","💧",fiScore],["Urgency","⚡",urgScore],["Rectal Pain","😣",painScore],["Prolapse Sensation","⬇️",prolapseScore]].filter(([,,s])=>s!==null).map(([l,i,s])=>`${i} ${l}: ${domainBand(s)?.label}`).join("\n")}\n\nFor discussion with your healthcare team — not a diagnosis.\nGenerated by REPAIR (repair-pelvic-floor.netlify.app)`;

  const handleShare = async () => {
    const copyViaTextarea = (t) => {
      const ta = document.createElement("textarea");
      ta.value = t;
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); setShared(true); setTimeout(() => setShared(false), 2000); } catch {}
      document.body.removeChild(ta);
    };

    if (navigator.share) {
      try {
        await navigator.share({ title: "My IMPACT Bowel Survey Results", text: summaryForShare });
        setShared(true); setTimeout(() => setShared(false), 2000);
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(summaryForShare);
      setShared(true); setTimeout(() => setShared(false), 2000);
    } catch {
      copyViaTextarea(summaryForShare);
    }
  };

  return (
    <div>
      <PrivacyNote context="results" />
      {score16 !== null && band && (
        <Card style={{ background: C.tealLight, border: `2px solid ${band.color}`, borderRadius: 16, padding: 16, marginBottom: 16, textAlign: "center" }}>
          <div style={{ color: C.muted, fontSize: 14, marginBottom: 4 }}>IMPACT Composite Score</div>
          <div style={{ color: band.color, fontSize: 56, fontWeight: 900, lineHeight: 1 }}>{score16}</div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 8 }}>out of 16</div>
          <div style={{ display: "inline-block", background: band.color, color: "#fff", borderRadius: 99, padding: "4px 16px", fontSize: 14, fontWeight: 700 }}>{band.label}</div>
          <div style={{ color: C.navy, fontSize: 15, lineHeight: 1.6, marginTop: 12, textAlign: "left" }}>{band.msg}</div>
        </Card>
      )}
      <Card style={{ border: `2px solid ${bristol?.color || C.border}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.muted, fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Stool Type (Bristol Scale)</div>
        <div style={{ color: bristol?.color || C.navy, fontWeight: 700, fontSize: 17, marginBottom: 4 }}>Type {ans.bristol} — {BRISTOL_TYPES.find(t => t.type === ans.bristol)?.desc}</div>
        {bristol && <div style={{ color: C.slate, fontSize: 17, lineHeight: 1.5 }}>{bristol.note}</div>}
      </Card>
      {hasDomainScores && (
        <Card style={{ borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.navy, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Symptom Bother by Domain</div>
          <div style={{ color: C.muted, fontSize: 15, marginBottom: 16 }}>Scale: Not bothersome → Extremely bothersome</div>
          <DomainBar label="Constipation / Evacuation" icon="🚽" score={constipScore} detail={constipScore !== null ? "Average bother across your constipation symptoms" : null} />
          <DomainBar label="Fecal Leakage / Incontinence" icon="💧" score={fiScore} detail={fiScore !== null ? "Most bothersome leakage type reported" : null} />
          <DomainBar label="Urgency" icon="⚡" score={urgScore} />
          <DomainBar label="Rectal / Anal Pain" icon="😣" score={painScore} />
          <DomainBar label="Prolapse Sensation" icon="⬇️" score={prolapseScore} />
          <div style={{ color: C.muted, fontSize: 14, marginTop: 8, lineHeight: 1.5 }}>These domain scores are based on your bother ratings. They are not diagnostic — share them with your healthcare team.</div>
        </Card>
      )}
      {hasLeakage && (
        <Card style={{ border: `2px solid ${C.coral}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.coral, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>💧 Leakage Detail</div>
          {ans.q8a === "yes" && <div style={{ color: C.navy, fontSize: 17, marginBottom: 4 }}>• Solid stool — {ans.q8a_freq} / bother: {ans.q8a_bother}</div>}
          {ans.q8b === "yes" && <div style={{ color: C.navy, fontSize: 17, marginBottom: 4 }}>• Liquid stool — {ans.q8b_freq} / bother: {ans.q8b_bother}</div>}
          {ans.q8c === "yes" && <div style={{ color: C.navy, fontSize: 17 }}>• Gas — {ans.q8c_freq} / bother: {ans.q8c_bother}</div>}
        </Card>
      )}
      {ans.q12 && ans.q12 !== "never" && (
        <Card style={{ border: `2px solid ${C.red}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>🩸 Rectal Bleeding</div>
          <div style={{ color: C.navy, fontSize: 17, marginBottom: 6 }}>Frequency: {ans.q12}</div>
          <div style={{ color: C.red, fontSize: 17, fontWeight: 600 }}>Please make sure to mention this to your healthcare team at your appointment.</div>
        </Card>
      )}
      <Card style={{ background: C.tealLight, border: `2px solid ${C.teal}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>💬 Summary for your healthcare team</div>
        <div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6 }}>{summaryText}</div>
      </Card>
      <Card style={{ background: C.warnLt, border: `1px solid ${C.warn}44`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <div style={{ color: C.warn, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>📅 Before your appointment</div>
        <div style={{ color: C.navy, fontSize: 15, lineHeight: 1.6 }}>Print or screenshot this report to bring with you. Sharing it with your team saves time and opens a better conversation.</div>
      </Card>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={handleShare} style={{ flex: 1, borderRadius: 14, padding: "14px 0", background: C.tealLight, color: C.teal, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
          {shared ? "✓ Sent!" : "📤 Save or send this summary"}
        </button>
      </div>
      <div style={{ color: C.muted, fontSize: 14, textAlign: "center", marginBottom: 12 }}>IMPACT Bowel Function Short Form — Endorsed by ASCRS, AUGS, ICS, SUFU (Bordeianou et al., Dis Colon Rectum 2020)</div>
      <button onClick={onRetake} style={{ width: "100%", borderRadius: 14, padding: "14px 0", background: C.tealLight, color: C.teal, border: `1px solid ${C.teal}`, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia, serif", marginBottom: 16 }}>↩ Retake survey</button>
      {hasLeakage && <VimeoEmbed videoId="743819969" title="Fecal Incontinence — Understanding the Condition" />}
      {hasConstip && <VimeoEmbed videoId="1175949349" title="Constipation & Dyssynergic Defecation" />}
    </div>
  );
};

// ─── CALCULATORS SECTION ──────────────────────────────────────────────────────
const OptionCard = ({ label, selected, onClick, color = C.teal }) => (
  <button onClick={onClick} style={{ width: "100%", textAlign: "left", border: `2px solid ${selected ? color : C.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 10, background: selected ? (color === C.teal ? C.tealLight : C.coralLt) : C.card, display: "flex", alignItems: "center", gap: 14, minHeight: 60, cursor: "pointer", fontFamily: "Georgia, serif" }}>
  <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, border: `2.5px solid ${selected ? color : C.border}`, background: selected ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {selected && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
  </div>
  <span style={{ color: C.navy, fontSize: 16, lineHeight: 1.4, flex: 1 }}>{label}</span>
</button>
);

const CheckCard = ({ label, checked, onClick, color = C.teal }) => (
  <button onClick={onClick} style={{ width: "100%", textAlign: "left", border: `2px solid ${checked ? color : C.border}`, borderRadius: 14, padding: "16px 18px", marginBottom: 10, background: checked ? (color === C.teal ? C.tealLight : C.coralLt) : C.card, display: "flex", alignItems: "center", gap: 14, minHeight: 60, cursor: "pointer", fontFamily: "Georgia, serif" }}>
  <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, border: `2.5px solid ${checked ? color : C.border}`, background: checked ? color : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {checked && <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>✓</span>}
  </div>
  <span style={{ color: C.navy, fontSize: 16, lineHeight: 1.4, flex: 1 }}>{label}</span>
</button>
);

const CalculatorsSection = ({ scores, setScores, primarySymptom, setPrimarySymptom }) => {
  const [step, setStep] = useState(1);
  const [impactAnswers, setImpactAnswers] = useState(null);
  const [impactDone, setImpactDone] = useState(false);
  const SYMPTOM_OPTS = [
    { id: "incontinence", label: "Leakage or inability to control stool or gas" },
    { id: "ods", label: "Difficulty emptying / straining / incomplete evacuation" },
    { id: "constipation", label: "Infrequent bowel movements / constipation" },
    { id: "prolapse", label: "Sensation of bulging, pressure, or tissue coming out" },
    { id: "multiple", label: "Multiple symptoms equally — hard to pick one" },
  ];

  const sympDone = !!primarySymptom;
  const surveyDone = impactDone;

  const handleImpactComplete = (ans) => {
    setImpactAnswers(ans);
    setImpactDone(true);
    setScores(prev => ({ ...prev, impact: ans, impactDone: true }));
  };

  const sympCallout = primarySymptom === "incontinence" ? "Leakage symptoms respond well to surgical repair — an important point for your pre-op conversation."
    : primarySymptom === "ods" || primarySymptom === "constipation" ? "Constipation and difficult evacuation improve in ~60–70% of patients after repair. A frank conversation about expectations is essential."
    : primarySymptom === "prolapse" ? "Surgical repair directly addresses the structural problem. Functional symptoms may follow their own trajectory."
    : "You're experiencing several symptoms. The survey will capture your full picture.";

  const StepDot = ({ n, done, active }) => (
    <div style={{ width: 40, height: 40, borderRadius: "50%", background: done ? C.teal : active ? C.teal : C.border, color: done || active ? "#fff" : C.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: done ? 18 : 17, fontWeight: 700, flexShrink: 0 }}>
      {done ? "✓" : n}
    </div>
  );

  return (
    <div>
      <SectionHeader title="My Symptom Scores" subtitle="Complete each step before your appointment." />
      <PrivacyNote context="survey" />
      <Callout icon="📋" body="Your answers give your healthcare team a clear picture of your symptoms — and help you have a more productive conversation." />

      {/* Step 1 */}
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
          <StepDot n="1" done={sympDone} active={step === 1} />
          <div style={{ width: 2, flex: 1, minHeight: 16, background: sympDone ? C.teal : C.border, marginTop: 4 }} />
        </div>
        <div style={{ flex: 1, paddingLeft: 16, paddingBottom: 8 }}>
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", marginBottom: step === 1 ? 16 : 8, fontFamily: "Georgia, serif" }}>
            <div style={{ color: C.navy, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>What bothers you most?</div>
            {sympDone && step !== 1 && <div style={{ color: C.teal, fontSize: 15, marginTop: 4 }}>✓ {SYMPTOM_OPTS.find(o => o.id === primarySymptom)?.label}</div>}
          </button>
          {step === 1 && (
            <div>
              <div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>Which symptom is affecting your quality of life the most? This matters especially if you're considering surgery.</div>
              {SYMPTOM_OPTS.map(o => <OptionCard key={o.id} label={o.label} selected={primarySymptom === o.id} onClick={() => setPrimarySymptom(o.id)} />)}
              {primarySymptom && (<div><Callout icon="💡" body={sympCallout} /><button onClick={() => setStep(2)} style={{ width: "100%", borderRadius: 14, padding: "16px 0", background: C.teal, color: "#fff", border: "none", fontSize: 17, fontWeight: 700, cursor: "pointer", marginTop: 4, fontFamily: "Georgia, serif" }}>Next: Bowel Survey →</button></div>)}
            </div>
          )}
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
          <StepDot n="2" done={surveyDone} active={step === 2} />
          <div style={{ width: 2, flex: 1, minHeight: 16, background: surveyDone ? C.teal : C.border, marginTop: 4 }} />
        </div>
        <div style={{ flex: 1, paddingLeft: 16, paddingBottom: 8 }}>
          <button onClick={() => sympDone && setStep(2)} style={{ background: "none", border: "none", padding: 0, cursor: sympDone ? "pointer" : "default", textAlign: "left", marginBottom: step === 2 ? 16 : 8, fontFamily: "Georgia, serif" }}>
            <div style={{ color: sympDone || step >= 2 ? C.navy : C.muted, fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>Bowel Survey (IMPACT)</div>
            {surveyDone && step !== 2 && <div style={{ color: C.teal, fontSize: 15, marginTop: 4 }}>✓ Completed</div>}
            {!sympDone && <div style={{ color: C.muted, fontSize: 14, marginTop: 3 }}>Complete Step 1 first</div>}
          </button>
          {step === 2 && (
            <div>
              <Callout body="This is the IMPACT Bowel Function Short Form — validated and endorsed by the Pelvic Floor Disorders Consortium." icon="🔬" />
              {surveyDone && impactAnswers ? <IMPACTResults ans={impactAnswers} onRetake={() => { setImpactDone(false); setImpactAnswers(null); }} />
                : <IMPACTSurvey onComplete={handleImpactComplete} />}
              {surveyDone && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ background: C.tealLight, borderRadius: 14, padding: 20, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🎉</div>
                    <div style={{ color: C.teal, fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Survey complete!</div>
                    <div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>Your responses are ready to share with your healthcare team. For surgical risk and recurrence factors, see the <strong>Considering Surgery</strong> section.</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

// ─── SURGICAL SECTION ────────────────────────────────────────────────────────
const SurgicalSection = ({ speak, stop, speaking }) => {
  const [open, setOpen] = useState(null);
  const [surgRisk, setSurgRisk] = useState([]);
  const [recRisk, setRecRisk] = useState([]);
  const toggle = (id) => setOpen(open === id ? null : id);

  const SURG_RISKS = ["Age over 75", "Active heart disease or recent cardiac event", "Poorly controlled diabetes", "BMI over 35", "Active smoking", "Severe lung disease (COPD, requiring oxygen)", "Kidney disease", "Prior pelvic or abdominal radiation", "Blood thinning medications", "Prior abdominal surgery with complications"];
  const REC_RISKS = [
    { id: "prior", label: "Prior rectal prolapse repair", why: "Previous repair is one of the strongest predictors of recurrence. Scar tissue affects tissue quality and repair durability." },
    { id: "age80", label: "Age over 80", why: "Connective tissue weakens with age; supporting structures are less able to hold a repair long-term." },
    { id: "hyper", label: "Connective tissue disorder / joint hypermobility", why: "People with generalized connective tissue laxity have higher recurrence risk." },
    { id: "straining", label: "Chronic straining / constipation", why: "⭐ Modifiable. Optimizing bowel habits before surgery significantly improves outcomes." },
    { id: "obesity", label: "BMI ≥ 30", why: "⭐ Modifiable. Even modest weight loss can meaningfully reduce intra-abdominal pressure on the repair." },
  ];

  const sections = [
    { id: "what", q: "What is the surgery?", content: (<div><div style={{ color: C.navy, fontSize: 17, lineHeight: 1.7, marginBottom: 16 }}>The most common surgery for rectal prolapse is called <strong>rectopexy</strong> — the rectum is secured to the tailbone (sacrum) to stop it from prolapsing. It is usually done laparoscopically (keyhole surgery) or robotically, with small incisions.</div><VimeoEmbed videoId="1180494424" title="Rectopexy Surgical Animation" /><Card style={{ borderRadius: 14, padding: 14 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>What to expect in recovery</div>{["Hospital stay varies — often 1–3 days depending on approach", "Bowel function may be temporarily altered in the weeks after surgery", "Pelvic floor PT is often recommended post-operatively", "Fiber, hydration, and straining avoidance remain important after repair", "Symptom improvement may be gradual — allow time for full assessment"].map((t, i) => (<div key={i} style={{ display: "flex", gap: 10, marginBottom: 10 }}><span style={{ color: C.teal, flexShrink: 0 }}>→</span><span style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{t}</span></div>))}</Card></div>) },
    { id: "happen", q: "What will happen to my symptoms?", content: (<div><Callout icon="⭐" color={C.coral} bg={C.coralLt} title="The most important thing to understand" body="Fixing the anatomy does not guarantee fixing the function. This is something your care team should discuss with you openly before any procedure." />{[{ title: "Fecal Incontinence & Leakage", icon: "💧", good: true, body: "Surgery for rectal prolapse is more likely to improve leakage and incontinence. If this is your most bothersome symptom, the evidence is more reassuring." }, { title: "Constipation & Difficult Evacuation", icon: "🚽", good: false, body: "Improvement is less predictable — around 60–70% of patients see improvement, meaning 30–40% may not. If straining is your primary complaint, discuss this honestly with your care team first." }].map(s => (<Card key={s.title} style={{ border: `2px solid ${s.good ? C.teal : C.warn}`, borderRadius: 14, padding: 14, marginBottom: 12 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><span style={{ fontSize: 22 }}>{s.icon}</span><span style={{ color: C.navy, fontWeight: 700, fontSize: 16, flex: 1 }}>{s.title}</span><span style={{ background: s.good ? C.tealLight : C.warnLt, color: s.good ? C.teal : C.warn, borderRadius: 20, padding: "3px 10px", fontSize: 13, fontWeight: 700 }}>{s.good ? "More predictable" : "Less predictable"}</span></div><div style={{ color: C.navy, fontSize: 16, lineHeight: 1.7 }}>{s.body}</div></Card>))}<Callout icon="💙" body="If surgery doesn't resolve everything, that is not a failure. Pelvic floor PT, lifestyle changes, and follow-up care all remain part of the picture." /></div>) },
    { id: "mesh", q: "Will I need mesh?", content: (<div><Callout body="Not all rectopexy procedures use mesh. Your care team will explain what they recommend and why. The information below supports an informed conversation." icon="ℹ️" />{[{ type: "Synthetic Mesh", icon: "🔩", desc: "Permanent synthetic material (polypropylene). Durable and widely used.", erosion: "~1.8% erosion rate", rec: "~15% recurrence" }, { type: "Biologic Mesh", icon: "🧬", desc: "Biologic material works by helping your body grow new, stronger tissue over time.", erosion: "~0.7% erosion rate", rec: "~15% recurrence" }, { type: "Suture Only — No Mesh", icon: "🪡", desc: "Rectum secured with sutures alone. A valid option for many patients.", erosion: "No mesh — no erosion risk", rec: "~15% recurrence" }].map(m => (<Card key={m.type} style={{ borderRadius: 14, padding: 14, marginBottom: 10 }}><div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}><span style={{ fontSize: 22 }}>{m.icon}</span><span style={{ color: C.navy, fontWeight: 700, fontSize: 16 }}>{m.type}</span></div><div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6, marginBottom: 10 }}>{m.desc}</div><div style={{ display: "flex", gap: 24 }}><div><div style={{ color: C.muted, fontSize: 13, textTransform: "uppercase" }}>Erosion</div><div style={{ color: C.navy, fontSize: 15, fontWeight: 600 }}>{m.erosion}</div></div><div><div style={{ color: C.muted, fontSize: 13, textTransform: "uppercase" }}>Recurrence</div><div style={{ color: C.navy, fontSize: 15, fontWeight: 600 }}>{m.rec}</div></div></div></Card>))}}
    { id: "risk", q: "Am I a good candidate for surgery?", content: (<div><div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>Select any factors that apply to you. This helps you start an informed conversation with your care team about surgical risk.</div>{SURG_RISKS.map(r => (<CheckCard key={r} label={r} checked={surgRisk.includes(r)} onClick={() => setSurgRisk(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])} />))}<Card style={{ background: C.tealLight, borderRadius: 14, padding: 14, marginTop: 4 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{surgRisk.length === 0 ? "✅ No risk factors identified" : `${surgRisk.length} factor${surgRisk.length > 1 ? "s" : ""} to discuss`}</div><div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{surgRisk.length === 0 ? "Reassuring — your team will do their own full pre-op assessment." : "Bring these to your consultation. Your team can explain how they affect your individual risk."}</div></Card></div>) },
    { id: "recurrence", q: "Could prolapse come back after surgery?", content: (<div><Callout body="Yes — rectal prolapse can recur after surgery. Knowing your risk factors helps you and your care team make the best plan. Some factors can be improved before surgery." icon="🔄" />{REC_RISKS.map(r => (<div key={r.id}><CheckCard label={r.label} checked={recRisk.includes(r.id)} onClick={() => setRecRisk(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])} color={C.coral} />{recRisk.includes(r.id) && (<div style={{ background: C.coralLt, borderRadius: 12, padding: "12px 16px", marginTop: -6, marginBottom: 10 }}><div style={{ color: C.slate, fontSize: 15, lineHeight: 1.6 }}>{r.why}</div></div>)}</div>))}{recRisk.length > 0 && (<Card style={{ background: C.tealLight, borderRadius: 14, padding: 14 }}><div style={{ color: C.teal, fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{recRisk.length} factor{recRisk.length > 1 ? "s" : ""} identified</div><div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>Bring this to your appointment. The more your team knows, the better they can plan with you.</div></Card>)}</div>) },
    { id: "questions", q: "What should I ask my care team?", content: (<div><div style={{ color: C.slate, fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>These are questions worth raising at your consultation. To print them, tap <strong>☰ Menu → Generate My Summary</strong> — they'll appear in your pre-appointment report.</div>{["What type of rectopexy are you recommending and why?", "Will mesh be used? What are the implications for my situation?", "What is the expected recurrence rate for me specifically?", "My most bothersome symptom is [leakage / constipation / prolapse] — how likely is surgery to improve this?", "What happens to my bowel function after surgery?", "What if my symptoms don't improve — what options remain?", "What should I do before surgery to optimize my outcome?", "Should I see a pelvic floor physical therapist before or after surgery?", "What is your personal experience and complication rate with this procedure?"].map((q, i) => (<Card key={i} style={{ borderRadius: 14, padding: 14, marginBottom: 10 }}><div style={{ display: "flex", gap: 14 }}><div style={{ color: C.teal, fontWeight: 800, fontSize: 17, flexShrink: 0, minWidth: 32 }}>Q{i + 1}</div><div style={{ color: C.navy, fontSize: 16, lineHeight: 1.6 }}>{q}</div></div></Card>))}<Callout body="Surgery is one part of the picture. Lifestyle work — fiber, movement, pelvic floor PT, stress management — remains important before and after any procedure." icon="🌿" /></div>) },
  ];

  return (
    <div>
      <SectionHeader title="Considering Surgery" subtitle="Honest, patient-friendly information to help you prepare and ask better questions." />
      <Callout body="Not sure if surgery is right for you? That's a completely normal place to be. This section helps you understand your options — at your own pace." icon="💙" />
      {sections.map((s, i) => (
        <div key={s.id} style={{ marginBottom: 4 }}>
          <button onClick={() => toggle(s.id)} style={{ width: "100%", textAlign: "left", background: open === s.id ? C.tealLight : C.card, border: `2px solid ${open === s.id ? C.teal : C.border}`, borderRadius: open === s.id ? "14px 14px 0 0" : 14, padding: "18px 20px", marginBottom: 2, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: open === s.id ? C.teal : C.tealLight, color: open === s.id ? "#fff" : C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{i + 1}</div>
            <span style={{ color: C.navy, fontWeight: 700, fontSize: 17, flex: 1, lineHeight: 1.3 }}>{s.q}</span>
            <span style={{ color: C.muted, fontSize: 20 }}>{open === s.id ? "▲" : "▼"}</span>
          </button>
          {open === s.id && (<div style={{ background: C.card, border: `2px solid ${C.teal}`, borderTop: "none", borderRadius: "0 0 14px 14px", padding: "16px 16px 20px", marginBottom: 12 }}>{s.content}</div>)}
        </div>
      ))}
    </div>
  );
};

// ─── RED FLAGS ────────────────────────────────────────────────────────────────
const RedFlagsSection = ({ speak, stop, speaking }) => (
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
      <Card key={f.label} style={{ border: `2px solid ${C.red}44`, borderRadius: 16, padding: 16, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 26 }}>{f.icon}</span>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 15 }}>{f.label}</div>
        </div>
        <div style={{ color: C.navy, fontSize: 17, lineHeight: 1.6, marginBottom: 8 }}>{f.desc}</div>
        <div style={{ background: C.redLt, borderRadius: 8, padding: "8px 12px" }}>
          <div style={{ color: C.red, fontWeight: 700, fontSize: 13 }}>Action: {f.urgency}</div>
        </div>
      </Card>
    ))}
    <Card style={{ background: C.navyMid, borderRadius: 16, padding: 16 }}>
      <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>When in doubt</div>
      <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 17, lineHeight: 1.6 }}>If you're unsure whether a symptom is a red flag, it's always better to contact your healthcare team than to wait. You know your body — trust that instinct.</div>
    </Card>
  </div>
);

// ─── CHATBOT ─────────────────────────────────────────────────────────────────
// System prompt version: V2 — April 2026
// Clinical author: Dr. Brooke Gurland, Stanford Colorectal Surgery
// Evidence base: Bungo et al. DCR 2024; Perry et al. DCR 2025; Emile et al. 2025
// Do not edit without updating REPAIR_Chatbot_Development_Log

const TRACK1_ADDITION = `

═══════════════════════════════════
ADAPTIVE STYLE — THIS PATIENT: DEPTH & RESEARCH
═══════════════════════════════════
This patient has indicated they want more detail and research. Adjust your responses:
- Write at Flesch-Kincaid Grade 9–11 (slightly longer sentences; clinical vocabulary permitted)
- Clinical vocabulary is permitted but must still be defined on first use
- Include relevant published data when available: "Published studies report..." or "Research shows approximately..."
- Only cite statistics you have a verified source for. If asked for a number you cannot source, say: "There is published data on this — your provider can pull the specific studies, or search PubMed for [specific terms]."
- Explain the mechanism — why does this happen in the body?
- If a patient cites a meta-analysis or published research, engage with it in general educational terms rather than deflecting
- Still warm in tone. Data and empathy are not mutually exclusive.`;

const SYSTEM_PROMPT = `You are a warm, knowledgeable patient education assistant embedded in the REPAIR app — a free, clinician-authored tool for patients with rectal prolapse, bowel dysfunction, and pelvic floor disorders. The app was created by a colorectal surgeon and lifestyle medicine physician at Stanford.

Your role is to educate patients in plain language, help them understand their conditions, and prepare meaningful questions for their appointments. You are not a doctor, not a diagnosis tool, and not a substitute for clinical care.

═══════════════════════════════════
PROVENANCE & IDENTITY SOURCE
═══════════════════════════════════
You were built by colorectal surgeons and pelvic floor specialists at Stanford. Your answers come from what your specialist team wants patients to know — not from general internet knowledge. When a question is outside your scope, say so clearly and direct the patient back to their care team. You do not need to say "I'm not ChatGPT" or compare yourself to other AI tools. Simply be what you are: a specialist-built companion for pelvic floor patients.

═══════════════════════════════════
READING LEVEL & WRITING RULES
═══════════════════════════════════
Write at a Flesch-Kincaid Grade 7–9 (unless the patient has been identified as preferring depth and research — see ADAPTIVE STYLE below).

Every sentence must be under 20 words. One idea per sentence. No embedded clauses.

Use the simplest everyday word. When a medical term is needed, immediately explain it in plain English in the same sentence — for example: "the rectum (the last part of your bowel)."

Use "you" and "your body" throughout. Keep responses personal and direct.

Replace hedging phrases with direct statements. Instead of "this needs to be weighed against potential benefits" say "ask your provider directly."

Normalize before educating. Lead with "Many people feel this way" or "You're not alone" before explaining mechanism.

When a patient shares an emotional experience, validate directly. Do not hedge empathy with "probably," "might have," or "it sounds like." Say "That must have been hard" — not "That probably felt difficult."

Follow-up questions must also be short and plain. "Which surgery are you getting ready for?" not "What type of pelvic floor surgery are you preparing for?"

Keep responses to 3–5 short sentences for most answers. End with one warm follow-up question when appropriate.

═══════════════════════════════════
PROVIDER LANGUAGE — CRITICAL
═══════════════════════════════════
NEVER default to "surgeon" or "surgical team" unless the patient has explicitly used those words in this conversation.

Use instead: "your healthcare team," "your provider," "your specialist," or "your care team."

This app serves patients across colorectal surgery, gastroenterology, urogynecology, primary care, pelvic floor physical therapy, and nursing — not all patients are on a surgical path.

═══════════════════════════════════
SCOPE
═══════════════════════════════════
IN SCOPE: Rectal prolapse, rectocele, intussusception, fecal incontinence, constipation, obstructed defecation, pelvic floor anatomy, imaging tests (defecography, MRI, anorectal manometry, endoanal ultrasound, transit studies), lifestyle medicine and pelvic floor health, surgical options in general terms, mesh and biologic materials in general terms, pelvic floor physical therapy, biofeedback in general terms, pre-appointment preparation.

OUT OF SCOPE — redirect gracefully: Conditions primarily involving the esophagus, stomach, or upper GI tract (achalasia, dysphagia, gastroparesis, gastric dysrhythmia). Say: "That's outside what I know well — your gastroenterologist is the right person for that question."

NEVER DO:
- Diagnose any individual patient
- Recommend specific medications by name or dose
- Recommend a specific surgical procedure for an individual patient
- Interpret a patient's own test results
- Generate a list of procedures based on a patient's specific test findings — ARM results plus "what procedure?" = redirect, not a recommendation list
- Predict how a specific named provider will feel or respond
- Speak on behalf of a named clinician
- Cite a statistic you cannot source — if you don't have a verified source, say so and direct the patient to ask their provider or search PubMed

═══════════════════════════════════
CLINICAL GUARDRAILS — MESH & MATERIALS
═══════════════════════════════════
Biologic mesh mechanism: Say "Biologic material works by helping your body grow new, stronger tissue over time." Do NOT say it "may not hold as long" or is less durable than synthetic — this is clinically inaccurate per international expert consensus (Perry et al. DCR 2025).

Synthetic vs. biologic mesh: Do NOT claim one is more durable or safer than the other. There is no significant difference in prolapse recurrence between the two per published consensus. If a patient's provider says they are equally durable, that is correct.

De novo pain after ventral mesh rectopexy: Published data (Perry et al. 2025) reports 12–31% of patients experience de novo pain, particularly when obstructed defecation was the indication, age under 50, or revisional surgery. Only cite this for patients who ask specifically about pain outcomes and want research detail.

Dyspareunia after surgery: Do NOT cite a specific percentage — no verified published statistic exists for this. Say: "Most people find their comfort with intimacy stays the same or improves — but de novo pain can occur in some cases. Your provider can share their own outcomes data, which is the most relevant number for you."

Recurrence after ventral rectopexy: Published systematic reviews report 0–18.8% recurrence — a wide range reflecting varied techniques and follow-up periods. Always add: "Your provider's own outcomes data matters more than population averages."

Biofeedback for dyssynergic defecation: There is published meta-analysis data on this. If a patient asks for specific numbers, say: "There are published meta-analyses on biofeedback for this condition. Search PubMed for 'biofeedback dyssynergic defecation systematic review' — your provider can review the specific studies with you."

Prolapse prevalence framing: Do NOT say rectal prolapse is "the most common" type of prolapse or imply it leads the list. Vaginal prolapse (including cystocele) is more prevalent overall. When listing types that affect the bowel, say: "Types that affect the bowel include rectal prolapse, rectocele, and internal prolapse." Do not rank them by prevalence.

Colostomy: Clarify it is rare for elective pelvic floor surgery. Do not use "bowel diversion" without explaining it.

Complication rates: Do not give specific percentages for individual complication risk. Direct patients to ask their own provider for their specific outcomes data.

Exercise after prolapse surgery: State the governing principle once: "For any high-impact or high-pressure activity after prolapse surgery, the general rule is to wait for your provider's clearance. That covers squats, jump rope, and similar exercises." Do not deflect each exercise question individually.

Provider credibility: If a patient questions their provider's competence, do not validate criticism or take sides. Acknowledge that clinical opinions sometimes differ: "Providers sometimes disagree on this — it's worth asking your provider to explain the evidence behind their recommendation."

═══════════════════════════════════
STATISTICS — WHAT MAY AND MAY NOT BE CITED
═══════════════════════════════════
ONLY cite statistics from verified published sources. If you do not have a verified source, do not cite a number.

APPROVED TO CITE (with source context):
- 41.5% of patients cannot find relevant information about prolapse online (Bungo et al. 2024)
- De novo pain after VMR: 12–31% (Perry et al. 2025, specific patient subgroups)
- Prolapse recurrence after VR: 0–18.8% range (systematic review data, wide range — contextualize)

BANNED — DO NOT USE (unverified, fabricated):
- "80–90% return to comfortable intimacy after rectocele repair" — no source exists
- Any specific biofeedback response rate cited without attribution

═══════════════════════════════════
CRISIS & EMERGENCY RESPONSE
═══════════════════════════════════
ACTIVE EMERGENCY SYMPTOMS (rectal bleeding actively occurring, severe acute pain, tissue that won't reduce, fever with anorectal symptoms, complete inability to pass stool): Say immediately: "These symptoms need attention today. Please contact your healthcare team right away or go to an emergency department if you're unsure. Don't wait."

IMPORTANT — do not over-trigger: A patient discussing a surgical risk their provider mentioned ("my surgeon mentioned the risk of bleeding") is NOT an emergency. Assess context before escalating.

SUICIDAL IDEATION: If a patient expresses any thought of self-harm or suicide, immediately provide: "Please reach out for support right now. Call or text 988 (Suicide and Crisis Lifeline) — available 24/7. Or text HELLO to 741741 (Crisis Text Line). You don't have to go through this alone." Stay present and warm. Keep redirecting gently across multiple exchanges. Hold the concern: "I'm still thinking about what you shared — are you doing okay right now?"

PATIENT CANNOT ACCESS CARE: If a patient expresses they are alone and cannot reach their provider or get to care, escalate creatively and persistently. Suggest calling 911, going to a neighbor, a public place, or calling for help.

═══════════════════════════════════
ADAPTIVE LISTENING STYLE
═══════════════════════════════════
Default to plain language (Grade 7–9). After a substantive exchange, check in once per session:
"Is this helpful? I can go two ways from here — more detail and research if you want to really understand the science, or keep it focused on what's practical and what others find helpful. What feels right?"

If the patient signals they want more depth ("tell me the research," "what does the data say," "I want to understand the science"), shift to Track 1 style (Grade 9–11, cite published data where verified).

═══════════════════════════════════
AI IDENTITY
═══════════════════════════════════
If asked whether you are AI: "Yes — I'm an AI, not a real person. I can help explain pelvic floor topics and help you prepare for your appointment. For anything personal or urgent, your care team is always the right call."

═══════════════════════════════════
ALWAYS CLOSE WITH
═══════════════════════════════════
Every substantive clinical response closes with direction to the patient's healthcare team. Keep it warm and brief: "Your care team can help with that — they know your full picture."`;

// V2 red flag detection — context-aware, does not over-trigger on informational mentions
const INFORMATIONAL_CONTEXT = ["mentioned", "told me", "risk of", "discussed", "said there was", "warned about", "asked about", "reading about", "heard that", "does it cause"];
const RED_FLAG_KEYWORDS = ["bleeding actively", "blood coming out", "can't push back", "stuck outside", "won't go back", "severe pain", "excruciating", "fever", "emergency", "purple tissue", "dark tissue", "can't pass stool"];

// ── V2 CHATBOT — now supports inline={true} for home screen use ───────────────
const Chatbot = ({ appState, onClose, chatMessages, setChatMessages, inline = false, starterPrompt = null }) => {
  const messages = chatMessages;
  const setMessages = setChatMessages;
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(messages.length === 0 && !starterPrompt);
  const [shared, setShared] = useState(false);
  const [listeningStyle, setListeningStyle] = useState(null);
  const [hasAskedStyle, setHasAskedStyle] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const starterFired = useRef(false);

  const starters = [
    "What is the difference between internal and external prolapse?",
    "Why do I feel like I can't empty fully?",
    "What questions should I ask my care team about rectopexy?",
    "How does diet affect my pelvic floor?",
  ];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // Fire starter prompt once on mount if provided
  useEffect(() => {
    if (starterPrompt && !starterFired.current && messages.length === 0) {
      starterFired.current = true;
      send(starterPrompt);
    }
  }, [starterPrompt]);

  const buildContext = () => {
    const lines = [];
    if (appState.section) lines.push(`Patient is in the "${appState.section}" section.`);
    if (appState.primarySymptom) lines.push(`Primary bothersome symptom: ${appState.primarySymptom}.`);
    if (listeningStyle === "depth") lines.push("Patient has requested depth and research style (Track 1).");
    if (listeningStyle === "practical") lines.push("Patient has requested practical, concise style (Track 2).");
    return lines.length ? `\n\nPATIENT CONTEXT (use to personalize — do not repeat back verbatim):\n${lines.join("\n")}` : "";
  };

  const isActiveEmergency = (text) => {
    const lower = text.toLowerCase();
    const hasRedFlag = RED_FLAG_KEYWORDS.some(k => lower.includes(k));
    if (!hasRedFlag) return false;
    const hasInfoContext = INFORMATIONAL_CONTEXT.some(c => lower.includes(c));
    return !hasInfoContext;
  };

  const shouldAskStyle = (replyText) => !hasAskedStyle && replyText.length > 300;

  const detectStyleChoice = (text) => {
    const lower = text.toLowerCase();
    const depthSignals = ["detail", "research", "data", "science", "statistics", "study", "studies", "evidence", "published", "more information", "deep", "technical"];
    const practicalSignals = ["simple", "short", "practical", "what to do", "keep it simple", "plain", "easy", "basics"];
    if (depthSignals.some(s => lower.includes(s))) return "depth";
    if (practicalSignals.some(s => lower.includes(s))) return "practical";
    return null;
  };

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setShowStarters(false);
    const styleChoice = detectStyleChoice(text);
    if (styleChoice && hasAskedStyle) setListeningStyle(styleChoice);
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const systemWithContext = (listeningStyle === "depth" ? SYSTEM_PROMPT + TRACK1_ADDITION : SYSTEM_PROMPT) + buildContext();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, listeningStyle }),
      });
      const data = await res.json();
      let reply = data.reply || "I'm sorry, I couldn't process that response.";
      if (isActiveEmergency(text)) {
        reply = "⚠️ What you're describing may need prompt attention. Please contact your healthcare team today or go to an emergency department if you're unsure. Don't wait.\n\n" + reply;
      }
      if (shouldAskStyle(reply)) {
        reply += "\n\n---\nIs this helpful? I can go two ways from here — more detail and research if you want to really understand the science, or keep it focused on what's practical and what others find helpful. What feels right?";
        setHasAskedStyle(true);
      }
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  // ── V2: Web Share API replaces broken copy button ──
  const handleShare = async () => {
    const clean = (str) => str
      .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
      .replace(/[⚠️💙🔒📋📅→•✓]/g, "")
      .replace(/\*\*/g, "")
      .trim();
    const lines = messages.map(m =>
      `${m.role === "user" ? "Me" : "REPAIR"}:\n${clean(m.content)}`
    );
    const text = lines.join("\n\n---\n\n");

    // iOS-safe copy using textarea + execCommand
    const copyViaTextarea = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "0";
      ta.style.left = "0";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {}
      document.body.removeChild(ta);
    };

    // Try Web Share API first (native iOS share sheet)
    if (navigator.share) {
      try {
        await navigator.share({ title: "My REPAIR conversation", text });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch {}
    }

    // Try clipboard API, fall back to textarea
    try {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      copyViaTextarea();
    }
  };

  // Inline mode: render chat content directly (no fixed modal wrapper)
  const chatContent = (
    <>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: inline ? "0 0 8px" : "20px 16px 8px", display: "flex", flexDirection: "column", minHeight: 180 }}>
        {showStarters && messages.length === 0 && (
          <div>
            <div style={{ color: C.slate, fontSize: 17, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>Ask me anything, or tap a topic below:</div>
            {starters.map((s, i) => (
              <button key={i} onClick={() => send(s)} style={{ width: "100%", textAlign: "left", background: C.card, border: `2px solid ${C.teal}`, borderRadius: 16, padding: "16px 20px", marginBottom: 12, color: C.navy, fontSize: 17, lineHeight: 1.5, cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 14, minHeight: 60 }}>
                <span style={{ color: C.teal, fontSize: 22, flexShrink: 0 }}>→</span>
                <span>{s}</span>
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 16, alignItems: "flex-end", gap: 10 }}>
            {m.role === "assistant" && (<div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0, marginBottom: 2 }}>🌿</div>)}
            <div style={{ maxWidth: "82%", background: m.role === "user" ? C.teal : C.card, color: m.role === "user" ? "#fff" : C.navy, fontSize: 16, lineHeight: 1.7, padding: "14px 18px", borderRadius: m.role === "user" ? "20px 20px 6px 20px" : "20px 20px 20px 6px", border: m.role === "assistant" ? `1px solid ${C.borderSoft}` : "none", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
            {m.role === "user" && (<div style={{ width: 34, height: 34, borderRadius: "50%", background: C.navyMid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, color: "#fff", fontWeight: 700 }}>You</div>)}
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🌿</div>
            <div style={{ background: C.card, borderRadius: "20px 20px 20px 6px", padding: "14px 18px", border: `1px solid ${C.borderSoft}`, display: "flex", alignItems: "center", gap: 8 }}>
              {[0, 1, 2].map(n => (<div key={n} style={{ width: 10, height: 10, borderRadius: "50%", background: C.tealMid, animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite` }} />))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 14px 14px", flexShrink: 0, background: C.card }}>
        {messages.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
            <div style={{ background: C.tealLight, border: `1px solid ${C.teal}33`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: C.slate, lineHeight: 1.5 }}>
              💡 Want a formatted summary to bring to your appointment? Tap <strong style={{ color: C.teal }}>☰ Menu → Generate My Summary</strong> — it includes your conversation, symptom scores, and questions for your care team in one printable report.
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: C.muted, fontSize: 12 }}>Or save just this conversation:</div>
              <button onClick={handleShare} style={{ background: "none", border: "none", color: C.teal, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                {shared ? "✓ Saved!" : "📤 Save or send"}
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <input ref={inputRef} value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); send(input); } }}
            placeholder="Ask me anything…"
            style={{ flex: 1, background: "#f4f8fb", border: `2px solid ${C.border}`, borderRadius: 18, padding: "14px 16px", fontSize: 16, color: C.navy, fontFamily: "Georgia, serif", lineHeight: 1.5, outline: "none" }}
            onFocus={e => e.target.style.borderColor = C.teal}
            onBlur={e => e.target.style.borderColor = C.border} />
          <button onClick={() => send(input)} disabled={!input.trim() || loading}
            style={{ width: 50, height: 50, borderRadius: "50%", background: input.trim() && !loading ? C.teal : C.border, border: "none", fontSize: 20, color: "#fff", cursor: input.trim() && !loading ? "pointer" : "not-allowed", flexShrink: 0 }}>↑</button>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, padding: "0 4px" }}>
          <div style={{ color: C.teal, fontSize: 11.5, fontWeight: 600 }}>🔒 Private · Not saved</div>
          <div style={{ color: C.muted, fontSize: 11.5 }}>For education · Not medical advice</div>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; } }`}</style>
    </>
  );

  // Inline mode: no modal wrapper
  if (inline) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Back to home link */}
        {messages.length > 0 && (
          <div style={{ padding: "8px 16px 0", flexShrink: 0 }}>
            <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif", textDecoration: "underline", textUnderlineOffset: 3 }}>← Start over</button>
          </div>
        )}
        {chatContent}
      </div>
    );
  }

  // Modal mode: for section-page chatbot (existing behavior)
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div style={{ background: C.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)" }}>
        {/* Modal header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealMid})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🌿</div>
            <div>
              <div style={{ color: C.navy, fontWeight: 800, fontSize: 20, lineHeight: 1.1 }}>Ask REPAIR</div>
              <div style={{ color: C.teal, fontSize: 15, fontWeight: 600, marginTop: 2 }}>Here to educate — not to diagnose</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {messages.length > 0 && (
              <button onClick={handleShare} style={{ background: C.tealLight, border: "none", borderRadius: 10, padding: "8px 12px", color: C.teal, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                {shared ? "✓ Saved!" : "📤 Save"}
              </button>
            )}
            <button onClick={onClose} style={{ width: 48, height: 48, borderRadius: "50%", background: "#f0f4f8", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.slate, cursor: "pointer" }}>✕</button>
          </div>
        </div>
        <div style={{ background: C.tealLight, borderBottom: `1px solid ${C.border}`, padding: "10px 20px", flexShrink: 0 }}>
          <div style={{ color: C.teal, fontSize: 14, lineHeight: 1.5, fontWeight: 500 }}>🔒 Private · Not saved after you close · Not a substitute for medical advice.</div>
        </div>
        {chatContent}
      </div>
    </div>
  );
};

// ─── PRINT SUMMARY ────────────────────────────────────────────────────────────
const PrintSummary = ({ scores, primarySymptom, chatMessages = [] }) => {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const score16 = scores.impactDone && scores.impact ? calcIMPACT016(scores.impact) : null;
  const band = impactBand(score16);
  const cleanText = (str) => str.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/[⚠️💙🔒📋📅→•✓⭐🌿🌱]/g, "").trim();

  return (
    <div style={{ fontFamily: "Georgia, serif", maxWidth: 700, margin: "0 auto", padding: 32, color: "#1a2e3b" }}>
      <div style={{ textAlign: "center", marginBottom: 32, borderBottom: "2px solid #2d7d6f", paddingBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#2d7d6f" }}>REPAIR</div>
        <div style={{ fontSize: 16, color: "#4a6278" }}>Pre-Appointment Summary</div>
        <div style={{ fontSize: 14, color: "#7a8fa6", marginTop: 4 }}>Prepared: {now} · For discussion with your healthcare team — not a medical record</div>
      </div>

      {/* V2: Save reminder */}
      <div style={{ background: "#fff3cd", border: "1px solid #f4a261", borderRadius: 10, padding: "12px 14px", marginBottom: 24, fontSize: 14, color: "#1a2e3b", fontWeight: 600, textAlign: "center" }}>
        ⚠️ Save or print this now — it won't be here when you return.
      </div>

      <div style={{ background: "#f0f7f5", borderRadius: 10, padding: "10px 14px", marginBottom: 24, fontSize: 13, color: "#4a6278" }}>
        🔒 These results are private. They're yours to keep, share with your doctor, or discard — entirely your choice.
      </div>

      {primarySymptom && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>1. My Primary Bothersome Symptom</div>
          <div style={{ fontSize: 16, color: "#1a2e3b" }}>The symptom that bothers me most: <strong>{primarySymptom}</strong></div>
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>2. My Bowel Survey (IMPACT)</div>
        {scores.impactDone && scores.impact ? (
          <div>
            {score16 !== null && band && (
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: band.color }}>{score16}/16</span>
                <span style={{ fontSize: 15, color: "#4a6278", marginLeft: 8 }}>— {band.label}</span>
                <div style={{ fontSize: 14, color: "#1a2e3b", lineHeight: 1.6, marginTop: 4 }}>{band.msg}</div>
              </div>
            )}
            <div style={{ fontSize: 14, color: "#1a2e3b", lineHeight: 1.6, marginBottom: 10 }}>{impactSummaryText(scores.impact)}</div>
          </div>
        ) : (
          <div style={{ color: "#7a8fa6", fontSize: 14 }}>IMPACT Bowel Function Survey not yet completed.</div>
        )}
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>3. Questions for My Appointment</div>
        {["What realistic improvement I can expect in my specific symptoms", "Lifestyle or non-surgical options I should pursue first or alongside treatment", "Whether I should see a pelvic floor physical therapist", "Whether surgery is appropriate for my situation"].map((q, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 14 }}>
            <span style={{ color: "#2d7d6f", fontWeight: 700 }}>□</span>
            <span>{q}</span>
          </div>
        ))}
      </div>

      {chatMessages.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#2d7d6f", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>4. My Conversation with REPAIR</div>
          <div style={{ fontSize: 12, color: "#7a8fa6", marginBottom: 12, fontStyle: "italic" }}>Questions I asked and answers I received — for reference in my appointment.</div>
          {chatMessages.map((m, i) => (
            <div key={i} style={{ marginBottom: 12, paddingLeft: m.role === "user" ? 0 : 16, borderLeft: m.role === "assistant" ? "3px solid #2d7d6f" : "none" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: m.role === "user" ? "#1a2e3b" : "#2d7d6f", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{m.role === "user" ? "Me" : "REPAIR"}</div>
              <div style={{ fontSize: 14, color: "#1a2e3b", lineHeight: 1.6 }}>{cleanText(m.content)}</div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 12, color: "#7a8fa6", textAlign: "center", marginTop: 32, borderTop: "1px solid #dde7ef", paddingTop: 16 }}>
        Generated by REPAIR — a free patient education app built by colorectal surgeons and pelvic floor specialists. For educational purposes only. Not a medical record.
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("home");
  const [chatOpen, setChatOpen] = useState(false);       // modal chatbot for section pages
  const [menuOpen, setMenuOpen] = useState(false);
  const [scores, setScores] = useState({});
  const [primarySymptom, setPrimarySymptom] = useState(null);
  const [showPDF, setShowPDF] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  // V2 home chat state
  const [homeChatStarted, setHomeChatStarted] = useState(false);
  const [starterPrompt, setStarterPrompt] = useState(null);

  const currentNav = NAV.find(n => n.id === section);
  const appState = { section, primarySymptom, scores };

  const handleStartChat = (prompt) => {
    setStarterPrompt(prompt);
    setHomeChatStarted(true);
  };

  const handleHomeChatClose = () => {
    setHomeChatStarted(false);
    setStarterPrompt(null);
    setChatMessages([]);
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", height: "100vh" }}>

      {/* TOP BAR */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, padding: "12px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", fontSize: 22, color: C.navy, cursor: "pointer", padding: 4 }}>☰</button>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: C.teal, fontWeight: 800, fontSize: 17, letterSpacing: 0.3 }}>🌿 REPAIR</div>
            <div style={{ color: C.muted, fontSize: 10.5, letterSpacing: 0.7, textTransform: "uppercase", fontWeight: 600, marginTop: 1 }}>Pelvic floor companion</div>
          </div>
          <div style={{ width: 30 }} />
        </div>
        {section !== "home" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <button onClick={() => setSection("home")} style={{ background: "none", border: "none", color: C.muted, fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }}>Home</button>
            <span style={{ color: C.muted, fontSize: 13 }}>›</span>
            <span style={{ color: C.teal, fontSize: 14, fontWeight: 600 }}>{currentNav?.label}</span>
          </div>
        )}
      </div>

      {/* V2: Credentials strip — always visible */}
      <CredentialsStrip />

      {/* V2 SIMPLIFIED HAMBURGER MENU */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: C.card, padding: "48px 0 24px", overflowY: "auto" }}>
            <div style={{ padding: "0 24px 16px" }}>
              <div style={{ color: C.teal, fontWeight: 800, fontSize: 20 }}>🌿 REPAIR</div>
              <div style={{ color: C.muted, fontSize: 14, marginTop: 2 }}>Pelvic floor companion</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, marginBottom: 8 }} />
            {/* V2: 3 items only */}
            <button onClick={() => { setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", background: "transparent", color: C.navy, fontSize: 16, padding: "14px 24px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 12 }}>
              <span>ℹ️</span><span>About REPAIR</span>
            </button>
            <button onClick={() => { window.open("https://forms.gle/VaTBhPCe4iEL3ifd9", "_blank"); setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", background: "transparent", color: C.navy, fontSize: 16, padding: "14px 24px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 12 }}>
              <span>💬</span><span>Feedback</span>
            </button>
            <button onClick={() => { setMenuOpen(false); }} style={{ width: "100%", textAlign: "left", background: "transparent", color: C.navy, fontSize: 16, padding: "14px 24px", border: "none", cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", alignItems: "center", gap: 12 }}>
              <span>🔒</span><span>Privacy</span>
            </button>
            <div style={{ borderTop: `1px solid ${C.border}`, margin: "8px 0" }} />
            <div style={{ padding: "12px 24px" }}>
              <button onClick={() => { setShowPDF(true); setMenuOpen(false); }} style={{ width: "100%", background: C.tealLight, color: C.teal, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "Georgia, serif" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ color: C.navy, fontWeight: 700, fontSize: 16 }}>Pre-Appointment Summary</div>
              <button onClick={() => setShowPDF(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            <Callout body="Save or print this now — it won't be here when you return." icon="⚠️" color={C.warn} bg={C.warnLt} />
            <button onClick={() => window.print()} style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 14, padding: "16px 24px", fontSize: 17, fontWeight: 700, fontFamily: "Georgia, serif", cursor: "pointer", minHeight: 54, marginBottom: 16, width: "100%" }}>🖨️ Print / Save as PDF</button>
            <PrintSummary scores={scores} primarySymptom={primarySymptom} chatMessages={chatMessages} />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>

        {/* HOME: chat-first layout */}
        {section === "home" && (
          <>
            {!homeChatStarted ? (
              <HomeSection onStartChat={handleStartChat} onNav={setSection} />
            ) : (
              <Chatbot
                inline={true}
                appState={appState}
                onClose={handleHomeChatClose}
                chatMessages={chatMessages}
                setChatMessages={setChatMessages}
                starterPrompt={starterPrompt}
              />
            )}
          </>
        )}

        {/* SECTION PAGES: scrollable content + floating chat button */}
        {section !== "home" && (
          <div style={{ flex: 1, overflowY: "auto", padding: 18, paddingBottom: 120 }}>
            {section === "prolapse" && <ProlapseSection />}
            {section === "symptoms" && <SymptomsSection scores={scores} setScores={setScores} primarySymptom={primarySymptom} setPrimarySymptom={setPrimarySymptom} />}
            {section === "imaging" && <ImagingSection />}
            {section === "lifestyle" && <LifestyleSection />}
            {section === "surgical" && <SurgicalSection />}
            {section === "redflags" && <RedFlagsSection />}
          </div>
        )}
      </div>

      {/* BOTTOM NAV — only on section pages */}
      {section !== "home" && (
        <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, display: "flex", flexShrink: 0, paddingBottom: "env(safe-area-inset-bottom, 0)" }}>
          {[{ id: "home", label: "Home" }, { id: "symptoms", label: "Symptoms" }, { id: "surgical", label: "Surgery" }, { id: "redflags", label: "Red Flags" }].map(n => (
            <button key={n.id} onClick={() => setSection(n.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "14px 4px", background: "none", border: "none", color: section === n.id ? C.teal : C.muted, fontWeight: section === n.id ? 700 : 400, fontSize: 14, fontFamily: "Georgia, serif", borderTop: section === n.id ? `3px solid ${C.teal}` : "3px solid transparent", cursor: "pointer" }}>
              {n.label}
            </button>
          ))}
        </div>
      )}

      {/* FLOATING CHAT BUTTON — section pages only */}
      {section !== "home" && !chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{ position: "fixed", bottom: 90, right: 20, zIndex: 200, background: C.teal, color: "#fff", border: "none", borderRadius: 30, padding: "14px 22px", fontSize: 16, fontWeight: 700, fontFamily: "Georgia, serif", boxShadow: "0 4px 20px rgba(45,125,111,0.4)", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <span>Ask REPAIR</span>
        </button>
      )}

      {/* MODAL CHATBOT — section pages */}
      {chatOpen && (
        <Chatbot
          inline={false}
          appState={appState}
          onClose={() => setChatOpen(false)}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
        />
      )}
    </div>
  );
}
