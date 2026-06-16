// Ratcliff/Obershelp similarity ratio, equivalent to Python's
// difflib.SequenceMatcher(None, a, b).ratio()

function longestMatch(a, b, aStart, aEnd, bStart, bEnd) {
  let best = { aStart, bStart, size: 0 };
  for (let i = aStart; i < aEnd; i++) {
    for (let j = bStart; j < bEnd; j++) {
      let k = 0;
      while (i + k < aEnd && j + k < bEnd && a[i + k] === b[j + k]) k++;
      if (k > best.size) best = { aStart: i, bStart: j, size: k };
    }
  }
  return best;
}

function matchBlocks(a, b, aStart, aEnd, bStart, bEnd, blocks) {
  const m = longestMatch(a, b, aStart, aEnd, bStart, bEnd);
  if (m.size === 0) return;
  if (aStart < m.aStart && bStart < m.bStart) {
    matchBlocks(a, b, aStart, m.aStart, bStart, m.bStart, blocks);
  }
  blocks.push(m);
  if (m.aStart + m.size < aEnd && m.bStart + m.size < bEnd) {
    matchBlocks(a, b, m.aStart + m.size, aEnd, m.bStart + m.size, bEnd, blocks);
  }
}

export function similarityRatio(a, b) {
  if (a.length === 0 && b.length === 0) return 1;
  const blocks = [];
  matchBlocks(a, b, 0, a.length, 0, b.length, blocks);
  const matches = blocks.reduce((sum, blk) => sum + blk.size, 0);
  return (2 * matches) / (a.length + b.length);
}

// Returns { value, ratio } for the candidate with the highest similarity ratio,
// or null if candidates is empty.
export function bestMatch(text, candidates) {
  let best = null;
  let bestRatio = -1;
  for (const candidate of candidates) {
    const ratio = similarityRatio(text, candidate);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = candidate;
    }
  }
  if (best === null) return null;
  return { value: best, ratio: bestRatio };
}
