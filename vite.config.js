import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '筋トレ日記',
        short_name: '筋トレ',
        description: '筋トレの記録をつけるアプリ',
        theme_color: '#ff5722',
        background_color: '#0a0e27',
        display: 'standalone',
  icons: [
      {
        src: '/pwa-192x192.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
        purpose: 'any maskable'
      },
      {
        src: '/pwa-512x512.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
        purpose: 'any maskable'
      }
  ]
      }
    })
  ]
})
