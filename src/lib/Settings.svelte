<script>
  import { saveSettings } from './settings.js';

  let { settings = $bindable() } = $props();

  let local = { ...settings };

  function save() {
    settings = { ...local };
    saveSettings(settings);
  }
</script>

<section class="settings">
  <h2>初期設定</h2>
  <p>
    OCR(Cloud Vision API)とスプレッドシート書き込み(Google Sheets API)には、
    自分のGoogle Cloudプロジェクトで発行したAPIキー・OAuthクライアントIDが必要です。
    入力した値はこの端末のブラウザにのみ保存されます。
  </p>

  <label>
    Cloud Vision API キー
    <input type="password" bind:value={local.visionApiKey} placeholder="AIza..." />
  </label>

  <label>
    Google OAuth クライアントID
    <input type="text" bind:value={local.googleClientId} placeholder="xxxx.apps.googleusercontent.com" />
  </label>

  <label>
    スプレッドシートID
    <input type="text" bind:value={local.spreadsheetId} placeholder="URLの /d/ と /edit の間の文字列" />
  </label>

  <label>
    シート名
    <input type="text" bind:value={local.sheetName} placeholder="シート1" />
  </label>

  <button onclick={save}>保存</button>
</section>

<style>
  .settings {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 32rem;
    margin: 0 auto;
    padding: 1rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
  }
  input {
    font-size: 1rem;
    padding: 0.5rem;
  }
  button {
    align-self: flex-start;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
</style>
