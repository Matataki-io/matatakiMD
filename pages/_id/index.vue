<template>
  <div class="wrapper">
    <div class="header">
      <router-link to="/overview" class="navbar-title">
        <i class="fa fa-file-text" /><span class="hidden-xs"> MatatakiMD</span>
      </router-link>
      <div class="header-right">
        <HeaderIpfs :ipfs-list="ipfsList" />
        <HeaderMore :is-user="isUser" @handleCommandMore="handleCommandMore" @importMarkdown="val => markdownData = val" />
        <HeaderUser :is-user="isUser" :users-data="usersData" @handleCommand="handleCommand" />
      </div>
    </div>

    <AsyncGithub :visible.sync="dialogAsyncGithub" :markdown-data="markdownData" @pull="val => markdownData = val" />
    <PublishMatataki :visible.sync="dialogPublishMatataki" :markdown-data="markdownData" :users-data="usersData" />
    <ImportPosts :visible.sync="dialogImportMatataki" @import="val => markdownData = val" />

    <client-only>
      <mavon-editor
        ref="md"
        v-model="markdownData"
        :box-shadow="false"
        :autofocus="false"
        :placeholder="placeholder"
        :style="editorStyle"
        :encryption="encryption"
        :image-upload-fn="imageUploadFn"
        class="editor"
        image-upload-action="customize"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import { throttle, debounce, isEmpty, isArray, assign } from 'lodash'
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import moment from 'moment'
import HeaderIpfs from '@/components/id-page/header-ipfs.vue'
import HeaderMore from '@/components/id-page/header-more.vue'
import HeaderUser from '@/components/id-page/header-user.vue'
import ImportPosts from '@/components/import-posts.vue'
import PublishMatataki from '@/components/publish-matataki.vue'
import AsyncGithub from '@/components/async-github.vue'
import {
  userStats, upload, ipfsUpload
} from '../../api/index'
import '@matataki/editor/dist/css/index.css'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import fileDownload from '../../utils/markdown-download'
import { Notes, FleekIpfs, userProps } from '../../types/index.d'
import { generateTitle } from '../../utils/index'

let mavonEditor: any = {
  mavonEditor: null
}

if (process.client) {
  mavonEditor = require('@matataki/editor')
}

@Component({
  components: {
    'mavon-editor': mavonEditor.mavonEditor,
    HeaderIpfs,
    HeaderMore,
    HeaderUser,
    ImportPosts,
    PublishMatataki,
    AsyncGithub
  }
})
export default class Edidtor extends Vue {
  resizeEvent: any = null
  editorStyle: object = {}
  notes: Notes = {} as Notes
  usersData: userProps = {} as userProps
  markdownData: string = ''
  dialogAsyncGithub: boolean = false
  dialogPublishMatataki: boolean = false
  dialogImportMatataki: boolean = false
  token: string = ''
  placeholder= '# 在此输入标题\n\n请在笔记标题前方输入 #，空格后输入笔记标题\n\n现在就开始编辑笔记吧！'
  // 加密语法
  encryption= '\n\n[read hold="SYMBOL amount"]\n\n隐藏内容\n\n暂仅在Matataki上使用\n\n> [📔使用说明](https://www.yuque.com/matataki/matataki/giw9u4)\n\n[else]\n\n预览内容\n\n[/read]\n'
  ipfsUploadLoading = false

  get isUser () {
    return !isEmpty(this.usersData)
  }

  get ipfsList () {
    if (isEmpty(this.notes.ipfs)) {
      return []
    } else {
      return this.notes.ipfs
    }
  }

  @Watch('markdownData')
  // oldVal: string
  onMdChangeed (val: string) {
    this.asyncContent(val)
  }

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
      this.getContent()

      this.handleResizeEditor()
      this.resizeEvent = throttle(this.handleResizeEditor, 300)
      window.addEventListener('resize', this.resizeEvent)

