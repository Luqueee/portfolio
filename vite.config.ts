import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { metadataMarkup } from './src/seo'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'portfolio-seo-head',
      transformIndexHtml(html) {
        return html.replace('<!-- SEO_HEAD -->', metadataMarkup('/'))
      },
    },
  ],
})
