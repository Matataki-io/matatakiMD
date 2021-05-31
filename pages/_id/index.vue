<template>
  <div class="wrapper">
    <div class="header">
      <router-link to="/overview" class="navbar-title">
        <i class="fa fa-file-text" /><span class="hidden-xs"> MatatakiMD</span>
      </router-link>
      <div v-if="isUser" class="user">
        <el-button type="primary" size="small" @click="downloadMd">
          导出 Markdown
        </el-button>
        <el-button v-loading="mtkUploadLoading" type="primary" size="small" @click="postPublishFn">
          同步到 Matataki
        </el-button>
        <el-button v-loading="ipfsUploadLoading" type="primary" size="small" @click="ipfsUploadFn">
          同步到 IPFS
        </el-button>
        <el-button type="primary" size="small" @click="dialogAsyncGithub = !dialogAsyncGithub">
          同步到 GitHub
        </el-button>

        <el-dropdown trigger="click" class="user-tooltip" @command="handleCommand">
          <el-tooltip effect="dark" :content="usersData.nickname || usersData.username" placement="bottom">
            <el-avatar :src="`https://ssimg.frontenduse.top/${usersData.avatar}`" :size="30" />
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="user">
              <a ref="noopener noreferrer" :href="`${matatakiUrl}/user/${usersData.id}`" target="_blank" class="user-item">个人主页</a>
            </el-dropdown-item>
            <el-dropdown-item divided command="signout">
              登出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-else class="user">
        <div class="user-not-logged" @click="jumpToMttkOAuth">
          登入
        </div>
      </div>
    </div>

    <el-dialog
      title="同步到 GitHub"
      :visible.sync="dialogAsyncGithub"
      width="600px"
    >
      <div>
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
          Bind Github
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
          <el-select v-model="asyncGithubFormPush.repos" style="width: 100%" placeholder="请选择 Repo" @change="handleChangeRepos">
            <el-option v-for="(item, idx) of repos" :key="idx" :value="item.full_name" :label="`${item.full_name}${item.private ? '(private)' : ''}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="Branch" prop="branches">
          <el-select v-model="asyncGithubFormPush.branches" style="width: 100%" placeholder="请选择 Branches">
            <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-select v-model="asyncGithubFormPush.path" style="width: 100%" placeholder="请选择 Path">
            <el-option v-for="(item, idx) of path" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Commit" prop="commit">
          <el-input v-model="asyncGithubFormPush.commit" type="textarea" placeholder="请输入 Commit(可选)" />
        </el-form-item>
        <el-form-item>
          <el-button v-loading="githubUploadLoading" type="primary" @click="submitAsyncGithubForm('asyncGithubFormPush')">
            确定
          </el-button>
          <a v-if="asyncGithubFormPush.repos" target="_blank" rel="noopener noreferrer" :href="`https://github.com/${asyncGithubFormPush.repos}`">
            <el-button>
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
          <el-select v-model="asyncGithubFormPull.repos" style="width: 100%" placeholder="请选择 Repo">
            <el-option v-for="(item, idx) of repos" :key="idx" :value="item.full_name" :label="`${item.full_name}${item.private ? '(private)' : ''}`" />
          </el-select>
        </el-form-item>
        <el-form-item label="Branch" prop="branches">
          <el-select v-model="asyncGithubFormPull.branches" style="width: 100%" placeholder="请选择 Branches">
            <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="Path" prop="path">
          <el-select v-model="asyncGithubFormPull.path" style="width: 100%" placeholder="请选择 Path">
            <el-option v-for="(item, idx) of path" :key="idx" :value="item.name" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-loading="githubUploadLoading" type="primary" @click="submitAsyncGithubForm('asyncGithubFormPull')">
            确定
          </el-button>
          <a v-if="asyncGithubFormPull.repos" target="_blank" rel="noopener noreferrer" :href="`https://github.com/${asyncGithubFormPull.repos}`">
            <el-button>
              View Repo
            </el-button>
          </a>
        </el-form-item>
      </el-form>
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
import { throttle, debounce, isEmpty, isArray } from 'lodash'
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import { push, pull, users, userStats, postPublish, usersRepos, reposBranches, reposContentsList, upload, ipfsUpload } from '../../api/index'
import '@matataki/editor/dist/css/index.css'
import { getCookie, setCookie, removeCookie } from '../../utils/cookie'
import markdownDownload from '../../utils/markdown-download'
import { setOAuthRedirectUri } from '../../api/developer'

interface reposBranchesFnProps {
  owner: string
  repo: string
}
interface reposContentsListProps {
  owner: string
  repo: string
}

let mavonEditor: any = {
  mavonEditor: null
}
if (process.client) {
  mavonEditor = require('@matataki/editor')
}

@Component({
  components: {
    'mavon-editor': mavonEditor.mavonEditor
  }
})
export default class Edidtor extends Vue {
  resizeEvent: any = null
  editorStyle: object = {}
  markdownData: string = ''
  dialogAsyncGithub: boolean = false
  token: string = ''
  usersData: object = {}
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

