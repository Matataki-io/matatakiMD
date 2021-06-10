<template>
  <el-dropdown trigger="click" class="more-tooltip" @command="command => $emit('handleCommandMore', command)">
    <span class="more-icon">
      <i class="el-icon-more" />
    </span>
    <el-dropdown-menu slot="dropdown" class="dropdown-menu-container">
      <li class="dropdown-header">
        选项
      </li>
      <template v-if="$nuxt.isOnline">
        <el-dropdown-item v-if="isUser" icon="el-icon-upload" command="async-github">
          同步到 GitHub
        </el-dropdown-item>
        <el-dropdown-item icon="el-icon-upload" command="async-ipfs">
          推送到 IPFS
        </el-dropdown-item>
        <el-dropdown-item v-if="isUser" icon="el-icon-upload" command="async-matataki">
          推送到 Matataki
        </el-dropdown-item>
        <el-dropdown-item v-if="isUser" icon="el-icon-upload" command="preview-matataki">
          预览 (Matataki 功能)
        </el-dropdown-item>
      </template>

      <li class="divder" />
      <li class="dropdown-header">
        汇出
      </li>

      <el-dropdown-item icon="el-icon-download" command="save-file-md">
        导出 Markdown
      </el-dropdown-item>

      <li class="divder" />
      <li class="dropdown-header">
        汇入
      </li>
      <template v-if="$nuxt.isOnline">
        <el-dropdown-item v-if="isUser" icon="el-icon-upload2" command="posts-import">
          导入文章 (Matataki 功能)
        </el-dropdown-item>
      </template>

      <el-dropdown-item icon="el-icon-upload2" command="import-file-md" class="item-file-upload">
        <client-only>
          <file-upload
            ref="upload"
            v-model="filesMarkdown"
            input-id="import-file-md"
            accept="text/markdown"
            @input-filter="inputFilterMarkdown"
          >
            <div class="item-file-upload_name">
              导入 Markdown
            </div>
          </file-upload>
        </client-only>
      </el-dropdown-item>

      <li class="divder" />
      <li class="dropdown-header">
        数据
      </li>
      <el-dropdown-item icon="el-icon-download" command="save-user-data">
        导出用户数据
      </el-dropdown-item>
      <el-dropdown-item icon="el-icon-upload2" command="import-user-data" class="item-file-upload">
        <client-only>
          <file-upload
            ref="upload"
            v-model="files"
            input-id="import-user-data"
            accept="application/json"
            @input-filter="inputFilter"
          >
            <div class="item-file-upload_name">
              导入用户数据
            </div>
          </file-upload>
        </client-only>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Watch,
  Prop
} from 'nuxt-property-decorator'
import { isEmpty, assign } from 'lodash'
import { Notes } from '../../types/index.d'

let VueUploadComponent = null

if (process.client) {
  VueUploadComponent = require('vue-upload-component')
}

@Component({
  components: {
    FileUpload: VueUploadComponent
  }
})
export default class HeaderIpfs extends Vue {
  @Prop({
    type: Boolean,
    required: true
  })
  readonly isUser!: boolean

  files = [] // import user data file
  filesMarkdown = [] // import markdown file

  @Watch('files')
  onFilesChanged () {
    this.handleFilesChange(this.files)
  }

  @Watch('filesMarkdown')
  onFilesMarkdownChanged () {
    this.handleFilesMarkdownChange(this.filesMarkdown)
  }

  // files change
  handleFilesChange (files: File[]): void {
    console.log('files', files)

    if (files.length <= 0) {
      return
    }

    const fileData: any = files[0]
    if (isEmpty(fileData)) {
      console.log('fileData', fileData)
      return
    }

    const file = fileData.file
    const reader = new FileReader()
    reader.onload = (event: any) => {
      console.log('读取结果：', event)
      const result = event.target.result || event.currentTarget.result
      const data = JSON.parse(result)
      // console.log('data', data)
      this.importUserData(data)
    }
    reader.onerror = (event: any) => {
      console.log('event', event)
      this.$message.error('文件读取发生错误')
    }
    reader.readAsText(file)
  }

