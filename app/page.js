"use client";

import { useState } from "react";
import IntakeForm from "@/components/IntakeForm";
import ScoreDashboard from "@/components/ScoreDashboard";

export default function Home() {
  const [scoreState, setScoreState] = useState({
    status: "idle",
    result: null,
  });

  async function handleComplete(data) {
    setScoreState({ status: "loading", result: null });

    const response = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    setScoreState({ status: "done", result });
  }

  function handleStartOver() {
    setScoreState({ status: "idle", result: null });
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-10">
      {scoreState.status === "idle" && <IntakeForm onComplete={handleComplete} />}

      {scoreState.status === "loading" && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-forest">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-forest/20 border-t-forest" />
          <p className="font-medium">Calculating your score...</p>
        </div>
      )}

      {scoreState.status === "done" && scoreState.result && (
        <div className="mx-auto flex w-full max-w-md flex-col gap-6">
          <ScoreDashboard
            score={scoreState.result.score}
            breakdown={scoreState.result.breakdown}
            levers={scoreState.result.levers}
          />
          <button
            type="button"
            onClick={handleStartOver}
            className="w-full rounded-xl border border-forest/25 bg-white px-4 py-3 font-semibold text-forest transition hover:bg-forest hover:text-white"
          >
            Start Over
          </button>
        </div>
      )}
    </main>
  );
}
