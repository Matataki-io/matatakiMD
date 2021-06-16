<template>
  <el-popover
    placement="bottom-start"
    width="360"
    trigger="click"
    @show="getAllNotes"
    @hide="() => notes = []"
  >
    <div class="box-container">
      <div class="box-title">
        <span>离线上传图片列表</span>
        <el-button type="danger" size="mini" @click="handleAllClear">
          清除所有
        </el-button>
      </div>
      <div v-if="notes.length" class="box-container-item">
        <div v-for="(item, index) in notes" :key="`${index}-${item.id_str || item.id}`" class="box-item">
          <p>ID: {{ item.id_str || item.id }}</p>
          <div>
            <template v-if="item.images">
              <div v-for="(itemImage, idx) in item.images || []" :key="`${idx}-${itemImage.time}`" class="item">
                <div class="item-image" @click="copyFn({ id: String(item.id_str || item.id), time: String(itemImage.time) })">
                  <el-image
                    style="width: 60px; height: 60px; flex: 0 0 60px;"
                    :src="itemImage.base64"
                    fit="cover"
                  />
                  <div class="item-info">
                    <span>{{ itemImage.name }}</span>
                  </div>
                </div>

                <div class="item-icon" @click="handleClear({ id: item.id_str || String(item.id), index: idx })">
                  <i class="el-icon-close" />
                </div>
              </div>
            </template>
            <p v-else class="box-text">
              没有上传图片
            </p>
          </div>
        </div>
      </div>
      <p v-else class="box-text">
        没有笔记
      </p>
    </div>
    <div slot="reference" class="header-right_icon">
      <i class="el-icon-picture-outline icon-ipfs" />
    </div>
  </el-popover>
</template>

<script lang="ts">
import {
  Component,
  Vue
} from 'nuxt-property-decorator'
import { cloneDeep } from 'lodash'

import { Notes } from '../../types'

@Component({})
export default class HeaderImages extends Vue {
  notes: Notes[] = []

  mounted () {
    if (process.browser) {
      //
    }
  }

  // 清除所有图片
  async clearAllImages (): Promise<void> {
    try {
      const keys = await (this as any).$localForage.keys()
      // console.log('keys', keys)
      for (let i = 0; i < keys.length; i++) {
        const ele = keys[i]
        const res: Notes = await (this as any).$localForage.getItem(ele)
        const note: Notes = cloneDeep(res)
        delete note.images
        await (this as any).$localForage.setItem(ele, note)
      }
      this.$message.success('清除成功')
      this.getAllNotes()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 清除图片
  async clearImages ({ id, index }: { id: string, index: number }): Promise<void> {
    try {
      const res: Notes = await (this as any).$localForage.getItem(id)
      const note: Notes = cloneDeep(res)
      note.images?.splice(index, 1)
      await (this as any).$localForage.setItem(id, note)
      this.$message.success('清除成功')
      this.getAllNotes()
    } catch (e) {
      console.log(e.toString())
    }
  }

  // 处理清除全部事件
  handleAllClear (): void {
    this.$confirm('此操作将清除所有离线上传的文件，并且会影响到笔记内离线上传的图片, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.clearAllImages()
    }).catch(() => {})
  }

  // 处理清除事件
  handleClear ({ id, index }: { id: string, index: number }): void {
    this.$confirm('此操作将清除离线上传的文件，并且会影响到笔记内离线上传的图片, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      this.clearImages({ id, index })
    }).catch(() => {})
  }

  // 获取所有笔记
  async getAllNotes ():Promise<void> {
    try {
      const keys = await (this as any).$localForage.keys()
      // console.log('keys', keys)
      const list: Notes[] = []
      for (let i = 0; i < keys.length; i++) {
        const ele = keys[i]
        const res: Notes = await (this as any).$localForage.getItem(ele)
        list.push(res)
      }

      const notesList: Notes[] = cloneDeep(list)
      this.notes = notesList.sort((a: any, b: any) => b.update_time - a.update_time)
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

  // 复制方法
  copyFn ({ id, time }: { id: string, time: string}): void {
    if (id === this.$route.params.id) {
      this.copy(`${id}-${time}`)
    } else {
      this.$message.info('暂不支持使用其他笔记的离线图片')
    }
  }
}
</script>

<style lang="less" scoped>
.header-right_icon {
  width: 22px;
  height: 22px;
  margin: 0 10px;
}
.icon-ipfs {
  width: 22px;
  height: 22px;
  font-size: 22px;
  color: #5f6266;
  cursor: pointer;
}
.box-container {
  padding: 10px;
  color: #5f6266;
}
.box-title {
  font-size: 16px;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.box-item {
  margin: 10px 0;
  span {
    margin-right: 6px;
  }
  .icon-copy {
    cursor: pointer;
    margin-left: 6px;
  }
  a {
    color: #5f6266;
  }
}
.box-text {
  font-size: 14px;
}

.box-container-item {
  max-height: 500px;
  overflow: auto;
}
.item {
  display: flex;
  align-items: center;
  margin: 4px 0;
  border-bottom: 1px solid #f1f1f1;
}
.item-image {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.item-info {
  margin-left: 10px;
  span {
    word-break: break-word;
    white-space: normal;
    font-size: 14px;
    color: #5f6266;
  }
}
.item-icon {
  cursor: pointer;
  margin-left: auto;
  padding: 10px 20px;
}
</style>
