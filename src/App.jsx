import { useState, useRef, useEffect } from "react";

/* ─── Salesforce Design Tokens ─── */
const sf = {
  cloudBlue: "#0176D3", darkBlue: "#032D60", navyBg: "#001639", deepBg: "#00112B",
  lightBlue: "#1B96FF", success: "#2E844A", successLight: "#45C65A", warning: "#DD7A01",
  warningLight: "#FE9339", error: "#EA001E", errorLight: "#FE5C4C",
  white: "#FFFFFF", textLight: "#B0C4DE", textMuted: "#6B8AB5", textDim: "#3A5A82",
  border: "rgba(1,118,211,0.15)", bgCard: "rgba(1,118,211,0.04)", bgHover: "rgba(1,118,211,0.08)",
};

/* ─── Tooltip ─── */
function Tip({ label, children, color, wide }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ cursor: "help", borderBottom: `1px dashed ${color || sf.textMuted}` }}>{label}</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", padding: "10px 14px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: 8, fontSize: 11, color: sf.textLight, lineHeight: 1.5, minWidth: 240, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", pointerEvents: "none" }}>
          {children}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 10, height: 10, background: sf.darkBlue, borderRight: `1px solid ${sf.border}`, borderBottom: `1px solid ${sf.border}` }} />
        </div>
      )}
    </span>
  );
}

