import { STAR_COLOR } from './constants.js';

// リザルト画面の★アイコン列は、難度の数だけオレンジ色の★が並ぶ(空アイコンは表示されない)。
// 各列にオレンジ色のピクセルが含まれるかを調べ、その連続区間(=★1個分)の数を数える。
export function countStars(canvas) {
  const ctx = canvas.getContext('2d');
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  const colHasOrange = new Array(width).fill(false);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > STAR_COLOR.rMin && g > STAR_COLOR.gMin && g < STAR_COLOR.gMax && b < STAR_COLOR.bMax) {
        colHasOrange[x] = true;
        break;
      }
    }
  }

  let runs = 0;
  let inRun = false;
  for (const has of colHasOrange) {
    if (has && !inRun) {
      runs++;
      inRun = true;
    } else if (!has) {
      inRun = false;
    }
  }
  return runs;
}

// countStars()の結果をクエストマスタのdifficultyOptions表記("★7"等)に変換。
// 0個や11個以上など想定外の場合はnullを返す(呼び出し側でクエストマスタの値を使う)。
export function starsToDifficulty(count) {
  if (count < 1 || count > 10) return null;
  return `★${count}`;
}
