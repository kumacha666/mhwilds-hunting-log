<script>
  let { onProcess, error = null } = $props();

  let resultFile = $state(null);
  let equipFile = $state(null);
  let processing = $state(false);

  function handleResultFile(e) {
    resultFile = e.target.files[0] ?? null;
  }
  function handleEquipFile(e) {
    equipFile = e.target.files[0] ?? null;
  }

  async function run() {
    if (!resultFile || !equipFile) return;
    processing = true;
    try {
      await onProcess(resultFile, equipFile);
    } finally {
      processing = false;
    }
  }
</script>

<section class="upload">
  <h2>スクリーンショットを選択</h2>
  <p>クエストクリア後の「リザルト画面」と、集会所に戻った直後の「装備一覧画面」の2枚を選んでください。</p>

  <label>
    ① リザルト画面
    <input type="file" accept="image/*" onchange={handleResultFile} />
  </label>

  <label>
    ② 装備一覧画面
    <input type="file" accept="image/*" onchange={handleEquipFile} />
  </label>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <button onclick={run} disabled={!resultFile || !equipFile || processing}>
    {processing ? '解析中...' : '解析する'}
  </button>
</section>

<style>
  .upload {
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
  button {
    align-self: flex-start;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
  .error {
    color: #c0392b;
  }
</style>
