import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { metadataMarkup } from './src/lib/seo'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-seo-head',
      transformIndexHtml(html) {
        return html.replace('<!-- SEO_HEAD -->', metadataMarkup('/'))
      },
    },
  ],
})
