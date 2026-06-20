"use client";

export default function Header({ onHowItWorks }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-1 pb-8">
      <div>
        <p className="text-3xl font-bold leading-tight text-forest">
          Carbon Score
        </p>
        <p className="mt-1 text-sm font-medium text-forest/60">
          Scanned, not typed
        </p>
      </div>

      <button
        type="button"
        aria-label="Learn how this works"
        onClick={onHowItWorks}
        className="rounded-xl border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:bg-mist"
      >
        How it works
      </button>
    </header>
  );
}
