import { NextResponse } from "next/server";
import { COMMUTE_FACTORS, HOME_ENERGY_ANNUAL } from "@/app/lib/emissionFactors";

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
  const { quickContext, cumulativeKg, totalScans } = await request.json();
  const commuteFactor = COMMUTE_FACTORS[quickContext?.commuteMode] ?? 0;
  const commuteAnnualKg =
    Number(quickContext?.commuteKmPerDay ?? 0) * commuteFactor * 230;
  const homeEnergyAnnualKg =
    HOME_ENERGY_ANNUAL[quickContext?.homeEnergy] ?? 0;
  const scanCount = Math.max(1, Number(totalScans) || 1);
  const scannedKg = Object.values(cumulativeKg ?? {}).reduce(
    (sum, value) => sum + Number(value ?? 0),
    0,
  );
  const purchaseAndDietKg = scannedKg * (365 / scanCount);
  const totalAnnualKg =
    commuteAnnualKg + homeEnergyAnnualKg + purchaseAndDietKg;
  const score = Math.round(
    clampScore(850 - (totalAnnualKg / 1000 / 12) * 550),
  );
  const breakdown = {
    commuteAnnualKg,
    homeEnergyAnnualKg,
    purchaseAndDietKg,
  };

  try {
    const levers = await getLeversFromGemini(score, breakdown);

    return NextResponse.json({ score, breakdown, levers });
  } catch {
    return NextResponse.json({ score, breakdown, levers: [] });
  }
}
