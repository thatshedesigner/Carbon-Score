import { NextResponse } from "next/server";

const SYSTEM_INSTRUCTION =
  'You are a receipt parser. Given an image of a shopping receipt, extract each line item and classify it into exactly one category: meat_dairy, produce, packaged_processed, electronics, clothing, household, other. Return ONLY valid JSON in this exact shape: {"items": [{"name": string, "category": string}]}. Do not include prices, taxes, totals, or store info as items. If the image is not a receipt, return {"items": []}.';

function stripJsonCodeFence(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(request) {
  try {
    const { imageBase64, mediaType } = await request.json();
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [
            {
              parts: [
                { text: "Parse this receipt." },
                {
                  inline_data: {
                    mime_type: mediaType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    );

    if (!response.ok) {
    const errorBody = await response.text();
    console.error("Gemini API call failed:", response.status, errorBody);
    return NextResponse.json({ items: [] });
    }

    const data = await response.json();
    console.log("Gemini raw response:", JSON.stringify(data));
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return NextResponse.json({ items: [] });
    }

    const parsed = JSON.parse(stripJsonCodeFence(text));
    const parsedItems = Array.isArray(parsed.items) ? parsed.items : [];

    return NextResponse.json({ items: parsedItems });
  } catch (error) {
    console.error("Receipt parse failed:", error.message);
    return NextResponse.json({ items: [] });
  }
}
