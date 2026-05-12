import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeSiteUrl(value?: string) {
  const trimmed = value?.trim()

  if (!trimmed) {
    return ''
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    return new URL(withProtocol).toString().replace(/\/$/, '')
  } catch {
    return ''
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = normalizeSiteUrl(
    env.VITE_SITE_URL ||
      env.SITE_URL ||
      env.URL ||
      env.DEPLOY_PRIME_URL ||
      env.CF_PAGES_URL ||
      env.VERCEL_PROJECT_PRODUCTION_URL ||
      env.VERCEL_URL,
  )
  const ogImageVersion = env.VITE_OG_IMAGE_VERSION?.trim() || '1'
  const ogImagePath = `/og/serum-game-og.png?v=${encodeURIComponent(ogImageVersion)}`
  const pageUrl = siteUrl || '/'
  const ogImageUrl = siteUrl ? new URL(ogImagePath, `${siteUrl}/`).toString() : ogImagePath

  return {
    plugins: [
      react(),
      {
        name: 'inject-social-meta',
        transformIndexHtml(html) {
          return html
            .replaceAll('__PAGE_URL__', pageUrl)
            .replaceAll('__OG_IMAGE_URL__', ogImageUrl)
        },
      },
    ],
  }
})
