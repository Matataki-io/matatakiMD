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

    <el-dialog
      title="同步到 GitHub"
      :visible.sync="dialogAsyncGithub"
      width="600px"
      custom-class="async-giithub"
    >
      <div>
        <!-- <div v-loading="githubLoading" class="async-github-loading" /> -->
        <div v-if="isUserGithub">
          <el-button size="small" @click="toggleMode('push')">
            推送至 GitHub
          </el-button>
          <el-button size="small" @click="toggleMode('pull')">
            从 GitHub 拉取
          </el-button>
          <a class="more" href="https://matataki.io/" target="_blank">了解更多</a>
        </div>
        <a v-else ref="noopener noreferrer" :href="matatakiUrl" target="_blank" class="user-github-link">
          Bind Github (Matataki 需要綁定 Github 賬號)
        </a>
      </div>
      <el-form
        v-if="asyncGithubFormMode === 'push'"
        ref="asyncGithubFormPush"
        :model="asyncGithubFormPush"
        :rules="asyncGithubFormRules"
        label-width="80px"
        class="async-github-form"
      >
        <el-form-item label="Repo" prop="repos">
          <el-select v-model="asyncGithubFormPush.repos" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Repo" @change="handleChangeRepos">
            <el-option v-for="(item, idx) of repos" :key="idx" :value="item.full_name" :label="`${item.full_name}${item.private ? '(private)' : ''}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="Branch" prop="branches">
          <el-select v-model="asyncGithubFormPush.branches" style="width: 100%" placeholder="请选择 Branches" disabled>
            <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-select v-model="asyncGithubFormPush.path" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Path">
            <el-option v-for="(item, idx) of path" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Commit" prop="commit">
          <el-input v-model="asyncGithubFormPush.commit" type="textarea" placeholder="请输入 Commit(可选)" />
        </el-form-item>
        <el-form-item>
          <el-button v-loading="githubUploadLoading" size="small" type="primary" @click="submitAsyncGithubForm('asyncGithubFormPush')">
            确定
          </el-button>
          <a v-if="asyncGithubFormPush.repos" target="_blank" rel="noopener noreferrer" :href="`https://github.com/${asyncGithubFormPush.repos}`">
            <el-button size="small">
              View Repo
            </el-button>
          </a>
        </el-form-item>
      </el-form>

      <el-form
        v-if="asyncGithubFormMode === 'pull'"
        ref="asyncGithubFormPull"
        :model="asyncGithubFormPull"
        :rules="asyncGithubFormRules"
        label-width="80px"
        class="async-github-form"
      >
        <el-form-item label="Repo" prop="repos">
          <el-select v-model="asyncGithubFormPull.repos" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Repo" @change="handleChangeRepos">
            <el-option v-for="(item, idx) of repos" :key="idx" :value="item.full_name" :label="`${item.full_name}${item.private ? '(private)' : ''}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="Branch" prop="branches">
          <el-select v-model="asyncGithubFormPull.branches" style="width: 100%" placeholder="请选择 Branches" disabled>
            <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-select v-model="asyncGithubFormPull.path" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Path">
            <el-option v-for="(item, idx) of path" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="githubUploadLoading" size="small" type="primary" @click="submitAsyncGithubForm('asyncGithubFormPull')">
            确定
          </el-button>
          <a v-if="asyncGithubFormPull.repos" target="_blank" rel="noopener noreferrer" :href="`https://github.com/${asyncGithubFormPull.repos}`">
            <el-button size="small">
              View Repo
            </el-button>
          </a>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="发布到 Matataki"
      :visible.sync="dialogPublishMatataki"
      width="600px"
    >
      <el-form
        ref="publishMatatakiForm"
        class="publish-matataki_form"
        :model="publishMatatakiForm"
        :rules="publishMatatakiFormRules"
      >
        <el-form-item label="標題" prop="title">
          <el-input v-model="publishMatatakiForm.title" placeholder="请输入標題" />
        </el-form-item>
        <el-form-item label="摘要" prop="shortContent">
          <el-input
            v-model="publishMatatakiForm.shortContent"
            type="textarea"
            :rows="6"
            placeholder="请输入摘要"
          />
        </el-form-item>
        <div>
          <client-only>
            <vue-hcaptcha
              v-if="!doINeedHCaptcha"
              ref="hcaptchaRef"
              :sitekey="hCaptchaSiteKey"
              language="zh"
              @verify="onCaptchaVerify"
              @expired="onExpire"
              @error="onError"
              @reset="onCaptchaReset"
            />
          </client-only>
        </div>
        <el-form-item>
          <el-button v-loading="mtkUploadLoading" :disabled="isCaptchaOK" size="small" type="primary" @click="submitPublishMatatakiForm('publishMatatakiForm')">
            发布
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="導入文章"
      :visible.sync="dialogImportMatataki"
      width="600px"
    >
      <div>
        <p>基於 Matataki 的導入文章功能</p>
        <div style="margin: 20px 0;">
          <el-input v-model="dialogImportMatatakiInput" placeholder="請輸入文章地址" />
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
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import moment from 'moment'
import HeaderIpfs from '@/components/id-page/header-ipfs.vue'
import HeaderMore from '@/components/id-page/header-more.vue'
import HeaderUser from '@/components/id-page/header-user.vue'
import {
  push, pull, users,
  userStats, postPublish, usersRepos,
  reposBranches, reposContentsList, upload,
  ipfsUpload, getDoINeedHCaptcha, postsImport
} from '../../api/index'
import '@matataki/editor/dist/css/index.css'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import fileDownload from '../../utils/markdown-download'
import { setOAuthRedirectUri } from '../../api/developer'
import { hCaptchaDataProps, Notes, FleekIpfs } from '../../types/index.d'

