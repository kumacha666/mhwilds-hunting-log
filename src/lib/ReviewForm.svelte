<script>
  import { WEAPON_TYPES } from './constants.js';
  import { equipCode } from './parseEquip.js';

  let { data = $bindable(), onSave, saving = false, saveError = null, saved = false } = $props();

  // 防具欄が編集されたら簡易装備コードを再計算
  $effect(() => {
    data.equipCode = equipCode(data);
  });

  const lowConfidenceQuest = $derived(data.questRatio !== null && data.questRatio < 0.6);
  const lowConfidenceWeapon = $derived(data.weaponMatchDistance !== null && data.weaponMatchDistance > 20);
</script>

<section class="review">
  <h2>内容を確認・修正</h2>
  <p>OCR・画像認識の結果です。誤りがあれば修正してから記録してください。</p>

  <fieldset>
    <legend>クエスト情報</legend>

    <label class:warn={lowConfidenceQuest}>
      クエスト名 {#if data.questRatio !== null}<small>(一致度 {Math.round(data.questRatio * 100)}%)</small>{/if}
      <input list="quest-names" bind:value={data.questName} />
      <datalist id="quest-names">
        {#each data.questNames as name}<option value={name}></option>{/each}
      </datalist>
    </label>

    <label class:warn={!data.difficultyFromStars}>
      クエスト難度 {#if !data.difficultyFromStars}<small>(★認識失敗のためクエストマスタの既定値)</small>{/if}
      <select bind:value={data.difficulty}>
        {#each data.difficultyOptions as opt}<option value={opt}>{opt}</option>{/each}
      </select>
    </label>

    <label>
      クリアタイム
      <input type="text" bind:value={data.clearTime} placeholder="12'34&quot;56" />
    </label>

    <label>
      モンスター名
      <input type="text" bind:value={data.monster} />
    </label>

    <label>
      エリア
      <input type="text" bind:value={data.area} />
    </label>

    <label>
      クエストタイプ
      <input type="text" bind:value={data.questType} />
    </label>

    <label>
      クエスト種別
      <input type="text" bind:value={data.questKind} />
    </label>
  </fieldset>

  <fieldset>
    <legend>装備</legend>

    <label class:warn={lowConfidenceWeapon}>
      武器種 {#if data.weaponMatchDistance !== null}<small>(差分 {data.weaponMatchDistance}/256)</small>{/if}
      <select bind:value={data.weaponType}>
        {#each WEAPON_TYPES as w}<option value={w}>{w}</option>{/each}
      </select>
    </label>

    <label>メイン武器 <input type="text" bind:value={data.mainWeapon} /></label>
    <label>サブ武器 <input type="text" bind:value={data.subWeapon} /></label>
    <label>頭防具 <input type="text" bind:value={data.head} /></label>
    <label>胴防具 <input type="text" bind:value={data.chest} /></label>
    <label>腕防具 <input type="text" bind:value={data.arms} /></label>
    <label>腰防具 <input type="text" bind:value={data.waist} /></label>
    <label>脚防具 <input type="text" bind:value={data.legs} /></label>
    <label>護石 <input type="text" bind:value={data.talisman} /></label>
    <label>装衣 <input type="text" bind:value={data.outfit} /></label>
    <label>簡易装備コード <input type="text" bind:value={data.equipCode} /></label>
  </fieldset>

  <fieldset>
    <legend>その他</legend>

    <label>
      個体種
      <select bind:value={data.individualType}>
        {#each data.individualTypeOptions as opt}<option value={opt}>{opt}</option>{/each}
      </select>
    </label>

    <label>
      狩猟方法
      <select bind:value={data.huntMethod}>
        {#each data.huntMethodOptions as opt}<option value={opt}>{opt}</option>{/each}
      </select>
    </label>

    <label>
      メモ
      <textarea bind:value={data.memo} rows="2"></textarea>
    </label>
  </fieldset>

  {#if saveError}<p class="error">{saveError}</p>{/if}
  {#if saved}<p class="success">スプレッドシートに記録しました。</p>{/if}

  <button onclick={onSave} disabled={saving}>{saving ? '記録中...' : 'スプレッドシートに記録'}</button>
</section>

<style>
  .review {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 32rem;
    margin: 0 auto;
    padding: 1rem;
  }
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    padding: 0.75rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.9rem;
  }
  label.warn {
    color: #b8860b;
  }
  input, select, textarea {
    font-size: 1rem;
    padding: 0.4rem;
  }
  button {
    align-self: flex-start;
    padding: 0.5rem 1.5rem;
    font-size: 1rem;
  }
  .error {
    color: #c0392b;
  }
  .success {
    color: #1e7e34;
  }
</style>
