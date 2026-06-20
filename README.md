# CarbonStreak

Duolingo for your carbon footprint, scanned not typed.

## What this is

Most carbon footprint trackers fail for two reasons. People stop logging behavior manually within a week, and the tools focus on visible actions like driving and flying while ignoring the roughly 60 percent of an average footprint that's embedded in what people actually buy. CarbonStreak fixes both. You scan a receipt, the app reads it, classifies every item by carbon impact, and turns your habits into a single legible score you actually want to check again tomorrow.

## How it works

1. Set your baseline once: commute mode and home energy source.
2. Snap or upload any receipt. Gemini reads the image and classifies each line item into one of seven carbon categories.
3. Fixed emission factors convert those categories into kilograms of CO2e. No AI does the math, only the categorization.
4. The footprint converts into a 300 to 850 score, the same range people already understand from credit scores.
5. A second Gemini call ranks your three highest impact changes and explains each one in plain language.
6. Every scan adds to a streak and moves your position on the leaderboard.

## Why a receipt scanner instead of a form

Self-reported carbon calculators ask people to remember and estimate their own behavior, which is exactly why they get abandoned. A receipt already contains an itemized, accurate record of what someone bought. Reading it directly removes the single biggest source of friction in every other carbon tracker, manual data entry, and captures the largest hidden share of a person's footprint at the same time.

## Tech stack

- Next.js 14, App Router, JavaScript
- Tailwind CSS
- Gemini API (gemini-3.5-flash) for receipt OCR and lever ranking
- Browser localStorage for streak, scan history, and quick context
- Deployed on Vercel

## Project structure

app/
  page.js                       main flow controller
  api/
    parse-receipt/route.js      Gemini OCR and categorization
    score/route.js              deterministic scoring plus Gemini lever ranking
  components/
    QuickContext.jsx            one-time commute and home energy setup
    ReceiptScanner.jsx          upload, scan, and demo receipt flow
    ScoreDashboard.jsx          score display and lever cards
    StreakLeaderboard.jsx       streak counter and leaderboard
    HowItWorks.jsx              in-app explainer modal
  lib/
    emissionFactors.js          emission factor constants
    storage.js                  localStorage helpers
public/
  demo-receipt.png              fallback receipt for live demos

## Deployment

Deployed on Vercel. GEMINI_API_KEY must be added separately in the Vercel project's Environment Variables, since .env.local is never pushed to GitHub.

## A note on the numbers

Emission factors used here are directional estimates built for a fast, demoable prototype, not certified scientific figures. The leaderboard includes a few seeded demo entries alongside the real user, included for demo purposes only.

## Built for

PromptWars, Challenge 3: Carbon Footprint Awareness Platform. Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.
