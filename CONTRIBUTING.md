# REPAIR — Contributing Guide 🌿

This guide outlines how clinical authors and technical engineers collaborate to maintain and improve the REPAIR platform. To preserve clinical safety, data privacy, and software stability, please follow the guidelines below.

---

## 👥 Roles & Responsibilities

### Clinical Author & Principal Investigator (Dr. Brooke Gurland, Stanford)
* **Scope:** Clinical accuracy, safety boundaries, reading level, patient validation, statistics, literature citations, and system prompt text/guardrails.
* **Primary Files:** 
  * Modifying the clinical system prompt in [netlify/functions/chat.js](netlify/functions/chat.js).
  * Updating static educational text/videos in [src/App.jsx](src/App.jsx).

### AI & Technical Engineer (James Horine)
* **Scope:** Codebase architecture, serverless integrations, local development environments, API proxies, state management, dependencies, styling/UI, and deployment.
* **Primary Files:** All files across the workspace including [package.json](package.json), [vite.config.js](vite.config.js), [netlify.toml](netlify.toml), [index.html](index.html), and structural React/JavaScript logic in [src/App.jsx](src/App.jsx) or [netlify/functions/chat.js](netlify/functions/chat.js).

---

## 🩺 Guidelines for Clinical Updates (Dr. Gurland)

When editing clinical guidelines, please adhere strictly to these principles:

### 1. Modifying the Chatbot System Prompt
The system prompt is held inside a template literal string in [netlify/functions/chat.js](netlify/functions/chat.js).
* **Do not edit code syntax:** Keep edits strictly within the text blocks of the `SYSTEM_PROMPT` variable.
* **Keep the Critical Surgical Boundary:** Never alter or soften the rules regarding **Grade I, II, or III internal prolapse with obstructed defecation**. Surgery is not a surgical indication for these cases.
* **Literacy requirements:** Keep clinical text below a Flesch-Kincaid Grade 7–9 reading level unless specified for the "depth" adaptive style. Keep sentences under 20 words, with one clear idea per sentence.
* **Version Control:** Update the `System prompt version` and evidence bibliography header comments in [netlify/functions/chat.js](netlify/functions/chat.js) whenever making updates.

### 2. Updating Educational Cards & Videos
Diagnostic cards and Vimeo video integrations are managed in [src/App.jsx](src/App.jsx).
* **Vimeo Configurations:** Video IDs are mapped at the top of the file in the `VIMEO_IDS` object.
* **Adding or Editing Content:** Text is grouped within specialized components like `PROLAPSE_CARDS`. Maintain the strict plain-English translation guidelines for medical terminology or work with the AI engineer to integrate changes.

---

## 🛠️ Guidelines for Technical Engineering (James)

### 1. Serverless Gateway Security
The handler in [netlify/functions/chat.js](netlify/functions/chat.js) acts as a serverless endpoint proxying requests to the Anthropic API.
* **Secret Protection:** Never commit or hardcode API keys. Always retrieve keys via `process.env.ANTHROPIC_API_KEY`.
* **CORS & Origin Security:** Enforce origin white-labeling via the `ALLOWED_ORIGIN` environment variable.
* **Payload Sanitation:** Strip incoming payloads down to a strict array of valid user/assistant roles, slicing contexts to prevent token-overflow vectors.

### 2. Local Development & Deployment
* To test serverless routing locally alongside the Vite frontend, run both using Netlify Dev CLI:
  ```bash
  npm install -g netlify-cli
  netlify dev
  ```
* Ensure code modifications do not introduce states that violate the responsive-first layout, standard touch-target sizing, or offline browser capabilities.
* Validate that compile or lint errors are clean before pushing to branches:
  ```bash
  npm run build
  ```

---

## 💬 Getting Clinical Feedback

Before deploying changes to production:
1. Verify any text adjustments comply with standard patient validation practices.
2. Confirm that changes regarding medical/anatomical definitions are backed by peer-reviewed clinical studies.
3. Keep clinical boundaries strictly safe-guarded. If in doubt, review recommendations with Dr. Gurland first.
