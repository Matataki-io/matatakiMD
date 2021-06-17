<template>
  <el-popover
    placement="bottom-start"
    width="400"
    trigger="click"
    @show="getImages"
    @hide="() => images = {}"
  >
    <div class="box-container">
      <div class="item">
        <div class="item-title">
          <span>默认素材</span>
        </div>
        <div class="item-container">
          <div v-for="(item, index) in allMaterial" :key="index" class="item-c-box" @click="copy(`${ssimg}${item}`)">
            <img :src="`${ssimg}${item}`" alt="material">
          </div>
        </div>
      </div>
      <div class="item">
        <div class="item-title">
          <span>其他素材<span>(自己上传的)</span></span>
          <el-tooltip class="item" effect="dark" content="清空全部素材" placement="top-start">
            <el-button v-if="showClearAllBtn" size="mini" circle icon="el-icon-close" @click="handleAllClear" />
          </el-tooltip>
        </div>
        <div class="item-container">
          <div v-for="(item, index) in images.upload" :key="index" class="item-c-box" @click="copy(`${ssimg}${item.url}`)">
            <img :src="`${ssimg}${item.url}`" alt="material">
            <div class="item-close" @click="e => handleClear({index: Number(index)}, e)">
              <i class="el-icon-close icon" />
            </div>
          </div>
          <p v-if="!showClearAllBtn" class="text">
            没有素材
          </p>
        </div>
      </div>
    </div>
    <div slot="reference" class="header-right_icon">
      <svg
        t="1623906793120"
        class="icon"
        viewBox="0 0 1280 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2361"
        width="200"
        height="200"
      ><path d="M1213.44 318.08H59.2c-58.56 0-61.504 28.544-58.368 63.424l52.48 573.184c3.2 34.88 11.52 63.36 70.016 63.36h1025.92c59.712 0 66.816-28.48 69.952-63.36l52.48-573.184c3.2-34.88 0.32-63.36-58.24-63.36z m-42.368-139.904c-7.04-28.032-41.664-50.944-76.928-50.944H660.48c-35.264 0-84.608-20.16-109.568-44.864L513.088 44.928C488.128 20.224 438.848 0 403.52 0H196.352c-35.2 0-67.328 28.48-71.168 63.232l-18.56 165.824h1077.248l-12.8-50.88z" p-id="2362" /></svg>
    </div>
  </el-popover>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import { isEmpty } from 'lodash'

import { ImagesProps } from '../../types'

@Component({})
export default class HeaderMaterial extends Vue {
  images: ImagesProps = {} as ImagesProps

  get allMaterial (): string[] {
    return [
      '/material/default_cover_v1.png',
      '/material/default_cover.png',
      '/material/matataki_logo.png'
    ]
  }

  get ssimg (): string {
    return (process.env.APP_SSIMG) as string
  }

  get showClearAllBtn (): boolean {
    if (isEmpty(this.images.upload)) {
      return false
    } else {
      return !!this.images.upload.length
    }
  }

  mounted () {
    if (process.browser) {
      //
    }
  }

  // 清除所有图片
  async clearAllImages (): Promise<void> {
    try {
      const key = 'images'
      const res: ImagesProps = await (this as any).$localForage.getItem(key)
      res.upload = []

      await (this as any).$localForage.setItem(key, res)
      this.$message.success('清除成功')
      this.getImages()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 清除图片
  async clearImages ({ index }: { index: number }): Promise<void> {
    try {
      const key = 'images'
      const res: ImagesProps = await (this as any).$localForage.getItem(key)
      res.upload?.splice(index, 1)

      await (this as any).$localForage.setItem(key, res)
      this.$message.success('清除成功')
      this.getImages()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 处理清除全部事件
  handleAllClear (): void {
    this.$confirm('此操作将删除所有素材, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.clearAllImages()
    }).catch(() => {})
  }

  // 处理清除事件
  handleClear ({ index }: { index: number }, e: Event): void {
    e.stopPropagation()
    this.$confirm('此操作将删除素材, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.clearImages({ index })
    }).catch(() => {})
  }

  // 获取所有素材
  async getImages ():Promise<void> {
    try {
      const key = 'images'
      const res: ImagesProps = await (this as any).$localForage.getItem(key)
      this.images = res
    } catch (e) {
      console.log(e.toString())
    }
  }

  copy (hash: string): void {
    this.$copyText(hash).then(() => {
      this.$message.success('复制成功')
    }, () => {
      this.$message.error('复制失败')
    })
  }
}
</script>

<style lang="less" scoped>
.header-right_icon {
  width: 22px;
  height: 22px;
  margin: 0 10px;
}
.icon {
  width: 22px;
  height: 22px;
  font-size: 22px;
  color: #5f6266;
  fill: #5f6266;
  cursor: pointer;
}
.box-container {
  padding: 10px;
  color: #5f6266;
  max-height: 600px;
  overflow: auto;
}
.item-title {
  font-size: 14px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item {
  margin: 0 0 20px 0;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
}

.item-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
}
.item-c-box {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  overflow: hidden;
  background-color: #f8f8fb;
  border-radius: 3px;
  border: 1px solid #f8f8fb;
  box-sizing: border-box;
  cursor: pointer;
  transition: all .3s;
  position: relative;
  &:hover {
    background-color: mix(#f8f8fb, #000, 90%);
    .item-close {
      display: block;
    }
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
  .item-close {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #dadada;
    border-radius: 0 0 0 4px;
    text-align: center;
    display: none;
  }
  .icon {
    font-size: 16px;
    color: #333;
    line-height: 22px;
  }
}
.text {
  font-size: 14px;
}
</style>
