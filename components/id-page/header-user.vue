<template>
  <div class="user">
    <el-dropdown v-if="isUser" trigger="click" class="user-tooltip" @command="val => $emit('handleCommand', val)">
      <el-tooltip effect="dark" :content="usersData.nickname || usersData.username" placement="bottom">
        <el-avatar :src="`https://ssimg.frontenduse.top/${usersData.avatar}`" :size="30" />
      </el-tooltip>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-user" command="user">
          <a ref="noopener noreferrer" :href="`${matatakiUrl}/user/${usersData.id}`" target="_blank" class="user-item">个人主页</a>
        </el-dropdown-item>
        <el-dropdown-item divided icon="el-icon-warning-outline" command="signout">
          登出
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div v-else class="user-not-logged" @click="jumpToMttkOAuth">
      登入
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop
} from 'nuxt-property-decorator'
import { setOAuthRedirectUri } from '../../api/developer'

@Component({})
export default class HeaderIpfs extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  readonly usersData!: Object

  @Prop({
    type: Boolean,
    required: true
  })
  readonly isUser!: boolean

  get matatakiUrl () {
    if (process.client) {
      return process.env.APP_MATATAKI_URL
    } else {
      return ''
    }
  }

  async jumpToMttkOAuth (): Promise<void> {
    try {
      console.log('from', location)
      await setOAuthRedirectUri(location.pathname)
    } catch (error) {
      console.log('error', error)
    }
    (window as any).location = process.env.REACT_APP_OAuthUrl
  };
}
</script>

<style lang="less" scoped>
.user-tooltip {
  display: flex;
  align-items: center;
}
.user {
  display: flex;
  align-items: center;
}
.user-item {
  font-size: 14px;
  color: #606266;
  text-decoration: none;
}
.user-not-logged {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #606266;
  cursor: pointer;
}
</style>
