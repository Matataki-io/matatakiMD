<template>
  <div class="wrapper">
    404 page ...
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
      //
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  margin: 100px auto 0;
  font-size: 20px;
  text-align: center;
}
</style>
