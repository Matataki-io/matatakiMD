
export default {
  development: {
    NODE: 'development',
    NODE_ENV: 'development',
    APP_API_URL: 'http://127.0.0.1:7001',
    // Matataki
    APP_MATATAKI_URL: 'https://test.matataki.io',
    APP_MATATAKI_RELEASE_NOTES: 'https://www.matataki.io/p/9195',
    APP_MATATAKI_TUTORIAL: 'https://www.matataki.io/p/9196',
    // # Matataki OAuth Related config
    REACT_APP_OAuthUrl: 'https://developer.matataki.io/app/905ac873d9d71038/oauth?network=test',
    REACT_APP_OAuthClientId: '401523152384315',
    REACT_APP_OAuthClientSecret: '2987112115071a55',
    VUE_APP_HCAPTCHA_SITE_KEY: 'add3227a-649b-4e14-b286-d6c917f9b775'
  },
  production: {
    NODE: 'production',
    NODE_ENV: 'production',
    APP_API_URL: 'https://md-api.mttk.net',
    // Matataki
    APP_MATATAKI_URL: 'https://matataki.io',
    APP_MATATAKI_RELEASE_NOTES: 'https://www.matataki.io/p/9195',
    APP_MATATAKI_TUTORIAL: 'https://www.matataki.io/p/9196',
    // # Matataki OAuth Related config
    REACT_APP_OAuthUrl: 'https://developer.matataki.io/app/f1d77cd8b16bd25f/oauth',
    REACT_APP_OAuthClientId: '582657204820772',
    REACT_APP_OAuthClientSecret: '62694caddff0c216',
    VUE_APP_HCAPTCHA_SITE_KEY: '929510ae-ff3e-4ccc-bb8b-f7dd3983e791'
  }
}
