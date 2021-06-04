<template>
  <div class="wrapper">
    <div class="header">
      <router-link to="/overview" class="navbar-title">
        <i class="fa fa-file-text" /><span class="hidden-xs"> MatatakiMD</span>
      </router-link>
      <div class="header-right">
        <el-popover
          placement="bottom-start"
          width="360"
          trigger="click"
        >
          <div class="ipfs-container">
            <p class="ipfs-title">
              IPFS 列表
            </p>
            <div v-if="ipfsList.length">
              <div v-for="(item, idx) in ipfsList" :key="idx" class="ipfs-item">
                <span>{{ shortHash(item.hash) }} <i class="el-icon-document-copy icon-copy" @click="copyHash(item.hash)" /></span>
                <a :href="item.publicUrl" target="_blank">Fleek</a>
                <a :href="`https://ipfs.io/ipfs/${item.hash}`" target="_blank">IPFS</a>
              </div>
            </div>
            <p v-else class="ipfs-text">
              沒有 Ipfs 記錄
            </p>
          </div>
          <div slot="reference" class="header-right_icon">
            <svg
              t="1622783016906"
              class="icon-ipfs"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="4541"
              width="200"
              height="200"
            ><path d="M245.794 676.096L486.056 814.81V537.376L245.794 398.662z" fill="#5f6266" p-id="4542" /><path d="M271.729 353.733l240.262 138.714 240.273-138.714-240.273-138.72z" fill="#5f6266" p-id="4543" /><path d="M778.2 398.659L537.93 537.372v277.441L778.2 676.092z" fill="#5f6266" p-id="4544" /><path d="M882.897 220.377L583.506 47.53 511.999 6.244 442.823 46.18l-301.73 174.197-69.617 40.204V769.248l68.97 39.817 302.377 174.584 69.176 39.934 71.507-41.286 300.037-173.231 68.981-39.817V260.581l-69.627-40.204zM857.72 753.976c0 5.408 0.655 10.657 1.79 15.727L560.016 942.608c-12.561-10.805-28.864-17.385-46.738-17.385-18.354 0-35.037 6.953-47.733 18.295L164.48 769.702c1.137-5.069 1.787-10.318 1.787-15.727 0-31.542-20.387-58.269-48.68-67.879V342.764c28.292-9.609 48.68-36.332 48.68-67.878 0-5.103-0.556-10.083-1.565-14.879L465.544 86.31c12.697 11.341 29.379 18.293 47.733 18.293 17.874 0 34.178-6.577 46.738-17.386l299.273 172.789a72.374 72.374 0 0 0-1.569 14.879c0 31.546 20.388 58.27 48.683 67.878v343.333c-28.295 9.611-48.682 36.338-48.682 67.88" fill="#5f6266" p-id="4545" /></svg>
          </div>
        </el-popover>

        <el-dropdown trigger="click" class="more-tooltip" @command="handleCommandMore">
          <span class="more-icon">
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="isUser" icon="el-icon-upload" command="async-github">
              同步到 GitHub
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-upload" command="async-ipfs">
              推送到 IPFS
            </el-dropdown-item>
            <el-dropdown-item v-if="isUser" icon="el-icon-upload" command="async-matataki">
              推送到 Matataki
            </el-dropdown-item>
            <el-dropdown-item v-if="isUser" icon="el-icon-download" command="posts-import">
              导入文章
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-download" command="save-file-md" divided>
              导出 Markdown
            </el-dropdown-item>
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
            <el-dropdown-item icon="el-icon-download" command="save-user-data" divided>
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

        <div v-if="isUser" class="user">
          <el-dropdown trigger="click" class="user-tooltip" @command="handleCommand">
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
        </div>
        <div v-else class="user">
          <div class="user-not-logged" @click="jumpToMttkOAuth">
            登入
          </div>
        </div>
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
let VueUploadComponent = null

if (process.client) {
  mavonEditor = require('@matataki/editor')
  VueUploadComponent = require('vue-upload-component')
}

@Component({
  components: {
    'mavon-editor': mavonEditor.mavonEditor,
    VueHcaptcha,
    FileUpload: VueUploadComponent
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

  files = [] // import user data file
  filesMarkdown = [] // import markdown file

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

  @Watch('files')
  onFilesChanged () {
    this.handleFilesChange()
  }

  @Watch('filesMarkdown')
  onFilesMarkdownChanged () {
    this.handleFilesMarkdownChange()
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
    console.log('newFile', newFile)
    if (newFile && !oldFile) {
      // 过滤不是图片后缀的文件
      if (!/\.(md)$/i.test(newFile.name)) {
        this.$message.warning('只能上传 Markdown 文件！')
        return prevent()
      }
    }
  }

  // files change
  handleFilesChange () {
    console.log('files', this.files)

    if (this.files.length <= 0) {
      return
    }

    const fileData: any = this.files[0]
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
  importUserData (data: any) {
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
  async mergedUserData (list: object[]) {
    for (let i = 0; i < list.length; i++) {
      const ele: { [key: string]: any } = list[i]
      // console.log('ele', ele)
      const key: any = Object.keys(ele)
      try {
        const itemResult = await (this as any).$localForage.getItem(key) || {}
        const data = assign(itemResult, ele[key])
        await (this as any).$localForage.setItem(key, data)
      } catch (e) {
        console.log(e.toString())
      }
    }
  }

  // files markdown change
  handleFilesMarkdownChange () {
    console.log('filesMarkdown', this.filesMarkdown)

    if (this.filesMarkdown.length <= 0) {
      return
    }

    const fileData: any = this.filesMarkdown[0]
    if (isEmpty(fileData)) {
      console.log('fileData', fileData)
      return
    }

    const file = fileData.file
    const reader = new FileReader()
    reader.onload = (event: any) => {
      console.log('读取结果：', event)
      const data = event.target.result || event.currentTarget.result
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
  importMarkdown (data: any) {
    // 询问是否导入 并且展示会影响到的数据内容
    this.$confirm('该操作会覆盖内容！是否导入？', '确认信息', {
      distinguishCancelAndClose: true,
      confirmButtonText: '保存',
      cancelButtonText: '取消'
    })
      .then(() => {
        this.markdownData = data
        this.$message({
          type: 'info',
          message: '保存修改'
        })
      })
      .catch(() => {})
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

  shortHash (hash: string): string {
    if (!hash) { return '...' }
    const len = 12
    return `${hash.slice(0, len)}...${hash.slice(hash.length - len)}`
  }

  copyHash (hash: string): void {
    (this as any).$copyText(hash).then(() => {
      this.$message.success('複製成功')
    }, () => {
      this.$message.error('複製失敗')
    })
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
.header-right_icon {
  width: 22px;
  height: 22px;
}
.icon-ipfs {
  width: 22px;
  height: 22px;
  font-size: 22px;
  color: #5f6266;
  cursor: pointer;
}
.ipfs-container {
  padding: 10px;
  color: #5f6266;
}
.ipfs-title {
  font-size: 16px;
  margin: 0 0 10px;
}
.ipfs-item {
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
.ipfs-text {
  font-size: 14px;
}

.item-file-upload {
  display: flex;
  align-items: center;
}
.item-file-upload_name {
  margin-left: 4px;
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
  margin-left: 10px;
}
.more-tooltip {
  .more-icon {
    padding: 0 14px;
    font-size: 22px;
    &:hover {
      color: #333;
    }
  }
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
