<template>
  <el-dialog
    title="导入文章"
    :visible.sync="dialogImportMatataki"
    :close-on-click-modal="false"
    width="600px"
  >
    <div>
      <p>基于 Matataki 的导入文章功能</p>
      <div style="margin: 20px 0;">
        <el-input v-model="dialogImportMatatakiInput" placeholder="请输入文章地址" />
      </div>
      <div>
        <el-button size="small" @click="dialogImportMatataki = false">
          取消
        </el-button>
        <el-button v-loading="dialogImportMatatakiLoading" size="small" type="primary" @click="handlePostsImport">
          导入
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  PropSync
} from 'nuxt-property-decorator'
import {
  postsImport
} from '../api/index'

@Component({})
export default class HeaderIpfs extends Vue {
  @PropSync('visible', { type: Boolean, required: true })
  dialogImportMatataki!: boolean

  dialogImportMatatakiInput: string = ''
  dialogImportMatatakiLoading: boolean = false

  // 导入文章处理
  async handlePostsImport (): Promise<void> {
    try {
      this.dialogImportMatatakiLoading = true

      if (!this.dialogImportMatatakiInput) {
        this.$message.warning('URL 不能为空')
        return
      }

      const res = await postsImport({ url: this.dialogImportMatatakiInput })
      // console.log('res', res)
      if (res.code === 0) {
        this.$emit('import', res.data.content)
        this.$message.success('导入成功')
        this.dialogImportMatataki = false
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      this.dialogImportMatatakiLoading = false
    }
  }
}
</script>
