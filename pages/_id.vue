<template>
  <div class="container">
    <div class="header">
      <a v-if="!token" href="https://github.com/login/oauth/authorize?client_id=07025561030e5b006396&scope=repo">
        <el-button type="primary" size="small">Github Login</el-button>
      </a>
      <div v-else class="user">
        <el-button type="primary" size="small">
          导出 Markdown
        </el-button>
        <el-button type="primary" size="small">
          同步到 Matataki
        </el-button>
        <el-button type="primary" size="small">
          同步到 IPFS
        </el-button>
        <el-button type="primary" size="small" @click="dialogAsyncGithub = !dialogAsyncGithub">
          同步到 GitHub
        </el-button>
        <a :href="usersData.url" target="_blank" class="user-info">
          <el-avatar :src="usersData.avatar_url" :size="30" />
          <span>{{ usersData.login }}</span>
        </a>
      </div>
      <el-dialog
        title="同步到 GitHub"
        :visible.sync="dialogAsyncGithub"
        width="600px"
      >
        <div>
          <a v-if="!token" href="https://github.com/login/oauth/authorize?client_id=07025561030e5b006396&scope=repo">
            <el-button size="small">Github Login</el-button>
          </a>
          <div v-else>
            <el-button size="small" @click="toggleMode('push')">
              推送至 GitHub
            </el-button>
            <el-button size="small" @click="toggleMode('pull')">
              从 GitHub 拉取
            </el-button>
            <a class="more" href="https://matataki.io/" target="_blank">了解更多</a>
          </div>
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
            <el-button type="primary" @click="submitAsyncGithubForm('asyncGithubFormPush')">
              确定
            </el-button>
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
            <el-button type="primary" @click="submitAsyncGithubForm('asyncGithubFormPull')">
              确定
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <client-only>
      <mavon-editor
        ref="md"
        v-model="markdownData"
        :box-shadow="false"
        :autofocus="false"
        placeholder="请输入内容"
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
import { throttle, debounce } from 'lodash'
import {
  Component,
  Vue,
  Watch
} from 'nuxt-property-decorator'
import { push, pull, users, usersRepos, reposBranches, reposContentsList, upload } from '../api/index'
import '@matataki/editor/dist/css/index.css'
import { getCookie, setCookie } from '../utils/cookie'

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
  asyncGithubFormMode: string = '' // push pull
  repos: Array<object> = []
  branches= []
  path= []
  // 加密语法
  encryption= '\n\n[read hold="SYMBOL amount"]\n\n隐藏内容\n> [📔使用说明](https://www.yuque.com/matataki/matataki/giw9u4)\n\n[else]\n\n预览内容\n\n[/read]\n'

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

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
      this.getContent()

      this.handleResizeEditor()
      this.resizeEvent = throttle(this.handleResizeEditor, 300)
      window.addEventListener('resize', this.resizeEvent)

      this.token = getCookie('token') || ''
      try {
        const usersDataStore = getCookie('users-github') || ''
        if (usersDataStore) {
          this.usersData = JSON.parse(usersDataStore)
        } else {
          this.usersFn()
        }
      } catch (e) {
        console.log('e', e)
      }
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

  async getContent (): Promise<void> {
    const res = await (this as any).$localForage.getItem(this.$route.params.id)
    this.markdownData = res.content
  }

  asyncContent = debounce(async (val: string) => {
    await (this as any).$localForage.setItem(this.$route.params.id, {
      title: 'Features',
      content: val,
      create_time: Date.now()
    })
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
      const [owner, repo] = this.asyncGithubFormPush.repos.split('/')
      const res: any = await push({
        contents: this.markdownData,
        owner,
        path: this.asyncGithubFormPush.path,
        branch: this.asyncGithubFormPush.branches,
        repo,
        commit: this.asyncGithubFormPush.commit,
        token: this.token
      })
      if (res.code === 0) {
        this.$message.success('推送成功')
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      this.$message.error(`推送失败: ${e.toString()}`)
    }
  }

  async handPullEvent (): Promise<void> {
    try {
      const [owner, repo] = this.asyncGithubFormPull.repos.split('/')

      const res: any = await pull({
        owner,
        path: this.asyncGithubFormPull.path,
        branch: this.asyncGithubFormPull.branches,
        repo,
        token: this.token
      })
      if (res.code === 0) {
        this.$message.success('拉取成功')
        this.markdownData = res.data.content
      } else {
        throw new Error(res.message)
      }
    } catch (e: any) {
      this.$message.error(`拉取失败: ${e.toString()}`)
    }
  }

  async usersFn (): Promise<void> {
    const res: any = await users({
      token: this.token
    })
    if (res.code === 0) {
      setCookie('users-github', JSON.stringify(res.data))
      this.usersData = res.data
    }
  }

  async usersReposFn (): Promise<void> {
    try {
      const res: any = await usersRepos({
        username: (this as any).usersData.login,
        token: this.token
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
        repo,
        token: this.token
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
        repo,
        token: this.token
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
}
</script>

<style lang="less" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  position: relative;
}
.editor {
  width: 100%;
}

.header {
  height: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  box-shadow: 0 2px 10px  rgba(0, 0, 0, .05);
  box-sizing: border-box;
  border-bottom: 1px solid #f1f1f1;
}

.user {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  span {
    color: #333;
    font-size: 14px;
    margin-left: 10px;
  }
}

.async-github-form {
  margin-top: 20px;
}

.more {
  margin-left: 10px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
</style>
