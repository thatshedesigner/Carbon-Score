"use client";

import { useCallback, useState } from "react";
import QuickContext from "@/components/QuickContext";
import ReceiptScanner from "@/components/ReceiptScanner";
import ScoreDashboard from "@/components/ScoreDashboard";
import StreakLeaderboard from "@/components/StreakLeaderboard";
import Header from "@/app/components/Header";
import HowItWorks from "@/app/components/HowItWorks";
import { getData } from "@/app/lib/storage";

export default function Home() {
  const [scoreState, setScoreState] = useState({
    status: "context",
    result: null,
  });
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  const handleContextComplete = useCallback(() => {
    setScoreState({ status: "scanner", result: null });
  }, []);

  async function handleScoreRequest() {
    const data = getData();

    setScoreState({ status: "loading", result: null });

    const response = await fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quickContext: data.quickContext,
        cumulativeKg: data.cumulativeKg,
        totalScans: data.totalScans,
      }),
    });
    const result = await response.json();

    setScoreState({ status: "done", result });
  }

  function handleScanAnother() {
    setScoreState({ status: "scanner", result: null });
  }

  return (
    <main className="min-h-screen bg-mist px-4 py-8">
      <Header onHowItWorks={() => setShowHowItWorks(true)} />

      <div
        key={scoreState.status}
        className="animate-screen-fade transition duration-200 ease-out"
      >
        {scoreState.status === "context" && (
          <QuickContext onComplete={handleContextComplete} />
        )}

        {scoreState.status === "scanner" && (
          <ReceiptScanner onDone={handleScoreRequest} />
        )}

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
            <StreakLeaderboard score={scoreState.result.score} />
            <button
              type="button"
              onClick={handleScanAnother}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 font-semibold text-forest transition hover:bg-mist"
            >
              Scan Another Receipt
            </button>
          </div>
        )}
      </div>

      {showHowItWorks && (
        <HowItWorks onClose={() => setShowHowItWorks(false)} />
      )}
    </main>
  );
}
