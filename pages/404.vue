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
  width: 100%;
  height: 100vh;
  background: #333;
  color: #fff;
  font-size: 20px;
  padding: 100px 0 0 0;
  text-align: center;
  a {
    color: #fff;
  }
}
</style>
