import { loadImage, cropToCanvas, canvasToBase64 } from './crop.js';
import { ocrText } from './visionApi.js';
import { identifyWeaponIcon } from './weaponIcon.js';
import { loadQuestMaster, resolveArea, questField } from './questMaster.js';
import { parseResultScreen } from './parseResult.js';
import { parseEquipScreen, equipCode } from './parseEquip.js';
import { countStars, starsToDifficulty } from './difficulty.js';
import { CROP_BOXES, SHEET_COLUMNS } from './constants.js';

// Runs the full OCR + image-recognition pipeline on the two screenshots and
// returns a flat object with one property per review-form field. All values
// are best-effort defaults that the user can edit before saving.
export async function processScreenshots(resultFile, equipFile, apiKey) {
  const master = await loadQuestMaster();

  const resultImg = await loadImage(resultFile);
  const equipImg = await loadImage(equipFile);

  const resultCrop = cropToCanvas(resultImg, CROP_BOXES.resultTitle);
  const equipTextCrop = cropToCanvas(equipImg, CROP_BOXES.equipText);
  const weaponIconCrop = cropToCanvas(equipImg, CROP_BOXES.weaponIcon);
  const starRowCrop = cropToCanvas(resultImg, CROP_BOXES.starRow);

  const [resultOcr, equipOcr, weaponMatch] = await Promise.all([
    ocrText(canvasToBase64(resultCrop), apiKey),
    ocrText(canvasToBase64(equipTextCrop), apiKey),
    identifyWeaponIcon(weaponIconCrop),
  ]);

  const { questName, questRatio, clearTime } = parseResultScreen(master, resultOcr);
  const equip = parseEquipScreen(equipOcr);

  const starCount = countStars(starRowCrop);
  const starDifficulty = starsToDifficulty(starCount);
  const defaultDifficulty = questName ? questField(master, questName, 'difficulty') : '';
  const difficulty = starDifficulty ?? defaultDifficulty;
  const area = questName ? resolveArea(master, questName, difficulty) : '';

  return {
    questName: questName ?? '',
    questRatio,
    difficulty,
    difficultyFromStars: starDifficulty !== null,
    clearTime: clearTime ?? '',
    monster: questName ? questField(master, questName, 'monster') : '',
    area,
    questType: questName ? questField(master, questName, 'questType') : '',
    questKind: questName ? questField(master, questName, 'questKind') : '',
    weaponType: weaponMatch?.weapon ?? '',
    weaponMatchDistance: weaponMatch?.distance ?? null,
    mainWeapon: equip.mainWeapon,
    subWeapon: equip.subWeapon,
    head: equip.head,
    chest: equip.chest,
    arms: equip.arms,
    waist: equip.waist,
    legs: equip.legs,
    talisman: equip.talisman,
    outfit: equip.outfit,
    equipCode: equipCode(equip),
    individualType: questName ? questField(master, questName, 'individualType') : '',
    huntMethod: questName ? questField(master, questName, 'huntMethod') : '',
    memo: '',
    questNames: master.questMaster.map((r) => r[master.colIndex.questName]),
    difficultyOptions: master.difficultyOptions,
    individualTypeOptions: master.individualTypeOptions,
    huntMethodOptions: master.huntMethodOptions,
  };
}

// Converts the (possibly edited) review data into a 22-column row matching
// SHEET_COLUMNS / docs/quest_log_design.md.
export function toSheetRow(data) {
  const values = {
    日時: new Date().toLocaleString('ja-JP'),
    クエスト名: data.questName,
    クエスト難度: data.difficulty,
    クリアタイム: data.clearTime,
    モンスター名: data.monster,
    エリア: data.area,
    クエストタイプ: data.questType,
    クエスト種別: data.questKind,
    武器種: data.weaponType,
    メイン武器: data.mainWeapon,
    サブ武器: data.subWeapon,
    頭防具: data.head,
    胴防具: data.chest,
    腕防具: data.arms,
    腰防具: data.waist,
    脚防具: data.legs,
    護石: data.talisman,
    装衣: data.outfit,
    簡易装備コード: data.equipCode,
    個体種: data.individualType,
    狩猟方法: data.huntMethod,
    メモ: data.memo,
  };
  return SHEET_COLUMNS.map((col) => values[col] ?? '');
}
