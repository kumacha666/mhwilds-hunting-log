# モンハンワイルズ 狩猟記録 PWA

クエストクリア後の「リザルト画面」と「装備一覧画面」の2枚のスクリーンショットから、
OCR(Cloud Vision API)・武器種アイコン認識・クエストマスタへのファジーマッチで
狩猟記録の各項目を自動入力し、確認・修正のうえ自分のGoogleスプレッドシートへ記録する。

**デプロイ先**: https://kumacha666.github.io/mhwilds-hunting-log/

## 開発

```sh
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド(dist/)
```

## 初回セットアップ(利用者側)

アプリ右上の ⚙ から以下を設定する。値はその端末のブラウザの localStorage にのみ保存される。

1. **Cloud Vision API キー**: 自分のGoogle Cloudプロジェクトで [Cloud Vision API](https://console.cloud.google.com/) を有効化し、APIキーを発行
2. **Google OAuth クライアントID**: 同プロジェクトでOAuthクライアントID(ウェブアプリケーション)を作成。
   承認済みJavaScript生成元にこのPWAの配信元URLを追加。スコープは`https://www.googleapis.com/auth/spreadsheets`のみ使用
3. **スプレッドシートID**: 記録先スプレッドシートのURL中の`/d/`と`/edit`の間の文字列
4. **シート名**: データを書き込むシート名(既定: `シート1`)

## 使い方

1. 「①リザルト画面」「②装備一覧画面」のスクショを選択し「解析する」
2. 内容を確認・修正画面で、クエスト名・武器種・防具名等のOCR/認識結果をチェック
   (一致度が低い項目には警告色がつく)
3. 「スプレッドシートに記録」でGoogleにログインし、シートの3行目(既存データの先頭)に1行挿入

## 実装済み

- `src/lib/crop.js`: Canvasによるスクショの領域切り出し(リザルト情報欄・装備テキスト欄・武器種アイコン欄)
- `src/lib/visionApi.js`: Cloud Vision API (TEXT_DETECTION, languageHints: ja)
- `src/lib/fuzzy.js`, `questMaster.js`: `public/data/quest_master.json`へのファジーマッチでクエスト名・モンスター・エリア・難度等を補完
- `src/lib/parseEquip.js`: 装備一覧画面のOCRテキストをラベル(メイン武器/サブ武器/防具5部位/護石/装衣)ごとに分割、簡易装備コードを算出
- `src/lib/weaponIcon.js`: `public/templates/weapon_icons/`の14種テンプレートとの average hash 比較で武器種アイコンを判別
- `src/lib/difficulty.js`: リザルト画面の★アイコン列をピクセル色(オレンジ)判定し、連続区間の数からクエスト難度を算出
- `src/lib/sheetsApi.js`: Google Identity Services (OAuthトークンクライアント) + Sheets API v4で先頭付近に1行挿入

## デプロイ(GitHub Pages)

`.github/workflows/deploy.yml`で、`main`ブランチへのpush時に自動で
`https://kumacha666.github.io/mhwilds-hunting-log/` へデプロイされる(GitHub Actions経由)。

初回のみ、リポジトリの **Settings → Pages → Source** を「GitHub Actions」に設定する必要がある。

Google Cloud Console側のOAuthクライアント設定で、承認済みJavaScript生成元に
`https://kumacha666.github.io` を追加すること。

## 未実装・今後の課題

- 防具・護石・装衣名のファジーマッチ用辞書(現状はOCR結果そのまま。表記揺れは確認画面で手動修正)
- モンスターアイコンのテンプレートマッチング(調査クエスト等の複数体判別)
- 実機(Cloud Vision APIキー・OAuthクライアントID使用)での動作確認
