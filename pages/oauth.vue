<template>
  <div class="wrapper">
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
        setCookie('access-token', String(token), 1)
        this.$router.push(decodeURIComponent(String(path) || '/'))
      } else {
        this.$message.error('not token!')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  height: 100vh;
  background: #333;
  color: #fff;
  font-size: 16px;
  a {
    color: #fff;
    font-size: 16px;
  }
}
</style>
