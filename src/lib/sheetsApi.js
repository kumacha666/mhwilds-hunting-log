// Google Identity Services (OAuth token client) + Sheets API v4 client.
// Scope is restricted to spreadsheets only.

const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';
const GIS_SRC = 'https://accounts.google.com/gsi/client';

let gisLoadPromise = null;

function loadGis() {
  if (gisLoadPromise) return gisLoadPromise;
  gisLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
  return gisLoadPromise;
}

let tokenClient = null;
let cachedToken = null;

// Requests (or reuses) an OAuth access token with the spreadsheets scope.
// Triggers the Google consent popup on first use.
export async function getAccessToken(clientId) {
  if (cachedToken) return cachedToken;
  await loadGis();

  return new Promise((resolve, reject) => {
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPE,
        callback: (response) => {
          if (response.error) {
            reject(new Error(`OAuth error: ${response.error}`));
            return;
          }
          cachedToken = response.access_token;
          resolve(cachedToken);
        },
      });
    }
    tokenClient.requestAccessToken();
  });
}

async function sheetsFetch(path, accessToken, options = {}) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets API error (${res.status}): ${body}`);
  }
  return res.json();
}

async function getSheetId(spreadsheetId, sheetName, accessToken) {
  const data = await sheetsFetch(
    `${spreadsheetId}?fields=sheets.properties`,
    accessToken,
  );
  const sheet = data.sheets.find((s) => s.properties.title === sheetName);
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`);
  return sheet.properties.sheetId;
}

// Inserts a new row at `dataStartRow` (1-indexed, matching the existing
// Apps Script convention of DATA_START_ROW=3: row1=タイトル, row2=見出し,
// row3〜=データ) and writes `rowValues` into it. Formatting is copied from
// the row that was previously at `dataStartRow` (now pushed down by one).
export async function insertRowAtTop(spreadsheetId, sheetName, accessToken, rowValues, dataStartRow = 3) {
  const sheetId = await getSheetId(spreadsheetId, sheetName, accessToken);
  const rowIndex = dataStartRow - 1; // 0-indexed

  await sheetsFetch(`${spreadsheetId}:batchUpdate`, accessToken, {
    method: 'POST',
    body: JSON.stringify({
      requests: [
        {
          insertDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: rowIndex, endIndex: rowIndex + 1 },
            inheritFromBefore: false,
          },
        },
        {
          copyPaste: {
            source: {
              sheetId,
              startRowIndex: rowIndex + 1,
              endRowIndex: rowIndex + 2,
              startColumnIndex: 0,
              endColumnIndex: rowValues.length,
            },
            destination: {
              sheetId,
              startRowIndex: rowIndex,
              endRowIndex: rowIndex + 1,
              startColumnIndex: 0,
              endColumnIndex: rowValues.length,
            },
            pasteType: 'PASTE_FORMAT',
          },
        },
      ],
    }),
  });

  const range = encodeURIComponent(`${sheetName}!A${dataStartRow}`);
  await sheetsFetch(`${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`, accessToken, {
    method: 'PUT',
    body: JSON.stringify({ values: [rowValues] }),
  });
}
