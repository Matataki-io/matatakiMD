<template>
  <div class="wrapper">
    <div class="header">
      <router-link to="/overview" class="navbar-title">
        <i class="fa fa-file-text" /><span class="hidden-xs"> MatatakiMD</span>
      </router-link>
      <div class="header-right">
        <UploadImagesBtn @uploadAll="handleUploadOfflineImages" />
        <HeaderImages />
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
import { throttle, debounce, isEmpty, isArray, assign, cloneDeep } from 'lodash'
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import moment from 'moment'
import HeaderIpfs from '@/components/id-page/header-ipfs.vue'
import HeaderMore from '@/components/id-page/header-more.vue'
import HeaderUser from '@/components/id-page/header-user.vue'
import HeaderImages from '@/components/id-page/header-images.vue'
import UploadImagesBtn from '@/components/id-page/header-upload-images-btn.vue'
import ImportPosts from '@/components/import-posts.vue'
import PublishMatataki from '@/components/publish-matataki.vue'
import AsyncGithub from '@/components/async-github.vue'
import {
  userStats, upload, ipfsUpload,
  draftSave, preview
} from '../../api/index'
import '@matataki/editor/dist/css/index.css'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import fileDownload from '../../utils/markdown-download'
import { Notes, FleekIpfs, userProps, NotesImages } from '../../types/index.d'
import { generateTitle, ipfsHtmlTemp, generateShortContent, fileToBase64, base64ToFile, isOfflineUploadImages } from '../../utils/index'

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
    HeaderImages,
    UploadImagesBtn,
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
  offlineUploadLoading = false
  saveOfflineUploadImagesChecked = false

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
  onMdChangeed (val: string) {
    this.asyncContent(val)
  }

  @Watch('$nuxt.isOffline')
  onNuxtOfflineChangeed (val: boolean) {
    if (val) {
      this.hideOfflineUploadImage()
    }
  }

  @Watch('$nuxt.isOnline')
  onNuxtOnlineChangeed (val: boolean) {
    if (val) {
      this.processOfflineUploadImage()
    }
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

      this.$nextTick(async () => {
        await this.processOfflineImage()
        await this.processOfflineUploadImage()
      })
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

  // 获取用户信息
  async userStatsFn (): Promise<void> {
    const res = await userStats()
    if (res.code === 0) {
      setCookie('users', JSON.stringify(res.data), 1)
      this.usersData = res.data
    }
  }

  async uploadFn (file: File): Promise<string|false> {
    try {
      const res = await upload(file)
      if (res.code === 0) {
        return `${process.env.APP_SSIMG}${res.data}`
      } else {
        console.log(res.message)
        throw new Error('fail...')
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }

  // 图片上传的回调方法
  async imageUploadFn (file: File): Promise<string> {
    if (this.$nuxt.isOnline) {
      const url = await this.uploadFn(file)
      return url || 'fail...'
    } else {
      // console.log('file', file)
      const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
      const resData = cloneDeep(res)
      const base64 = await fileToBase64(file)
      const time = Date.now()
      if (isEmpty(resData.images)) {
        resData.images = []
      }
      if (resData.images) {
        resData.images.push({
          name: file.name,
          type: file.type,
          size: file.size,
          base64,
          time
        })
      }

      await (this as any).$localForage.setItem(this.$route.params.id, resData)

      // id-time
      return `${this.$route.params.id}-${time}`
    }
  }

  // ipfs 上传
  async ipfsUploadFn (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    try {
      const title = generateTitle('#previewContent h1')
      const content = (document as any).querySelector('#previewContent').innerHTML

      this.ipfsUploadLoading = true

      const res = await ipfsUpload({
        title,
        content: ipfsHtmlTemp({ title, content })
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

  // 处理发布到 IPFS 事件
  handleUploadIpfs (): void {
    if (isOfflineUploadImages()) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null as any, [
          h('p', null as any, '文垱内有离线上传的图片！是否继续？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.ipfsUploadFn()
      })
    } else {
      this.ipfsUploadFn()
    }
  }

  // 处理发布到 Matataki 事件
  handleUploadMatataki (): void {
    if (isOfflineUploadImages()) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null as any, [
          h('p', null as any, '文垱内有离线上传的图片！是否继续？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.dialogPublishMatataki = true
      })
    } else {
      this.dialogPublishMatataki = true
    }
  }

  // 下载为 Markdown
  downloadMd (): void {
    try {
      const title = generateTitle('#previewContent h1')
      fileDownload({ content: this.markdownData, name: `${title}.md` })
    } catch (e) {
      this.$message.error(`下载失败：${e.toString()}`)
    }
  }

  // 处理保存文件为 Markdown 事件
  handleSaveFileMd (): void {
    if (isOfflineUploadImages()) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null as any, [
          h('p', null as any, '文垱内有离线上传的图片！是否继续？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.downloadMd()
      })
    } else {
      this.downloadMd()
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

        if (!this.saveOfflineUploadImagesChecked) {
          delete res.images
        }

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

  // 处理保存用户数据事件
  handleSaveUserData (): void {
    const h = this.$createElement
    const self = this
    this.$msgbox({
      title: '提示',
      message: h('div', null as any, [
        h('p', null as any, '该操作将会下载用户所有数据！是否继续？'),
        h('div', { style: { margin: '10px 0 0 0' } }, [
          h('el-checkbox', {
            domProps: {
              value: self.saveOfflineUploadImagesChecked
            },
            on: {
              input (value: boolean) {
                self.saveOfflineUploadImagesChecked = value
              }
            }
          }, '保存离线上传图片数据')
        ])
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      this.downloadUserData()
    })
  }

  // 预览方法
  async previewFn (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    const title = generateTitle('#previewContent h1')
    const _shortContent = generateShortContent('#previewContent p')

    try {
      const draftSaveResult = await draftSave({
        title,
        content: this.markdownData,
        shortContent: _shortContent
      })

      if (draftSaveResult.code !== 0) {
        throw new Error(draftSaveResult.message)
      }

      const previewResult = await preview({ id: draftSaveResult.data })

      if (previewResult.code === 0) {
        this.$notify({
          title: '发布成功',
          message: `Preview: ${process.env.APP_MATATAKI_URL}/preview/${draftSaveResult.data}`
        })
      } else {
        throw new Error(previewResult.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      loading.close()
    }
  }

  // 确认预览框
  handleConfirmPreview (): void {
    if (isOfflineUploadImages()) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('div', null as any, [
          h('p', null as any, '文垱内有离线上传的图片！是否继续？'),
          h('p', null as any, '该操作会在 Matataki 生成一篇草稿！是否继续？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.downloadMd()
      })
    } else {
      this.$confirm('该操作会在 Matataki 生成一篇草稿！是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.previewFn()
      }).catch(() => {})
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
      this.handleUploadIpfs()
    } else if (command === 'async-matataki') {
      this.handleUploadMatataki()
    } else if (command === 'preview-matataki') {
      this.handleConfirmPreview()
    } else if (command === 'posts-import') {
      this.dialogImportMatataki = true
    } else if (command === 'save-file-md') {
      this.handleSaveFileMd()
    } else if (command === 'save-user-data') {
      this.handleSaveUserData()
    }
  }

  // 处理离线上传图片 用 base64 替换
  async processOfflineImage () {
    const imgList = document.querySelectorAll<HTMLImageElement>('#previewContent img')
    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
    const images: NotesImages[] = res.images || ([] as NotesImages[])

    imgList.forEach((el: HTMLImageElement) => {
      const imgSrc = el.src

      // 如果是 cdn 图片 不处理
      // 其他图片会在 filter 过滤掉
      if (imgSrc.includes(process.env.APP_SSIMG as string)) {
        return
      }

      // noteId-time to id、time
      const [noteId, time] = imgSrc.split('-')
      const imageData: NotesImages[] = images.filter((i: NotesImages) => Number(i.time) === Number(time))
      if (!isEmpty(imageData)) {
        const { base64 } = imageData[0]
        const id = noteId.replace(`${window.location.origin}/`, '')

        el.src = (base64 as string)
        el.setAttribute('data-id', id)
        el.setAttribute('data-time', time)
      }
    })
  }

  // 处理离线上传按钮事件
  async processOfflineImageButtonEvent ({ id, time }: { id: string, time: number }): Promise<void> {
    if (this.$nuxt.isOffline) {
      this.$message.info('离线状态下不可上传')
      return
    }

    if (this.offlineUploadLoading) {
      this.$message.info('上一个上传图片任务未完成')
      return
    }

    const res: Notes = await (this as any).$localForage.getItem(id)
    const images: NotesImages[] = res.images || ([] as NotesImages[])
    const imageData: NotesImages[] = images.filter((i: NotesImages) => Number(i.time) === Number(time))

    if (isEmpty(imageData)) {
      this.$message.warning('没有图片信息！')
      return
    }

    const { base64, name, type } = imageData[0]
    let file = null
    try {
      file = await base64ToFile(base64 as string, name, type)
    } catch (e) {
      console.log(e)
    }

    if (!file) {
      this.$message.warning('转换图片文件失败')
      return
    }

    const loading = this.$notify({
      title: '提示',
      message: 'Uploading...',
      duration: 0
    })
    this.offlineUploadLoading = true
    const url = await this.uploadFn(file)
    this.offlineUploadLoading = false
    loading.close()

    if (url) {
      this.$message.success('Upload success')
      const content = this.markdownData.replace(`${id}-${time}`, url)
      this.markdownData = content
    } else {
      this.$message.error('Upload fail!')
    }
  }

  // 隐藏离线上传按钮
  hideOfflineUploadImage () {
    const btnList = document.querySelectorAll<HTMLImageElement>('#previewContent .upload-image-btn')
    btnList.forEach((el: HTMLImageElement) => {
      el.remove()
    })
  }

  // 处理离线上传按钮
  processOfflineUploadImage () {
    if (this.$nuxt.isOffline) {
      console.log('离线不需要渲染离线上传按钮')
      return
    }

    const imgList = document.querySelectorAll<HTMLImageElement>('#previewContent img[data-time]')
    imgList.forEach((el: HTMLImageElement) => {
      const time = el.getAttribute('data-time')
      // const id = el.getAttribute('data-id')

      if (time) {
        const btn = document.createElement('button')
        btn.innerText = 'Upload'
        btn.className = 'upload-image-btn'
        btn.addEventListener('click', () => {
          this.$confirm('上传离线图片, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.processOfflineImageButtonEvent({ id: this.$route.params.id, time: Number(time) || 0 })
          }).catch(() => {})
        }, false)
        el.parentNode?.appendChild(btn)
      }
    })
  }

  // 处理上传所有离线图片
  async handleUploadOfflineImages (): Promise<void> {
    const list = document.querySelectorAll<HTMLImageElement>('#previewContent img[data-time]')
    for (let i = 0; i < list.length; i++) {
      const el: HTMLElement = list[i]
      const time: string = el.getAttribute('data-time') || ''
      await this.processOfflineImageButtonEvent({ id: this.$route.params.id, time: Number(time) || 0 })
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

<style lang="less">
.upload-image-btn {
  padding: 10px 20px;
  border: 1px solid #878787;
  background: transparent;
  font-size: 14px;
  border-radius: 0;
  cursor: pointer;
  outline: none;
  display: block;
}
</style>