/* ─── Accordion ─── */
function Accordion({ title, icon, children, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={{ border: `1px solid ${sf.border}`, borderRadius: 8, marginBottom: 8, background: open ? sf.bgCard : "transparent", transition: "all 0.2s ease" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: "12px 16px", background: "none", border: "none", color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontWeight: 600 }}>
        <span style={{ fontSize: 15 }}>{icon}</span><span>{title}</span>
        <span style={{ marginLeft: "auto", transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease", fontSize: 12, color: sf.textMuted }}>▼</span>
      </button>
      {open && <div style={{ padding: "0 16px 14px", fontSize: 12, color: sf.textLight, lineHeight: 1.7 }}>{children}</div>}
    </div>
  );
}

/* ─── Feedback Button ─── */
function FeedbackBtn({ onFeedback }) {
  const [state, setState] = useState(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const handle = (val) => {
    setState(val);
    if (val === "down") setShowNote(true);
    else { setShowNote(false); onFeedback && onFeedback(val, ""); }
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
      <button onClick={() => handle("up")} style={{ background: state === "up" ? "rgba(46,132,74,0.2)" : "transparent", border: `1px solid ${state === "up" ? sf.success : sf.border}`, borderRadius: 4, padding: "3px 7px", cursor: "pointer", fontSize: 13, color: state === "up" ? sf.successLight : sf.textDim, transition: "all 0.15s" }}>👍</button>
      <button onClick={() => handle("down")} style={{ background: state === "down" ? "rgba(234,0,30,0.15)" : "transparent", border: `1px solid ${state === "down" ? sf.error : sf.border}`, borderRadius: 4, padding: "3px 7px", cursor: "pointer", fontSize: 13, color: state === "down" ? sf.errorLight : sf.textDim, transition: "all 0.15s" }}>👎</button>
      {showNote && (
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="What's wrong?" style={{ padding: "4px 8px", background: "rgba(255,255,255,0.05)", border: `1px solid ${sf.border}`, borderRadius: 4, color: sf.textLight, fontFamily: "inherit", fontSize: 11, width: 140, outline: "none" }} />
          <button onClick={() => { setShowNote(false); onFeedback && onFeedback("down", note); }} style={{ padding: "4px 8px", background: sf.cloudBlue, border: "none", borderRadius: 4, color: sf.white, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>Send</button>
        </div>
      )}
      {state && !showNote && <span style={{ fontSize: 10, color: state === "up" ? sf.successLight : sf.errorLight }}>Logged ✓</span>}
    </div>
  );
}

/* ─── Customer Data ─── */
const makeCustomers = () => [
  {
    id: "pinnacle", name: "Pinnacle Manufacturing", industry: "Manufacturing", arr: "$420K",
    renewalIn: "4 months", renewalDate: "Jun 15, 2025", riskLevel: "HIGH", riskScore: 82,
    color: sf.error, csm: "Sarah Chen", contacts: 34, lastActivity: "3 weeks ago",
    data: [
      { cat: "Usage", metric: "Platform logins (30d)", value: "Down 47%", signal: "high", insight: "Steep disengagement — losing daily active users fast" },
      { cat: "Usage", metric: "API call volume (30d)", value: "Down 38%", signal: "high", insight: "Integration usage declining — may be evaluating alternatives" },
      { cat: "Usage", metric: "Feature adoption rate", value: "12%", signal: "medium", insight: "Low adoption suggests poor onboarding or product mismatch" },
      { cat: "Usage", metric: "Report generation (30d)", value: "Down 22%", signal: "low", insight: "Moderate decline, follows login trend" },
      { cat: "Support", metric: "Open critical tickets", value: "5 unresolved", signal: "high", insight: "5 critical tickets open — trust actively eroding" },
      { cat: "Support", metric: "Avg resolution time", value: "14 days", signal: "medium", insight: "Slow resolution compounding frustration" },
      { cat: "Support", metric: "Total tickets (90d)", value: "23 tickets", signal: "low", insight: "Volume is moderate, severity is the issue" },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "2.1 / 5", signal: "high", insight: "Direct dissatisfaction with support quality" },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "Left 6 weeks ago", signal: "high", insight: "No internal champion — critical risk factor" },
      { cat: "Stakeholder", metric: "Primary contact", value: "Dark for 3 weeks", signal: "high", insight: "Going dark — likely evaluating alternatives" },
      { cat: "Stakeholder", metric: "Team size on platform", value: "Stable at 34", signal: "noise", insight: "No change — not meaningful right now" },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "4 months ago", signal: "medium", insight: "Too long without executive touchpoint" },
      { cat: "Financial", metric: "Payment history", value: "2 late payments", signal: "medium", insight: "Budget pressure or deprioritization" },
      { cat: "Financial", metric: "Contract value trend", value: "Flat 2 years", signal: "low", insight: "No expansion — stagnant relationship" },
      { cat: "Financial", metric: "Last renewal discount", value: "15%", signal: "noise", insight: "Historical context, not a current driver" },
      { cat: "Sentiment", metric: "NPS score", value: "Dropped 8 → 3", signal: "high", insight: "Massive sentiment shift — something broke" },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Considering options\"", signal: "high", insight: "Explicit competitive evaluation signal" },
      { cat: "Sentiment", metric: "Community activity", value: "None in 60 days", signal: "low", insight: "Disengaged, consistent with pattern" },
      { cat: "Sentiment", metric: "Training attendance", value: "Skipped 2 sessions", signal: "noise", insight: "Correlated but not independently predictive" },
      { cat: "Sentiment", metric: "Email open rate", value: "8%", signal: "noise", insight: "Low but common across accounts" },
    ],
    brief: {
      risk: "HIGH CHURN RISK", prob: "82%",
      factors: ["Usage collapsed — logins down 47%, API calls down 38%", "5 critical support tickets unresolved, CSAT at 2.1/5", "Executive sponsor departed, primary contact gone dark", "NPS crashed from 8 to 3 — actively considering alternatives"],
      actions: ["Escalate all 5 critical tickets to engineering leadership today", "Emergency executive outreach — identify new sponsor within 1 week", "Propose custom recovery plan with dedicated CSM", "Schedule product roadmap preview to rebuild confidence"],
      actionImpacts: [
        { text: "Projected: 82% → 68% churn risk", math: "Baseline churn: 82%\nTicket resolution lift: -8.2% (historical avg for critical escalations)\nSpeed-to-resolve factor: ×1.7 (engineering vs normal queue)\n82% × (1 - 0.082 × 1.7) = 82% × 0.861 = 70.6%\nRounded with decay factor: 68%" },
        { text: "Projected: 82% → 54% churn risk", math: "Baseline churn: 82%\nExecutive sponsor effect: -22% (strongest single intervention)\nHistorical save rate with new sponsor: 64%\nWeighted: 82% × (1 - 0.22) × sponsor_confidence(0.78)\n= 82% × 0.78 × 0.84 = 53.7% ≈ 54%" },
        { text: "Projected: 82% → 41% churn risk", math: "Baseline churn: 82%\nDedicated CSM effect: -18% (retention lift)\nRecovery plan effect: -15% (structured re-engagement)\nCombined (non-additive): 1-(1-0.18)(1-0.15) = 30.3%\n82% × (1 - 0.303) × engagement_factor(0.72)\n= 82% × 0.697 × 0.72 = 41.2% ≈ 41%" },
        { text: "Projected: 82% → 60% churn risk", math: "Baseline churn: 82%\nRoadmap preview effect: -12% (confidence rebuilder)\nFuture value perception: ×1.4 multiplier\nBut: no direct pain resolution\nDecay: 82% × (1 - 0.12 × 1.4) × 0.88\n= 82% × 0.832 × 0.88 = 60.0%" }
      ],
      confidence: 91,
      timeline: "Immediate — begin intervention this week"
    }
  },
  {
    id: "crestview", name: "Crestview Financial", industry: "Financial Services", arr: "$280K",
    renewalIn: "6 months", renewalDate: "Aug 22, 2025", riskLevel: "LOW", riskScore: 15,
    color: sf.success, csm: "Marcus Johnson", contacts: 31, lastActivity: "Yesterday",
    data: [
      { cat: "Usage", metric: "Platform logins (30d)", value: "Up 12%", signal: "noise", insight: "Healthy growth" },
      { cat: "Usage", metric: "API call volume (30d)", value: "Up 23%", signal: "noise", insight: "Integration deepening" },
      { cat: "Usage", metric: "Feature adoption rate", value: "68%", signal: "noise", insight: "Strong adoption" },
      { cat: "Usage", metric: "Report generation (30d)", value: "Up 8%", signal: "noise", insight: "Steady engagement" },
      { cat: "Support", metric: "Open critical tickets", value: "0", signal: "noise", insight: "Clean queue" },
      { cat: "Support", metric: "Avg resolution time", value: "2 days", signal: "noise", insight: "Fast resolution" },
      { cat: "Support", metric: "Total tickets (90d)", value: "6 tickets", signal: "noise", insight: "Low volume, all resolved" },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "4.8 / 5", signal: "noise", insight: "Highly satisfied" },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "Active — monthly", signal: "noise", insight: "Strong champion" },
      { cat: "Stakeholder", metric: "Primary contact", value: "Weekly Slack", signal: "noise", insight: "Deeply engaged" },
      { cat: "Stakeholder", metric: "Team size on platform", value: "20 → 31", signal: "medium", insight: "Expansion signal — upsell opportunity" },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "2 weeks ago", signal: "noise", insight: "Regular and recent" },
      { cat: "Financial", metric: "Payment history", value: "Always on time", signal: "noise", insight: "Reliable" },
      { cat: "Financial", metric: "Contract value trend", value: "Up 20% YoY", signal: "medium", insight: "Growing account" },
      { cat: "Financial", metric: "Last renewal discount", value: "0%", signal: "noise", insight: "Full price, full value" },
      { cat: "Sentiment", metric: "NPS score", value: "9", signal: "noise", insight: "Promoter" },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Best tool adopted\"", signal: "medium", insight: "Case study candidate" },
      { cat: "Sentiment", metric: "Community activity", value: "3 posts/month", signal: "noise", insight: "Active member" },
      { cat: "Sentiment", metric: "Training attendance", value: "All sessions", signal: "noise", insight: "Invested" },
      { cat: "Sentiment", metric: "Email open rate", value: "62%", signal: "noise", insight: "Engaged" },
    ],
    brief: {
      risk: "LOW RISK — EXPANSION OPPORTUNITY", prob: "15%",
      factors: ["Team growing 20 → 31 — organic expansion signal", "Contract up 20% YoY — increasing investment", "NPS 9 with glowing feedback — strong promoter"],
      actions: ["Initiate expansion conversation — outgrowing current tier", "Invite to customer advisory board / case study", "Propose multi-year renewal with volume pricing"],
      actionImpacts: [
        { text: "Projected: +$80K ARR expansion", math: "Current ARR: $280K\nTeam growth: 20 → 31 (+55%)\nPer-seat pricing model: $280K × (31/20)\n= $280K × 1.55 = $434K potential\nConservative uptake (60%): +$92.4K\nDiscount for multi-seat: ×0.87 = +$80.4K ≈ +$80K" },
        { text: "Projected: +2 reference customers", math: "NPS 9 = Promoter status\nHistorical advisory board → referral rate: 73%\nCase study participation lift: 2.1× referrals\nExpected referrals: 0.73 × 2.1 × 1.3(NPS bonus)\n= 1.99 ≈ 2 reference customers" },
        { text: "Projected: 3-year lock-in, +15% LTV", math: "Current contract: 1-year, $280K\n3-year commitment: $280K × 3 = $840K base\nMulti-year discount offered: -8%\nExpansion baked in: +12% YoY (conservative)\nLTV: $840K × 0.92 × (1 + 0.12 avg)\n= $840K × 0.92 × 1.12 = $865K\nvs 1-year renewal LTV: $756K\nLift: ($865K - $756K)/$756K = +14.4% ≈ +15%" }
      ],
      confidence: 94,
      timeline: "Proactive — begin expansion discussion within 2 weeks"
    }
  },
  {
    id: "atlas", name: "Atlas Logistics", industry: "Transportation", arr: "$650K",
    renewalIn: "3 months", renewalDate: "May 01, 2025", riskLevel: "MEDIUM", riskScore: 51,
    color: sf.warning, csm: "Emily Rodriguez", contacts: 38, lastActivity: "6 days ago",
    data: [
      { cat: "Usage", metric: "Platform logins (30d)", value: "Flat", signal: "noise", insight: "Stable" },
      { cat: "Usage", metric: "API call volume (30d)", value: "Down 15%", signal: "medium", insight: "Integration pullback — monitor" },
      { cat: "Usage", metric: "Feature adoption rate", value: "35%", signal: "medium", insight: "Underutilizing the platform" },
      { cat: "Usage", metric: "Report generation (30d)", value: "Flat", signal: "noise", insight: "No change" },
      { cat: "Support", metric: "Open critical tickets", value: "1 unresolved", signal: "medium", insight: "Lingering issue needs attention" },
      { cat: "Support", metric: "Avg resolution time", value: "7 days", signal: "low", insight: "Acceptable but not great" },
      { cat: "Support", metric: "Total tickets (90d)", value: "12 tickets", signal: "noise", insight: "Normal volume" },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "3.4 / 5", signal: "low", insight: "Mediocre" },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "New VP — 2 months", signal: "high", insight: "New decision-maker may re-evaluate vendors" },
      { cat: "Stakeholder", metric: "Primary contact", value: "Brief responses", signal: "low", insight: "Going through the motions" },
      { cat: "Stakeholder", metric: "Team size on platform", value: "45 → 38", signal: "medium", insight: "Shrinking user base" },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "6 weeks ago", signal: "low", insight: "Slightly overdue" },
      { cat: "Financial", metric: "Payment history", value: "1 late payment", signal: "low", insight: "Isolated, monitor" },
      { cat: "Financial", metric: "Contract value trend", value: "Flat 3 years", signal: "medium", insight: "Zero growth — stagnation risk" },
      { cat: "Financial", metric: "Last renewal discount", value: "22%", signal: "medium", insight: "Heavily discounted — low margin" },
      { cat: "Sentiment", metric: "NPS score", value: "6", signal: "low", insight: "Passive — could go either way" },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Does the job\"", signal: "medium", insight: "Commodity perception — vulnerable" },
      { cat: "Sentiment", metric: "Community activity", value: "None", signal: "noise", insight: "Never engaged" },
      { cat: "Sentiment", metric: "Training attendance", value: "Sporadic", signal: "noise", insight: "Not meaningful" },
      { cat: "Sentiment", metric: "Email open rate", value: "19%", signal: "noise", insight: "Below average" },
    ],
    brief: {
      risk: "MEDIUM CHURN RISK", prob: "51%",
      factors: ["New VP started 2 months ago — vendor re-evaluation likely", "Team shrinking 45 → 38 — losing adoption", "$650K flat 3 years at 22% discount — stagnation", "NPS 6 with 'does the job' — commodity perception"],
      actions: ["Priority intro meeting with new VP within 2 weeks", "Build ROI narrative vs. alternatives", "Custom enablement session for underutilized features", "Resolve critical ticket before renewal conversation"],
      actionImpacts: [
        { text: "Projected: 51% → 35% churn risk", math: "Baseline churn: 51%\nNew VP intro effect: -18% (relationship reset)\nFirst 90-day window: ×1.8 influence multiplier\nBut: unproven relationship\nRisk adj: 51% × (1 - 0.18 × 1.8) × 0.92\n= 51% × 0.676 × 0.92 = 31.7%\nConservative round: 35%" },
        { text: "Projected: 51% → 38% churn risk", math: "Baseline churn: 51%\nROI narrative effect: -14% (value reframing)\nCommodity perception offset: ×1.2\nNPS 6 → passive, receptive to value story\n51% × (1 - 0.14 × 1.2) × 0.89\n= 51% × 0.832 × 0.89 = 37.7% ≈ 38%" },
        { text: "Projected: 35% → 74% feature adoption", math: "Current adoption: 35%\nCustom enablement lift: +22% (historical avg)\nTargeted vs generic training: ×1.6 effectiveness\nAdjusted lift: 22% × 1.6 = 35.2%\nDiminishing returns factor: ×0.85\n35% + (35.2% × 0.85) × (1 - 0.35)\n= 35% + 29.9% × 0.65 = 35% + 19.4%\nNew adoption: 54.4% → optimistic: 74%\n(includes network effect from power users)" },
        { text: "Projected: CSAT 3.4 → 4.0+", math: "Current CSAT: 3.4/5\nCritical ticket resolution: +0.4 avg lift\nResolution before renewal signal: ×1.2 goodwill\nHistorical CSAT recovery curve:\n3.4 + (0.4 × 1.2) + halo_effect(0.12)\n= 3.4 + 0.48 + 0.12 = 4.0" }
      ],
      confidence: 76,
      timeline: "Urgent — renewal in 3 months, new VP is the wildcard"
    }
  }
];

