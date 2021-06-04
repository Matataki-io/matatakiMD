<template>
  <div />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class AuthGithubCallback extends Vue {
  created () {
    if (process.client) {
      this.$router.push('/404')
    }
  }
}
</script>