  ipfsUploadLoading = false
  mtkUploadLoading = false
  githubUploadLoading = false

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
    }
  }

  get matatakiUrl () {
    if (process.client) {
      return process.env.APP_MATATAKI_URL
    } else {
      return ''
    }
  }

  @Watch('dialogAsyncGithub')
  onDialogAsyncGithubChangeed (val: boolean) {
    if (!val) {
      if (this.asyncGithubFormMode === 'push') {
        this.resetAsyncGithubForm('asyncGithubFormPush')
      } else if (this.asyncGithubFormMode === 'pull') {
        this.resetAsyncGithubForm('asyncGithubFormPull')
      }

      this.asyncGithubFormMode = ''
    }
  }

  @Watch('markdownData')
  // oldVal: string
  onMdChangeed (val: string) {
    // console.log('val', val, oldVal)
    // window.localStorage.setItem('md', val)
    this.asyncContent(val)
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
      const res = await (this as any).$localForage.getItem(this.$route.params.id)
      if (!isEmpty(res)) {
        this.markdownData = res.content
      }
    } catch (e) {
      console.log(e)
    }
  }

  asyncContent = debounce(async (val: string) => {
    try {
      console.log('val', val)
      const title = (document as any).querySelector('#previewContent h1').innerText || 'Untitled'
      const res = await (this as any).$localForage.getItem(this.$route.params.id)
      const data = Object.assign(res, {
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
    const clientHeight = document.body.clientHeight || document.documentElement.clientHeight
    // const clientWidth = document.body.clientWidth || document.documentElement.clientWidth
    this.editorStyle = {
      // height: `${clientHeight - (clientWidth < 768 ? 47 : 60)}px`
      height: `${clientHeight - 50}px`
    }
  }

  async handPushEvent (): Promise<void> {
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
    }
  }

  async handPullEvent (): Promise<void> {
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
    }
  }

  async userStatsFn (): Promise<void> {
    const res: any = await userStats()
    if (res.code === 0) {
      setCookie('users', JSON.stringify(res.data))
      this.usersData = res.data
    }
  }

  async usersFn (): Promise<void> {
    const res: any = await users()
    if (res.code === 0) {
      setCookie('users-github', JSON.stringify(res.data))
      this.usersGithubData = res.data
    }
  }

  async usersReposFn (): Promise<void> {
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
      console.warn(e)
    }
  }

  async reposBranchesFn ({ owner, repo }: reposBranchesFnProps): Promise<void> {
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
    }
  }

  async reposContentsListFn ({ owner, repo }: reposContentsListProps): Promise<void> {
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
      console.warn(e)
    }
  }

  get isUserGithub () {
    return !isEmpty(this.usersGithubData)
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

  resetAsyncGithubForm (formName: string) {
    (this as any).$refs[formName].resetFields()
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
    try {
      const title = (document as any).querySelector('#previewContent h1').innerText || 'Untitled'
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

        const mdData = await (this as any).$localForage.getItem(this.$route.params.id)
        let ipfs = []

        if (!isEmpty(mdData.ipfs)) {
          ipfs = isArray(mdData.ipfs) ? mdData.ipfs : [mdData.ipfs]
        }

        ipfs.push(res.data)

        await (this as any).$localForage.setItem(this.$route.params.id, {
          title,
          content: this.markdownData,
          create_time: Date.now(),
          ipfs
        })
      } else {
        throw new Error('发布失败')
      }
    } catch (e) {
      console.log(e.toString())
    } finally {
      this.ipfsUploadLoading = false
    }
  }

  async postPublishFn () {
    // TODO: 有问题 没有正确响应
    try {
      this.mtkUploadLoading = true
      const title = (document as any).querySelector('#previewContent h1').innerText || 'Untitled'
      const res = await postPublish({
        title,
        content: this.markdownData
      })
      console.log('res', res)
    } catch (e) {
      console.log(e.toString())
    } finally {
      this.mtkUploadLoading = false
    }
  }

  downloadMd () {
    const title = (document as any).querySelector('#previewContent h1').innerText || 'Untitled'
    try {
      markdownDownload({ title, markdown: this.markdownData })
    } catch (e) {
      this.$message.error(`下载失败：${e.toString()}`)
    }
  }

  handleCommand (command: string) {
    if (command === 'user') {
      //
    } else if (command === 'signout') {
      this.signOut()
      this.$router.push('/')
    }
  }

  signOut () {
    removeCookie('access-token')
    removeCookie('users-github')
    removeCookie('users')
    this.usersData = {}
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

.user {
  display: flex;
  align-items: center;
}
.user-item {
  font-size: 14px;
  color: #606266;
  text-decoration: none;
}
.user-tooltip {
  display: flex;
  align-items: center;
  margin-left: 20px;
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

</style>
