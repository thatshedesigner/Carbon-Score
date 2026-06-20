"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RECEIPT_CATEGORY_KG } from "@/app/lib/emissionFactors";
import { recordScan } from "@/app/lib/storage";

const CATEGORY_STYLES = {
  meat_dairy: "bg-red-100 text-red-700",
  produce: "bg-lime-100 text-lime-700",
  packaged_processed: "bg-amber-100 text-amber-700",
  electronics: "bg-sky-100 text-sky-700",
  clothing: "bg-fuchsia-100 text-fuchsia-700",
  household: "bg-teal-100 text-teal-700",
  other: "bg-zinc-100 text-zinc-700",
};

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        reject(new Error("Unable to read file"));
        return;
      }

      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function formatCategory(category) {
  return category.replaceAll("_", " ");
}

function formatKg(category) {
  return `${RECEIPT_CATEGORY_KG[category] ?? RECEIPT_CATEGORY_KG.other} kg`;
}

export default function ReceiptScanner({ onDone }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewAlt, setPreviewAlt] = useState("Receipt preview");
  const [status, setStatus] = useState("idle");
  const [items, setItems] = useState([]);

  async function scanReceipt(imageBase64, mediaType) {
    setStatus("scanning");
    setItems([]);

    try {
      const response = await fetch("/api/parse-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64,
          mediaType,
        }),
      });
      const data = await response.json();
      const parsedItems = Array.isArray(data.items) ? data.items : [];

      recordScan(parsedItems);
      setItems(parsedItems);
    } catch {
      recordScan([]);
      setItems([]);
    } finally {
      setStatus("done");
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setPreviewAlt("Uploaded receipt preview");
    const imageBase64 = await fileToBase64(file);

    scanReceipt(imageBase64, file.type);
  }

  async function handleDemoReceipt() {
    const response = await fetch("/demo-receipt.png");
    const blob = await response.blob();
    const imageBase64 = await fileToBase64(blob);

    setPreviewUrl(URL.createObjectURL(blob));
    setPreviewAlt("Sample grocery receipt");
    scanReceipt(imageBase64, "image/png");
  }

  function handleReset() {
    setPreviewUrl("");
    setPreviewAlt("Receipt preview");
    setStatus("idle");
    setItems([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <section className="mx-auto flex w-full max-w-md flex-col gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={handleFileChange}
      />

      {status === "idle" && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-56 flex-col items-center justify-center rounded-xl bg-forest p-8 text-center font-semibold text-white shadow-sm transition hover:bg-[#0f3f22]"
          >
            Snap or upload a receipt
          </button>
          <button
            type="button"
            aria-label="Use a sample receipt"
            onClick={handleDemoReceipt}
            className="self-center rounded-xl border border-forest/20 bg-white px-4 py-2 text-sm font-semibold text-forest transition hover:bg-mist"
          >
            Try Demo Receipt
          </button>
        </div>
      )}

      {status !== "idle" && previewUrl && (
        <Image
          src={previewUrl}
          alt={previewAlt}
          width={112}
          height={112}
          unoptimized
          className="h-28 w-28 rounded-xl border border-forest/15 object-cover"
        />
      )}

      {status === "scanning" && (
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 text-forest shadow-soft">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />
          <span className="font-medium">Scanning...</span>
        </div>
      )}

      {status === "done" && items.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-soft">
          {items.map((item, index) => {
            const category = item.category || "other";

            return (
              <div
                key={`${item.name}-${category}-${index}`}
                className="flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-forest">{item.name}</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${CATEGORY_STYLES[category] ?? CATEGORY_STYLES.other}`}
                  >
                    {formatCategory(category)}
                  </span>
                </div>
                <span className="shrink-0 text-sm font-semibold text-forest">
                  {formatKg(category)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {status === "done" && items.length === 0 && (
        <div className="rounded-xl bg-white p-4 text-center font-medium text-forest shadow-soft">
          Couldn&apos;t read that receipt clearly, try another photo
        </div>
      )}

      {status === "done" && (
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="w-full rounded-xl border border-forest/20 bg-white px-4 py-3 font-semibold text-forest transition hover:bg-mist"
          >
            Scan Another
          </button>
          {items.length > 0 && (
            <button
              type="button"
              onClick={onDone}
              className="w-full rounded-xl bg-forest px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-[#0f3f22]"
            >
              See My Score
            </button>
          )}
        </div>
      )}
    </section>
  );
}
