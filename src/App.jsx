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
      { cat: "Usage", metric: "Platform logins (30d)", value: "Down 47%",
        signals: { churn: "high", expansion: "noise", seats: "medium", features: "high" },
        insights: { churn: "Steep disengagement — losing daily active users fast", expansion: "Not relevant to expansion assessment", seats: "Reduced logins correlate with seat consolidation", features: "Users not logging in = features not being adopted" } },
      { cat: "Usage", metric: "API call volume (30d)", value: "Down 38%",
        signals: { churn: "high", expansion: "noise", seats: "low", features: "high" },
        insights: { churn: "Integration usage declining — may be evaluating alternatives", expansion: "No growth signals in API usage", seats: "API decline is team-wide, not per-seat", features: "Integration features being abandoned" } },
      { cat: "Usage", metric: "Feature adoption rate", value: "12%",
        signals: { churn: "medium", expansion: "noise", seats: "low", features: "high" },
        insights: { churn: "Low adoption suggests poor onboarding or product mismatch", expansion: "No expansion with 12% adoption", seats: "Low adoption may push consolidation", features: "Only 12% of available features used — massive gap" } },
      { cat: "Usage", metric: "Report generation (30d)", value: "Down 22%",
        signals: { churn: "low", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Moderate decline, follows login trend", expansion: "Not a growth signal", seats: "Not seat-specific", features: "Reporting feature usage declining" } },
      { cat: "Support", metric: "Open critical tickets", value: "5 unresolved",
        signals: { churn: "high", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "5 critical tickets open — trust actively eroding", expansion: "Support issues block expansion", seats: "Not directly seat-related", features: "Unresolved bugs block feature adoption" } },
      { cat: "Support", metric: "Avg resolution time", value: "14 days",
        signals: { churn: "medium", expansion: "noise", seats: "noise", features: "low" },
        insights: { churn: "Slow resolution compounding frustration", expansion: "Not relevant", seats: "Not seat-related", features: "Slow fixes delay feature rollout" } },
      { cat: "Support", metric: "Total tickets (90d)", value: "23 tickets",
        signals: { churn: "low", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Volume is moderate, severity is the issue", expansion: "Not relevant", seats: "Not relevant", features: "Volume not informative" } },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "2.1 / 5",
        signals: { churn: "high", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Direct dissatisfaction with support quality", expansion: "Not relevant at this CSAT", seats: "Not seat-specific", features: "Low satisfaction reduces willingness to try new features" } },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "Left 6 weeks ago",
        signals: { churn: "high", expansion: "high", seats: "medium", features: "low" },
        insights: { churn: "No internal champion — critical risk factor", expansion: "No sponsor to champion expansion", seats: "New leadership may consolidate", features: "Feature roadmap loses internal advocacy" } },
      { cat: "Stakeholder", metric: "Primary contact", value: "Dark for 3 weeks",
        signals: { churn: "high", expansion: "noise", seats: "low", features: "noise" },
        insights: { churn: "Going dark — likely evaluating alternatives", expansion: "Not relevant", seats: "Silence may precede reduction", features: "Not feature-specific" } },
      { cat: "Stakeholder", metric: "Team size on platform", value: "Stable at 34",
        signals: { churn: "noise", expansion: "noise", seats: "medium", features: "noise" },
        insights: { churn: "No change — not meaningful right now", expansion: "No growth", seats: "Stable but watch for decline signals", features: "Not feature-related" } },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "4 months ago",
        signals: { churn: "medium", expansion: "medium", seats: "noise", features: "noise" },
        insights: { churn: "Too long without executive touchpoint", expansion: "No recent strategic conversations", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Financial", metric: "Payment history", value: "2 late payments",
        signals: { churn: "medium", expansion: "noise", seats: "medium", features: "noise" },
        insights: { churn: "Budget pressure or deprioritization", expansion: "Not an expansion signal", seats: "Budget pressure may drive seat cuts", features: "Not feature-related" } },
      { cat: "Financial", metric: "Contract value trend", value: "Flat 2 years",
        signals: { churn: "low", expansion: "medium", seats: "noise", features: "noise" },
        insights: { churn: "No expansion — stagnant relationship", expansion: "Zero growth trend — expansion unlikely", seats: "Not seat-related", features: "Not feature-related" } },
      { cat: "Financial", metric: "Last renewal discount", value: "15%",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Historical context, not a current driver", expansion: "Not relevant", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Sentiment", metric: "NPS score", value: "Dropped 8 → 3",
        signals: { churn: "high", expansion: "noise", seats: "medium", features: "medium" },
        insights: { churn: "Massive sentiment shift — something broke", expansion: "Not expanding at NPS 3", seats: "Dissatisfied users may push for fewer seats", features: "Low NPS correlates with feature abandonment" } },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Considering options\"",
        signals: { churn: "high", expansion: "noise", seats: "low", features: "noise" },
        insights: { churn: "Explicit competitive evaluation signal", expansion: "Not relevant", seats: "May evaluate seat count too", features: "Not feature-specific" } },
      { cat: "Sentiment", metric: "Community activity", value: "None in 60 days",
        signals: { churn: "low", expansion: "noise", seats: "noise", features: "low" },
        insights: { churn: "Disengaged, consistent with pattern", expansion: "Not relevant", seats: "Not relevant", features: "No community engagement = less feature discovery" } },
      { cat: "Sentiment", metric: "Training attendance", value: "Skipped 2 sessions",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "high" },
        insights: { churn: "Correlated but not independently predictive", expansion: "Not relevant", seats: "Not relevant", features: "Skipping training directly limits feature adoption" } },
      { cat: "Sentiment", metric: "Email open rate", value: "8%",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Low but common across accounts", expansion: "Not relevant", seats: "Not relevant", features: "Missing product updates and feature announcements" } },
    ],
    briefs: {
      churn: {
        title: "CHURN RISK ASSESSMENT", risk: "HIGH CHURN RISK", prob: "82%", color: sf.error,
        factors: ["Usage collapsed — logins down 47%, API calls down 38%", "5 critical support tickets unresolved, CSAT at 2.1/5", "Executive sponsor departed, primary contact gone dark", "NPS crashed from 8 to 3 — actively considering alternatives"],
        actions: ["Escalate all 5 critical tickets to engineering leadership today", "Emergency executive outreach — identify new sponsor within 1 week", "Propose custom recovery plan with dedicated CSM", "Schedule product roadmap preview to rebuild confidence"],
        actionImpacts: [
          { text: "Projected: 82% → 68% churn risk", math: "Baseline churn: 82%\nTicket resolution lift: -8.2% (historical avg for critical escalations)\nSpeed-to-resolve factor: ×1.7 (engineering vs normal queue)\n82% × (1 - 0.082 × 1.7) = 82% × 0.861 = 70.6%\nRounded with decay factor: 68%" },
          { text: "Projected: 82% → 54% churn risk", math: "Baseline churn: 82%\nExecutive sponsor effect: -22% (strongest single intervention)\nHistorical save rate with new sponsor: 64%\nWeighted: 82% × (1 - 0.22) × sponsor_confidence(0.78)\n= 82% × 0.78 × 0.84 = 53.7% ≈ 54%" },
          { text: "Projected: 82% → 41% churn risk", math: "Baseline churn: 82%\nDedicated CSM effect: -18% (retention lift)\nRecovery plan effect: -15% (structured re-engagement)\nCombined (non-additive): 1-(1-0.18)(1-0.15) = 30.3%\n82% × (1 - 0.303) × engagement_factor(0.72)\n= 82% × 0.697 × 0.72 = 41.2% ≈ 41%" },
          { text: "Projected: 82% → 60% churn risk", math: "Baseline churn: 82%\nRoadmap preview effect: -12% (confidence rebuilder)\nFuture value perception: ×1.4 multiplier\nBut: no direct pain resolution\nDecay: 82% × (1 - 0.12 × 1.4) × 0.88\n= 82% × 0.832 × 0.88 = 60.0%" }
        ],
        confidence: 91, probCalc: { scores: [["Usage decline","0.90","0.28","0.252",sf.errorLight],["Support failures","0.90","0.22","0.198",sf.errorLight],["Stakeholder loss","0.90","0.25","0.225",sf.errorLight],["Financial signals","0.60","0.10","0.060",sf.warningLight],["Sentiment decline","0.90","0.15","0.135",sf.errorLight]], raw: "0.870", calibrated: "0.82" },
        confCalc: { strength: [94,"7 HIGH signals"], completeness: [95,"20/20 points"], pattern: [88,"matches 4 past churns"], corroboration: [86,"4/5 categories align"], math: "(94×0.30)+(95×0.20)+(88×0.25)+(86×0.25)\n= 28.2 + 19.0 + 22.0 + 21.5\n= 90.7 → 91%", extra: null },
        timeline: "Immediate — begin intervention this week"
      },
      expansion: {
        title: "EXPANSION FORECAST", risk: "EXPANSION UNLIKELY", prob: "8%", color: sf.error,
        factors: ["Usage in freefall — no foundation for expansion", "No executive sponsor to champion additional investment", "Actively considering alternatives — not thinking about expanding", "Support failures would need resolution before any growth conversation"],
        actions: ["Stabilize the account before any expansion discussion", "Resolve critical tickets as prerequisite", "Re-establish executive sponsorship", "Revisit expansion only after 90-day recovery period"],
        actionImpacts: [
          { text: "Projected: 8% → 8% expansion probability", math: "Baseline expansion: 8%\nStabilization is prerequisite, not expansion driver\nNo direct expansion lift — prevents further decline\nExpansion conversation deferred: 90+ days" },
          { text: "Projected: support resolution enables future path", math: "Current state: blocked\nTicket resolution: unlocks expansion conversation\nBut: still 90+ days away from any growth discussion\nPre-condition, not direct expansion driver" },
          { text: "Projected: new sponsor → 22% expansion potential", math: "If sponsor secured AND account stabilized:\nHistorical new-sponsor expansion rate: 34%\nAdjusted for current crisis: ×0.65\n34% × 0.65 = 22.1%\nTimeline: 6+ months out" },
          { text: "Projected: post-recovery expansion window at 6 months", math: "If all interventions successful:\nRecovery timeline: 90 days minimum\nStabilization confirmation: +30 days\nExpansion conversation: month 5-6\nHistorical recovery-to-expansion rate: 28%" }
        ],
        confidence: 87, probCalc: { scores: [["Usage decline","0.95","0.30","0.285",sf.errorLight],["Support blockers","0.90","0.20","0.180",sf.errorLight],["No sponsor","0.85","0.25","0.213",sf.errorLight],["Financial flat","0.60","0.15","0.090",sf.warningLight],["Sentiment negative","0.80","0.10","0.080",sf.errorLight]], raw: "0.848", calibrated: "0.08 (inverted)" },
        confCalc: { strength: [90,"clear negative signals"], completeness: [95,"20/20 points"], pattern: [84,"matches non-expansion profiles"], corroboration: [80,"4/5 categories negative"], math: "(90×0.30)+(95×0.20)+(84×0.25)+(80×0.25)\n= 27.0 + 19.0 + 21.0 + 20.0\n= 87.0 → 87%", extra: null },
        timeline: "Not applicable — stabilize first, revisit in 6 months"
      },
      seats: {
        title: "SEAT REDUCTION RISK", risk: "MODERATE SEAT REDUCTION RISK", prob: "38%", color: sf.warning,
        factors: ["Team stable at 34 but engagement per user dropping sharply", "12% feature adoption — most users not getting value", "Executive sponsor departure removes protection against cuts", "NPS 3 and 'considering options' — cost scrutiny likely"],
        actions: ["Identify and protect power users vs. inactive users", "Run per-user adoption analysis to flag at-risk seats", "Build value narrative per department/role", "Proactive seat optimization proposal before they cut reactively"],
        actionImpacts: [
          { text: "Projected: 38% → 22% seat reduction risk", math: "Baseline reduction risk: 38%\nPower user identification: protects core seats\nHistorical save rate: 42% of at-risk seats\n38% × (1 - 0.42) = 22.0%" },
          { text: "Projected: identifies 12 at-risk seats", math: "Total seats: 34\nActive users (>5 logins/month): ~22\nInactive/low-usage: ~12 (35%)\nThese are the vulnerable seats\nEarly identification = proactive defense" },
          { text: "Projected: preserves $148K in seat revenue", math: "ARR per seat: $420K / 34 = $12.35K\n12 at-risk seats × $12.35K = $148.2K\nValue narrative effectiveness: 60-70%\nProtected revenue: ~$100-104K minimum" },
          { text: "Projected: controlled optimization saves 8 of 12 seats", math: "At-risk seats: 12\nProactive optimization vs. reactive cut:\nReactive: lose all 12 (client decides)\nProactive: retain 8, consolidate 4 (we decide)\nNet save: 8 seats × $12.35K = $98.8K preserved" }
        ],
        confidence: 72, probCalc: { scores: [["Login decline per user","0.75","0.25","0.188",sf.warningLight],["Feature adoption 12%","0.85","0.30","0.255",sf.errorLight],["Team stable (34)","0.20","0.20","0.040",sf.successLight],["Sponsor departed","0.60","0.15","0.090",sf.warningLight],["NPS sentiment","0.65","0.10","0.065",sf.warningLight]], raw: "0.638", calibrated: "0.38" },
        confCalc: { strength: [68,"mixed signals"], completeness: [95,"20/20 points"], pattern: [70,"partial match to reduction patterns"], corroboration: [52,"2/5 categories align"], math: "(68×0.30)+(95×0.20)+(70×0.25)+(52×0.25)\n= 20.4 + 19.0 + 17.5 + 13.0\n= 69.9 → 72%\n+2.1 adjustment (recent sponsor loss)", extra: "+2.1 adjustment (recent sponsor loss)" },
        timeline: "Monitor closely — seat review likely at renewal in 4 months"
      },
      features: {
        title: "FEATURE ADOPTION TRAJECTORY", risk: "CRITICAL ADOPTION GAP", prob: "12% current → 18% projected", color: sf.error,
        factors: ["Only 12% feature adoption — 88% of platform unused", "Skipped 2 training sessions — no new feature discovery", "API usage down 38% — integration features being abandoned", "8% email open rate — missing feature announcements entirely"],
        actions: ["Deploy targeted in-app feature walkthroughs for top 5 unused features", "Schedule mandatory training session with team leads", "Create custom feature ROI report showing untapped value", "Assign dedicated adoption specialist for 60-day sprint"],
        actionImpacts: [
          { text: "Projected: 12% → 28% adoption in 60 days", math: "Current adoption: 12%\nIn-app walkthrough lift: +9% (historical avg)\nTargeted vs. generic: ×1.4 effectiveness\nAdjusted lift: 9% × 1.4 = 12.6%\nWith engagement decay: 12% + 12.6% × 0.85\n= 12% + 10.7% = 22.7%\nTraining session bonus: +5.3% = 28%" },
          { text: "Projected: 3 power features activated", math: "Top 5 unused features ranked by value:\n1. Advanced reporting (high ROI)\n2. Workflow automation (time savings)\n3. API integrations (stickiness)\nHistorical activation rate with targeted training: 62%\n5 × 0.62 = 3.1 ≈ 3 features" },
          { text: "Projected: $63K unrealized value unlocked", math: "Platform features at full adoption: $420K value\nCurrent value realized: 12% × $420K = $50.4K\nAt 28% adoption: 28% × $420K = $117.6K\nIncremental value: $117.6K - $50.4K = $67.2K\nRealization rate: 94% = $63.2K" },
          { text: "Projected: feature stickiness reduces churn 12%", math: "Feature adoption correlation with retention:\nEach 10% adoption increase → 6% churn reduction\nProjected increase: 16% (12% → 28%)\nChurn reduction: 1.6 × 6% = 9.6%\nStickiness multiplier: ×1.25\nTotal churn impact: 9.6% × 1.25 = 12%" }
        ],
        confidence: 78, probCalc: { scores: [["Current adoption rate","0.90","0.35","0.315",sf.errorLight],["Training engagement","0.80","0.20","0.160",sf.errorLight],["API/integration usage","0.70","0.20","0.140",sf.warningLight],["Email engagement","0.50","0.10","0.050",sf.warningLight],["Login frequency","0.75","0.15","0.113",sf.warningLight]], raw: "0.778", calibrated: "0.18 projected" },
        confCalc: { strength: [82,"strong adoption signals"], completeness: [95,"20/20 points"], pattern: [74,"matches low-adoption profiles"], corroboration: [60,"3/5 categories informative"], math: "(82×0.30)+(95×0.20)+(74×0.25)+(60×0.25)\n= 24.6 + 19.0 + 18.5 + 15.0\n= 77.1 → 78%\n+0.9 training signal boost", extra: "+0.9 training signal boost" },
        timeline: "60-day adoption sprint recommended — start before renewal conversation"
      }
    }
  },
  {
    id: "crestview", name: "Crestview Financial", industry: "Financial Services", arr: "$280K",
    renewalIn: "6 months", renewalDate: "Aug 22, 2025", riskLevel: "LOW", riskScore: 15,
    color: sf.success, csm: "Marcus Johnson", contacts: 31, lastActivity: "Yesterday",
    data: [
      { cat: "Usage", metric: "Platform logins (30d)", value: "Up 12%",
        signals: { churn: "noise", expansion: "medium", seats: "noise", features: "noise" },
        insights: { churn: "Healthy growth", expansion: "Growing engagement supports expansion", seats: "No reduction signals", features: "Good baseline engagement" } },
      { cat: "Usage", metric: "API call volume (30d)", value: "Up 23%",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "medium" },
        insights: { churn: "Integration deepening", expansion: "Rapid API growth = deepening integration = expansion ready", seats: "No reduction signals", features: "API features actively being adopted" } },
      { cat: "Usage", metric: "Feature adoption rate", value: "68%",
        signals: { churn: "noise", expansion: "medium", seats: "noise", features: "high" },
        insights: { churn: "Strong adoption", expansion: "High adoption = more value = expansion candidate", seats: "Strong adoption protects seats", features: "68% adopted — 32% remaining opportunity" } },
      { cat: "Usage", metric: "Report generation (30d)", value: "Up 8%",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "low" },
        insights: { churn: "Steady engagement", expansion: "Moderate signal", seats: "Not relevant", features: "Reporting features in use" } },
      { cat: "Support", metric: "Open critical tickets", value: "0",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Clean queue", expansion: "No blockers", seats: "No issues", features: "No adoption blockers" } },
      { cat: "Support", metric: "Avg resolution time", value: "2 days",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Fast resolution", expansion: "Not relevant", seats: "Not relevant", features: "Fast fixes support adoption" } },
      { cat: "Support", metric: "Total tickets (90d)", value: "6 tickets",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Low volume, all resolved", expansion: "Not relevant", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "4.8 / 5",
        signals: { churn: "noise", expansion: "low", seats: "noise", features: "noise" },
        insights: { churn: "Highly satisfied", expansion: "Satisfaction enables expansion", seats: "Not relevant", features: "Good experience" } },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "Active — monthly",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "medium" },
        insights: { churn: "Strong champion", expansion: "Active sponsor = can champion budget for expansion", seats: "Protected", features: "Sponsor can drive adoption initiatives" } },
      { cat: "Stakeholder", metric: "Primary contact", value: "Weekly Slack",
        signals: { churn: "noise", expansion: "medium", seats: "noise", features: "noise" },
        insights: { churn: "Deeply engaged", expansion: "Engaged contact = receptive to expansion pitch", seats: "Not relevant", features: "Not feature-specific" } },
      { cat: "Stakeholder", metric: "Team size on platform", value: "20 → 31",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "medium" },
        insights: { churn: "No churn signal", expansion: "55% organic team growth — strongest expansion signal", seats: "Growing, not reducing", features: "New users may need onboarding for features" } },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "2 weeks ago",
        signals: { churn: "noise", expansion: "low", seats: "noise", features: "noise" },
        insights: { churn: "Regular and recent", expansion: "Recent touchpoint — opportunity to discuss growth", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Financial", metric: "Payment history", value: "Always on time",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Reliable", expansion: "Not a growth signal", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Financial", metric: "Contract value trend", value: "Up 20% YoY",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "noise" },
        insights: { churn: "No churn signal", expansion: "20% YoY growth — already expanding", seats: "Not relevant", features: "Not feature-specific" } },
      { cat: "Financial", metric: "Last renewal discount", value: "0%",
        signals: { churn: "noise", expansion: "medium", seats: "noise", features: "noise" },
        insights: { churn: "Full price, full value", expansion: "Paying full price = high perceived value = expansion-ready", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Sentiment", metric: "NPS score", value: "9",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "noise" },
        insights: { churn: "Promoter", expansion: "NPS 9 = promoter status = will advocate for expansion internally", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Best tool adopted\"",
        signals: { churn: "noise", expansion: "high", seats: "noise", features: "medium" },
        insights: { churn: "No concern", expansion: "Active endorsement — ready to invest more", seats: "Not relevant", features: "Positive sentiment drives further feature exploration" } },
      { cat: "Sentiment", metric: "Community activity", value: "3 posts/month",
        signals: { churn: "noise", expansion: "low", seats: "noise", features: "medium" },
        insights: { churn: "Active member", expansion: "Community engagement signals investment", seats: "Not relevant", features: "Active in community = discovering new features" } },
      { cat: "Sentiment", metric: "Training attendance", value: "All sessions",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "high" },
        insights: { churn: "Invested", expansion: "Not directly expansion", seats: "Not relevant", features: "100% training attendance = maximum feature discovery" } },
      { cat: "Sentiment", metric: "Email open rate", value: "62%",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Engaged", expansion: "Not directly relevant", seats: "Not relevant", features: "High open rate = seeing feature announcements" } },
    ],
    briefs: {
      churn: {
        title: "CHURN RISK ASSESSMENT", risk: "LOW RISK — EXPANSION OPPORTUNITY", prob: "15%", color: sf.success,
        factors: ["Team growing 20 → 31 — organic expansion signal", "Contract up 20% YoY — increasing investment", "NPS 9 with glowing feedback — strong promoter"],
        actions: ["Initiate expansion conversation — outgrowing current tier", "Invite to customer advisory board / case study", "Propose multi-year renewal with volume pricing"],
        actionImpacts: [
          { text: "Projected: +$80K ARR expansion", math: "Current ARR: $280K\nTeam growth: 20 → 31 (+55%)\nPer-seat pricing model: $280K × (31/20)\n= $280K × 1.55 = $434K potential\nConservative uptake (60%): +$92.4K\nDiscount for multi-seat: ×0.87 = +$80.4K ≈ +$80K" },
          { text: "Projected: +2 reference customers", math: "NPS 9 = Promoter status\nHistorical advisory board → referral rate: 73%\nCase study participation lift: 2.1× referrals\nExpected referrals: 0.73 × 2.1 × 1.3(NPS bonus)\n= 1.99 ≈ 2 reference customers" },
          { text: "Projected: 3-year lock-in, +15% LTV", math: "Current contract: 1-year, $280K\n3-year commitment: $280K × 3 = $840K base\nMulti-year discount offered: -8%\nExpansion baked in: +12% YoY (conservative)\nLTV: $840K × 0.92 × (1 + 0.12 avg)\n= $840K × 0.92 × 1.12 = $865K\nvs 1-year renewal LTV: $756K\nLift: ($865K - $756K)/$756K = +14.4% ≈ +15%" }
        ],
        confidence: 94, probCalc: { scores: [["Usage growth","0.10","0.28","0.028",sf.successLight],["Support health","0.05","0.22","0.011",sf.successLight],["Stakeholder strong","0.10","0.25","0.025",sf.successLight],["Financial growth","0.20","0.10","0.020",sf.successLight],["Sentiment positive","0.10","0.15","0.015",sf.successLight]], raw: "0.099", calibrated: "0.15" },
        confCalc: { strength: [96,"all signals positive"], completeness: [95,"20/20 points"], pattern: [92,"matches 6 past renewals"], corroboration: [93,"5/5 categories align"], math: "(96×0.30)+(95×0.20)+(92×0.25)+(93×0.25)\n= 28.8 + 19.0 + 23.0 + 23.25\n= 94.05 → 94%", extra: null },
        timeline: "Proactive — begin expansion discussion within 2 weeks"
      },
      expansion: {
        title: "EXPANSION FORECAST", risk: "STRONG EXPANSION SIGNAL", prob: "89%", color: sf.success,
        factors: ["Team grew 55% organically (20 → 31) — exceeding current tier", "Contract value up 20% YoY — already investing more", "NPS 9 + 'best tool adopted' — internal champion creating pull", "API calls up 23% — deepening integration = more dependency", "Executive sponsor active monthly — can approve budget"],
        actions: ["Present enterprise tier proposal with volume pricing", "Propose additional department onboarding (sales, ops)", "Offer early access to upcoming features as expansion incentive", "Structure multi-year deal with built-in growth tiers"],
        actionImpacts: [
          { text: "Projected: +$154K ARR (enterprise tier)", math: "Current ARR: $280K\nEnterprise tier pricing: $434K (31 seats at volume)\nMid-market → enterprise uplift: +12% for premium features\n$434K × 1.12 = $486K\nConservative capture rate: 85%\nProjected new ARR: $434K × 0.85 = $369K\nNet expansion: $369K - $280K = $89K base\nPlus new department seats: +$65K\nTotal: +$154K" },
          { text: "Projected: 2 new departments onboarded", math: "Current: Engineering team (31 users)\nCandidate departments: Sales (est. 15 seats), Ops (est. 12 seats)\nSponsor influence score: 0.85\nHistorical cross-department adoption: 68%\nExpected: 2 × 0.68 = 1.36 → 2 departments\n(Sales most likely first)" },
          { text: "Projected: 91% retention with early access", math: "Current retention probability: 85%\nEarly access loyalty effect: +6%\nSunk cost of integration: already high\nWith enterprise tier: switching cost ×2.3\nProjected retention: 85% + 6% = 91%" },
          { text: "Projected: $1.2M 3-year TCV", math: "Year 1: $434K (enterprise tier)\nYear 2: $434K × 1.15 (growth clause) = $499K\nYear 3: $499K × 1.10 = $549K\nTotal 3-year TCV: $1,482K\nWith multi-year discount (-18%): $1,215K ≈ $1.2M\nvs current trajectory: $840K (3 × $280K)" }
        ],
        confidence: 92, probCalc: { scores: [["Team growth 55%","0.95","0.25","0.238",sf.successLight],["API growth 23%","0.85","0.20","0.170",sf.successLight],["Active sponsor","0.90","0.20","0.180",sf.successLight],["Contract up 20%","0.88","0.20","0.176",sf.successLight],["NPS 9 promoter","0.92","0.15","0.138",sf.successLight]], raw: "0.902", calibrated: "0.89" },
        confCalc: { strength: [94,"5 strong expansion signals"], completeness: [95,"20/20 points"], pattern: [90,"matches 8 past expansions"], corroboration: [89,"5/5 categories positive"], math: "(94×0.30)+(95×0.20)+(90×0.25)+(89×0.25)\n= 28.2 + 19.0 + 22.5 + 22.25\n= 91.95 → 92%", extra: null },
        timeline: "Immediate — expansion conversation this month, close by Q3"
      },
      seats: {
        title: "SEAT REDUCTION RISK", risk: "VERY LOW — SEAT GROWTH EXPECTED", prob: "3%", color: sf.success,
        factors: ["Team grew 55% in current period (20 → 31)", "Feature adoption at 68% — users getting clear value", "NPS 9 across the team — no dissatisfied user segments"],
        actions: ["No defensive action needed — focus on expansion instead", "Proactively offer volume pricing for next growth phase", "Monitor per-department usage to ensure even adoption"],
        actionImpacts: [
          { text: "Projected: +15-20 additional seats in 6 months", math: "Current growth rate: 55% in last period\nHistorical growth continuation: 60% of rate\nProjected: 31 × (1 + 0.55 × 0.60) = 31 × 1.33\n= 41.2 seats → +10 minimum\nWith department expansion: +15-20 total" },
          { text: "Projected: volume pricing saves client 12%", math: "Current per-seat cost: $280K / 31 = $9.03K\nVolume tier (40+ seats): $7.95K per seat\nSavings: ($9.03K - $7.95K) / $9.03K = 12%\nClient motivation to consolidate on platform" },
          { text: "Projected: zero seat reduction risk through renewal", math: "Growth trajectory: accelerating\nUser satisfaction: NPS 9\nAdoption: 68% (above churn threshold)\nHistorical seat reduction in this profile: <3%\nConclusion: focus entirely on growth" }
        ],
        confidence: 96, probCalc: { scores: [["Team growth 55%","0.05","0.30","0.015",sf.successLight],["Adoption 68%","0.05","0.25","0.013",sf.successLight],["NPS 9","0.03","0.20","0.006",sf.successLight],["Active sponsor","0.05","0.15","0.008",sf.successLight],["Financial growth","0.05","0.10","0.005",sf.successLight]], raw: "0.047", calibrated: "0.03" },
        confCalc: { strength: [97,"all signals positive"], completeness: [95,"20/20 points"], pattern: [96,"matches growth profiles"], corroboration: [95,"5/5 categories growing"], math: "(97×0.30)+(95×0.20)+(96×0.25)+(95×0.25)\n= 29.1 + 19.0 + 24.0 + 23.75\n= 95.85 → 96%", extra: null },
        timeline: "No action needed — seat count will grow organically"
      },
      features: {
        title: "FEATURE ADOPTION TRAJECTORY", risk: "STRONG ADOPTION — ADVANCED FEATURES NEXT", prob: "68% current → 82% projected", color: sf.success,
        factors: ["68% adoption already — above average", "100% training attendance — team is learning", "API calls up 23% — integration features growing fast", "Community active (3 posts/month) — discovering features organically", "62% email open rate — seeing feature announcements"],
        actions: ["Introduce advanced feature track for power users", "Enable beta access to upcoming Q3 features", "Create internal champions program for feature evangelism", "Schedule advanced API integration workshop"],
        actionImpacts: [
          { text: "Projected: 68% → 82% adoption in 90 days", math: "Current adoption: 68%\nAdvanced track lift: +8% (power user features)\nBeta access engagement: +4%\nChampion network effect: +2%\nTotal: 68% + 14% = 82%\nDiminishing returns above 68%: ×0.85\nAdjusted: 68% + (14% × 0.85) = 79.9% ≈ 82%\n(champion effect adds +2.1%)" },
          { text: "Projected: 5 power users become feature champions", math: "Team size: 31\nCurrent power users (>80% feature use): ~8\nChampion program conversion: 62%\n8 × 0.62 = 4.96 ≈ 5 champions\nEach champion influences ~3 teammates" },
          { text: "Projected: API integration depth → 4 new connections", math: "Current API integrations: est. 6\nAPI growth rate: 23%/month\nWorkshop activation of dormant endpoints: +2\nNew integration discovery: +2\nProjected: 6 + 4 = 10 integrations\nStickiness score: very high (switching cost ×3)" },
          { text: "Projected: +$42K upsell via advanced features", math: "Advanced feature tier premium: +15% of ARR\n$280K × 0.15 = $42K\nPower user willingness to pay: 78%\nExpected capture: $42K × 0.78 = $32.8K minimum\nWith champion advocacy: $42K (full capture likely)" }
        ],
        confidence: 91, probCalc: { scores: [["Current adoption 68%","0.70","0.30","0.210",sf.successLight],["Training 100%","0.90","0.20","0.180",sf.successLight],["API growth 23%","0.80","0.20","0.160",sf.successLight],["Community active","0.65","0.15","0.098",sf.successLight],["Email open 62%","0.60","0.15","0.090",sf.successLight]], raw: "0.738", calibrated: "0.82 projected" },
        confCalc: { strength: [92,"strong adoption baseline"], completeness: [95,"20/20 points"], pattern: [89,"matches high-adopter trajectory"], corroboration: [88,"4/5 categories strong"], math: "(92×0.30)+(95×0.20)+(89×0.25)+(88×0.25)\n= 27.6 + 19.0 + 22.25 + 22.0\n= 90.85 → 91%", extra: null },
        timeline: "90-day advanced adoption track — start with power user cohort"
      }
    }
  },
  {
    id: "atlas", name: "Atlas Logistics", industry: "Transportation", arr: "$650K",
    renewalIn: "3 months", renewalDate: "May 01, 2025", riskLevel: "MEDIUM", riskScore: 51,
    color: sf.warning, csm: "Emily Rodriguez", contacts: 38, lastActivity: "6 days ago",
    data: [
      { cat: "Usage", metric: "Platform logins (30d)", value: "Flat",
        signals: { churn: "noise", expansion: "noise", seats: "low", features: "noise" },
        insights: { churn: "Stable", expansion: "No growth", seats: "Flat logins but fewer users", features: "Not informative" } },
      { cat: "Usage", metric: "API call volume (30d)", value: "Down 15%",
        signals: { churn: "medium", expansion: "noise", seats: "medium", features: "high" },
        insights: { churn: "Integration pullback — monitor", expansion: "Not a growth signal", seats: "API reduction may mean fewer integrating users", features: "Integration features being deprioritized" } },
      { cat: "Usage", metric: "Feature adoption rate", value: "35%",
        signals: { churn: "medium", expansion: "noise", seats: "high", features: "high" },
        insights: { churn: "Underutilizing the platform", expansion: "Not relevant", seats: "65% unused features = users not getting value = seat risk", features: "Only 35% adopted — 65% opportunity gap" } },
      { cat: "Usage", metric: "Report generation (30d)", value: "Flat",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "low" },
        insights: { churn: "No change", expansion: "Not relevant", seats: "Not relevant", features: "Stable but not growing" } },
      { cat: "Support", metric: "Open critical tickets", value: "1 unresolved",
        signals: { churn: "medium", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Lingering issue needs attention", expansion: "Not relevant", seats: "Not seat-related", features: "May block specific feature adoption" } },
      { cat: "Support", metric: "Avg resolution time", value: "7 days",
        signals: { churn: "low", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Acceptable but not great", expansion: "Not relevant", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Support", metric: "Total tickets (90d)", value: "12 tickets",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Normal volume", expansion: "Not relevant", seats: "Not relevant", features: "Not relevant" } },
      { cat: "Support", metric: "CSAT on last 5 tickets", value: "3.4 / 5",
        signals: { churn: "low", expansion: "noise", seats: "low", features: "low" },
        insights: { churn: "Mediocre", expansion: "Not relevant", seats: "Low satisfaction → less investment per seat", features: "Meh satisfaction reduces feature exploration" } },
      { cat: "Stakeholder", metric: "Executive sponsor", value: "New VP — 2 months",
        signals: { churn: "high", expansion: "medium", seats: "high", features: "medium" },
        insights: { churn: "New decision-maker may re-evaluate vendors", expansion: "New VPs sometimes bring new budget — or cut", seats: "New VP likely to audit seat utilization", features: "May reprioritize which features matter" } },
      { cat: "Stakeholder", metric: "Primary contact", value: "Brief responses",
        signals: { churn: "low", expansion: "noise", seats: "noise", features: "noise" },
        insights: { churn: "Going through the motions", expansion: "Not relevant", seats: "Not relevant", features: "Not feature-specific" } },
      { cat: "Stakeholder", metric: "Team size on platform", value: "45 → 38",
        signals: { churn: "medium", expansion: "noise", seats: "high", features: "medium" },
        insights: { churn: "Shrinking user base", expansion: "Not an expansion signal", seats: "Already lost 7 seats (16%) — primary seat reduction indicator", features: "Fewer users = fewer feature advocates" } },
      { cat: "Stakeholder", metric: "Last executive meeting", value: "6 weeks ago",
        signals: { churn: "low", expansion: "noise", seats: "low", features: "noise" },
        insights: { churn: "Slightly overdue", expansion: "Not relevant", seats: "No recent discussion of utilization", features: "Not relevant" } },
      { cat: "Financial", metric: "Payment history", value: "1 late payment",
        signals: { churn: "low", expansion: "noise", seats: "medium", features: "noise" },
        insights: { churn: "Isolated, monitor", expansion: "Not relevant", seats: "Budget pressure may accelerate seat cuts", features: "Not relevant" } },
      { cat: "Financial", metric: "Contract value trend", value: "Flat 3 years",
        signals: { churn: "medium", expansion: "medium", seats: "medium", features: "noise" },
        insights: { churn: "Zero growth — stagnation risk", expansion: "3 years flat = no expansion appetite", seats: "Flat contract but shrinking users = cost per seat rising", features: "Not feature-specific" } },
      { cat: "Financial", metric: "Last renewal discount", value: "22%",
        signals: { churn: "medium", expansion: "noise", seats: "high", features: "noise" },
        insights: { churn: "Heavily discounted — low margin", expansion: "Not relevant", seats: "22% discount + shrinking users = likely to negotiate down further", features: "Not relevant" } },
      { cat: "Sentiment", metric: "NPS score", value: "6",
        signals: { churn: "low", expansion: "noise", seats: "medium", features: "medium" },
        insights: { churn: "Passive — could go either way", expansion: "Not relevant", seats: "Passive users don't defend seat count", features: "Lukewarm sentiment limits feature exploration" } },
      { cat: "Sentiment", metric: "Last NPS comment", value: "\"Does the job\"",
        signals: { churn: "medium", expansion: "noise", seats: "medium", features: "high" },
        insights: { churn: "Commodity perception — vulnerable", expansion: "Not expanding with this sentiment", seats: "'Does the job' = only paying for what we use = seat reduction language", features: "Commodity perception means only basic features valued" } },
      { cat: "Sentiment", metric: "Community activity", value: "None",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "low" },
        insights: { churn: "Never engaged", expansion: "Not relevant", seats: "Not relevant", features: "No organic feature discovery" } },
      { cat: "Sentiment", metric: "Training attendance", value: "Sporadic",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "high" },
        insights: { churn: "Not meaningful", expansion: "Not relevant", seats: "Not relevant", features: "Sporadic training = inconsistent feature adoption" } },
      { cat: "Sentiment", metric: "Email open rate", value: "19%",
        signals: { churn: "noise", expansion: "noise", seats: "noise", features: "medium" },
        insights: { churn: "Below average", expansion: "Not relevant", seats: "Not relevant", features: "Missing feature announcements and tips" } },
    ],
    briefs: {
      churn: {
        title: "CHURN RISK ASSESSMENT", risk: "MEDIUM CHURN RISK", prob: "51%", color: sf.warning,
        factors: ["New VP started 2 months ago — vendor re-evaluation likely", "Team shrinking 45 → 38 — losing adoption", "$650K flat 3 years at 22% discount — stagnation", "NPS 6 with 'does the job' — commodity perception"],
        actions: ["Priority intro meeting with new VP within 2 weeks", "Build ROI narrative vs. alternatives", "Custom enablement session for underutilized features", "Resolve critical ticket before renewal conversation"],
        actionImpacts: [
          { text: "Projected: 51% → 35% churn risk", math: "Baseline churn: 51%\nNew VP intro effect: -18% (relationship reset)\nFirst 90-day window: ×1.8 influence multiplier\nBut: unproven relationship\nRisk adj: 51% × (1 - 0.18 × 1.8) × 0.92\n= 51% × 0.676 × 0.92 = 31.7%\nConservative round: 35%" },
          { text: "Projected: 51% → 38% churn risk", math: "Baseline churn: 51%\nROI narrative effect: -14% (value reframing)\nCommodity perception offset: ×1.2\nNPS 6 → passive, receptive to value story\n51% × (1 - 0.14 × 1.2) × 0.89\n= 51% × 0.832 × 0.89 = 37.7% ≈ 38%" },
          { text: "Projected: 35% → 74% feature adoption", math: "Current adoption: 35%\nCustom enablement lift: +22% (historical avg)\nTargeted vs generic training: ×1.6 effectiveness\nAdjusted lift: 22% × 1.6 = 35.2%\nDiminishing returns factor: ×0.85\n35% + (35.2% × 0.85) × (1 - 0.35)\n= 35% + 29.9% × 0.65 = 35% + 19.4%\nNew adoption: 54.4% → optimistic: 74%\n(includes network effect from power users)" },
          { text: "Projected: CSAT 3.4 → 4.0+", math: "Current CSAT: 3.4/5\nCritical ticket resolution: +0.4 avg lift\nResolution before renewal signal: ×1.2 goodwill\nHistorical CSAT recovery curve:\n3.4 + (0.4 × 1.2) + halo_effect(0.12)\n= 3.4 + 0.48 + 0.12 = 4.0" }
        ],
        confidence: 76, probCalc: { scores: [["Usage flat","0.40","0.28","0.112",sf.warningLight],["Support mixed","0.45","0.22","0.099",sf.warningLight],["Stakeholder risk","0.70","0.25","0.175",sf.errorLight],["Financial stale","0.70","0.10","0.070",sf.warningLight],["Sentiment passive","0.60","0.15","0.090",sf.warningLight]], raw: "0.546", calibrated: "0.51" },
        confCalc: { strength: [68,"1 HIGH, mixed signals"], completeness: [95,"20/20 points"], pattern: [71,"partial match only"], corroboration: [65,"2/5 categories align"], math: "(68×0.30)+(95×0.20)+(71×0.25)+(65×0.25)\n= 20.4 + 19.0 + 17.75 + 16.25\n= 73.4 → 76%", extra: "+2.6 recency boost (new VP signal)" },
        timeline: "Urgent — renewal in 3 months, new VP is the wildcard"
      },
      expansion: {
        title: "EXPANSION FORECAST", risk: "EXPANSION UNLIKELY", prob: "11%", color: sf.error,
        factors: ["Contract flat 3 years — no growth trajectory", "Team shrinking 45 → 38 — opposite of expansion", "New VP may cut before expanding — re-evaluation mode", "'Does the job' sentiment — no enthusiasm for more investment"],
        actions: ["Do not pitch expansion in current climate", "Focus on retention and value demonstration first", "Wait for new VP relationship to stabilize", "Identify potential expansion only after Q2 renewal secured"],
        actionImpacts: [
          { text: "Projected: expansion possible Q4 if retention secured", math: "Current expansion probability: 11%\nIf retention secured (Q2): base improves to 25%\nIf VP relationship established: ×1.6\n25% × 1.6 = 40% expansion probability in Q4\nTimeline: 6-9 months out" },
          { text: "Projected: new VP could unlock $130K if converted", math: "If VP becomes champion:\nNew department potential: 20 additional seats\n20 × ($650K/38 per seat) = $342K potential\nRealistic capture: 38% (new relationship)\n$342K × 0.38 = $130K\nBut: 6+ months away minimum" },
          { text: "Projected: feature adoption must reach 55% first", math: "Expansion prerequisite: demonstrated value\nCurrent adoption: 35%\nHistorical expansion threshold: 55%+ adoption\nGap: 20% adoption increase needed\nTimeline to 55%: ~4 months with enablement\nExpansion conversation: month 5-6 earliest" },
          { text: "Projected: retention focus yields better ROI than expansion push", math: "Expansion push now: 11% success × $130K = $14.3K EV\nRetention focus: 70% save rate × $650K = $455K EV\nROI ratio: retention is 32× more valuable\nClear priority: save the account first" }
        ],
        confidence: 82, probCalc: { scores: [["Contract flat 3yr","0.85","0.25","0.213",sf.errorLight],["Team shrinking","0.80","0.25","0.200",sf.errorLight],["New VP uncertainty","0.70","0.20","0.140",sf.warningLight],["Commodity sentiment","0.75","0.15","0.113",sf.warningLight],["22% discount","0.60","0.15","0.090",sf.warningLight]], raw: "0.756", calibrated: "0.11 (inverted)" },
        confCalc: { strength: [84,"clear negative signals"], completeness: [95,"20/20 points"], pattern: [80,"matches non-expansion profile"], corroboration: [70,"3/5 negative"], math: "(84×0.30)+(95×0.20)+(80×0.25)+(70×0.25)\n= 25.2 + 19.0 + 20.0 + 17.5\n= 81.7 → 82%", extra: null },
        timeline: "Not now — revisit expansion only after retention is secured in Q2"
      },
      seats: {
        title: "SEAT REDUCTION RISK", risk: "HIGH SEAT REDUCTION RISK", prob: "72%", color: sf.error,
        factors: ["Already lost 7 seats (45 → 38) — 16% reduction in progress", "Only 35% feature adoption — 65% of users underutilizing", "New VP will likely audit seat utilization in first 90 days", "'Does the job' at 22% discount — cost optimization target", "Flat $650K contract + shrinking users = rising cost per seat"],
        actions: ["Run immediate per-user utilization audit", "Identify and activate the 12-15 underutilizing users", "Present value-per-seat analysis to new VP proactively", "Propose seat optimization plan before they impose one"],
        actionImpacts: [
          { text: "Projected: 72% → 45% seat reduction risk", math: "Baseline reduction risk: 72%\nProactive utilization audit: shows transparency\nHistorical proactive vs reactive: saves 38% more seats\n72% × (1 - 0.38) = 44.6% ≈ 45%\nKey: controlling the narrative" },
          { text: "Projected: save 8 of 12 at-risk seats", math: "Current active users (>5 logins/month): ~26\nInactive/low-usage: ~12 seats at risk\nActivation sprint effectiveness: 65%\n12 × 0.65 = 7.8 ≈ 8 seats saved\nRevenue protected: 8 × $17.1K = $136.8K" },
          { text: "Projected: proactive plan saves $205K vs reactive cut", math: "Reactive scenario: VP cuts 15 seats\n15 × ($650K/38) = $256.6K revenue lost\nProactive scenario: optimize 5, activate 8, keep 25\nProactive revenue loss: 5 × $17.1K = $85.5K\nSavings: $256.6K - $85.5K = $171.1K\nPlus goodwill value: ~$34K = $205K total" },
          { text: "Projected: value-per-seat story shifts VP perception", math: "Current perception: 'paying for 38, only 26 active'\nCost per active seat: $650K/26 = $25K\nWith optimization: $650K/33 = $19.7K\nIndustry benchmark: $22K average\nStory: 'you're getting below-market value per active seat'\nPerception shift probability: 68%" }
        ],
        confidence: 84, probCalc: { scores: [["Team shrunk 16%","0.90","0.30","0.270",sf.errorLight],["Adoption 35%","0.85","0.25","0.213",sf.errorLight],["New VP audit","0.80","0.20","0.160",sf.errorLight],["22% discount","0.70","0.15","0.105",sf.warningLight],["Commodity perception","0.65","0.10","0.065",sf.warningLight]], raw: "0.813", calibrated: "0.72" },
        confCalc: { strength: [88,"strong reduction signals"], completeness: [95,"20/20 points"], pattern: [82,"matches seat reduction profiles"], corroboration: [72,"4/5 categories negative"], math: "(88×0.30)+(95×0.20)+(82×0.25)+(72×0.25)\n= 26.4 + 19.0 + 20.5 + 18.0\n= 83.9 → 84%", extra: null },
        timeline: "Critical — expect VP audit within 30 days, renewal in 3 months"
      },
      features: {
        title: "FEATURE ADOPTION TRAJECTORY", risk: "LOW ADOPTION — DECLINING TRAJECTORY", prob: "35% current → 29% projected", color: sf.error,
        factors: ["Only 35% adoption with declining API usage (-15%)", "Sporadic training attendance — inconsistent learning", "'Does the job' sentiment — only using basic features", "19% email open rate — missing feature updates entirely", "No community engagement — zero organic feature discovery"],
        actions: ["Deploy immediate 'quick wins' feature campaign targeting 5 high-ROI features", "Assign feature adoption specialist for 8-week sprint", "Create role-specific feature guides for logistics workflows", "Implement in-app tooltips and guided tours"],
        actionImpacts: [
          { text: "Projected: 35% → 48% adoption in 60 days", math: "Current adoption: 35% (declining)\nQuick wins campaign: +8% (low-effort, high-value features)\nAdoption specialist lift: +5% (guided activation)\nRole-specific guides: +3% (relevance increases adoption)\nIn-app tooltips: +2% (passive discovery)\nTotal: 35% + 18% × diminishing_factor(0.72)\n= 35% + 13% = 48%" },
          { text: "Projected: reverses decline trajectory within 30 days", math: "Current trajectory: -3% adoption per quarter\nIntervention reversal: typically week 2-3\nHistorical pattern: decline → flat → growth\nFlat by day 20, growth by day 35\nKey metric: daily feature activation rate" },
          { text: "Projected: role-specific adoption increases stickiness 24%", math: "Generic features: switching cost = low\nRole-specific configured features: switching cost = high\nLogistics workflow features (5 targeted):\nRoute optimization, fleet dashboard, carrier scoring\nPer-feature stickiness increase: 4.8%\n5 × 4.8% = 24% total stickiness improvement" },
          { text: "Projected: feature adoption → $97K in demonstrated value", math: "Platform total value at full adoption: $650K\nCurrent realized value: 35% × $650K = $227.5K\nAt 48% adoption: 48% × $650K = $312K\nDemonstrated value increase: $84.5K\nPlus reduced support costs: $12.5K\nTotal: $97K demonstrated value" }
        ],
        confidence: 75, probCalc: { scores: [["Current adoption 35%","0.70","0.30","0.210",sf.warningLight],["API declining 15%","0.65","0.20","0.130",sf.warningLight],["Sporadic training","0.80","0.20","0.160",sf.errorLight],["Low email opens","0.55","0.15","0.083",sf.warningLight],["No community","0.60","0.15","0.090",sf.warningLight]], raw: "0.673", calibrated: "0.29 projected (declining)" },
        confCalc: { strength: [78,"clear declining signals"], completeness: [95,"20/20 points"], pattern: [72,"matches declining adoption curve"], corroboration: [55,"3/5 categories informative"], math: "(78×0.30)+(95×0.20)+(72×0.25)+(55×0.25)\n= 23.4 + 19.0 + 18.0 + 13.75\n= 74.15 → 75%", extra: null },
        timeline: "Urgent — reverse decline before renewal conversation in 3 months"
      }
    }
  }
];

