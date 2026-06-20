"use client";

const STEPS = [
  {
    title: "Set your baseline",
    description: "Commute and home energy, asked once.",
  },
  {
    title: "Snap a receipt",
    description:
      "Gemini reads the image and classifies every item into a carbon category.",
  },
  {
    title: "We do the math",
    description:
      "Annual footprint calculated with fixed emission factors, not AI guesswork.",
  },
  {
    title: "Get your levers",
    description:
      "A second Gemini call ranks your top 3 highest-impact changes and explains why.",
  },
  {
    title: "Build your streak",
    description:
      "Every scan counts. Better choices move your score and your leaderboard rank.",
  },
];

export default function HowItWorks({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <section className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <p className="text-sm font-semibold text-forest/70">
          Duolingo for your carbon footprint, scanned not typed.
        </p>

        <ol className="mt-6 flex flex-col gap-5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">
                {index + 1}
              </span>
              <div>
                <h2 className="font-semibold text-forest">{step.title}</h2>
                <p className="mt-1 text-sm leading-6 text-forest/70">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white transition hover:bg-forest/90"
        >
          Got it
        </button>
      </section>
    </div>
  );
}
