<template>
  <div v-if="isShowBox" class="box">
    <el-tooltip class="item" effect="dark" content="一键上传笔记内所有的离线图片" placement="bottom">
      <span class="btn" @click="uploadAllOfflineImages"><span>一件上传</span><sup>Offline</sup></span>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import { isOfflineUploadImages } from '../../utils/index'

@Component({})
export default class UploadImagesBtn extends Vue {
  isShowBox: boolean = false
  // NodeJS.Timeout
  timer: ReturnType<typeof setInterval> = null as any

  @Watch('$nuxt.isOnline')
  onIsOnlineChanged () {
    this.toggleShow()
  }

  mounted () {
    this.$nextTick(() => {
      this.toggleShow()
      this.timer = setInterval(() => {
        this.toggleShow()
      }, 5000)
    })
  }

  destroyed () {
    clearInterval(this.timer)
  }

  // 是否显示一件离线上传
  toggleShow (): void {
    if (process.client) {
      this.isShowBox = this.$nuxt.isOnline && isOfflineUploadImages()
    } else {
      this.isShowBox = false
    }
  }

  // 上传所有离线图片
  uploadAllOfflineImages (): void {
    if (isOfflineUploadImages()) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null as any, [
          h('p', null as any, '一键上传笔记内所有的离线图片')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$emit('uploadAll')
      })
    } else {
      console.log('not offline images')
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 0 10px;
}
.btn {
  cursor: pointer;
  font-size: 12px;
  color: #333;
  span {
    letter-spacing: 1px;
  }
}
</style>