const catIcons = { Usage: "📊", Support: "🎧", Stakeholder: "👤", Financial: "💰", Sentiment: "💬" };
const metricDefs = {
  "Platform logins (30d)": "Number of unique user logins to the platform over the last 30 days, compared to the previous period.",
  "API call volume (30d)": "Total API requests made by this customer's integrations in the last 30 days. Indicates how deeply embedded the platform is in their workflows.",
  "Feature adoption rate": "Percentage of available platform features actively used by this customer. Higher adoption = more value realized = lower churn risk.",
  "Report generation (30d)": "Number of reports, dashboards, or exports generated in the last 30 days. Measures active analytical use of the platform.",
  "Open critical tickets": "Number of unresolved support tickets marked as critical/P1 severity. These directly impact customer trust and satisfaction.",
  "Avg resolution time": "Average number of days to resolve support tickets for this customer. Industry benchmark is 3-5 days.",
  "Total tickets (90d)": "Total support tickets submitted over the last 90 days. High volume may indicate product issues or heavy usage.",
  "CSAT on last 5 tickets": "Customer Satisfaction score averaged across the 5 most recent resolved tickets. Scale: 1 (very dissatisfied) to 5 (very satisfied).",
  "Executive sponsor": "The senior leader at the customer organization who champions the platform internally. Loss of sponsor is a top churn predictor.",
  "Primary contact": "The day-to-day contact person managing the platform relationship. Their engagement level signals account health.",
  "Team size on platform": "Number of licensed users actively on the platform. Growth signals expansion; decline signals potential seat reduction.",
  "Last executive meeting": "Time since the last strategic meeting between our leadership and the customer's executives. Regular touchpoints reduce churn risk.",
  "Payment history": "Track record of on-time contract payments. Late payments can signal budget pressure or deprioritization.",
  "Contract value trend": "Year-over-year change in the customer's contract value. Flat or declining trends suggest stagnation.",
  "Last renewal discount": "Discount percentage applied at the most recent renewal. High discounts may indicate price sensitivity or low perceived value.",
  "NPS score": "Net Promoter Score (0-10). 9-10 = Promoter, 7-8 = Passive, 0-6 = Detractor. Measures likelihood to recommend the platform.",
  "Last NPS comment": "Most recent verbatim feedback from the customer's NPS survey. Direct voice-of-customer signal.",
  "Community activity": "Customer's participation in the platform's user community — forum posts, event attendance, knowledge sharing.",
  "Training attendance": "Participation in platform training sessions, webinars, and enablement programs. Correlates with feature adoption.",
  "Email open rate": "Percentage of platform emails (product updates, tips, announcements) opened by the customer's team.",
};
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
  { num: 3, label: "Question", icon: "❓" },
  { num: 4, label: "Filter", icon: "🧠" },
  { num: 5, label: "Agent Context", icon: "🤖" },
  { num: 6, label: "Intelligence Brief", icon: "🎯" },
  { num: 7, label: "Take Action", icon: "⚡" },
];

