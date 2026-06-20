"use client";

const SCORE_STYLES = [
  { max: 579, text: "text-score-poor", bg: "bg-score-poor" },
  { max: 669, text: "text-score-fair", bg: "bg-score-fair" },
  { max: 739, text: "text-score-good", bg: "bg-score-good" },
  { max: 799, text: "text-score-great", bg: "bg-score-great" },
  { max: 850, text: "text-score-excellent", bg: "bg-score-excellent" },
];

const BREAKDOWN_LABELS = {
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
  const gaugeWidth = `${Math.min(100, Math.max(0, ((score - 300) / 550) * 100))}%`;
  const hasLevers = Array.isArray(levers) && levers.length > 0;

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-6">
      <div className="text-center">
        <div className={`text-6xl font-bold ${scoreStyles.text}`}>{score}</div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-forest/10">
          <div
            className={`h-full rounded-full ${scoreStyles.bg}`}
            style={{ width: gaugeWidth }}
          />
        </div>
      </div>

      {hasLevers ? (
        <div className="flex flex-col gap-3">
          {levers.slice(0, 3).map((lever) => (
            <article
              key={`${lever.category}-${lever.action}`}
              className="rounded-xl border border-forest/15 bg-white p-4 shadow-sm"
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
        <article className="rounded-xl border border-forest/15 bg-white p-4 shadow-sm">
          <h2 className="font-semibold text-forest">
            Couldn&apos;t generate personalized levers right now, here&apos;s your
            score breakdown
          </h2>
          <dl className="mt-4 flex flex-col gap-3">
            {Object.entries(BREAKDOWN_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <dt className="text-sm text-forest/70">{label}</dt>
                <dd className="text-sm font-semibold text-forest">
                  {formatKg(breakdown[key] ?? 0)}
                </dd>
              </div>
            ))}
          </dl>
        </article>
      )}
    </section>
  );
}
