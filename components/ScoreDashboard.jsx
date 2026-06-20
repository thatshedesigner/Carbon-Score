"use client";

const SCORE_STYLES = [
  { max: 579, text: "text-score-poor", stroke: "#DC2626" },
  { max: 669, text: "text-score-fair", stroke: "#F59E0B" },
  { max: 739, text: "text-score-good", stroke: "#84CC16" },
  { max: 799, text: "text-score-great", stroke: "#22C55E" },
  { max: 850, text: "text-score-excellent", stroke: "#15803D" },
];

const BREAKDOWN_LABELS = {
  commuteAnnualKg: "Commute",
  homeEnergyAnnualKg: "Home energy",
  purchaseAndDietKg: "Purchases and diet",
  commuteKg: "Commute",
  dietKg: "Diet",
  flightsKg: "Flights",
  homeEnergyKg: "Home energy",
  purchaseKg: "Recent purchase",
};

function getScoreStyles(score) {
  return SCORE_STYLES.find((style) => score <= style.max) ?? SCORE_STYLES[0];
}

function formatKg(value) {
  return `${Math.round(value).toLocaleString()} kg`;
}

export default function ScoreDashboard({ score, breakdown, levers }) {
  const scoreStyles = getScoreStyles(score);
  const scoreProgress = Math.min(100, Math.max(0, ((score - 300) / 550) * 100));
  const ringRadius = 72;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset =
    ringCircumference - (scoreProgress / 100) * ringCircumference;
  const hasLevers = Array.isArray(levers) && levers.length > 0;

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="flex justify-center">
        <div className="relative h-48 w-48">
          <svg
            aria-hidden="true"
            viewBox="0 0 180 180"
            className="h-full w-full -rotate-90"
          >
            <circle
              cx="90"
              cy="90"
              r={ringRadius}
              fill="none"
              stroke="rgba(20, 83, 45, 0.1)"
              strokeWidth="14"
            />
            <circle
              cx="90"
              cy="90"
              r={ringRadius}
              fill="none"
              stroke={scoreStyles.stroke}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-6xl font-bold ${scoreStyles.text}`}>
              {score}
            </span>
          </div>
        </div>
      </div>

      {hasLevers ? (
        <div className="flex flex-col gap-3">
          {levers.slice(0, 3).map((lever) => (
            <article
              key={`${lever.category}-${lever.action}`}
              className="rounded-xl bg-white p-4 shadow-soft"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-forest/70">
                    {lever.category}
                  </p>
                  <h2 className="mt-1 font-semibold text-forest">
                    {lever.action}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-score-good/15 px-3 py-1 text-sm font-semibold text-score-good">
                  +{lever.potentialPointGain} pts
                </span>
              </div>
              <p className="text-sm leading-6 text-forest/75">
                {lever.explanation}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-xl bg-white p-4 shadow-soft">
          <h2 className="font-semibold text-forest">
            Couldn&apos;t generate personalized levers right now, here&apos;s your
            score breakdown
          </h2>
          <dl className="mt-4 flex flex-col gap-3">
            {Object.entries(breakdown).map(([key, value]) => {
              const label = BREAKDOWN_LABELS[key] ?? key;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between gap-4"
                >
                  <dt className="text-sm text-forest/70">{label}</dt>
                  <dd className="text-sm font-semibold text-forest">
                    {formatKg(value ?? 0)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </article>
      )}
    </section>
  );
}
