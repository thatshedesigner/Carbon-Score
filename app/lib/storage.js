import { RECEIPT_CATEGORY_KG } from "./emissionFactors";

const STORAGE_KEY = "Carbon Score_data";

const DEFAULT_CUMULATIVE_KG = {
  meat_dairy: 0,
  produce: 0,
  packaged_processed: 0,
  electronics: 0,
  clothing: 0,
  household: 0,
  other: 0,
};

const DEFAULT_DATA = {
  quickContext: null,
  streakCount: 0,
  lastScanDate: null,
  totalScans: 0,
  cumulativeKg: DEFAULT_CUMULATIVE_KG,
};

function canUseLocalStorage() {
  return typeof window !== "undefined" && window.localStorage;
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayDate() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  return yesterday.toISOString().slice(0, 10);
}

function normalizeData(data) {
  return {
    ...DEFAULT_DATA,
    ...data,
    cumulativeKg: {
      ...DEFAULT_CUMULATIVE_KG,
      ...data?.cumulativeKg,
    },
  };
}

function persistData(data) {
  if (!canUseLocalStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getData() {
  if (!canUseLocalStorage()) {
    return normalizeData();
  }

  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY);

    if (!storedData) {
      return normalizeData();
    }

    return normalizeData(JSON.parse(storedData));
  } catch {
    return normalizeData();
  }
}

export function saveQuickContext(commuteMode, commuteKmPerDay, homeEnergy) {
  const data = getData();
  const nextData = {
    ...data,
    quickContext: {
      commuteMode,
      commuteKmPerDay,
      homeEnergy,
    },
  };

  persistData(nextData);

  return nextData;
}

export function recordScan(parsedItems) {
  const data = getData();
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  const cumulativeKg = { ...data.cumulativeKg };

  parsedItems.forEach((item) => {
    const category = item.category;

    if (!Object.prototype.hasOwnProperty.call(cumulativeKg, category)) {
      return;
    }

    cumulativeKg[category] += RECEIPT_CATEGORY_KG[category];
  });

  let streakCount = data.streakCount;

  if (data.lastScanDate === yesterday) {
    streakCount += 1;
  } else if (data.lastScanDate !== today) {
    streakCount = 1;
  }

  const nextData = {
    ...data,
    streakCount,
    lastScanDate: today,
    totalScans: data.totalScans + 1,
    cumulativeKg,
  };

  persistData(nextData);

  return nextData;
}