  // import user data
  importUserData (data: any): void {
    console.log('data', data)

    // 询问是否导入 并且展示会影响到的数据内容
    this.$confirm('该操作会覆盖本地的数据！是否导入？', '确认信息', {
      distinguishCancelAndClose: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    })
      .then(() => {
        this.mergedUserData(data.notes)
        this.$message({
          type: 'info',
          message: '保存修改'
        })
      })
      .catch(() => {})
  }

  // 合并用户数据
  async mergedUserData (list: Notes[]): Promise<void> {
    for (let i = 0; i < list.length; i++) {
      const ele: { [key: string]: any } = list[i]
      // console.log('ele', ele)
      const key: any = Object.keys(ele)
      try {
        const itemResult: Notes = await (this as any).$localForage.getItem(key) || {} as Notes
        const data = assign(itemResult, ele[key])
        await (this as any).$localForage.setItem(key, data)
      } catch (e) {
        console.log(e.toString())
      }
    }
  }

  // files markdown change
  handleFilesMarkdownChange (filesMarkdown: File[]): void {
    console.log('filesMarkdown', filesMarkdown)

    if (filesMarkdown.length <= 0) {
      return
    }

    const fileData: any = filesMarkdown[0]
    if (isEmpty(fileData)) {
      console.log('fileData', fileData)
      return
    }

    const file = fileData.file
    const reader = new FileReader()
    reader.onload = (event: any) => {
      console.log('读取结果：', event)
      const data: string = event.target.result || event.currentTarget.result
      // console.log('data', data)
      this.importMarkdown(data)
    }
    reader.onerror = (event: any) => {
      console.log('event', event)
      this.$message.error('文件读取发生错误')
    }
    reader.readAsText(file)
  }

  // import markdown
  importMarkdown (data: string): void {
    // 询问是否导入 并且展示会影响到的数据内容
    this.$confirm('该操作会覆盖内容！是否导入？', '确认信息', {
      distinguishCancelAndClose: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    })
      .then(() => {
        this.$emit('importMarkdown', data)
        this.$message({
          type: 'info',
          message: '保存修改'
        })
      })
      .catch(() => {})
  }

  /**
   * Pretreatment
   * @param  Object|undefined   newFile   读写
   * @param  Object|undefined   oldFile   只读
   * @param  Function           prevent   阻止回调
   * @return undefined
   */
  inputFilter (newFile: any, oldFile: any, prevent: Function) {
    if (newFile && !oldFile) {
      // 过滤不是图片后缀的文件
      if (!/\.(json)$/i.test(newFile.name)) {
        this.$message.warning('只能上传 JSON 文件！')
        return prevent()
      }
    }
  }

  /**
   * Pretreatment
   * @param  Object|undefined   newFile   读写
   * @param  Object|undefined   oldFile   只读
   * @param  Function           prevent   阻止回调
   * @return undefined
   */
  inputFilterMarkdown (newFile: any, oldFile: any, prevent: Function) {
    if (newFile && !oldFile) {
      // 过滤不是图片后缀的文件
      if (!/\.(md)$/i.test(newFile.name)) {
        this.$message.warning('只能上传 Markdown 文件！')
        return prevent()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.more-tooltip {
  .more-icon {
    padding: 0 20px;
    font-size: 22px;
    &:hover {
      color: #333;
    }
  }
}

.item-file-upload {
  display: flex;
  align-items: center;
}
.item-file-upload_name {
  margin-left: 4px;
}
.dropdown-header {
  color: #888;
  display: block;
  padding: 3px 20px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.42857143;
  white-space: nowrap;
  user-select: none;
}
.divder {
  height: 1px;
  margin: 10px 0;
  overflow: hidden;
  background-color: #e5e5e5;
  border-bottom: 1px solid #e3e3e3;
}
</style>
