import { NextResponse } from "next/server";

const COMMUTE_FACTORS = {
  car_solo: 0.21,
  carpool: 0.105,
  transit: 0.04,
  bike_walk: 0,
  wfh: 0,
};

const DIET_ANNUAL_KG = {
  meat_daily: 3300,
  meat_weekly: 2500,
  vegetarian: 1700,
  vegan: 1500,
};

const HOME_ENERGY_ANNUAL_KG = {
  grid_standard: 2500,
  grid_renewable: 300,
  solar: 100,
};

const PURCHASE_KG = {
  electronics: 300,
  furniture: 200,
  clothing: 100,
  none: 0,
};

const SYSTEM_INSTRUCTION =
  'You are a carbon footprint advisor. Given a user\'s annual emissions breakdown by category and their score (300-850, higher is better), return ONLY valid JSON, no markdown, no preamble, in this exact shape:\n{"levers": [{"category": string, "action": string, "explanation": string, "potentialPointGain": number}]}\nReturn exactly 3 levers, ranked by potentialPointGain descending, highest-impact category first. Each explanation must be one sentence, concrete, and reference the actual kg number for that category. potentialPointGain is your estimate of how many score points that single change could add, integer between 5 and 80.';

function clampScore(score) {
  return Math.min(850, Math.max(300, score));
}

function stripJsonCodeFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function getLeversFromGemini(score, breakdown) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return [];
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: JSON.stringify({ score, breakdown }),
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Gemini request failed");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini response was empty");
  }

  const parsed = JSON.parse(stripJsonCodeFence(text));

  return Array.isArray(parsed.levers) ? parsed.levers : [];
}

export async function POST(request) {
  const {
    commuteMode,
    commuteKmPerDay,
    diet,
    flightsPerYear,
    homeEnergy,
    recentPurchase,
  } = await request.json();

  const commuteFactor = COMMUTE_FACTORS[commuteMode] ?? 0;
  const commuteKg = Number(commuteKmPerDay) * commuteFactor * 230;
  const dietKg = DIET_ANNUAL_KG[diet] ?? 0;
  const flightsKg = Number(flightsPerYear) * 500;
  const homeEnergyKg = HOME_ENERGY_ANNUAL_KG[homeEnergy] ?? 0;
  const purchaseKg = PURCHASE_KG[recentPurchase] ?? 0;

  const totalAnnualKg =
    commuteKg + dietKg + flightsKg + homeEnergyKg + purchaseKg;
  const totalAnnualTons = totalAnnualKg / 1000;
  const score = Math.round(clampScore(850 - (totalAnnualTons / 12) * 550));
  const breakdown = {
    commuteKg,
    dietKg,
    flightsKg,
    homeEnergyKg,
    purchaseKg,
  };

  try {
    const levers = await getLeversFromGemini(score, breakdown);

    return NextResponse.json({ score, breakdown, levers });
  } catch {
    return NextResponse.json({ score, breakdown, levers: [] });
  }
}
