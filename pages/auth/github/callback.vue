<template>
  <div>
    github callback
    <n-link :to="{ name: 'index' }">
      Go Home
    </n-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { oauthLoginAccessToken } from '../../../api/index'
import { setCookie } from '../../../utils/cookie'

@Component({})
export default class AuthGithubCallback extends Vue {
  created () {
    if (process.client) {
      console.log('router', this.$route)
      const code: any = this.$route.query.code || ''
      if (code) {
        this.oauthLoginAccessTokenFn(code)
      }
    }
  }

  async oauthLoginAccessTokenFn (code: string) :Promise<void> {
    const res: any = await oauthLoginAccessToken({
      code,
      platform: 'github'
    })
    if (res.code === 0) {
      setCookie('token', res.data.token)
    }
  }
}
</script>