interface reposBranchesFnProps {
  owner: string
  repo: string
}
interface reposContentsListProps {
  owner: string
  repo: string
}

interface userProps {
  avatar: string
  id: number
  nickname: string
  platform: string
  username: string
}

let mavonEditor: any = {
  mavonEditor: null
}

if (process.client) {
  mavonEditor = require('@matataki/editor')
}

@Component({
  components: {
    'mavon-editor': mavonEditor.mavonEditor,
    VueHcaptcha,
    HeaderIpfs,
    HeaderMore,
    HeaderUser
  }
})
export default class Edidtor extends Vue {
  resizeEvent: any = null
  editorStyle: object = {}
  notes: Notes = {} as Notes
  markdownData: string = ''
  dialogAsyncGithub: boolean = false
  dialogPublishMatataki: boolean = false
  dialogImportMatataki: boolean = false
  dialogImportMatatakiInput: string = ''
  dialogImportMatatakiLoading: boolean = false
  token: string = ''
  usersData: userProps = {} as userProps
  usersGithubData: object = {}
  asyncGithubFormMode: string = '' // push pull
  repos: Array<object> = []
  branches= []
  path= []
  placeholder= '# 在此输入标题\n\n请在笔记标题前方输入 #，空格后输入笔记标题\n\n现在就开始编辑笔记吧！'
  // 加密语法
  encryption= '\n\n[read hold="SYMBOL amount"]\n\n隐藏内容\n\n暂仅在Matataki上使用\n\n> [📔使用说明](https://www.yuque.com/matataki/matataki/giw9u4)\n\n[else]\n\n预览内容\n\n[/read]\n'

  asyncGithubFormPush = {
    repos: '',
    branches: '',
    path: '',
    commit: ''
  }

  asyncGithubFormPull = {
    repos: '',
    branches: '',
    path: ''
  }

  publishMatatakiForm = {
    title: '',
    shortContent: ''
  }

  publishMatatakiFormRules = {
    title: [
      { required: true, message: '请输入標題', trigger: 'blur' }
    ],
    shortContent: [
      { required: true, message: '请输入摘要', trigger: 'blur' }
    ]
  }

  ipfsUploadLoading = false
  mtkUploadLoading = false
  githubUploadLoading = false
  githubLoading = false

  doINeedHCaptcha = true
  hCaptchaData: hCaptchaDataProps = {
    expired: false,
    token: '',
    eKey: '',
    error: ''
  }

