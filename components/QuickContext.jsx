"use client";

import { useEffect, useState } from "react";
import { getData, saveQuickContext } from "@/app/lib/storage";

export default function QuickContext({ onComplete }) {
  const [isChecking, setIsChecking] = useState(true);
  const [commuteMode, setCommuteMode] = useState("");
  const [commuteKmPerDay, setCommuteKmPerDay] = useState("");
  const [homeEnergy, setHomeEnergy] = useState("");

  const showCommuteDistance =
    commuteMode && commuteMode !== "wfh" && commuteMode !== "bike_walk";
  const canContinue =
    commuteMode &&
    homeEnergy &&
    (!showCommuteDistance || commuteKmPerDay !== "");

  useEffect(() => {
    if (getData().quickContext !== null) {
      onComplete();
      return;
    }

    setIsChecking(false);
  }, [onComplete]);

  function handleSubmit(event) {
    event.preventDefault();

    saveQuickContext(
      commuteMode,
      showCommuteDistance ? Number(commuteKmPerDay) : 0,
      homeEnergy,
    );
    onComplete();
  }

  if (isChecking) {
    return null;
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-mist px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl border border-forest/15 bg-white p-5 shadow-sm"
      >
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-forest">
            How do you usually get around
          </span>
          <select
            value={commuteMode}
            onChange={(event) => {
              setCommuteMode(event.target.value);
              setCommuteKmPerDay("");
            }}
            className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
          >
            <option value="">Select commute mode</option>
            <option value="car_solo">Car solo</option>
            <option value="carpool">Carpool</option>
            <option value="transit">Transit</option>
            <option value="bike_walk">Bike or walk</option>
            <option value="wfh">Work from home</option>
          </select>
        </label>

        {showCommuteDistance && (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-forest">
              Commute distance, km per day
            </span>
            <input
              type="number"
              min="0"
              max="200"
              value={commuteKmPerDay}
              onChange={(event) => setCommuteKmPerDay(event.target.value)}
              className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
            />
          </label>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-forest">
            Your home energy source
          </span>
          <select
            value={homeEnergy}
            onChange={(event) => setHomeEnergy(event.target.value)}
            className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
          >
            <option value="">Select home energy</option>
            <option value="grid_standard">Standard grid</option>
            <option value="grid_renewable">Renewable grid</option>
            <option value="solar">Solar</option>
          </select>
        </label>

        <button
          type="submit"
          disabled={!canContinue}
          className="w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </section>
  );
}
