# Google Sheets Data Layer Setup

## Overview
The Renewal Intelligence Agent can pull customer data from a Google Sheet instead of using hardcoded demo data. This lets you:
- Update data without redeploying
- Demonstrate a decoupled architecture ("In production, this connects to Data Cloud")
- Show live data during a panel walkthrough

## Setup Steps

### 1. Create the Google Sheet
Create a new Google Sheet with **two tabs**:

### Tab 1: `customers`
| id | name | industry | arr | renewal_in | renewal_date | risk_level | risk_score | csm | contacts | last_activity |
|----|------|----------|-----|------------|--------------|------------|------------|-----|----------|---------------|
| pinnacle | Pinnacle Manufacturing | Manufacturing | $420K | 4 months | Jun 15, 2025 | HIGH | 82 | Sarah Chen | 34 | 3 weeks ago |
| crestview | Crestview Financial | Financial Services | $280K | 6 months | Aug 22, 2025 | LOW | 15 | Marcus Liu | 47 | 2 days ago |
| meridian | Meridian Healthcare | Healthcare | $340K | 2 months | Apr 5, 2025 | MEDIUM | 55 | Priya Patel | 28 | 1 week ago |

### Tab 2: `signals`
| customer_id | category | metric | value | churn_signal | churn_insight | expansion_signal | expansion_insight | seats_signal | seats_insight | features_signal | features_insight |
|-------------|----------|--------|-------|--------------|---------------|-------------------|-------------------|--------------|---------------|-----------------|------------------|
| pinnacle | Usage | Platform logins (30d) | Down 47% | high | Steep disengagement — losing daily active users fast | noise | Not relevant to expansion assessment | medium | Reduced logins correlate with seat consolidation | high | Users not logging in = features not being adopted |
| pinnacle | Usage | API call volume (30d) | Down 38% | high | Integration usage declining — may be evaluating alternatives | noise | No growth signals in API usage | low | API decline is team-wide, not per-seat | high | Integration features being abandoned |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Each customer should have 20 signal rows** matching the demo data structure.

### 2. Publish the Sheet
1. Go to **File → Share → Publish to web**
2. Select **Entire Document** and **CSV** format
3. Click **Publish**
4. Note: individual tab URLs are auto-generated

### 3. Get Your Sheet ID
From your sheet URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
Copy the ID portion.

### 4. Update the App
In `src/App.jsx`, change line 6:
```js
const SHEET_ID = "YOUR_SHEET_ID_HERE";
```

### 5. Deploy
Push to GitHub and Vercel will auto-deploy. The app will fetch from your sheet on load.

## Architecture Narrative for Panel Interview

> "The data layer is completely decoupled. Right now it's backed by a Google Sheet for rapid prototyping — I can change a customer's usage metrics in the sheet and the agent immediately reflects the updated data. In production, this same interface connects to Salesforce Data Cloud via API. The Intelligence Layer doesn't care where the data comes from — it scores whatever signals it receives."

## Fallback
If the sheet is unavailable or SHEET_ID is empty, the app automatically falls back to built-in demo data. This means the demo always works, even offline.