  get asyncGithubFormRules () {
    if (this.asyncGithubFormMode === 'push') {
      return {
        repos: [
          { required: true, message: '请选择 Repo', trigger: 'change' }
        ],
        branches: [
          { required: true, message: '请选择 Branches', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请选择 Path', trigger: 'change' }
        ]
      }
    } else if (this.asyncGithubFormMode === 'pull') {
      return {
        repos: [
          { required: true, message: '请选择 Repo', trigger: 'change' }
        ],
        branches: [
          { required: true, message: '请选择 Branches', trigger: 'change' }
        ],
        path: [
          { required: true, message: '请选择 Path', trigger: 'change' }
        ]
      }
    } else {
      return {}
    }
  }

  get isUser () {
    return !isEmpty(this.usersData)
  }

  get matatakiUrl () {
    if (process.client) {
      return process.env.APP_MATATAKI_URL
    } else {
      return ''
    }
  }

  get isUserGithub () {
    return !isEmpty(this.usersGithubData)
  }

  get hCaptchaSiteKey () {
    if (process.client) {
      return process.env.VUE_APP_HCAPTCHA_SITE_KEY
    } else {
      return ''
    }
  }

  get isCaptchaOK () {
    // 如果是白名单
    if (this.doINeedHCaptcha) { return false }

    if ((!this.hCaptchaData.expired) && !!(this.hCaptchaData.token)) {
      return false
    } else {
      return true
    }
  }

  get ipfsList () {
    if (isEmpty(this.notes.ipfs)) {
      return []
    } else {
      return this.notes.ipfs
    }
  }

  @Watch('dialogAsyncGithub')
  onDialogAsyncGithubChangeed (val: boolean) {
    if (!val) {
      if (this.asyncGithubFormMode === 'push') {
        this.resetForm('asyncGithubFormPush')
      } else if (this.asyncGithubFormMode === 'pull') {
        this.resetForm('asyncGithubFormPull')
      }

      this.asyncGithubFormMode = ''
    }
  }

  @Watch('markdownData')
  // oldVal: string
  onMdChangeed (val: string) {
    this.asyncContent(val)
  }

  @Watch('dialogPublishMatataki')
  onDialogPublishMatatakiChangeed (val: boolean) {
    this.onCaptchaReset()
    if (process.client) {
      if (this.$refs.hcaptchaRef && !val) {
        (this.$refs.hcaptchaRef as any).reset()
      }
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

      try {
        const usersDataStore = getCookie('users-github') || ''
        if (usersDataStore) {
          this.usersGithubData = JSON.parse(usersDataStore)
        } else {
          this.usersFn()
        }
      } catch (e) {
        console.log('e', e)
      }

      this.doINeedHCaptchaFn()
    }
  }

  async jumpToMttkOAuth () {
    try {
      console.log('from', location)
      await setOAuthRedirectUri(location.pathname)
    } catch (error) {
      console.log('error', error)
    }
    (window as any).location = process.env.REACT_APP_OAuthUrl
  };

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
      const title = this.generateTitle()
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

  async handPushEvent (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在推送...',
      duration: 0
    })

    try {
      console.log(this.asyncGithubFormPush)

      this.githubUploadLoading = true
      const [owner, repo] = this.asyncGithubFormPush.repos.split('/')
      const res: any = await push({
        contents: this.markdownData,
        owner,
        path: this.asyncGithubFormPush.path,
        branch: this.asyncGithubFormPush.branches,
        repo,
        commit: this.asyncGithubFormPush.commit
      })
      if (res.code === 0) {
        this.$message.success('推送成功')
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      this.$message.error(`推送失败: ${e.toString()}`)
    } finally {
      this.githubUploadLoading = false
      loading.close()
    }
  }

