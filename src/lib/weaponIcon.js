import { WEAPON_TYPES } from './constants.js';

const HASH_SIZE = 16; // 16x16 average hash

// Computes a 256-bit average hash (as a string of '0'/'1') for a canvas.
function averageHash(canvas) {
  const small = document.createElement('canvas');
  small.width = HASH_SIZE;
  small.height = HASH_SIZE;
  const ctx = small.getContext('2d');
  ctx.drawImage(canvas, 0, 0, HASH_SIZE, HASH_SIZE);

  const { data } = ctx.getImageData(0, 0, HASH_SIZE, HASH_SIZE);
  const gray = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
  const mean = gray.reduce((a, b) => a + b, 0) / gray.length;
  return gray.map((v) => (v >= mean ? '1' : '0')).join('');
}

function hammingDistance(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return d;
}

let templateHashesPromise = null;

async function loadTemplateHashes() {
  if (templateHashesPromise) return templateHashesPromise;
  templateHashesPromise = Promise.all(
    WEAPON_TYPES.map(async (weapon) => {
      const img = new Image();
      img.src = `${import.meta.env.BASE_URL}templates/weapon_icons/${encodeURIComponent(weapon)}.png`;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext('2d').drawImage(img, 0, 0);
      return { weapon, hash: averageHash(canvas) };
    }),
  );
  return templateHashesPromise;
}

// Identifies the weapon type by comparing the cropped weapon-icon canvas
// against the 14 reference templates. Returns { weapon, distance } where a
// lower distance (out of 256 bits) means a closer match.
export async function identifyWeaponIcon(iconCanvas) {
  const templates = await loadTemplateHashes();
  const hash = averageHash(iconCanvas);

  let best = null;
  for (const t of templates) {
    const distance = hammingDistance(hash, t.hash);
    if (!best || distance < best.distance) best = { weapon: t.weapon, distance };
  }
  return best;
}
