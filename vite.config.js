import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    VitePWA({
    includeAssets: ['icn.png'],
    registerType: 'autoUpdate',
    devOptions: {
      enabled: true
    },
    manifest: {
      name: 'Quran learner',
      short_name: 'quran-learner',
      description: 'learn the Quran',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icn.png',
          sizes: '512x512',
          type: 'image/png'
        },
      ]
    }
  })
]
})