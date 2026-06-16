import { EQUIP_LABELS } from './constants.js';
import { similarityRatio } from './fuzzy.js';

const LABEL_MATCH_THRESHOLD = 0.5;

// Parses OCR text from the 装備一覧画面 crop. The panel alternates
// "ラベル行" (メイン武器/サブ武器/頭防具/...) and "値行" (item name), in a
// fixed order. For each label we scan forward from the previous match for
// the closest-matching line, then take the next non-empty line as its value.
// Returns an object keyed by EQUIP_LABELS' `key`s (value is '' if not found).
export function parseEquipScreen(ocrText) {
  const lines = ocrText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const result = {};
  let searchFrom = 0;

  for (const { key, label } of EQUIP_LABELS) {
    let bestIdx = -1;
    let bestRatio = LABEL_MATCH_THRESHOLD;
    for (let i = searchFrom; i < lines.length - 1; i++) {
      const ratio = similarityRatio(lines[i], label);
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIdx = i;
      }
    }
    if (bestIdx === -1) {
      result[key] = '';
      continue;
    }
    result[key] = lines[bestIdx + 1];
    searchFrom = bestIdx + 2;
  }

  return result;
}

// 簡易装備コード: 頭/胴/腕/腰/脚 防具名の先頭1文字を連結
export function equipCode(equip) {
  return ['head', 'chest', 'arms', 'waist', 'legs']
    .map((k) => (equip[k] ? equip[k][0] : '？'))
    .join('');
}
