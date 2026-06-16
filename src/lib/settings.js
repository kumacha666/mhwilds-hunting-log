const STORAGE_KEY = 'monhan-quest-log-settings';

const DEFAULTS = {
  visionApiKey: '',
  googleClientId: '',
  spreadsheetId: '',
  sheetName: 'シート1',
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function isConfigured(settings) {
  return Boolean(settings.visionApiKey && settings.googleClientId && settings.spreadsheetId);
}
