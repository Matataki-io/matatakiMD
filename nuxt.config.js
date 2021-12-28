import ENV from './env'

const PORT = {
  development: 3000,
  production: 5068
}

const metaTitle = 'MatatakiMD - Markdown 编辑器'
const metaDescription = '用开箱即用的 Markdown 编辑器书写 并发布到 IPFS、GitHub、Matataki 让你快速记录想法、随时发布到永存网络。'
const metaKeywords = 'Collaborative, Markdown, Notes、GitHub、IPFS、Matataki、瞬MATATAKI、仙女座科技、小岛美奈子、岛娘'
const metaImage = 'https://smartsignature-img.oss-cn-hongkong.aliyuncs.com/article/2021/06/16/26ba884341efc989364f8ade91099f8f.png'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MatatakiMD',
    meta: [
      { charset: 'utf-8' },

      { hid: 'robots', name: 'robots', property: 'robots', content: 'index,follow' },
      { hid: 'copyright', name: 'copyright', property: 'copyright', content: 'Copyright © 2018-2021 ANDOROMEDA TECH.ltd' },
      { hid: 'description', name: 'description', content: metaDescription },
      { hid: 'keywords', name: 'keywords', content: metaKeywords },
      /* <!--  Meta for Twitter Card --> */
      { hid: 'twitter:card', name: 'twitter:card', property: 'twitter:card', content: 'summary' },
      { hid: 'twitter:site', name: 'twitter:site', property: 'twitter:site', content: metaTitle },
      { hid: 'twitter:title', name: 'twitter:title', property: 'twitter:title', content: metaTitle },
      { hid: 'twitter:image', name: 'twitter:image', property: 'twitter:image', content: metaImage },
      { hid: 'twitter:description', name: 'twitter:description', property: 'twitter:description', content: metaDescription },
      /* <!--  Meta for OpenGraph --> */
      { hid: 'og:type', name: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', name: 'og:site_name', property: 'og:site_name', content: metaTitle },
      { hid: 'og:title', name: 'og:title', property: 'og:title', content: metaTitle },
      { hid: 'og:image', name: 'og:image', property: 'og:image', content: metaImage },
      { hid: 'og:description', name: 'og:description', property: 'og:description', content: metaDescription }
      /* end */

    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    '@/plugins/vue-plugins'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/localforage'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/nuxt-community/style-resources-module
    // https://www.nuxtjs.cn/api/configuration-build#styleresources
    '@nuxtjs/style-resources'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      name: 'MatatakiMD',
      short_name: 'MatatakiMD',
      description: 'MatatakiMD',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/]
  },
  server: {
    port: PORT[process.env.NODE_ENV], // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  env: ENV[process.env.NODE_ENV]
}
