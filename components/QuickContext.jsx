"use client";

import { useEffect, useState } from "react";
import { getData, saveQuickContext } from "@/app/lib/storage";

export default function QuickContext({ onComplete }) {
  const commuteModeId = "commute-mode";
  const commuteKmPerDayId = "commute-km-per-day";
  const homeEnergyId = "home-energy";
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
    <section className="mx-auto flex w-full max-w-md justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-2xl bg-white p-6 shadow-soft"
      >
        <h1 className="text-2xl font-bold text-forest">Set your baseline</h1>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor={commuteModeId}
              className="mb-2 block text-sm font-medium text-forest"
            >
              How do you usually get around
            </label>
            <select
              id={commuteModeId}
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
          </div>

          {showCommuteDistance && (
            <div>
              <label
                htmlFor={commuteKmPerDayId}
                className="mb-2 block text-sm font-medium text-forest"
              >
                Commute distance, km per day
              </label>
              <input
                id={commuteKmPerDayId}
                type="number"
                min="0"
                max="200"
                value={commuteKmPerDay}
                onChange={(event) => setCommuteKmPerDay(event.target.value)}
                className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
              />
            </div>
          )}

          <div>
            <label
              htmlFor={homeEnergyId}
              className="mb-2 block text-sm font-medium text-forest"
            >
              Your home energy source
            </label>
            <select
              id={homeEnergyId}
              value={homeEnergy}
              onChange={(event) => setHomeEnergy(event.target.value)}
              className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
            >
              <option value="">Select home energy</option>
              <option value="grid_standard">Standard grid</option>
              <option value="grid_renewable">Renewable grid</option>
              <option value="solar">Solar</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!canContinue}
          className="mt-6 w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0f3f22] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </form>
    </section>
  );
}
