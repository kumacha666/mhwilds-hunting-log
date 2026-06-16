// Canvas-based image cropping utilities.

// Loads a File/Blob into an ImageBitmap.
export async function loadImage(file) {
  return await createImageBitmap(file);
}

// Crops `box` (fractions of width/height, see constants.js) out of `image`
// and returns a canvas containing just that region.
export function cropToCanvas(image, box) {
  const sx = Math.round(box.x * image.width);
  const sy = Math.round(box.y * image.height);
  const sw = Math.round(box.w * image.width);
  const sh = Math.round(box.h * image.height);

  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
  return canvas;
}

// Returns the base64-encoded (no data: prefix) content of a canvas as JPEG.
export function canvasToBase64(canvas, quality = 0.92) {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  return dataUrl.split(',')[1];
}

// Returns ImageData for a canvas region (defaults to the whole canvas).
export function getImageData(canvas) {
  const ctx = canvas.getContext('2d');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
