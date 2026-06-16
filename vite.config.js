import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages (プロジェクトページ)へのデプロイ用。
// https://kumacha666.github.io/mhwilds-hunting-log/ 配下に配置するため、本番ビルドのみbaseを変更する。
const base = process.env.GITHUB_PAGES ? '/mhwilds-hunting-log/' : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['templates/**/*', 'data/**/*'],
      manifest: {
        name: 'モンハンワイルズ 狩猟記録',
        short_name: '狩猟記録',
        description: 'クエストクリア後のスクリーンショットから狩猟記録をスプレッドシートに記録するツール',
        theme_color: '#2b2118',
        background_color: '#2b2118',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 装備一覧・武器アイコンの画像はサイズが大きいため上限を緩める
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
})