      this.token = getCookie('access-token') || ''
      try {
        const usersDataStore = getCookie('users') || ''
        if (usersDataStore) {
          this.usersData = JSON.parse(usersDataStore)
        } else {
          this.userStatsFn()
        }
      } catch (e) {
        console.log('e', e)
      }
    }
  }

  async getContent (): Promise<void> {
    try {
      const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
      if (!isEmpty(res)) {
        this.notes = res
        this.markdownData = res.content
      }
    } catch (e) {
      console.log(e)
    }
  }

  asyncContent = debounce(async (val: string) => {
    try {
      console.log('val', val)
      const title = generateTitle('#previewContent h1')
      const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
      const data = assign(res, {
        title,
        content: val,
        update_time: Date.now()
      })

      console.log('data', data)

      await (this as any).$localForage.setItem(this.$route.params.id, data)
    } catch (e) {
      console.log(e)
    }
  }, 1000)

  handleResizeEditor (): void {
    try {
      const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
      // const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
      this.editorStyle = {
      // height: `${clientHeight - (clientWidth < 768 ? 47 : 60)}px`
        height: `${clientHeight - 50}px`
      }
    } catch (e) {
      console.log(e)
    }
  }

  async userStatsFn (): Promise<void> {
    const res: any = await userStats()
    if (res.code === 0) {
      setCookie('users', JSON.stringify(res.data), 1)
      this.usersData = res.data
    }
  }

  // 图片上传的回调方法
  async imageUploadFn (file: File) {
    try {
      const res: any = await upload(file)
      if (res.code === 0) {
        return `https://ssimg.frontenduse.top/${res.data}`
      } else {
        console.log(res.message)
        throw new Error('fail...')
      }
    } catch (e) {
      console.log(e)
      return 'fail...'
    }
  }

  ipfsHtmlTemp ({ title, content }: { title: string, content: string }) {
    const htmlTemp =
`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="apple-touch-icon" sizes="180x180" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
    <link rel="icon" type="image/png" sizes="32x32" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
    <link rel="icon" type="image/png" sizes="16x16" href="https://ssimg.frontenduse.top/material/matataki_logo.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <meta name="copyright" property="copyright" content="Copyright © 2018-2021 ANDOROMEDA TECH.ltd">
    <meta name="description" content="Matataki Editor">
    <meta name="keywords" content="Matataki Editor,仙女座科技,瞬MATATAKI,Fan票">

    <meta name="twitter:card" property="twitter:card" content="summary">
    <meta name="twitter:site" property="twitter:site" content="Matataki Editor">
    <meta name="twitter:title" property="twitter:title" content="Matataki Editor">
    <meta name="twitter:image" property="twitter:image" content="https://ssimg.frontenduse.top/material/matataki_logo.png">
    <meta name="twitter:description" property="twitter:description" content="Matataki Editor">

    <meta name="og:type" property="og:type" content="website">
    <meta name="og:site_name" property="og:site_name" content="Matataki Editor">
    <meta name="og:title" property="og:title" content="Matataki Editor">
    <meta name="og:image" property="og:image" content="https://ssimg.frontenduse.top/material/matataki_logo.png">
    <meta name="og:site_name" property="og:site_name" content="Matataki Editor">
    <meta name="og:description" property="og:description" content="Matataki Editor">

  <title>${title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/4.0.0/github-markdown.min.css">
  <style>
    .markdown-body {
      max-width: 860px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <article class="markdown-body">
    ${content}
  </article>
</body>
</html>`
    return htmlTemp
  }

  async ipfsUploadFn () {
    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    try {
      const title = generateTitle('#previewContent h1')
      const content = (document as any).querySelector('#previewContent').innerHTML

      this.ipfsUploadLoading = true

      const res: any = await ipfsUpload({
        title,
        content: this.ipfsHtmlTemp({ title, content })
      })

      if (res.code === 0) {
        this.$notify({
          title: '发布成功',
          message: res.data.publicUrl
        })

        const mdData: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
        let ipfs: FleekIpfs[] = []

        if (!isEmpty(mdData.ipfs)) {
          ipfs = isArray(mdData.ipfs) ? mdData.ipfs : [mdData.ipfs]
        }

        ipfs.push(res.data)

        const data = assign(mdData, {
          update_time: Date.now(),
          ipfs
        })
        await (this as any).$localForage.setItem(this.$route.params.id, data)

        await this.getContent()
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      this.ipfsUploadLoading = false
      loading.close()
    }
  }

  // 下载为 Markdown
  downloadMd () {
    try {
      const title = generateTitle('#previewContent h1')
      fileDownload({ content: this.markdownData, name: `${title}.md` })
    } catch (e) {
      this.$message.error(`下载失败：${e.toString()}`)
    }
  }

  // 保存用户数据
  async downloadUserData (): Promise<void> {
    try {
      const keys = await (this as any).$localForage.keys()
      const list = []
      for (let i = 0; i < keys.length; i++) {
        const ele = keys[i]
        const res = await (this as any).$localForage.getItem(ele)
        const key = res.id_str || ele // 用字符串 id
        list.push({
          [key]: res
        })
      }

      const time = moment().format('YYYY-MM-DD')
      fileDownload({
        content: JSON.stringify({
          notes: list
        }),
        name: `MatatakiMD-备份数据-${time}.json`
      })
    } catch (e) {
      this.$message.error(`下载失败：${e.toString()}`)
    }
  }

  // 用户下拉处理
  handleCommand (command: string) {
    if (command === 'user') {
      //
    } else if (command === 'signout') {
      this.signOut()
      // this.$router.push('/')
    }
  }

  // 更多下拉处理
  handleCommandMore (command: string) {
    if (command === 'async-github') {
      this.dialogAsyncGithub = !this.dialogAsyncGithub
    } else if (command === 'async-ipfs') {
      this.ipfsUploadFn()
    } else if (command === 'async-matataki') {
      this.dialogPublishMatataki = true
    } else if (command === 'posts-import') {
      this.dialogImportMatataki = true
    } else if (command === 'save-file-md') {
      this.downloadMd()
    } else if (command === 'save-user-data') {
      this.downloadUserData()
    }
  }

  // 退出登录
  signOut () {
    removeCookie('access-token')
    removeCookie('users-github')
    removeCookie('users')
    this.usersData = {} as userProps
  }
}
</script>

<style lang="less" scoped src="./index.less"></style>
<style lang="less" scoped>
.wrapper {
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
  background-color: #fff;
  text-align: left;
}
.editor {
  width: 100%;
}

.header {
  height: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  // box-shadow: 0 2px 10px  rgba(0, 0, 0, .05);
  box-sizing: border-box;
  border-bottom: 1px solid #e7e7e7;
  background-color: #f8f8f8;
}
.navbar-title {
  font-size: 20px;
  font-weight: bold;
  color: #777;
  text-decoration: none;
}
.header-right {
  display: flex;
  align-items: center;
}

</style>
