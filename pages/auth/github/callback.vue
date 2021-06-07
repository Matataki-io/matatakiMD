<template>
  <div class="wrapper">
    github callback
    <n-link :to="{ name: 'index' }">
      Go Home
    </n-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AuthGithubCallback extends Vue {
  created () {
    if (process.client) {
      console.log('router', this.$route)
      const code: any = this.$route.query.code || ''
      if (code) {
        console.log(code)
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
}
</style>
