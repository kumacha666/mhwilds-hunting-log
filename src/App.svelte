<script>
  import Settings from './lib/Settings.svelte';
  import UploadStep from './lib/UploadStep.svelte';
  import ReviewForm from './lib/ReviewForm.svelte';
  import { loadSettings, isConfigured } from './lib/settings.js';
  import { processScreenshots, toSheetRow } from './lib/pipeline.js';
  import { getAccessToken, insertRowAtTop } from './lib/sheetsApi.js';

  const initialSettings = loadSettings();
  let settings = $state(initialSettings);
  let showSettings = $state(!isConfigured(initialSettings));
  let reviewData = $state(null);
  let processError = $state(null);
  let saving = $state(false);
  let saveError = $state(null);
  let saved = $state(false);

  async function handleProcess(resultFile, equipFile) {
    processError = null;
    try {
      reviewData = await processScreenshots(resultFile, equipFile, settings.visionApiKey);
    } catch (e) {
      processError = e.message;
    }
  }

  async function handleSave() {
    saving = true;
    saveError = null;
    saved = false;
    try {
      const token = await getAccessToken(settings.googleClientId);
      const row = toSheetRow(reviewData);
      await insertRowAtTop(settings.spreadsheetId, settings.sheetName, token, row);
      saved = true;
    } catch (e) {
      saveError = e.message;
    } finally {
      saving = false;
    }
  }

  function reset() {
    reviewData = null;
    processError = null;
    saveError = null;
    saved = false;
  }
</script>

<header>
  <h1>モンハンワイルズ 狩猟記録</h1>
  <button class="gear" onclick={() => (showSettings = !showSettings)} aria-label="設定">⚙</button>
</header>

{#if showSettings}
  <Settings bind:settings />
{:else if !reviewData}
  <UploadStep onProcess={handleProcess} error={processError} />
{:else}
  <ReviewForm bind:data={reviewData} onSave={handleSave} {saving} {saveError} {saved} />
  <div class="actions">
    <button onclick={reset}>別のスクショを解析</button>
  </div>
{/if}

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 32rem;
    margin: 0 auto;
    padding: 1rem;
  }
  h1 {
    font-size: 1.25rem;
    margin: 0;
  }
  .gear {
    font-size: 1.25rem;
    background: none;
    border: none;
    cursor: pointer;
  }
  .actions {
    max-width: 32rem;
    margin: 0 auto;
    padding: 0 1rem 1rem;
  }
</style>
