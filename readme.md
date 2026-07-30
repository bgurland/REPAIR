# REPAIR 🌿
### Rectal Prolapse Education and Patient Awareness Information Resource

REPAIR is an interactive, privacy-first, and shame-free clinician-authored educational portal designed for patients navigating rectal prolapse, bowel dysfunction, and pelvic floor disorders. 

Developed in clinical collaboration with **Dr. Brooke Gurland** (Colorectal Surgeon and Lifestyle Medicine Physician at Stanford), this platform aims to guide, educate, and empower patients to understand their health, self-assess symptoms safely, and prepare structured, meaningful conversations for clinical appointments.

---

## 📖 Table of Contents
1. [Core Philosophy & Privacy](#-core-philosophy--privacy)
2. [Application Modules](#-application-modules)
3. [Secure AI Chatbot Architecture](#-secure-ai-chatbot-architecture)
4. [Tech Stack & File Structure](#-tech-stack--file-structure)
5. [Getting Started & Local Development](#-getting-started--local-development)
6. [Deployment & Environment Configuration](#-deployment--environment-configuration)
7. [Contributing & Roles](#-contributing--roles)

---

## 🔒 Core Philosophy & Privacy

Pelvic floor disorders and bowel dysfunction are deeply personal conditions that carry immense social stigma/shame, causing up to **41.5% of patients** to feel unable to find trustworthy, plain-language resources online.

* **Privacy-First Design:** REPAIR enforces a strict data boundary. Zero patient answers, symptom scores, or chat histories are recorded or transmitted to any server. Everything resides securely in-memory on the user's local device.
* **Empathetic Literacy:** Complex clinical terminologies are systematically demystified into a 7th-9th grade reading level using warm, non-judgmental prose. 
* **Accessibility First:** Integrated with a native Text-to-Speech (TTS) narration engine using the browser's `SpeechSynthesis` API, enabling multi-modal reading and listening options (e.g. customized comfortable natural speaking voices).

---

## 🧭 Application Modules

REPAIR organizes patient education into highly focused, responsive panels:

1. **🏠 Home (The Hub):** Features a clean dashboard that explains the platform's clinical design roots and provides direct-access cards to all modules.
2. **📖 Understanding Prolapse:** 
   - Explains the anatomical mechanism of rectal prolapse (contrasting internal intussusception with full external prolapse).
   - Features Dr. Gurland's degree classifications (**Grades I to V**).
   - Includes custom, animated Vimeo video integrations detailing pelvic organ anatomy.
3. **🔍 My Symptoms & IMPACT Score:**
   - Provides a comprehensive symptom self-assessment survey.
   - Helps patients translate qualitative distress into a structured clinical score to share with care teams.
4. **🩻 Pelvic Floor Testing:** 
   - Demystifies complex specialized investigations so patients know exactly what to expect.
   - Covers: Dynamic Defecography (X-ray and MR), Anorectal Manometry (ARM), Endoanal Ultrasound, and Colonic Transit Studies.
5. **🥦 Lifestyle & Bowel Habit Training:**
   - Solidifies lifestyle medicine principles.
   - Delivers actionable dietary recommendations (fiber intake, hydration metrics), toilet posture guidelines (e.g., footstool elevation), and straining avoidance strategies.
6. **🏥 Considering Surgery:** 
   - Explains surgical approaches in balanced, evidence-based terms (abdominal rectopexy vs. perineal procedures).
   - Highlights international expert consensus around mesh clinical safety, biological vs. synthetic scaffolds, post-operative clearance principles, and realistic recurrence/success rates.
7. **🚨 Red Flags (Emergency Action Protocol):**
   - High-contrast, critical rescue directions for serious physiological conditions (e.g., incarcerated non-reducible prolapse).
   - Direct crisis links and suicide prevention mechanisms (such as **988 Suicide & Crisis Lifeline** or Crisis Text Line "HELLO" to 741741).

---

## 💬 Secure AI Chatbot Architecture

The REPAIR Chatbot acts as an expert medical education assistant. It is powered by a highly structured clinical knowledge model mapped to **Claude 3.5 Sonnet** (via `claude-sonnet-4-6` API), governed by Dr. Gurland's custom clinical instructions (System Prompt version 2.3).

### Key Clinical Guardrails
1. **Critical Surgical Boundary (The Hard Stop):**
   - Built to forbid recommendations of surgical treatments for **Grades I, II, or III internal prolapse (intussusception)** when **obstructed defecation** is the primary symptom. The chatbot strictly reinforces conservative paths: physical pelvic floor therapy, biofeedback, and bowel habits work.
2. **Provider-Neutral Language:**
   - Avoids referencing "surgeons" or "surgical teams" by default. Recognizes that patients might be co-managed by gastroenterologists, urogynecologists, physical therapists, primary care doctors, and nurse specialists.
3. **Verified Evidence Base:**
   - Restricts numerical clinical output to verified literature statistics (e.g., VMR de novo pain recurrence metrics from Perry et al., DCR 2025; and revision overall success statistics from Fuschillo et al., 2025). Fabricated web statistics (i.e., hallucinations) are explicitly banned.
4. **Adaptive Listening Styles ("Depth & Research"):**
   - Understands a client's learning speed. Incorporates an optional custom prompt override (`listeningStyle === "depth"`) that dynamically scales the reading level (FK Grade 9-11), integrates underlying physiological mechanisms, permits clinical jargon (immediately translated), and suggests structured PubMed/literature searches.

---

## 🛠️ Tech Stack & File Structure

REPAIR is engineered for maximum performance, maintainability, and standard-compliant security.

```
REPAIR/
├── index.html                   # HTML entry point, configuring mobile viewport boundaries & Georgia styling.
├── package.json                 # Project declarations, utilizing React 18 & built atop Vite 5.
├── vite.config.js               # Optimizes static production outDir targeting.
├── netlify.toml                 # Configures Netlify auto-deployment, serverless paths & proxy routing rules.
├── netlify/
│   └── functions/
│       └── chat.js              # Serverless Netlify secure API proxy. Hydrates doctor-approved system prompts 
│                                # and safely queries Anthropic's Claude API without exposing keys to clients.
└── src/
    ├── main.jsx                 # Entry execution script bootstrapper.
    └── App.jsx                  # Single-Page frontend hub. Manages responsive design panels, Vimeo video controllers, 
                                 # text-to-speech engines, scoring forms, and secure state handling.
```

---

## 💻 Getting Started & Local Development

### Prerequisites
* **Node.js** (v18.x or later recommended)
* An **Anthropic API Key** (to enable the secure chatbot assistant)

### 🔑 Retrieving Your Anthropic API Key
1. Sign up or log into the [Anthropic Console](https://console.anthropic.com/).
2. Navigate to the **API Keys** section in the dashboard.
3. Click **Create Key**, name it appropriately (e.g., `REPAIR-Local-Dev`), and copy the generated key structure (starts with `sk-ant-`). *Keep this secret and never check it into source control.*

### Local Environment Setup
To run the secure serverless chatbot endpoint locally, you need to configure your environment variables.
1. In the root of the project, create a new file named `.env`:
   ```bash
   touch .env
   ```
2. Open `.env` in your editor and add your key:
   ```env
   ANTHROPIC_API_KEY=your_copied_anthropic_api_key_here
   ```

### Installation
1. Clone the repository and navigate to its root directory:
   ```bash
   cd REPAIR
   ```
2. Install frontend and builder dependencies:
   ```bash
   npm install
   ```

### Running the App Locally

#### Option A: Running with Chatbot Functionality (Recommended)
To run the React frontend *and* execute the local secure serverless functions (which proxy to Anthropic), use the **Netlify CLI** dev server:
1. Ensure the Netlify CLI is installed globally or run it via `npx`:
   ```bash
   npm install -g netlify-cli
   ```
2. Start the local server:
   ```bash
   netlify dev
   ```
   *This automatically detects your `.env` file, spins up the serverless function proxy, and launches your hot-reloading app at [http://localhost:8888](http://localhost:8888).*

#### Option B: Frontend Only (No chatbot interactions)
If you only need to work on the static page guides, modules, or layout, you can start the raw Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚡ Deployment & Environment Configuration

REPAIR is structured to be deployed instantly on **Netlify** with automatic build triggers in git workflow pipelines. 

### Netlify Proxy Routing
The [netlify.toml](netlify.toml) file automatically redirects requests from the frontend `/api/chat` path to the serverless function:
```toml
[[redirects]]
  from = "/api/chat"
  to = "/.netlify/functions/chat"
  status = 200
```

### Environment Variables
For secure API interactions, you must configure the following variable in your server-side environment (e.g., on the Netlify dashboard under **Site configuration > Environment variables**):

| Variable Name | Description | Default |
| :--- | :--- | :--- |
| `ANTHROPIC_API_KEY` | **Required.** Your Anthropic developer console private API credentials. | *None* |
| `ALLOWED_ORIGIN` | **Optional.** Restricts cross-origin requests to prevent unauthorized use of your endpoints. | `*` (All) |

---

## 🤝 Contributing & Roles

REPAIR has a clean separation of roles to preserve clinical safety while maintaining high software standards:
* **Clinical Content & System Prompts:** Guided by **Dr. Brooke Gurland** (Stanford).
* **AI & Technical Engineering:** Guided by **James Horine**.

If you'd like to understand our workflow, make updates to safety thresholds, adapt chatbot behaviors, or run specialized diagnostic checkouts, please review our [CONTRIBUTING.md](CONTRIBUTING.md) guide.

---

*This application is strictly educational. It does not provide medical services, diagnose symptoms, or substitute structured, individualized consultations with licensed professional medical providers.*
