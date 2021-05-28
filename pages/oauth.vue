<template>
  <div>
    matataki callback...
    <n-link :to="{ name: 'index' }">
      Go Home
    </n-link>
  </div>
</template>

<script lang="ts">
import { isEmpty } from 'lodash'
import { Component, Vue } from 'nuxt-property-decorator'
import { setCookie } from '../utils/cookie'

@Component({})
export default class AuthGithubCallback extends Vue {
  created () {
    if (process.client) {
      console.log('router', this.$route)
      const { token, path } = this.$route.query
      if (!isEmpty(token)) {
        setCookie('access-token', String(token))
        this.$router.push(decodeURIComponent(String(path) || '/'))
      } else {
        this.$message.error('not token!')
      }
    }
  }
}
</script>
