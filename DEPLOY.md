# Renewal Intelligence Agent — Deployment Guide

## What You Need
- A GitHub account (free) — https://github.com
- A Vercel account (free) — https://vercel.com (sign up with GitHub)
- An Anthropic API key — https://console.anthropic.com (for the live chat feature)

## Step-by-Step Deployment (10 minutes)

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Name it `renewal-intelligence-agent` (or whatever you want)
3. Set it to **Private** (important — don't make this public)
4. Click **Create repository**

### Step 2: Upload the Code
**Option A: Upload via GitHub web interface (easiest)**
1. On your new repo page, click **"uploading an existing file"**
2. Drag and drop ALL the files from the unzipped folder:
   - `package.json`
   - `vite.config.js`
   - `vercel.json`
   - `index.html`
   - `.gitignore`
   - `.env.example`
   - `api/chat.js`
   - `src/main.jsx`
   - `src/App.jsx`
3. Make sure the folder structure is preserved (api/ and src/ folders)
4. Click **Commit changes**

**Option B: Upload via command line**
```bash
cd renewal-agent-deploy
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/renewal-intelligence-agent.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"**
3. Find and select your `renewal-intelligence-agent` repo
4. Vercel will auto-detect it as a Vite project — leave defaults
5. Before clicking Deploy, expand **"Environment Variables"**
6. Add this variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from https://console.anthropic.com
7. Click **Deploy**

### Step 4: You're Live!
Vercel will give you a URL like:
`https://renewal-intelligence-agent-xyz.vercel.app`

This is what you send to Chris.

## Optional: Custom Domain
If you want a cleaner URL, Vercel lets you set a custom subdomain for free:
- Go to your project Settings > Domains
- Change it to something like `renewal-agent.vercel.app`

## Getting an Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign up (if you haven't)
3. Go to API Keys > Create Key
4. Copy the key (starts with `sk-ant-`)
5. Add $5 credit (this will last months for this demo)
6. Paste the key into Vercel's environment variables

## If the Chat Doesn't Work
The entire demo works without the chat — the interactive filtering, overrides, feedback, 
and all 6 steps are fully functional. The chat is a bonus feature that requires the API key. 
If it doesn't connect, Chris can still experience 95% of the demo.

## Making Changes After Deployment
1. Edit files in your GitHub repo
2. Vercel automatically redeploys on every push
3. Changes go live in ~30 seconds