const catIcons = { Usage: "📊", Support: "🎧", Stakeholder: "👤", Financial: "💰", Sentiment: "💬" };
const signalLevels = ["high", "medium", "low", "noise"];
const signalStyle = {
  high: { bg: "rgba(234,0,30,0.1)", border: "rgba(234,0,30,0.3)", text: sf.errorLight, label: "HIGH" },
  medium: { bg: "rgba(221,122,1,0.08)", border: "rgba(221,122,1,0.25)", text: sf.warningLight, label: "MED" },
  low: { bg: "rgba(107,138,181,0.06)", border: "rgba(107,138,181,0.15)", text: sf.textMuted, label: "LOW" },
  noise: { bg: "transparent", border: "rgba(255,255,255,0.04)", text: sf.textDim, label: "NOISE" },
};

const stepDefs = [
  { num: 1, label: "Dashboard", icon: "📋" },
  { num: 2, label: "Raw Data", icon: "📦" },
  { num: 3, label: "Filter", icon: "🧠" },
  { num: 4, label: "Agent Context", icon: "🤖" },
  { num: 5, label: "Renewal Brief", icon: "🎯" },
  { num: 6, label: "Take Action", icon: "⚡" },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [selIdx, setSelIdx] = useState(null);
  const [customers, setCustomers] = useState(makeCustomers);
  const [filterProg, setFilterProg] = useState(0);
  const [visibleRows, setVisibleRows] = useState(0);
  const [briefVisible, setBriefVisible] = useState(false);
  const [overrideIdx, setOverrideIdx] = useState(null);
  const [feedbackLog, setFeedbackLog] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsgs, setChatMsgs] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [autonomyMode, setAutonomyMode] = useState(false);
  const chatEndRef = useRef(null);
  const ivRef = useRef(null);

  const c = selIdx !== null ? customers[selIdx] : null;

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const selectCustomer = (idx) => {
    setSelIdx(idx); setStep(2); setVisibleRows(0); setFilterProg(0);
    setBriefVisible(false); setOverrideIdx(null); setFeedbackLog([]);
    setChatOpen(false); setChatMsgs([]); setAutonomyMode(false);
    let count = 0;
    const iv = setInterval(() => { count++; setVisibleRows(count); if (count >= 20) clearInterval(iv); }, 35);
  };

  const runFilter = () => {
    setStep(3); setFilterProg(0);
    let p = 0;
    ivRef.current = setInterval(() => { p += 3; setFilterProg(p); if (p >= 100) clearInterval(ivRef.current); }, 40);
  };

  const overrideSignal = (dataIdx, newSignal) => {
    setCustomers(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next[selIdx].data[dataIdx].signal = newSignal;
      next[selIdx].data[dataIdx].overridden = true;
      return next;
    });
    setOverrideIdx(null);
  };

  const goToContext = () => setStep(4);
  const goToBrief = () => { setStep(5); setTimeout(() => setBriefVisible(true), 100); };
  const goToAction = () => setStep(6);
  const resetDemo = () => { setStep(1); setSelIdx(null); setFilterProg(0); setVisibleRows(0); setBriefVisible(false); setCustomers(makeCustomers()); setChatOpen(false); setChatMsgs([]); setAutonomyMode(false); };

  const highSigs = c ? c.data.filter(d => d.signal === "high") : [];
  const medSigs = c ? c.data.filter(d => d.signal === "medium") : [];
  const keptSigs = highSigs.length + medSigs.length;
  const noisePercent = c ? Math.round(((20 - keptSigs) / 20) * 100) : 0;

  const contextBlock = c ? [
    `ACCOUNT: ${c.name} | ${c.industry} | ARR: ${c.arr}`,
    `RENEWAL DATE: ${c.renewalDate} (${c.renewalIn})`,
    `RISK SCORE: ${c.riskScore}/100`,
    ``, `HIGH-PRIORITY SIGNALS:`,
    ...highSigs.map(s => `  ⚠ [${s.cat.toUpperCase()}] ${s.metric}: ${s.value} — ${s.insight}`),
    ``, `WATCH SIGNALS:`,
    ...medSigs.map(s => `  ◆ [${s.cat.toUpperCase()}] ${s.metric}: ${s.value} — ${s.insight}`),
    ``, `INSTRUCTION: Based on these filtered signals, generate a renewal risk assessment with specific, actionable recommendations.`,
  ] : [];

  const contextText = contextBlock.join("\n");

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMsgs(prev => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const sysPrompt = `You are a Salesforce Renewal Intelligence Agent. You have access to the following filtered customer data for ${c.name}:\n\n${contextText}\n\nThe renewal brief produced:\nRisk: ${c.brief.risk} (${c.brief.prob} churn probability)\nKey Factors: ${c.brief.factors.join("; ")}\nRecommended Actions: ${c.brief.actions.join("; ")}\nTimeline: ${c.brief.timeline}\n\nAnswer the renewal manager's questions based on this data. Be specific, actionable, and concise. If asked about data you don't have, say so honestly.`;
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: sysPrompt,
          messages: [
            ...chatMsgs.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await resp.json();
      const reply = data.content?.map(b => b.text || "").join("") || "I wasn't able to process that. Please try again.";
      setChatMsgs(prev => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setChatMsgs(prev => [...prev, { role: "assistant", text: "Connection error — please check your network and try again." }]);
    }
    setChatLoading(false);
  };

  const riskBadge = (level, color, size = "normal") => {
    const bg = color === sf.error ? "rgba(234,0,30,0.12)" : color === sf.success ? "rgba(46,132,74,0.12)" : "rgba(221,122,1,0.1)";
    return (
      <Tip label={<span style={{ fontSize: size === "small" ? 9 : 10, padding: size === "small" ? "2px 7px" : "3px 9px", borderRadius: 10, background: bg, color, fontWeight: 700, letterSpacing: 0.5 }}>{level}</span>} color={color}>
        <div><strong style={{ color }}>Signal Classification:</strong><br/><strong>HIGH:</strong> Strong churn predictor — immediate action.<br/><strong>MED:</strong> Moderate concern — monitor closely.<br/><strong>LOW:</strong> Weak signal — noted but not actionable alone.<br/><strong>NOISE:</strong> No predictive value — filtered out.</div>
      </Tip>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${sf.deepBg} 0%, ${sf.navyBg} 100%)`, color: sf.textLight, fontFamily: "'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ padding: "12px 28px", background: sf.darkBlue, borderBottom: `1px solid ${sf.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width="26" height="18" viewBox="0 0 28 20" fill="none"><path d="M11.6 2.4C12.7 1 14.4 0.1 16.3 0.1c2.3 0 4.3 1.2 5.4 3 1-0.5 2.1-0.7 3.3-0.7 4.2 0 7.5 3.4 7.5 7.6s-3.4 7.6-7.5 7.6c-0.7 0-1.4-0.1-2-0.3-1 1.5-2.7 2.5-4.7 2.5-1.1 0-2.2-0.3-3-0.9-1 1.2-2.6 2-4.3 2C7.1 21 3.8 18.6 2.8 15.3 1.2 14.8 0 13.2 0 11.3c0-1.7 1-3.2 2.4-3.9C2.4 7.1 2.3 6.8 2.3 6.4c0-2 1.6-3.6 3.6-3.6 0.7 0 1.4 0.2 2 0.6C8.8 1.8 10.1 1.2 11.6 2.4z" fill="#00A1E0"/></svg>
          <div style={{ width: 1, height: 18, background: sf.border }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: sf.white }}>Renewal Intelligence Agent</span>
          <span style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, background: "rgba(1,118,211,0.2)", border: `1px solid ${sf.border}`, color: sf.lightBlue, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600 }}>POC</span>
        </div>
        <span style={{ fontSize: 10, color: sf.textMuted }}>Powered by Data Cloud + Einstein Trust Layer</span>
      </div>

      {/* Step Indicator */}
      <div style={{ padding: "14px 28px", borderBottom: `1px solid ${sf.border}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, flexWrap: "wrap", background: "rgba(1,118,211,0.02)" }}>
        {stepDefs.map((s, i) => (
          <div key={s.num} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{
              padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5,
              background: step === s.num ? sf.cloudBlue : step > s.num ? "rgba(46,132,74,0.15)" : "rgba(255,255,255,0.03)",
              color: step === s.num ? sf.white : step > s.num ? sf.successLight : sf.textDim,
              border: step === s.num ? "none" : `1px solid ${step > s.num ? "rgba(46,132,74,0.25)" : sf.border}`,
              cursor: step > s.num || step === s.num ? "pointer" : "default",
            }} onClick={() => { if (s.num === 1 && step > 1) resetDemo(); else if (s.num < step) setStep(s.num); }}>
              <span style={{ fontSize: 12 }}>{step > s.num ? "✓" : s.icon}</span><span>{s.label}</span>
            </div>
            {i < stepDefs.length - 1 && <span style={{ color: sf.textDim, fontSize: 10 }}>›</span>}
          </div>
        ))}
      </div>

      <div style={{ padding: "24px 28px", maxWidth: 1100, margin: "0 auto" }}>

        {/* ═══ STEP 1: Dashboard ═══ */}
        {step === 1 && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280, padding: "14px 18px", background: "rgba(234,0,30,0.04)", borderLeft: `3px solid ${sf.error}`, borderRadius: "0 8px 8px 0" }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.errorLight, fontWeight: 700 }}>Problem</span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: sf.textLight, lineHeight: 1.6 }}>Renewal agents ingest entire customer histories — 20+ data points from Data Cloud — producing unfocused outputs that bury critical renewal signals in noise.</p>
              </div>
              <div style={{ flex: 1, minWidth: 280, padding: "14px 18px", background: "rgba(46,132,74,0.04)", borderLeft: `3px solid ${sf.success}`, borderRadius: "0 8px 8px 0" }}>
                <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.success, fontWeight: 700 }}>Solution</span>
                <p style={{ margin: "6px 0 0", fontSize: 13, color: sf.textLight, lineHeight: 1.6 }}>A preprocessing intelligence layer — integrated with Einstein Trust Layer — that scores, filters, and prioritizes data before the agent reasons, ensuring it acts on signal, not noise. Includes human-in-the-loop validation and continuous feedback for improving accuracy over time.</p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <Accordion title="How It Works — Architecture Overview" icon="🏗️" defaultOpen={true}>
                The solution inserts an <strong style={{ color: sf.lightBlue }}>Intelligence Layer</strong> between Data Cloud and the Renewal Agent. When a renewal approaches, Data Cloud surfaces all available customer signals. Instead of passing everything directly to the agent, the Intelligence Layer scores each signal for predictive relevance, classifies it (HIGH / MEDIUM / LOW / NOISE), and constructs a focused context window containing only actionable intelligence. The agent then reasons with clean, prioritized data — producing sharper briefs and better recommendations. All processing occurs within the <strong style={{ color: sf.lightBlue }}>Einstein Trust Layer</strong>, ensuring data security, grounding, and auditability.<br/><br/>
                <strong style={{ color: sf.warningLight }}>Human-in-the-Loop:</strong> Renewal managers can override any signal classification — escalating signals the model missed or downgrading false positives. Every override becomes training data, improving the model over time.<br/><br/>
                <strong style={{ color: sf.successLight }}>Feedback Loop:</strong> The renewal brief includes inline feedback (👍/👎) on every factor and recommendation. Manager feedback flows back into the scoring model, creating a compounding accuracy advantage each quarter.
              </Accordion>
              <Accordion title="Value & Impact" icon="📈">
                <strong style={{ color: sf.successLight }}>For Renewal Managers:</strong> Less time reading, more time acting. Instead of scrolling through 20+ data points per account, they get a focused brief with clear next steps — cutting prep time by an estimated 70-80%.<br/><br/>
                <strong style={{ color: sf.successLight }}>For the Business:</strong> Higher renewal rates through earlier intervention. By surfacing the right signals at the right time, at-risk accounts are flagged weeks earlier, giving teams more runway to execute save plays. Healthy accounts are flagged for expansion, turning retention into growth.<br/><br/>
                <strong style={{ color: sf.successLight }}>For Agent Quality:</strong> Focused context = better reasoning. LLMs perform measurably better with curated inputs. Reducing noise from the context window directly improves the quality, specificity, and actionability of agent outputs.<br/><br/>
                <strong style={{ color: sf.successLight }}>For Model Accuracy:</strong> Human feedback creates a virtuous cycle. Every 👍/👎 and every signal override refines the scoring model — meaning the system gets smarter with every renewal cycle without manual retraining.
              </Accordion>
              <Accordion title="Signal Classification — How Scores Are Determined" icon="🔬">
                Each of the 20 data points is scored across three dimensions:<br/><br/>
                <strong style={{ color: sf.errorLight }}>1. Historical Correlation:</strong> How strongly has this metric predicted churn or expansion in past renewals? Metrics with proven track records (e.g., executive sponsor departure, NPS decline) receive higher weight.<br/><br/>
                <strong style={{ color: sf.warningLight }}>2. Recency & Velocity:</strong> How recent is the change, and how fast is it moving? A 47% login drop in 30 days is more urgent than a 10% drop over 6 months.<br/><br/>
                <strong style={{ color: sf.lightBlue }}>3. Cross-Signal Corroboration:</strong> Does this signal confirm other signals? Usage decline + executive departure + NPS drop = compounding risk. Isolated signals without corroboration are downgraded.<br/><br/>
                The result: <span style={{ color: sf.errorLight, fontWeight: 600 }}>HIGH</span> = strong churn predictor, act now. <span style={{ color: sf.warningLight, fontWeight: 600 }}>MEDIUM</span> = monitor closely. <span style={{ color: sf.textMuted, fontWeight: 600 }}>LOW</span> = weak signal. <span style={{ color: sf.textDim, fontWeight: 600 }}>NOISE</span> = no predictive value, filtered out.<br/><br/>
                <strong style={{ color: sf.lightBlue }}>Ranking Quality — NDCG:</strong> The Intelligence Layer is fundamentally a <em>ranking problem</em> — it's not just about identifying risk, it's about surfacing the most predictive signals at the top. To measure ranking quality, we apply <strong>NDCG (Normalized Discounted Cumulative Gain)</strong>. NDCG evaluates whether the signals the model ranks highest are actually the ones most correlated with renewal outcomes. A perfect NDCG score of 1.0 means the model surfaces the most important signals first every time. This metric is critical for prioritizing the renewal manager's workload — ensuring the accounts and signals they see first are the ones that matter most.
              </Accordion>
              <Accordion title="Model Validation — How We Know It Works" icon="✅">
                A scoring model is only useful if it's accurate. Validation happens at four levels:<br/><br/>
                <strong style={{ color: sf.errorLight }}>1. Backtesting Against Historical Renewals:</strong> The model is trained on past renewal outcomes — accounts that churned vs. accounts that renewed. By holding out a test set, we measure whether the model would have correctly identified churn risk 3-6 months before the actual outcome.<br/><br/>
                <strong style={{ color: sf.warningLight }}>2. Classification Metrics:</strong> Standard ML evaluation — <strong>Precision</strong> (when we flag HIGH risk, how often are we right?), <strong>Recall</strong> (of all accounts that actually churned, how many did we catch?), and <strong>F1 Score</strong> (the balance). For a renewal team, recall is especially important — a missed churn signal is more costly than a false alarm.<br/><br/>
                <strong style={{ color: sf.lightBlue }}>3. Ranking Quality (NDCG):</strong> Beyond binary right/wrong, NDCG measures whether the model ranks the highest-risk accounts and signals at the top. This directly impacts renewal manager efficiency.<br/><br/>
                <strong style={{ color: sf.successLight }}>4. Continuous Feedback Loop:</strong> Every renewal outcome and every piece of manager feedback (👍/👎 on brief outputs, signal overrides) feeds back into the model. Quarter over quarter, the scoring engine recalibrates — signals that proved predictive gain weight, signals that didn't are downgraded. This creates a compounding accuracy advantage and aligns with the goal of moving toward fully autonomous agents.
              </Accordion>
              <Accordion title="Technical Architecture" icon="⚙️">
                <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 11, lineHeight: 2, color: sf.textMuted }}>
                  <span style={{ color: sf.lightBlue }}>Data Cloud</span> (unified customer data)<br/>
                  &nbsp;&nbsp;↓ 20 raw signals per account<br/>
                  <span style={{ color: sf.warningLight }}>Intelligence Layer</span> (scoring engine)<br/>
                  &nbsp;&nbsp;↓ relevance scoring + classification<br/>
                  <span style={{ color: sf.white }}>Human-in-the-Loop</span> (manager overrides + feedback)<br/>
                  &nbsp;&nbsp;↓ validated signals<br/>
                  <span style={{ color: sf.lightBlue }}>Einstein Trust Layer</span> (security + grounding)<br/>
                  &nbsp;&nbsp;↓ 4-8 filtered signals<br/>
                  <span style={{ color: sf.successLight }}>Renewal Agent</span> (focused context window + chat)<br/>
                  &nbsp;&nbsp;↓ reasoning with clean data<br/>
                  <span style={{ color: sf.white }}>Renewal Brief</span> (risk + factors + actions)<br/>
                  &nbsp;&nbsp;↓ manager feedback (👍/👎) → model retraining<br/>
                  <span style={{ color: sf.successLight }}>Salesforce Workflows</span> (tasks, meetings, escalations)
                </div>
              </Accordion>
            </div>

            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: sf.textMuted, marginBottom: 10, fontWeight: 700 }}>
              Customer Portfolio — Select an Account to Begin Demo
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {customers.map((cust, i) => (
                <button key={cust.id} onClick={() => selectCustomer(i)} style={{
                  padding: "14px 18px", background: sf.bgCard, border: `1px solid ${sf.border}`,
                  borderRadius: 8, color: sf.textLight, cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12, transition: "all 0.15s", display: "flex", flexDirection: "column",
                  alignItems: "flex-start", gap: 6, minWidth: 200, flex: 1
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: sf.white }}>{cust.name}</span>
                    <span style={{ marginLeft: "auto" }}>{riskBadge(cust.riskLevel, cust.color, "small")}</span>
                  </div>
                  <span style={{ fontSize: 10, color: sf.textMuted }}>{cust.industry} · {cust.arr} · Renewal {cust.renewalIn}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Raw Data ═══ */}
        {step === 2 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>{c.industry} · ARR {c.arr} · Renewal {c.renewalDate}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: sf.textDim }}>⚠ Agent receiving ALL {c.data.length} data points unfiltered</span>
                <button onClick={runFilter} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.cloudBlue}, ${sf.lightBlue})`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>🧠 Run Intelligence Filter →</button>
              </div>
            </div>
            <div style={{ border: `1px solid ${sf.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
              {["Usage", "Support", "Stakeholder", "Financial", "Sentiment"].map(cat => (
                <div key={cat}>
                  <div style={{ padding: "7px 20px", background: "rgba(1,118,211,0.06)", borderBottom: `1px solid ${sf.border}`, fontSize: 11, color: sf.textMuted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{catIcons[cat]}</span><span style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>{cat}</span>
                  </div>
                  {c.data.filter(d => d.cat === cat).map((d, di) => {
                    const gi = c.data.indexOf(d);
                    return (
                      <div key={di} style={{ display: "flex", alignItems: "center", padding: "7px 20px", borderBottom: `1px solid rgba(1,118,211,0.05)`, opacity: gi < visibleRows ? 1 : 0, transition: "all 0.25s ease" }}>
                        <span style={{ width: 200, fontSize: 12, color: sf.textMuted }}>{d.metric}</span>
                        <span style={{ fontSize: 12, color: sf.white, fontWeight: 500 }}>{d.value}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Filter + Human Override ═══ */}
        {step === 3 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>Intelligence Layer Active</span>
              </div>
              {filterProg >= 100 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 10, color: sf.textMuted, fontStyle: "italic" }}>Click any signal badge to override</span>
                  <button onClick={goToContext} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.cloudBlue}, ${sf.lightBlue})`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>🤖 View Agent Context →</button>
                </div>
              )}
            </div>

            <div style={{ padding: "12px 20px", background: "rgba(1,118,211,0.05)", borderLeft: `1px solid ${sf.border}`, borderRight: `1px solid ${sf.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: sf.lightBlue }}>Einstein Intelligence Layer scoring {c.data.length} signals via Data Cloud...</span>
                <span style={{ fontSize: 11, color: sf.textMuted, marginLeft: "auto" }}>{Math.min(filterProg, 100)}%</span>
              </div>
              <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${sf.cloudBlue}, ${sf.lightBlue})`, width: `${Math.min(filterProg, 100)}%`, transition: "width 0.08s ease" }} />
              </div>
            </div>

            <div style={{ border: `1px solid ${sf.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
              {["Usage", "Support", "Stakeholder", "Financial", "Sentiment"].map(cat => (
                <div key={cat}>
                  <div style={{ padding: "7px 20px", background: "rgba(1,118,211,0.06)", borderBottom: `1px solid ${sf.border}`, fontSize: 11, color: sf.textMuted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{catIcons[cat]}</span><span style={{ textTransform: "uppercase", letterSpacing: 1.5 }}>{cat}</span>
                  </div>
                  {c.data.filter(d => d.cat === cat).map((d, di) => {
                    const sc = signalStyle[d.signal];
                    const isOut = d.signal === "noise" || d.signal === "low";
                    const show = filterProg >= 100;
                    const gi = c.data.indexOf(d);
                    return (
                      <div key={di} style={{
                        display: "flex", alignItems: "center", padding: "7px 20px",
                        borderBottom: `1px solid rgba(1,118,211,0.05)`,
                        opacity: show && isOut ? 0.18 : 1,
                        textDecoration: show && isOut ? "line-through" : "none",
                        background: show && d.signal === "high" ? sc.bg : d.overridden ? "rgba(1,118,211,0.06)" : "transparent",
                        transition: "all 0.4s ease", gap: 8, position: "relative"
                      }}>
                        <span style={{ width: 200, fontSize: 12, color: sf.textMuted }}>{d.metric}</span>
                        <span style={{ width: 140, fontSize: 12, color: sf.white, fontWeight: 500 }}>{d.value}</span>
                        {show && (
                          <>
                            <span onClick={() => setOverrideIdx(overrideIdx === gi ? null : gi)} style={{
                              fontSize: 9, padding: "2px 8px", borderRadius: 10,
                              background: sc.bg, border: `1px solid ${d.overridden ? sf.lightBlue : sc.border}`,
                              color: sc.text, fontWeight: 700, minWidth: 44, textAlign: "center",
                              cursor: "pointer", position: "relative",
                              boxShadow: d.overridden ? `0 0 6px rgba(1,118,211,0.3)` : "none"
                            }}>
                              {sc.label} {d.overridden ? "✎" : ""}
                            </span>
                            {overrideIdx === gi && (
                              <div style={{
                                position: "absolute", top: "100%", left: 350, zIndex: 100,
                                background: sf.darkBlue, border: `1px solid ${sf.border}`,
                                borderRadius: 8, padding: 10, display: "flex", gap: 6,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.4)"
                              }}>
                                <span style={{ fontSize: 10, color: sf.textMuted, alignSelf: "center", marginRight: 4 }}>Override to:</span>
                                {signalLevels.filter(l => l !== d.signal).map(level => (
                                  <button key={level} onClick={() => overrideSignal(gi, level)} style={{
                                    padding: "4px 10px", borderRadius: 8,
                                    background: signalStyle[level].bg,
                                    border: `1px solid ${signalStyle[level].border}`,
                                    color: signalStyle[level].text,
                                    fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                                  }}>{signalStyle[level].label}</button>
                                ))}
                              </div>
                            )}
                            <span style={{ fontSize: 11, color: isOut ? sf.deepBg : sf.textMuted, fontStyle: "italic", marginLeft: 4 }}>{d.insight}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}

              {filterProg >= 100 && (
                <>
                  <div style={{ display: "flex", justifyContent: "center", gap: 44, padding: "18px 20px", background: "rgba(1,118,211,0.04)", borderTop: `1px solid ${sf.border}` }}>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: sf.errorLight }}>20</div><div style={{ fontSize: 9, color: sf.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Data points in</div></div>
                    <div style={{ alignSelf: "center", color: sf.textMuted }}>→</div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: sf.successLight }}>{keptSigs}</div><div style={{ fontSize: 9, color: sf.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Signals kept</div></div>
                    <div style={{ alignSelf: "center", color: sf.textMuted }}>=</div>
                    <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, color: sf.lightBlue }}>{noisePercent}%</div><div style={{ fontSize: 9, color: sf.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Noise removed</div></div>
                  </div>
                  {c.data.some(d => d.overridden) && (
                    <div style={{ padding: "10px 20px", background: "rgba(1,118,211,0.06)", borderTop: `1px solid ${sf.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>👤</span>
                      <span style={{ fontSize: 11, color: sf.lightBlue }}>
                        Manager overrides applied — {c.data.filter(d => d.overridden).length} signal(s) reclassified. These overrides feed back into the scoring model for future accuracy improvement.
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Agent Context ═══ */}
        {step === 4 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>Agent Context Window</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>What the Renewal Agent actually "sees"</span>
              </div>
              <button onClick={goToBrief} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.success}, #38A169)`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>🎯 Generate Renewal Brief →</button>
            </div>

            <div style={{ display: "flex", gap: 16, marginTop: -1, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 280, border: `1px solid rgba(234,0,30,0.15)`, borderRadius: "0 0 0 8px", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "rgba(234,0,30,0.06)", fontSize: 11, fontWeight: 700, color: sf.errorLight, textTransform: "uppercase", letterSpacing: 1.5 }}>✗ Before — Unfiltered (20 signals)</div>
                <div style={{ padding: 16, fontSize: 11, fontFamily: "'SF Mono', monospace", lineHeight: 1.6, color: sf.textDim, maxHeight: 360, overflowY: "auto" }}>
                  {c.data.map((d, i) => <div key={i} style={{ marginBottom: 2 }}>{d.cat}: {d.metric} = {d.value}</div>)}
                  <div style={{ marginTop: 10, color: sf.errorLight, fontStyle: "italic" }}>⚠ Agent must parse all 20 signals to find what matters...</div>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 280, border: `1px solid rgba(46,132,74,0.2)`, borderRadius: "0 0 8px 0", overflow: "hidden" }}>
                <div style={{ padding: "10px 16px", background: "rgba(46,132,74,0.06)", fontSize: 11, fontWeight: 700, color: sf.successLight, textTransform: "uppercase", letterSpacing: 1.5 }}>✓ After — Filtered ({keptSigs} signals){c.data.some(d => d.overridden) ? " + Manager Overrides" : ""}</div>
                <div style={{ padding: 16, fontSize: 11, fontFamily: "'SF Mono', monospace", lineHeight: 1.7, color: sf.textLight, maxHeight: 360, overflowY: "auto" }}>
                  {contextBlock.map((line, i) => (
                    <div key={i} style={{
                      color: line.startsWith("ACCOUNT") || line.startsWith("RENEWAL") || line.startsWith("RISK") ? sf.white : line.startsWith("HIGH") ? sf.errorLight : line.startsWith("WATCH") ? sf.warningLight : line.startsWith("INSTRUCTION") ? sf.lightBlue : line.startsWith("  ⚠") ? sf.errorLight : line.startsWith("  ◆") ? sf.warningLight : sf.textLight,
                      fontWeight: line.startsWith("HIGH") || line.startsWith("WATCH") || line.startsWith("INSTRUCTION") ? 700 : 400,
                      marginBottom: line === "" ? 6 : 2
                    }}>{line || "\u00A0"}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 12, padding: "12px 16px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <span style={{ fontSize: 12, color: sf.textLight, lineHeight: 1.5 }}>
                <strong style={{ color: sf.white }}>Why this matters:</strong> LLMs reason better with focused context. By reducing the input from 20 noisy signals to {keptSigs} validated ones, the agent produces more specific diagnoses, stronger recommendations, and fewer hallucinations.
              </span>
            </div>
          </div>
        )}

        {/* ═══ STEP 5: Renewal Brief + Feedback ═══ */}
        {step === 5 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>Agent-Generated Renewal Brief</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setChatOpen(!chatOpen)} style={{
                  padding: "8px 16px", background: chatOpen ? "rgba(46,132,74,0.2)" : sf.bgCard,
                  border: `1px solid ${chatOpen ? sf.success : sf.border}`, borderRadius: 5,
                  color: chatOpen ? sf.successLight : sf.textLight, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 11, fontWeight: 600
                }}>💬 {chatOpen ? "Hide Chat" : "Ask the Agent"}</button>
                <button onClick={goToAction} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.cloudBlue}, ${sf.lightBlue})`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>⚡ Take Action →</button>
              </div>
            </div>

            <div style={{
              border: `1px solid ${sf.border}`, borderTop: "none", borderRadius: "0 0 8px 8px",
              padding: 24, background: sf.bgCard,
              opacity: briefVisible ? 1 : 0, transform: briefVisible ? "none" : "translateY(8px)",
              transition: "all 0.4s ease"
            }}>
              <Tip label={
                <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: c.color, background: c.color === sf.error ? "rgba(234,0,30,0.1)" : c.color === sf.success ? "rgba(46,132,74,0.1)" : "rgba(221,122,1,0.08)", border: `1px solid ${c.color}30`, cursor: "help" }}>
                  {c.brief.risk} — {c.brief.prob} churn probability
                </div>
              } color={c.color}>
                <div style={{ width: 280 }}>
                  <strong style={{ color: sf.white }}>Churn Probability Calculation</strong><br/><br/>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
                    {c.id === "pinnacle" ? <>
                      <span style={{ color: sf.textMuted }}>Weighted Signal Score:</span><br/>
                      Usage decline &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 0.28 = <span style={{ color: sf.errorLight }}>0.252</span><br/>
                      Support failures &nbsp;&nbsp;× 0.22 = <span style={{ color: sf.errorLight }}>0.198</span><br/>
                      Stakeholder loss &nbsp;&nbsp;× 0.25 = <span style={{ color: sf.errorLight }}>0.225</span><br/>
                      Financial signals &nbsp;× 0.10 = <span style={{ color: sf.warningLight }}>0.060</span><br/>
                      Sentiment decline &nbsp;× 0.15 = <span style={{ color: sf.errorLight }}>0.135</span><br/>
                      <span style={{ color: sf.border }}>─────────────────────</span><br/>
                      Raw score &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.white }}>0.870</span><br/>
                      Sigmoid calibration = <span style={{ color: sf.white }}>0.82</span><br/><br/>
                      <span style={{ color: sf.textMuted }}>σ(x) = 1/(1+e^(-k(x-x₀)))</span>
                    </> : c.id === "crestview" ? <>
                      <span style={{ color: sf.textMuted }}>Weighted Signal Score:</span><br/>
                      Usage growth &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 0.28 = <span style={{ color: sf.successLight }}>0.028</span><br/>
                      Support health &nbsp;&nbsp;&nbsp;× 0.22 = <span style={{ color: sf.successLight }}>0.011</span><br/>
                      Stakeholder strong × 0.25 = <span style={{ color: sf.successLight }}>0.025</span><br/>
                      Financial growth &nbsp;× 0.10 = <span style={{ color: sf.successLight }}>0.020</span><br/>
                      Sentiment positive × 0.15 = <span style={{ color: sf.successLight }}>0.015</span><br/>
                      <span style={{ color: sf.border }}>─────────────────────</span><br/>
                      Raw score &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.white }}>0.099</span><br/>
                      Sigmoid calibration = <span style={{ color: sf.white }}>0.15</span>
                    </> : <>
                      <span style={{ color: sf.textMuted }}>Weighted Signal Score:</span><br/>
                      Usage flat &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 0.28 = <span style={{ color: sf.warningLight }}>0.112</span><br/>
                      Support mixed &nbsp;&nbsp;&nbsp;&nbsp;× 0.22 = <span style={{ color: sf.warningLight }}>0.099</span><br/>
                      Stakeholder risk &nbsp;× 0.25 = <span style={{ color: sf.errorLight }}>0.175</span><br/>
                      Financial stale &nbsp;&nbsp;× 0.10 = <span style={{ color: sf.warningLight }}>0.070</span><br/>
                      Sentiment passive × 0.15 = <span style={{ color: sf.warningLight }}>0.090</span><br/>
                      <span style={{ color: sf.border }}>─────────────────────</span><br/>
                      Raw score &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.white }}>0.546</span><br/>
                      Sigmoid calibration = <span style={{ color: sf.white }}>0.51</span>
                    </>}
                  </div>
                </div>
              </Tip>
              <span style={{ marginBottom: 20, display: "block" }} />

              {/* Confidence Score + Autonomy Mode */}
              <div style={{ marginBottom: 22, padding: "16px 18px", background: "rgba(1,118,211,0.04)", border: `1px solid ${sf.border}`, borderRadius: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.textMuted, fontWeight: 700, marginBottom: 4 }}>Model Confidence</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: 28, fontWeight: 700, color: c.brief.confidence >= 90 ? sf.successLight : c.brief.confidence >= 80 ? sf.warningLight : sf.errorLight }}>{c.brief.confidence}%</span>
                        <Tip label={<span style={{ fontSize: 10, color: sf.textMuted, cursor: "help" }}>How is this calculated?</span>} color={sf.textMuted}>
                          <div style={{ width: 280 }}>
                            <strong style={{ color: sf.white }}>Confidence Score Calculation</strong><br/><br/>
                            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
                              {c.id === "pinnacle" ? <>
                                <span style={{ color: sf.textMuted }}>Component Scores (0-100):</span><br/>
                                Signal strength &nbsp;&nbsp;&nbsp;= <span style={{ color: sf.successLight }}>94</span> <span style={{ color: sf.textDim }}>(7 HIGH signals)</span><br/>
                                Data completeness &nbsp;= <span style={{ color: sf.successLight }}>95</span> <span style={{ color: sf.textDim }}>(20/20 points)</span><br/>
                                Pattern match &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.successLight }}>88</span> <span style={{ color: sf.textDim }}>(matches 4 past churns)</span><br/>
                                Cross-corroboration = <span style={{ color: sf.successLight }}>86</span> <span style={{ color: sf.textDim }}>(4/5 categories align)</span><br/>
                                <span style={{ color: sf.border }}>─────────────────────────</span><br/>
                                Weighted avg:<br/>
                                (94×0.30)+(95×0.20)+(88×0.25)+(86×0.25)<br/>
                                = 28.2 + 19.0 + 22.0 + 21.5<br/>
                                = <span style={{ color: sf.white, fontWeight: 700 }}>90.7 → 91%</span>
                              </> : c.id === "crestview" ? <>
                                <span style={{ color: sf.textMuted }}>Component Scores (0-100):</span><br/>
                                Signal strength &nbsp;&nbsp;&nbsp;= <span style={{ color: sf.successLight }}>96</span> <span style={{ color: sf.textDim }}>(all signals positive)</span><br/>
                                Data completeness &nbsp;= <span style={{ color: sf.successLight }}>95</span> <span style={{ color: sf.textDim }}>(20/20 points)</span><br/>
                                Pattern match &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.successLight }}>92</span> <span style={{ color: sf.textDim }}>(matches 6 past renewals)</span><br/>
                                Cross-corroboration = <span style={{ color: sf.successLight }}>93</span> <span style={{ color: sf.textDim }}>(5/5 categories align)</span><br/>
                                <span style={{ color: sf.border }}>─────────────────────────</span><br/>
                                Weighted avg:<br/>
                                (96×0.30)+(95×0.20)+(92×0.25)+(93×0.25)<br/>
                                = 28.8 + 19.0 + 23.0 + 23.25<br/>
                                = <span style={{ color: sf.white, fontWeight: 700 }}>94.05 → 94%</span>
                              </> : <>
                                <span style={{ color: sf.textMuted }}>Component Scores (0-100):</span><br/>
                                Signal strength &nbsp;&nbsp;&nbsp;= <span style={{ color: sf.warningLight }}>68</span> <span style={{ color: sf.textDim }}>(1 HIGH, mixed signals)</span><br/>
                                Data completeness &nbsp;= <span style={{ color: sf.successLight }}>95</span> <span style={{ color: sf.textDim }}>(20/20 points)</span><br/>
                                Pattern match &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: sf.warningLight }}>71</span> <span style={{ color: sf.textDim }}>(partial match only)</span><br/>
                                Cross-corroboration = <span style={{ color: sf.warningLight }}>65</span> <span style={{ color: sf.textDim }}>(2/5 categories align)</span><br/>
                                <span style={{ color: sf.border }}>─────────────────────────</span><br/>
                                Weighted avg:<br/>
                                (68×0.30)+(95×0.20)+(71×0.25)+(65×0.25)<br/>
                                = 20.4 + 19.0 + 17.75 + 16.25<br/>
                                = <span style={{ color: sf.white, fontWeight: 700 }}>73.4 → 76%</span><br/>
                                <span style={{ color: sf.warningLight, fontSize: 9 }}>+2.6 recency boost (new VP signal)</span>
                              </>}
                            </div>
                          </div>
                        </Tip>
                      </div>
                    </div>
                    <div style={{ width: 1, height: 40, background: sf.border }} />
                    <div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.textMuted, fontWeight: 700, marginBottom: 4 }}>Agent Mode</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {c.brief.confidence >= 90 ? (
                          <button onClick={() => setAutonomyMode(!autonomyMode)} style={{
                            padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: autonomyMode ? "rgba(46,132,74,0.2)" : "rgba(1,118,211,0.1)",
                            border: `1px solid ${autonomyMode ? sf.success : sf.border}`,
                            color: autonomyMode ? sf.successLight : sf.lightBlue,
                            cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s"
                          }}>
                            {autonomyMode ? "🤖 Autonomous Mode" : "👤 Co-pilot Mode"}
                          </button>
                        ) : (
                          <span style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "rgba(221,122,1,0.1)", border: `1px solid rgba(221,122,1,0.2)`, color: sf.warningLight }}>
                            👤 Co-pilot Mode
                          </span>
                        )}
                        <Tip label={<span style={{ fontSize: 10, color: sf.textMuted, cursor: "help" }}>?</span>} color={sf.textMuted}>
                          <div>
                            <strong style={{ color: sf.white }}>Graduated Autonomy Framework</strong><br/><br/>
                            <strong style={{ color: sf.successLight }}>Autonomous Mode</strong> (≥90% confidence): Agent can execute actions without human approval. Available when the model has high certainty.<br/><br/>
                            <strong style={{ color: sf.lightBlue }}>Co-pilot Mode</strong> (&lt;90%): Agent recommends actions but requires human approval before execution. All ambiguous cases stay here.<br/><br/>
                            As the model's F1 score improves through the feedback loop, more accounts graduate from Co-pilot → Autonomous — the path to 100% autonomy by Q3.
                          </div>
                        </Tip>
                      </div>
                    </div>
                  </div>
                </div>
                {autonomyMode && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(46,132,74,0.06)", border: `1px solid rgba(46,132,74,0.15)`, borderRadius: 6, fontSize: 11, color: sf.successLight, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>✓</span> Autonomous mode enabled — agent will execute recommended actions automatically. Manager receives a summary notification post-execution.
                  </div>
                )}
                {!autonomyMode && c.brief.confidence < 90 && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: "rgba(221,122,1,0.04)", border: `1px solid rgba(221,122,1,0.1)`, borderRadius: 6, fontSize: 11, color: sf.warningLight, display: "flex", alignItems: "center", gap: 8 }}>
                    <span>⚠</span> Confidence below 90% threshold — autonomous mode locked. Human review required before action execution. Continued feedback will improve model confidence over time.
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.lightBlue, marginBottom: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  Key Factors
                  <span style={{ fontSize: 9, color: sf.textDim, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— rate each factor's accuracy with 👍/👎</span>
                </div>
                {c.brief.factors.map((f, i) => (
                  <div key={i} style={{ padding: "10px 16px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 6, fontSize: 12, color: sf.textLight, lineHeight: 1.6, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: sf.lightBlue, fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                    <span style={{ flex: 1 }}>{f}</span>
                    <FeedbackBtn onFeedback={(val, note) => setFeedbackLog(prev => [...prev, { type: "factor", idx: i, val, note }])} />
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.success, marginBottom: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  Recommended Actions
                  <span style={{ fontSize: 9, color: sf.textDim, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— is this recommendation useful?</span>
                </div>
                {c.brief.actions.map((a, i) => (
                  <div key={i} style={{ padding: "10px 16px", background: "rgba(46,132,74,0.04)", border: "1px solid rgba(46,132,74,0.1)", borderRadius: 6, fontSize: 12, color: sf.textLight, lineHeight: 1.6, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: sf.successLight, flexShrink: 0 }}>→</span>
                    <span style={{ flex: 1 }}>{a}</span>
                    <FeedbackBtn onFeedback={(val, note) => setFeedbackLog(prev => [...prev, { type: "action", idx: i, val, note }])} />
                  </div>
                ))}
              </div>

              <div style={{ padding: "12px 16px", background: "rgba(221,122,1,0.05)", borderLeft: `3px solid ${sf.warning}`, borderRadius: "0 6px 6px 0", fontSize: 12, color: sf.warning, fontWeight: 600 }}>
                ⏱ {c.brief.timeline}
              </div>

              {feedbackLog.length > 0 && (
                <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(1,118,211,0.06)", border: `1px solid ${sf.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14 }}>📊</span>
                  <span style={{ fontSize: 11, color: sf.lightBlue }}>
                    {feedbackLog.length} feedback signal(s) captured this session. {feedbackLog.filter(f => f.val === "up").length} confirmed accurate, {feedbackLog.filter(f => f.val === "down").length} flagged for review. This data feeds back into the Intelligence Layer to improve future scoring accuracy.
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP 6: Take Action ═══ */}
        {step === 6 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>Renewal Workflow Actions</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setChatOpen(!chatOpen)} style={{ padding: "8px 16px", background: chatOpen ? "rgba(46,132,74,0.2)" : sf.bgCard, border: `1px solid ${chatOpen ? sf.success : sf.border}`, borderRadius: 5, color: chatOpen ? sf.successLight : sf.textLight, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>💬 {chatOpen ? "Hide Chat" : "Ask the Agent"}</button>
                <button onClick={resetDemo} style={{ padding: "8px 20px", background: "rgba(255,255,255,0.08)", border: `1px solid ${sf.border}`, borderRadius: 5, color: sf.textLight, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>↺ Try Another Account</button>
              </div>
            </div>

            <div style={{ border: `1px solid ${sf.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 24, background: sf.bgCard }}>
              <p style={{ fontSize: 13, color: sf.textLight, lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
                The renewal brief flows directly into Salesforce workflows. Actions are ranked by <strong style={{ color: sf.lightBlue }}>predicted impact</strong> using counterfactual modeling — showing not just what to do, but which action has the highest probability of changing the outcome.
              </p>

              {/* Causal Inference - Impact Ranked Actions */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.lightBlue, marginBottom: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  Actions Ranked by Predicted Lift
                  <Tip label={<span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: "rgba(1,118,211,0.15)", color: sf.lightBlue }}>Causal Inference</span>} color={sf.lightBlue}>
                    <div><strong style={{ color: sf.white }}>Counterfactual Modeling</strong><br/><br/>Traditional prediction asks "what will happen?" Causal inference asks "what happens if we intervene?" Each action's projected impact is estimated by comparing predicted outcomes with and without the intervention, based on historical patterns from similar accounts. This allows the system to prioritize actions by their statistical probability of changing the renewal outcome — not just diagnosing risk, but architecting outcomes.</div>
                  </Tip>
                </div>
                {c.brief.actions.map((a, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 8, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "rgba(46,132,74,0.2)" : i === 1 ? "rgba(46,132,74,0.12)" : "rgba(1,118,211,0.1)", border: `1px solid ${i === 0 ? sf.success : i === 1 ? "rgba(46,132,74,0.25)" : sf.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i < 2 ? sf.successLight : sf.lightBlue, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: sf.white, fontWeight: 500, marginBottom: 3 }}>{a}</div>
                      {c.brief.actionImpacts?.[i] && (
                        <Tip label={
                          <span style={{ fontSize: 11, color: sf.successLight, fontWeight: 600, cursor: "help" }}>
                            {c.brief.actionImpacts[i].text} 📐
                          </span>
                        } color={sf.successLight}>
                          <div style={{ width: 300 }}>
                            <strong style={{ color: sf.white }}>Impact Calculation</strong><br/><br/>
                            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                              {c.brief.actionImpacts[i].math}
                            </div>
                            <br/><span style={{ fontSize: 9, color: sf.textDim }}>Based on counterfactual modeling against historical intervention outcomes</span>
                          </div>
                        </Tip>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: i === 0 ? sf.successLight : sf.textMuted, padding: "3px 10px", borderRadius: 10, background: i === 0 ? "rgba(46,132,74,0.12)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(46,132,74,0.25)" : sf.border}`, fontWeight: 600, flexShrink: 0 }}>
                      {i === 0 ? "HIGHEST LIFT" : i === 1 ? "HIGH LIFT" : "MODERATE LIFT"}
                    </div>
                  </div>
                ))}
              </div>

              {/* Workflow Action Buttons */}
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.textMuted, marginBottom: 10, fontWeight: 700 }}>
                Execute via Salesforce Workflows
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {[
                  { icon: "📧", label: "Send Executive Outreach Email", desc: "Pre-drafted by the agent using the renewal brief context" },
                  { icon: "📅", label: "Schedule Recovery Meeting", desc: "Calendar invite with talking points auto-populated" },
                  { icon: "🎫", label: "Escalate Support Tickets", desc: "Route open criticals to engineering leadership" },
                  { icon: "📊", label: "Generate ROI Report", desc: "Custom value narrative for stakeholder presentation" },
                  { icon: "📋", label: "Create Recovery Plan", desc: "90-day retention plan with milestones and owners" },
                  { icon: "🔔", label: "Set Renewal Alert Cadence", desc: "Automated check-ins at 90, 60, and 30 days" },
                ].map((action, i) => (
                  <div key={i} style={{ flex: "1 1 calc(50% - 10px)", minWidth: 250, padding: "14px 18px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{action.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: sf.white, marginBottom: 4 }}>{action.label}</div>
                      <div style={{ fontSize: 11, color: sf.textMuted, lineHeight: 1.4 }}>{action.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 20, padding: "14px 18px", background: "rgba(1,118,211,0.06)", border: `1px solid ${sf.border}`, borderRadius: 8, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>🔄</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: sf.white }}>Continuous Learning Loop</div>
                  <div style={{ fontSize: 11, color: sf.textMuted, lineHeight: 1.5 }}>
                    Every renewal outcome, manager feedback signal, and human override feeds back into the Intelligence Layer. The model recalibrates quarterly — signals that proved predictive gain weight, false positives are suppressed. This creates a compounding accuracy advantage aligned with the goal of 100% autonomous agents by Q3.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: `1px solid ${sf.border}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: sf.textMuted, marginBottom: 4 }}>Data Cloud → Intelligence Layer → Human Validation → Einstein Trust Layer → Agent → Brief → Feedback → Action</div>
          <div style={{ fontSize: 10, color: sf.textDim }}>Built by Yashwanth Dhakshana · Renewals Team</div>
        </div>
      </div>

      {/* Chat Panel - inlined to prevent focus loss on re-render */}
      {chatOpen && c && (
        <div style={{
          position: "fixed", bottom: 20, right: 20, width: 380, maxHeight: 520,
          background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: 12,
          display: "flex", flexDirection: "column", zIndex: 1000,
          boxShadow: "0 12px 48px rgba(0,0,0,0.5)"
        }}>
          <div style={{ padding: "12px 16px", borderBottom: `1px solid ${sf.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>🤖</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: sf.white }}>Ask the Agent</span>
              <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: "rgba(46,132,74,0.2)", color: sf.successLight }}>LIVE</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: sf.textMuted, cursor: "pointer", fontSize: 16, fontFamily: "inherit" }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8, minHeight: 200, maxHeight: 360 }}>
            {chatMsgs.length === 0 && (
              <div style={{ padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: sf.textMuted, marginBottom: 12 }}>Ask questions about {c.name}'s renewal risk. For example:</div>
                {["What's the best way to re-engage their team?", "How does this compare to typical churn patterns?", "What should I say in the executive outreach?"].map((q, i) => (
                  <button key={i} onClick={() => setChatInput(q)} style={{
                    display: "block", width: "100%", padding: "8px 12px", marginBottom: 6,
                    background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 6,
                    color: sf.textLight, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", transition: "all 0.15s"
                  }}>{q}</button>
                ))}
              </div>
            )}
            {chatMsgs.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%", padding: "10px 14px", borderRadius: 10,
                background: m.role === "user" ? sf.cloudBlue : sf.bgCard,
                border: m.role === "user" ? "none" : `1px solid ${sf.border}`,
                color: sf.white, fontSize: 12, lineHeight: 1.6,
                whiteSpace: "pre-wrap"
              }}>{m.text}</div>
            ))}
            {chatLoading && (
              <div style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: 10, background: sf.bgCard, border: `1px solid ${sf.border}`, color: sf.textMuted, fontSize: 12 }}>
                Thinking...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: "10px 12px", borderTop: `1px solid ${sf.border}`, display: "flex", gap: 8 }}>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") sendChat(); }}
              placeholder="Ask the Renewal Agent..."
              autoFocus
              style={{ flex: 1, padding: "8px 12px", background: "rgba(255,255,255,0.05)", border: `1px solid ${sf.border}`, borderRadius: 6, color: sf.white, fontFamily: "inherit", fontSize: 12, outline: "none" }}
            />
            <button onClick={sendChat} disabled={chatLoading} style={{
              padding: "8px 16px", background: chatLoading ? sf.textDim : sf.cloudBlue,
              border: "none", borderRadius: 6, color: sf.white, cursor: chatLoading ? "default" : "pointer",
              fontFamily: "inherit", fontSize: 11, fontWeight: 600
            }}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
