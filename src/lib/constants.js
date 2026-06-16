// Crop boxes as fractions of image width/height, calibrated against
// 3840x2160 (4K) screenshots. Using fractions keeps things correct for
// other 16:9 resolutions (e.g. 1920x1080).
export const CROP_BOXES = {
  // リザルト画面: クエスト名 + 難度 + クリアタイム
  resultTitle: { x: 1380 / 3840, y: 180 / 2160, w: (2440 - 1380) / 3840, h: (640 - 180) / 2160 },
  // 装備一覧画面: 左パネルのテキスト列(メイン武器〜装衣)
  equipText: { x: 150 / 3840, y: 200 / 2160, w: (880 - 150) / 3840, h: (2160 - 200) / 2160 },
  // 装備一覧画面: 「メイン武器」欄左の武器種アイコン
  weaponIcon: { x: 15 / 3840, y: 220 / 2160, w: (200 - 15) / 3840, h: (395 - 220) / 2160 },
  // リザルト画面: クエスト難度の★アイコン列(★の数だけアイコンが並ぶ)
  starRow: { x: 1380 / 3840, y: 255 / 2160, w: (2440 - 1380) / 3840, h: (300 - 255) / 2160 },
};

// ★アイコンの色判定(オレンジ)のしきい値
export const STAR_COLOR = { rMin: 180, gMin: 60, gMax: 150, bMax: 90 };

// OCRはアポストロフィ/ダブルクォートを誤認識しやすいため区切り文字は広めに許容
export const CLEAR_TIME_RE = /(\d{1,2}['"'"′″!]\d{2}['"'"′″!]\d{2})/;

// 装備一覧画面で各項目の前に表示されるラベル(この順で並ぶ)
export const EQUIP_LABELS = [
  { key: 'mainWeapon', label: 'メイン武器' },
  { key: 'subWeapon', label: 'サブ武器' },
  { key: 'head', label: '頭防具' },
  { key: 'chest', label: '胴防具' },
  { key: 'arms', label: '腕防具' },
  { key: 'waist', label: '腰防具' },
  { key: 'legs', label: '脚防具' },
  { key: 'talisman', label: '護石' },
  { key: 'outfit', label: '装衣' },
];

export const WEAPON_TYPES = [
  '大剣', '太刀', '片手剣', '双剣', 'ハンマー', '狩猟笛',
  'ランス', 'ガンランス', 'スラッシュアックス', 'チャージアックス',
  '操虫棍', 'ライトボウガン', 'ヘビィボウガン', '弓',
];

// スプレッドシート列構成(22列、docs/quest_log_design.md参照)
export const SHEET_COLUMNS = [
  '日時', 'クエスト名', 'クエスト難度', 'クリアタイム', 'モンスター名', 'エリア',
  'クエストタイプ', 'クエスト種別', '武器種', 'メイン武器', 'サブ武器',
  '頭防具', '胴防具', '腕防具', '腰防具', '脚防具', '護石', '装衣',
  '簡易装備コード', '個体種', '狩猟方法', 'メモ',
];
