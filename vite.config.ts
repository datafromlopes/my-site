import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
// @ts-expect-error -- plain ESM plugin, no types needed
import markdown from './plugins/markdown.mjs'

/** Frozen at build time so SSR output and hydration agree on "now". */
const BUILD_DATE = new Date().toISOString().slice(0, 10)

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [markdown(), react(), tailwindcss()],

  define: {
    __BUILD_DATE__: JSON.stringify(BUILD_DATE),
  },

  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },

  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: false,
    assetsInlineLimit: 2048,
    reportCompressedSize: false,
    rollupOptions: isSsrBuild
      ? undefined
      : {
          output: {
            manualChunks(id: string) {
              if (!id.includes('node_modules')) return undefined
              if (id.includes('react-router')) return 'router'
              if (id.includes('react-dom') || id.includes('/react/')) return 'react'
              return undefined
            },
          },
        },
  },

  server: { port: 5173 },
}))
