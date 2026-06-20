"use client";

import { useEffect, useMemo, useState } from "react";
import { getData } from "@/app/lib/storage";

const DEMO_ENTRIES = [
  { name: "Aanya", score: 612 },
  { name: "Rohan", score: 580 },
  { name: "Priya", score: 745 },
  { name: "Karthik", score: 690 },
];

function FlameIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-score-fair"
    >
      <path d="M12.4 2.2c.4 2.3-.3 4-1.9 5.7-1.5 1.6-2.9 3.1-2.9 5.4 0 1 .4 2.1 1.1 2.8.1-1.7.8-3 2.1-4.2.7-.7 1.2-1.5 1.3-2.5 2.4 1.6 3.8 3.8 3.8 6.2 0 1-.2 1.9-.7 2.7 1.8-1.1 3-3.1 3-5.4 0-3.6-2.1-6.3-5.8-10.7Zm-.5 19.8c-2.9 0-5.4-1.7-6.5-4.2-.5-1.1-.7-2.2-.7-3.4 0-3.3 1.9-5.4 3.7-7.3 1.5-1.6 2.8-3 2.1-5.8l-.3-1.3 1.2.7c5.4 3.1 8.1 7 8.1 12.2 0 5-3.5 9.1-7.6 9.1Z" />
    </svg>
  );
}

export default function StreakLeaderboard({ score }) {
  const [stats, setStats] = useState({
    streakCount: 0,
    totalScans: 0,
  });

  useEffect(() => {
    const data = getData();

    setStats({
      streakCount: data.streakCount,
      totalScans: data.totalScans,
    });
  }, []);

  const leaderboard = useMemo(() => {
    return [...DEMO_ENTRIES, { name: "You", score }].sort(
      (first, second) => second.score - first.score,
    );
  }, [score]);

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-5">
      <div className="rounded-xl border border-forest/15 bg-white p-5 text-center shadow-sm">
        <div className="flex items-center justify-center gap-3">
          <FlameIcon />
          <span className="text-5xl font-bold text-forest">
            {stats.streakCount}
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-forest">day streak</p>
        <p className="mt-1 text-sm text-forest/70">
          {stats.totalScans} receipts scanned
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-forest/15 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-mist text-sm text-forest/70">
            <tr>
              <th className="px-4 py-3 font-semibold">Rank</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 text-right font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.name === "You";

              return (
                <tr
                  key={entry.name}
                  className={`border-t border-forest/10 ${
                    isCurrentUser ? "border-l-4 border-l-forest bg-mist/60" : ""
                  }`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-forest/70">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-forest">
                    {entry.name}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-forest">
                    {entry.score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
