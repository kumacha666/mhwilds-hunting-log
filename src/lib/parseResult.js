import { CLEAR_TIME_RE } from './constants.js';
import { matchQuestFromOcrText } from './questMaster.js';

// Parses OCR text from the リザルト画面 crop. Returns
// { questName, questRatio, clearTime } where questName/questRatio may be
// null if no reasonable match was found.
export function parseResultScreen(master, ocrText) {
  const match = matchQuestFromOcrText(master, ocrText);
  const timeMatch = CLEAR_TIME_RE.exec(ocrText);
  return {
    questName: match?.questName ?? null,
    questRatio: match?.ratio ?? null,
    clearTime: timeMatch ? timeMatch[1] : null,
  };
}
