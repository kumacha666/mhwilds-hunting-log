// Google Cloud Vision API (TEXT_DETECTION) client.
// The user supplies their own API key (see settings.js), generated in their
// own Google Cloud project with the Vision API enabled.

export async function ocrText(base64Image, apiKey) {
  const res = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }],
          imageContext: { languageHints: ['ja'] },
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cloud Vision API error (${res.status}): ${body}`);
  }

  const data = await res.json();
  const response = data.responses?.[0];
  if (response?.error) {
    throw new Error(`Cloud Vision API error: ${response.error.message}`);
  }
  return response?.fullTextAnnotation?.text ?? '';
}
