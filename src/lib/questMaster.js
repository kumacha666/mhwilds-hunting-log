import { bestMatch } from './fuzzy.js';

let cache = null;

export async function loadQuestMaster() {
  if (cache) return cache;
  const res = await fetch(`${import.meta.env.BASE_URL}data/quest_master.json`);
  const data = await res.json();

  const cols = data.questMasterColumns;
  const colIndex = {};
  cols.forEach((c, i) => (colIndex[c] = i));

  const byName = new Map();
  for (const row of data.questMaster) {
    byName.set(row[colIndex.questName], row);
  }

  cache = { ...data, colIndex, byName };
  return cache;
}

// Finds the quest in questMaster whose name best fuzzy-matches any line of
// the given OCR text. Returns { quest, ratio, row } or null.
export function matchQuestFromOcrText(master, ocrText) {
  let best = null;
  for (const rawLine of ocrText.split('\n')) {
    const line = rawLine.trim().replace(/\s+/g, '');
    if (line.length < 2) continue;
    const match = bestMatch(line, master.questMaster.map((r) => r[master.colIndex.questName]));
    if (!match) continue;
    if (!best || match.ratio > best.ratio) best = match;
  }
  if (!best) return null;
  const row = master.byName.get(best.value);
  return { questName: best.value, ratio: best.ratio, row };
}

// Resolves the area for a quest, applying the (questName, difficulty) override
// table when present.
export function resolveArea(master, questName, difficulty) {
  for (const [q, diff, area] of master.areaOverrides) {
    if (q === questName && diff === difficulty) return area;
  }
  const row = master.byName.get(questName);
  return row ? row[master.colIndex.area] : '';
}

export function questField(master, questName, field) {
  const row = master.byName.get(questName);
  return row ? row[master.colIndex[field]] : '';
}