const questionDefs = [
  { id: "churn", label: "Churn Risk at Renewal", desc: "What is this customer's likelihood of churning in the next 6 months?", icon: "🔴", color: sf.errorLight },
  { id: "expansion", label: "Expansion Likelihood", desc: "Will this customer expand seats, usage, or contract value in the next 6 months?", icon: "📈", color: sf.successLight },
  { id: "seats", label: "Seat Reduction Risk", desc: "Is this customer likely to reduce seats or downgrade in the next 6 months?", icon: "📉", color: sf.warningLight },
  { id: "features", label: "Feature Adoption Trajectory", desc: "Which features will this customer adopt or abandon in the next 6 months?", icon: "🧩", color: sf.lightBlue },
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
  const [selectedQ, setSelectedQ] = useState(null);
  const [customQ, setCustomQ] = useState("");
  const [customBrief, setCustomBrief] = useState(null);
  const [customLoading, setCustomLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const chatEndRef = useRef(null);
  const ivRef = useRef(null);

  const c = selIdx !== null ? customers[selIdx] : null;
  const activeQ = selectedQ;
  const activeBrief = selectedQ === "custom" ? customBrief : (c && selectedQ ? c.briefs[selectedQ] : null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs]);

  const getSignal = (d) => selectedQ === "custom" ? (d._customSignal || "noise") : (d.signals?.[selectedQ] || "noise");
  const getInsight = (d) => selectedQ === "custom" ? (d._customInsight || "") : (d.insights?.[selectedQ] || "");

  const selectCustomer = (idx) => {
    setSelIdx(idx); setStep(2); setVisibleRows(0); setFilterProg(0);
    setBriefVisible(false); setOverrideIdx(null); setFeedbackLog([]);
    setChatOpen(false); setChatMsgs([]); setAutonomyMode(false);
    setSelectedQ(null); setCustomQ(""); setCustomBrief(null);
    let count = 0;
    const iv = setInterval(() => { count++; setVisibleRows(count); if (count >= 20) clearInterval(iv); }, 35);
  };

  const selectQuestion = (qId) => {
    setSelectedQ(qId);
    if (qId !== "custom") {
      setStep(4); setFilterProg(0);
      let p = 0;
      ivRef.current = setInterval(() => { p += 3; setFilterProg(p); if (p >= 100) clearInterval(ivRef.current); }, 40);
    }
  };

  const runCustomQuestion = async () => {
    if (!customQ.trim() || !c) return;
    setSelectedQ("custom"); setCustomLoading(true); setStep(4); setFilterProg(0);
    const dataStr = c.data.map(d => `[${d.cat}] ${d.metric}: ${d.value}`).join("\n");
    const sysPrompt = `You are a customer behavior intelligence agent for Salesforce. You are analyzing data for ${c.name} (${c.industry}, ARR: ${c.arr}, renewal in ${c.renewalIn}).

Here is the raw customer data:
${dataStr}

The user is asking a specific question about this customer's behavior 6 months into the future. Analyze the data and respond in EXACTLY this JSON format (no markdown, no backticks):
{"title":"BRIEF TITLE","risk":"Risk/status label","prob":"Key metric or probability","color":"red|green|orange","factors":["factor 1","factor 2","factor 3","factor 4"],"actions":["action 1","action 2","action 3","action 4"],"actionImpacts":[{"text":"Impact 1","math":"Calculation 1"},{"text":"Impact 2","math":"Calculation 2"},{"text":"Impact 3","math":"Calculation 3"},{"text":"Impact 4","math":"Calculation 4"}],"confidence":85,"timeline":"Timeline recommendation","signalScores":[{"idx":0,"signal":"high|medium|low|noise","insight":"Why this signal matters for this question"},{"idx":1,"signal":"noise","insight":"Not relevant"}]}

Include signalScores for ALL 20 data points (idx 0-19). Be specific and quantitative in your analysis.`;
    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514", max_tokens: 2000,
          system: sysPrompt,
          messages: [{ role: "user", content: customQ }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const colorMap = { red: sf.error, green: sf.success, orange: sf.warning };
      setCustomBrief({
        ...parsed,
        color: colorMap[parsed.color] || sf.lightBlue,
        probCalc: null, confCalc: null,
      });
      // Apply signal scores to data
      if (parsed.signalScores) {
        setCustomers(prev => {
          const next = JSON.parse(JSON.stringify(prev));
          parsed.signalScores.forEach(s => {
            if (next[selIdx].data[s.idx]) {
              next[selIdx].data[s.idx]._customSignal = s.signal;
              next[selIdx].data[s.idx]._customInsight = s.insight;
            }
          });
          return next;
        });
      }
    } catch (e) {
      setCustomBrief({
        title: "CUSTOM ANALYSIS", risk: "ANALYSIS ERROR", prob: "N/A", color: sf.warning,
        factors: ["Could not generate analysis — check API connection", "Try one of the predefined questions instead"],
        actions: ["Retry the question", "Use a predefined question"], actionImpacts: [],
        confidence: 0, timeline: "N/A", probCalc: null, confCalc: null
      });
    }
    setCustomLoading(false);
    let p = 0;
    ivRef.current = setInterval(() => { p += 5; setFilterProg(p); if (p >= 100) clearInterval(ivRef.current); }, 30);
  };

  const runFilter = () => {
    setStep(4); setFilterProg(0);
    let p = 0;
    ivRef.current = setInterval(() => { p += 3; setFilterProg(p); if (p >= 100) clearInterval(ivRef.current); }, 40);
  };

  const overrideSignal = (dataIdx, newSignal) => {
    setCustomers(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      if (selectedQ === "custom") {
        next[selIdx].data[dataIdx]._customSignal = newSignal;
      } else if (selectedQ) {
        next[selIdx].data[dataIdx].signals[selectedQ] = newSignal;
      }
      next[selIdx].data[dataIdx].overridden = true;
      return next;
    });
    setOverrideIdx(null);
  };

  const goToContext = () => setStep(5);
  const goToBrief = () => { setStep(6); setTimeout(() => setBriefVisible(true), 100); };
  const goToAction = () => setStep(7);
  const resetDemo = () => { setStep(1); setSelIdx(null); setFilterProg(0); setVisibleRows(0); setBriefVisible(false); setCustomers(makeCustomers()); setChatOpen(false); setChatMsgs([]); setAutonomyMode(false); setSelectedQ(null); setCustomQ(""); setCustomBrief(null); setFeedbackText(""); setFeedbackSent(false); };

  const highSigs = c ? c.data.filter(d => getSignal(d) === "high") : [];
  const medSigs = c ? c.data.filter(d => getSignal(d) === "medium") : [];
  const keptSigs = highSigs.length + medSigs.length;
  const noisePercent = c ? Math.round(((20 - keptSigs) / 20) * 100) : 0;

  const contextBlock = c ? [
    `ACCOUNT: ${c.name} | ${c.industry} | ARR: ${c.arr}`,
    `RENEWAL DATE: ${c.renewalDate} (${c.renewalIn})`,
    `QUESTION: ${selectedQ === "custom" ? customQ : (questionDefs.find(q => q.id === selectedQ)?.label || "Churn Risk")}`,
    ``, `HIGH-PRIORITY SIGNALS:`,
    ...highSigs.map(s => `  ⚠ [${s.cat.toUpperCase()}] ${s.metric}: ${s.value} — ${getInsight(s)}`),
    ``, `WATCH SIGNALS:`,
    ...medSigs.map(s => `  ◆ [${s.cat.toUpperCase()}] ${s.metric}: ${s.value} — ${getInsight(s)}`),
    ``, `INSTRUCTION: Based on these filtered signals, generate an intelligence brief answering the question above with specific, actionable recommendations.`,
  ] : [];

  const contextText = contextBlock.join("\n");

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMsgs(prev => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const brief = activeBrief;
      const sysPrompt = `You are a Salesforce Customer Behavior Intelligence Agent. You have access to the following filtered customer data for ${c.name}:\n\n${contextText}\n\nThe intelligence brief produced:\nAssessment: ${brief?.risk || "N/A"} (${brief?.prob || "N/A"})\nKey Factors: ${brief?.factors?.join("; ") || "N/A"}\nRecommended Actions: ${brief?.actions?.join("; ") || "N/A"}\nTimeline: ${brief?.timeline || "N/A"}\n\nAnswer the user's questions based on this data. Be specific, actionable, and concise. If asked about data you don't have, say so honestly.`;
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
                <button onClick={() => setStep(3)} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.cloudBlue}, ${sf.lightBlue})`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>❓ Select Your Question →</button>
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
                        <Tip label={<span style={{ width: 200, fontSize: 12, color: sf.textMuted, cursor: "help", borderBottom: `1px dashed rgba(107,138,181,0.3)`, display: "inline-block" }}>{d.metric}</span>} color={sf.textMuted}>
                          <div style={{ width: 240 }}><span style={{ fontSize: 11, lineHeight: 1.5 }}>{metricDefs[d.metric] || d.metric}</span></div>
                        </Tip>
                        <span style={{ fontSize: 12, color: sf.white, fontWeight: 500 }}>{d.value}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Question Selection ═══ */}
        {step === 3 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>What do you want to know about this customer's future?</span>
              </div>
            </div>
            <div style={{ border: `1px solid ${sf.border}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: 24, background: sf.bgCard }}>
              <p style={{ fontSize: 13, color: sf.textLight, lineHeight: 1.6, marginTop: 0, marginBottom: 20 }}>
                The same 20 data points get <strong style={{ color: sf.lightBlue }}>scored differently</strong> depending on the question. Select a question below, or ask your own — the Intelligence Layer adapts its filtering to match.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {questionDefs.map(q => (
                  <div key={q.id} onClick={() => selectQuestion(q.id)} style={{
                    padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: `1px solid ${sf.border}`,
                    borderRadius: 10, cursor: "pointer", transition: "all 0.2s",
                  }} onMouseEnter={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                     onMouseLeave={e => { e.currentTarget.style.borderColor = sf.border; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{q.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: sf.white, marginBottom: 6 }}>{q.label}</div>
                    <div style={{ fontSize: 11, color: sf.textMuted, lineHeight: 1.5 }}>{q.desc}</div>
                  </div>
                ))}
              </div>


            </div>
          </div>
        )}

        {/* ═══ STEP 4: Filter + Human Override ═══ */}
        {step === 4 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>Intelligence Layer Active</span>
                {selectedQ && (
                  <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 12, background: "rgba(1,118,211,0.15)", border: `1px solid rgba(1,118,211,0.25)`, color: sf.lightBlue, marginLeft: 8, fontWeight: 600 }}>
                    {selectedQ === "custom" ? customQ.slice(0, 50) + (customQ.length > 50 ? "..." : "") : questionDefs.find(q => q.id === selectedQ)?.label}
                  </span>
                )}
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
                    const sig = getSignal(d);
                    const sc = signalStyle[sig];
                    const isOut = sig === "noise" || sig === "low";
                    const show = filterProg >= 100;
                    const gi = c.data.indexOf(d);
                    return (
                      <div key={di} style={{
                        display: "flex", alignItems: "center", padding: "7px 20px",
                        borderBottom: `1px solid rgba(1,118,211,0.05)`,
                        opacity: show && isOut ? 0.18 : 1,
                        textDecoration: show && isOut ? "line-through" : "none",
                        background: show && sig === "high" ? sc.bg : d.overridden ? "rgba(1,118,211,0.06)" : "transparent",
                        transition: "all 0.4s ease", gap: 8, position: "relative"
                      }}>
                        <Tip label={<span style={{ width: 200, fontSize: 12, color: sf.textMuted, cursor: "help", borderBottom: `1px dashed rgba(107,138,181,0.3)`, display: "inline-block" }}>{d.metric}</span>} color={sf.textMuted}>
                          <div style={{ width: 240 }}><span style={{ fontSize: 11, lineHeight: 1.5 }}>{metricDefs[d.metric] || d.metric}</span></div>
                        </Tip>
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
                                {signalLevels.filter(l => l !== sig).map(level => (
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
                            <span style={{ fontSize: 11, color: isOut ? sf.deepBg : sf.textMuted, fontStyle: "italic", marginLeft: 4 }}>{getInsight(d)}</span>
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

        {/* ═══ STEP 5: Agent Context ═══ */}
        {step === 5 && c && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>Agent Context Window</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>What the Renewal Agent actually "sees"</span>
              </div>
              <button onClick={goToBrief} style={{ padding: "8px 20px", background: `linear-gradient(135deg, ${sf.success}, #38A169)`, border: "none", borderRadius: 5, color: sf.white, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>🎯 Generate Intelligence Brief →</button>
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

        {/* ═══ STEP 6: Intelligence Brief + Feedback ═══ */}
        {step === 6 && c && activeBrief && (
          <div>
            <div style={{ padding: "14px 20px", background: sf.darkBlue, border: `1px solid ${sf.border}`, borderRadius: "8px 8px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 600, color: sf.white }}>{c.name}</span>
                <span style={{ fontSize: 12, color: sf.textMuted, marginLeft: 12 }}>Agent-Generated Intelligence Brief</span>
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
                <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: activeBrief?.color || c.color, background: (activeBrief?.color || c.color) === sf.error ? "rgba(234,0,30,0.1)" : (activeBrief?.color || c.color) === sf.success ? "rgba(46,132,74,0.1)" : "rgba(221,122,1,0.08)", border: `1px solid ${activeBrief?.color || c.color}30`, cursor: "help" }}>
                  {activeBrief?.risk} — {activeBrief?.prob}
                </div>
              } color={activeBrief?.color || c.color}>
                <div style={{ width: 300 }}>
                  <strong style={{ color: sf.white }}>{activeBrief?.title || "Assessment"} Calculation</strong><br/><br/>
                  <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
                    {activeBrief?.probCalc ? <>
                      <span style={{ color: sf.textMuted }}>Weighted Signal Score:</span><br/>
                      {activeBrief.probCalc.scores.map(([label, score, weight, result, color], i) => (
                        <span key={i}>{label} <span style={{ color }}>{result}</span><br/></span>
                      ))}
                      <span style={{ color: sf.border }}>─────────────────────</span><br/>
                      Raw score = <span style={{ color: sf.white }}>{activeBrief.probCalc.raw}</span><br/>
                      Calibrated = <span style={{ color: sf.white }}>{activeBrief.probCalc.calibrated}</span>
                    </> : <span style={{ color: sf.textMuted }}>AI-generated assessment based on custom question analysis</span>}
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
                        <span style={{ fontSize: 28, fontWeight: 700, color: activeBrief?.confidence >= 90 ? sf.successLight : activeBrief?.confidence >= 80 ? sf.warningLight : sf.errorLight }}>{activeBrief?.confidence}%</span>
                        <Tip label={<span style={{ fontSize: 10, color: sf.textMuted, cursor: "help" }}>How is this calculated?</span>} color={sf.textMuted}>
                          <div style={{ width: 300 }}>
                            <strong style={{ color: sf.white }}>Confidence Score Calculation</strong><br/><br/>
                            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8 }}>
                              {activeBrief?.confCalc ? <>
                                <span style={{ color: sf.textMuted }}>Component Scores (0-100):</span><br/>
                                Signal strength &nbsp;&nbsp;&nbsp;= <span style={{ color: activeBrief.confCalc.strength[0] >= 85 ? sf.successLight : sf.warningLight }}>{activeBrief.confCalc.strength[0]}</span> <span style={{ color: sf.textDim }}>({activeBrief.confCalc.strength[1]})</span><br/>
                                Data completeness &nbsp;= <span style={{ color: sf.successLight }}>{activeBrief.confCalc.completeness[0]}</span> <span style={{ color: sf.textDim }}>({activeBrief.confCalc.completeness[1]})</span><br/>
                                Pattern match &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= <span style={{ color: activeBrief.confCalc.pattern[0] >= 85 ? sf.successLight : sf.warningLight }}>{activeBrief.confCalc.pattern[0]}</span> <span style={{ color: sf.textDim }}>({activeBrief.confCalc.pattern[1]})</span><br/>
                                Cross-corroboration = <span style={{ color: activeBrief.confCalc.corroboration[0] >= 80 ? sf.successLight : sf.warningLight }}>{activeBrief.confCalc.corroboration[0]}</span> <span style={{ color: sf.textDim }}>({activeBrief.confCalc.corroboration[1]})</span><br/>
                                <span style={{ color: sf.border }}>─────────────────────────</span><br/>
                                <span style={{ whiteSpace: "pre-wrap" }}>{activeBrief.confCalc.math}</span>
                                {activeBrief.confCalc.extra && <><br/><span style={{ color: sf.warningLight, fontSize: 9 }}>{activeBrief.confCalc.extra}</span></>}
                              </> : <span style={{ color: sf.textMuted }}>AI-estimated confidence based on signal clarity and data coverage</span>}
                            </div>
                          </div>
                        </Tip>
                      </div>
                    </div>
                    <div style={{ width: 1, height: 40, background: sf.border }} />
                    <div>
                      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.textMuted, fontWeight: 700, marginBottom: 4 }}>Agent Mode</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {activeBrief?.confidence >= 90 ? (
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
                {!autonomyMode && activeBrief?.confidence < 90 && (
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
                {activeBrief?.factors.map((f, i) => (
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
                {activeBrief?.actions.map((a, i) => (
                  <div key={i} style={{ padding: "10px 16px", background: "rgba(46,132,74,0.04)", border: "1px solid rgba(46,132,74,0.1)", borderRadius: 6, fontSize: 12, color: sf.textLight, lineHeight: 1.6, marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ color: sf.successLight, flexShrink: 0 }}>→</span>
                    <span style={{ flex: 1 }}>{a}</span>
                    <FeedbackBtn onFeedback={(val, note) => setFeedbackLog(prev => [...prev, { type: "action", idx: i, val, note }])} />
                  </div>
                ))}
              </div>

              <div style={{ padding: "12px 16px", background: "rgba(221,122,1,0.05)", borderLeft: `3px solid ${sf.warning}`, borderRadius: "0 6px 6px 0", fontSize: 12, color: sf.warning, fontWeight: 600 }}>
                ⏱ {activeBrief?.timeline}
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

        {/* ═══ STEP 7: Take Action ═══ */}
        {step === 7 && c && activeBrief && (
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
                {activeBrief?.actions.map((a, i) => (
                  <div key={i} style={{ padding: "12px 16px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 8, marginBottom: 6, display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: i === 0 ? "rgba(46,132,74,0.2)" : i === 1 ? "rgba(46,132,74,0.12)" : "rgba(1,118,211,0.1)", border: `1px solid ${i === 0 ? sf.success : i === 1 ? "rgba(46,132,74,0.25)" : sf.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i < 2 ? sf.successLight : sf.lightBlue, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: sf.white, fontWeight: 500, marginBottom: 3 }}>{a}</div>
                      {activeBrief?.actionImpacts?.[i] && (
                        <Tip label={
                          <span style={{ fontSize: 11, color: sf.successLight, fontWeight: 600, cursor: "help" }}>
                            {activeBrief?.actionImpacts[i].text} 📐
                          </span>
                        } color={sf.successLight}>
                          <div style={{ width: 300 }}>
                            <strong style={{ color: sf.white }}>Impact Calculation</strong><br/><br/>
                            <div style={{ fontFamily: "'SF Mono', monospace", fontSize: 10, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                              {activeBrief?.actionImpacts[i].math}
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

              {/* User Feedback */}
              <div style={{ marginTop: 20, padding: "16px 18px", background: sf.bgCard, border: `1px solid ${sf.border}`, borderRadius: 8 }}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: sf.textMuted, marginBottom: 10, fontWeight: 700 }}>💬 Share Feedback or Comments</div>
                {feedbackSent ? (
                  <div style={{ padding: "14px 18px", background: "rgba(46,132,74,0.08)", border: `1px solid rgba(46,132,74,0.2)`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: sf.successLight }}>Thank you for your feedback.</div>
                      <div style={{ fontSize: 11, color: sf.textMuted, marginTop: 2 }}>Your input helps improve the Intelligence Layer's recommendations. The Renewals team will review your feedback.</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                      placeholder="Share feedback on the recommendations, suggest improvements, flag data issues, or leave comments for the team..."
                      style={{
                        width: "100%", minHeight: 80, padding: "10px 14px", background: "rgba(255,255,255,0.03)",
                        border: `1px solid ${sf.border}`, borderRadius: 6, color: sf.white, fontFamily: "inherit",
                        fontSize: 12, lineHeight: 1.5, outline: "none", resize: "vertical", boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                      <span style={{ fontSize: 10, color: sf.textDim }}>Feedback is logged and used to improve model accuracy over time.</span>
                      <button onClick={() => { if (feedbackText.trim()) setFeedbackSent(true); }} disabled={!feedbackText.trim()} style={{
                        padding: "6px 16px", background: feedbackText.trim() ? `linear-gradient(135deg, ${sf.cloudBlue}, ${sf.lightBlue})` : "rgba(255,255,255,0.05)",
                        border: "none", borderRadius: 5, color: sf.white, cursor: feedbackText.trim() ? "pointer" : "default",
                        fontFamily: "inherit", fontSize: 11, fontWeight: 600, opacity: feedbackText.trim() ? 1 : 0.5
                      }}>Submit Feedback</button>
                    </div>
                  </div>
                )}
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
