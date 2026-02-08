# Renewal Intelligence Agent

A proof-of-concept Customer Behavior Intelligence Platform built for Salesforce's Data Science & Engineering team. The system demonstrates how an AI agent architecture can transform raw customer signals into actionable intelligence briefs — filtering noise, scoring relevance, and recommending interventions ranked by predicted impact.

**Live Demo:** [renewalagent.vercel.app](https://renewalagent.vercel.app)

---

## The Problem

Renewal and customer success teams are drowning in data. A single enterprise account generates 20+ behavioral signals across usage, support, stakeholder, financial, and sentiment categories. Feeding all of these unfiltered into an AI agent produces generic, hallucination-prone outputs. The challenge isn't data scarcity — it's signal noise.

## The Architecture

The Renewal Intelligence Agent introduces an **Intelligence Layer** between raw data and the AI agent. This layer scores and filters signals based on the specific question being asked, so the agent receives only validated, high-relevance context.

```
Raw Data (20 signals)
    ↓
Question Selection (what behavior are we predicting?)
    ↓
Intelligence Layer (score + filter + rank by relevance)
    ↓
Filtered Context (5-9 validated signals)
    ↓
AI Agent (generates brief from focused context)
    ↓
Causal Inference (rank actions by predicted lift)
    ↓
Salesforce Workflows (execute via tasks, emails, escalations)
```

### Key Insight: Question-Driven Signal Scoring

The same 20 data points get scored differently depending on the question. For example:

| Signal | Churn Risk | Expansion | Seat Reduction | Feature Adoption |
|--------|-----------|-----------|----------------|-----------------|
| Usage decline (-47%) | HIGH | NOISE | MEDIUM | HIGH |
| Executive sponsor left | HIGH | HIGH | MEDIUM | LOW |
| Team size 20 → 31 | NOISE | HIGH | NOISE | MEDIUM |
| Training skipped | NOISE | NOISE | NOISE | HIGH |

This means the platform isn't a single-purpose churn calculator — it's a flexible behavior intelligence system that adapts its analysis to the question being asked.

## Features

### 7-Step Interactive Walkthrough

1. **Dashboard** — Customer portfolio overview with risk indicators
2. **Raw Data** — All 20 unfiltered signals with metric definitions (hover `?` icons)
3. **Question Selection** — Choose from 4 behavioral prediction questions
4. **Intelligence Filter** — Watch signals get scored, filtered, and ranked in real-time. Click any signal badge to override the classification (human-in-the-loop)
5. **Agent Context** — Side-by-side comparison of unfiltered vs. filtered context windows
6. **Intelligence Brief** — AI-generated assessment with probability calculations, confidence scores, and recommended actions
7. **Take Action** — Causal inference-ranked actions with Salesforce workflow integration

### Confidence Scores & Graduated Autonomy

Every brief includes a model confidence score (0-100%) calculated from four weighted components:

- **Signal Strength** (30%) — clarity of individual signals
- **Data Completeness** (20%) — coverage across all categories
- **Pattern Match** (25%) — similarity to historical outcomes
- **Cross-Corroboration** (25%) — alignment across categories

Confidence drives autonomy:
- **≥ 90%** → Autonomous Mode available (agent can execute without approval)
- **< 90%** → Co-pilot Mode enforced (human review required)

This maps to a graduated autonomy roadmap targeting 100% autonomous agents by Q3.

### Causal Inference & Impact Ranking

Actions aren't just listed — they're ranked by **Predicted Lift** using counterfactual modeling. Each action shows:

- Baseline → projected outcome with full calculation
- Impact magnitude (HIGHEST / HIGH / MODERATE lift)
- Hover for the complete mathematical derivation

### Churn Probability Calculation

Each account's risk score uses a weighted signal scoring model:

```
Category Weights:
  Usage      × 0.28
  Support    × 0.22
  Stakeholder × 0.25
  Financial  × 0.10
  Sentiment  × 0.15

Raw Score → Sigmoid Calibration → Final Probability
σ(x) = 1/(1+e^(-k(x-x₀)))
```

Hover the risk badge on any brief to see the full per-account calculation.

### Live AI Agent Chat

An integrated chatbot (powered by Claude) has full context of the filtered signals and intelligence brief. Preset questions adapt to the selected analysis type. The agent provides data-grounded, account-specific answers — not generic advice.

### Human-in-the-Loop Overrides

Renewal managers can click any signal classification badge in the filter step to override the Intelligence Layer's scoring. Overrides are visually tracked and reflected in the agent's context window, demonstrating that domain expertise augments the model rather than being replaced by it.

### Feedback Loop

Users can submit feedback on recommendations in the Take Action step. This ties into the continuous learning architecture — every override, thumbs up/down, and text feedback signal feeds back into model recalibration.

## Demo Accounts

| Account | Industry | ARR | Risk | Story |
|---------|----------|-----|------|-------|
| **Pinnacle Manufacturing** | Manufacturing | $420K | HIGH (82%) | Usage collapsed, sponsor departed, actively evaluating alternatives |
| **Crestview Financial** | Financial Services | $280K | LOW (15%) | Growing 55%, NPS 9, strong expansion candidate |
| **Atlas Logistics** | Transportation | $650K | MEDIUM (51%) | New VP wildcard, commodity perception, seat reduction risk |

Each account has unique data, briefs, and calculations across all 4 question types (4 questions × 3 accounts = 12 distinct intelligence briefs).

## Tech Stack

- **Frontend:** React 18 + Vite
- **AI:** Claude API (Anthropic) via serverless proxy
- **Styling:** Salesforce Lightning Design System color palette (inline styles)
- **Deployment:** Vercel (auto-deploy from GitHub)
- **API Proxy:** Vercel Serverless Functions (`/api/chat.js`)

## Project Structure

```
├── src/
│   ├── App.jsx          # Complete application (single-file architecture)
│   └── main.jsx         # React entry point
├── api/
│   └── chat.js          # Serverless API proxy for Anthropic
├── index.html           # HTML entry
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel routing config
├── package.json         # Dependencies
├── DEPLOY.md            # Deployment guide
└── README.md
```

## Deployment

See [DEPLOY.md](./DEPLOY.md) for step-by-step deployment instructions.

Quick start:
1. Clone this repo
2. `npm install`
3. Create `.env` with `VITE_ANTHROPIC_KEY=your-key` (for local dev)
4. `npm run dev`
5. For production: deploy to Vercel with `ANTHROPIC_API_KEY` environment variable

## Architecture Document

A comprehensive 10-page architecture document accompanies this POC, covering:

- Technical architecture and pipeline flow
- Signal classification methodology with mathematical derivations
- Graduated autonomy framework
- Causal inference methodology
- Model validation strategy (backtesting, precision/recall, NDCG)
- Data security via Einstein Trust Layer
- Job description alignment mapping

---

Built by **Yashwanth Dhakshana** · Data Science & Engineering