  async handPullEvent (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在拉取...',
      duration: 0
    })

    try {
      this.githubUploadLoading = true

      const [owner, repo] = this.asyncGithubFormPull.repos.split('/')

      const res: any = await pull({
        owner,
        path: this.asyncGithubFormPull.path,
        branch: this.asyncGithubFormPull.branches,
        repo
      })
      if (res.code === 0) {
        this.$message.success('拉取成功')
        this.markdownData = res.data.content
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      this.$message.error(`拉取失败: ${e.toString()}`)
    } finally {
      this.githubUploadLoading = false
      loading.close()
    }
  }

  async userStatsFn (): Promise<void> {
    const res: any = await userStats()
    if (res.code === 0) {
      setCookie('users', JSON.stringify(res.data), 1)
      this.usersData = res.data
    }
  }

  async usersFn (): Promise<void> {
    const res: any = await users()
    if (res.code === 0) {
      setCookie('users-github', JSON.stringify(res.data), 1)
      this.usersGithubData = res.data
    }
  }

  async usersReposFn (): Promise<void> {
    this.githubLoading = true
    try {
      const res: any = await usersRepos({
        username: (this as any).usersGithubData.login
      })
      if (res.code === 0) {
        this.repos = res.data
        this.asyncGithubFormPush.repos = res.data[0].full_name
        this.asyncGithubFormPull.repos = res.data[0].full_name

        const [owner, repo] = (res.data[0].full_name).split('/')
        this.reposBranchesFn({
          owner,
          repo
        })
      }
    } catch (e) {
      console.warn(e.toString())
    } finally {
      this.githubLoading = false
    }
  }

  async reposBranchesFn ({ owner, repo }: reposBranchesFnProps): Promise<void> {
    this.githubLoading = true

    try {
      const res: any = await reposBranches({
        owner,
        repo
      })
      if (res.code === 0) {
        this.branches = res.data
        this.asyncGithubFormPush.branches = res.data[0].name
        this.asyncGithubFormPull.branches = res.data[0].name

        this.reposContentsListFn({
          owner,
          repo
        })
      }
    } catch (e) {
      console.warn(e)
    } finally {
      this.githubLoading = false
    }
  }

  async reposContentsListFn ({ owner, repo }: reposContentsListProps): Promise<void> {
    this.githubLoading = true

    try {
      const res: any = await reposContentsList({
        owner,
        repo
      })
      if (res.code === 0) {
        this.path = res.data
        this.asyncGithubFormPush.path = res.data[0].name
        this.asyncGithubFormPull.path = res.data[0].name
      }
    } catch (e) {
      console.warn(e.toString())
    } finally {
      this.githubLoading = false
    }
  }

  handleChangeRepos (e: any) {
    console.log('item', e)
    const [owner, repo] = e.split('/')
    this.reposBranchesFn({
      owner,
      repo
    })
  }

  toggleMode (mode: string) {
    this.asyncGithubFormMode = mode
    if (!this.repos.length) { // 暂时减少请求
      this.usersReposFn()
    }
  }

  submitAsyncGithubForm (formName: string) {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        if (this.asyncGithubFormMode === 'push') {
          this.handPushEvent()
        } else if (this.asyncGithubFormMode === 'pull') {
          this.handPullEvent()
        } else {
          this.$message('other submit')
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  resetForm (formName: string) {
    (this as any).$refs[formName].resetFields()
  }

  submitPublishMatatakiForm (formName: string) {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        this.postPublishFn()
      } else {
        console.log('error submit!!')
        return false
      }
    })
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
      const title = this.generateTitle()
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

  // 生成简介
  generateShortContent (): string {
    try {
      const dom: any = document.querySelectorAll('#previewContent p') // 有些导入的文章是 Section 等标签包裹的，所以选择所有 P
      const domList = [...dom].filter(i => !!(i.innerText.trim())) // 过滤一些没有内容的
      const str = domList.reduce((t, c) => {
        return `${t} ${c.innerText}`
      }, '')
      // console.log(str)
      return (str.trim()).slice(0, 300)
    } catch (e) {
      console.log('e', e.toString())
      return '...'
    }
  }

  // 生成标题
  generateTitle (): string {
    try {
      const titleDom = (document as any).querySelector('#previewContent h1')
      return titleDom ? titleDom.innerText : 'Untitled'
    } catch (e) {
      console.log(e.toString())
      return 'Untitled'
    }
  }

  // 发布到 Matataki
  async postPublishFn (): Promise<void> {
    if (!this.publishMatatakiForm.title || !this.publishMatatakiForm.shortContent) {
      this.$message.warning('標題和摘要不能為空！')
      return
    }

    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    try {
      this.mtkUploadLoading = true

      const res: any = await postPublish({
        title: this.publishMatatakiForm.title,
        content: this.markdownData,
        shortContent: this.publishMatatakiForm.shortContent,
        platform: this.usersData.platform,
        author: this.usersData.username || this.usersData.nickname,
        hCaptchaData: this.hCaptchaData
      })
      console.log('res', res)
      if (res.code === 0) {
        this.$notify({
          title: '提示',
          message: `url:${process.env.APP_MATATAKI_URL}/p/${res.data}`
        })
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      this.mtkUploadLoading = false
      loading.close()
    }
  }

  // 下载为 Markdown
  downloadMd () {
    try {
      const title = this.generateTitle()
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
      const title = this.generateTitle()
      const _shortContent = this.generateShortContent()

      console.log('_shortContent', _shortContent)

      this.publishMatatakiForm = {
        title,
        shortContent: _shortContent
      }

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

  onCaptchaVerify (token: string, eKey: string) {
    this.hCaptchaData = { token, eKey, expired: false, error: '' }
  }

  onExpire () {
    this.hCaptchaData = { token: '', eKey: '', expired: true, error: 'current token expires.' }
  }

  onError (e: any) {
    this.hCaptchaData = { token: '', eKey: '', expired: true, error: e }
    console.error('captcha error: ', e)
  }

  // 当hCaptcha状态重置时，重置hCaptchaData对象的值
  onCaptchaReset () {
    this.hCaptchaData = {
      expired: false,
      token: '',
      eKey: '',
      error: ''
    }
  }

  async doINeedHCaptchaFn () {
    try {
      const res: any = await getDoINeedHCaptcha()
      if (res.code === 0) {
        this.doINeedHCaptcha = res.data.isInWhiteList
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e.toString())
    }
  }

  async handlePostsImport () {
    try {
      this.dialogImportMatatakiLoading = true

      if (!this.dialogImportMatatakiInput) {
        this.$message.warning('URL 不能為空')
        return
      }

      const res: any = await postsImport({ url: this.dialogImportMatatakiInput })
      // console.log('res', res)
      if (res.code === 0) {
        this.markdownData = res.data.content
        this.dialogImportMatataki = false
        this.$message.success('導入成功')
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

.async-github-form {
  margin-top: 20px;
}
.user-github-link {
  font-size: 14px;
  color: #606266;
  text-decoration: underline;
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

.more {
  margin-left: 10px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
.async-github {
  position: relative;
}
.publish-matataki_form {
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
}
.async-github-loading {
  position: absolute;
  right: 60px;
  bottom: 40px;
}
</style>
