"use client";

import { useState } from "react";

export default function IntakeForm({ onComplete }) {
  const [commuteMode, setCommuteMode] = useState("");
  const [commuteKmPerDay, setCommuteKmPerDay] = useState("");
  const [diet, setDiet] = useState("");
  const [flightsPerYear, setFlightsPerYear] = useState("");
  const [homeEnergy, setHomeEnergy] = useState("");
  const [recentPurchase, setRecentPurchase] = useState("");

  const isComplete =
    commuteMode &&
    commuteKmPerDay !== "" &&
    diet &&
    flightsPerYear !== "" &&
    homeEnergy &&
    recentPurchase;

  function handleSubmit(event) {
    event.preventDefault();

    onComplete({
      commuteMode,
      commuteKmPerDay: Number(commuteKmPerDay),
      diet,
      flightsPerYear: Number(flightsPerYear),
      homeEnergy,
      recentPurchase,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl bg-mist p-4"
    >
      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">
          Commute mode
        </span>
        <select
          value={commuteMode}
          onChange={(event) => setCommuteMode(event.target.value)}
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

      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">
          Commute km per day
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

      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">Diet</span>
        <select
          value={diet}
          onChange={(event) => setDiet(event.target.value)}
          className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
        >
          <option value="">Select diet</option>
          <option value="meat_daily">Meat daily</option>
          <option value="meat_weekly">Meat weekly</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </label>

      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">
          Flights per year
        </span>
        <input
          type="number"
          min="0"
          max="50"
          value={flightsPerYear}
          onChange={(event) => setFlightsPerYear(event.target.value)}
          className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
        />
      </label>

      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">
          Home energy
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

      <label className="block rounded-xl border border-forest/20 bg-white p-4">
        <span className="mb-2 block text-sm font-medium text-forest">
          Recent purchase
        </span>
        <select
          value={recentPurchase}
          onChange={(event) => setRecentPurchase(event.target.value)}
          className="w-full rounded-xl border border-forest/30 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
        >
          <option value="">Select recent purchase</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="none">None</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={!isComplete}
        className="w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Calculate My Score
      </button>
    </form>
  );
}
