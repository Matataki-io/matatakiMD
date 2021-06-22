<template>
  <el-dialog
    title="同步到 GitHub"
    :close-on-click-modal="false"
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
        Bind Github (Matataki 需要绑定 Github 账号)
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
        <el-select v-model="asyncGithubFormPush.branches" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Branches" @change="val => handleChangeBranches(val, asyncGithubFormPush.repos)">
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
        <el-button v-loading="githubUploadLoading" size="small" type="primary" @click="submitForm('asyncGithubFormPush')">
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
        <el-select v-model="asyncGithubFormPull.branches" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Branches" @change="val => handleChangeBranches(val, asyncGithubFormPull.repos)">
          <el-option v-for="(item, idx) of branches" :key="idx" :value="item.name" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="Path" prop="path">
        <el-select v-model="asyncGithubFormPull.path" v-loading="githubLoading" style="width: 100%" placeholder="请选择 Path">
          <el-option v-for="(item, idx) of path" :key="idx" :value="item.name" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-loading="githubUploadLoading" size="small" type="primary" @click="submitForm('asyncGithubFormPull')">
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
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Watch
} from 'nuxt-property-decorator'
import { isEmpty } from 'lodash'
import {
  reposBranchesFnProps, reposContentsListProps, Notes,
  NoteGithubPullProps, NoteGithubPushProps, NoteGithubProps,
  ReposProps, BranchesProps, pathProps
} from '../types/index.d'
import { isOfflineUploadImages } from '../utils/index'
import {
  push, pull, users,
  usersRepos,
  reposBranches, reposContentsList
} from '../api/index'
import { getCookie, setCookie } from '../utils/cookie'

interface pushFormProps {
  repos: string,
  branches: string,
  path: string,
  commit: string
}

interface pullFormProps {
  repos: string,
  branches: string,
  path: string,
}

@Component({})
export default class HeaderIpfs extends Vue {
  @Prop({
    type: String,
    required: true
  })
  readonly markdownData!: string

  @PropSync('visible', { type: Boolean, required: true })
  dialogAsyncGithub!: boolean

  dialogImportMatatakiInput: string = ''
  dialogImportMatatakiLoading: boolean = false
  usersGithubData: object = {}
  repos: Array<ReposProps> = []
  branches: Array<BranchesProps> = []
  path: Array<pathProps> = []
  asyncGithubFormMode: string = '' // push pull
    asyncGithubFormPush: pushFormProps = {
      repos: '',
      branches: '',
      path: '',
      commit: ''
    }

  asyncGithubFormPull: pullFormProps = {
    repos: '',
    branches: '',
    path: ''
  }

  githubUploadLoading: boolean = false
  githubLoading: boolean = false

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

  get isUserGithub (): boolean {
    return !isEmpty(this.usersGithubData)
  }

  get matatakiUrl (): string {
    if (process.client) {
      return (process.env.APP_MATATAKI_URL) as string
    } else {
      return ''
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

  mounted () {
    // 编辑文章不会自动保存
    if (process.browser) {
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

  // 切换模式
  toggleMode (mode: string): void {
    this.asyncGithubFormMode = mode
    this.usersReposFn()
  }

  // 获取 GitHub 信息
  async usersFn (): Promise<void> {
    const res = await users()
    if (res.code === 0) {
      setCookie('users-github', JSON.stringify(res.data), 1)
      this.usersGithubData = res.data
    }
  }

  // 设置 Repo 信息 使用缓存
  async setRepoInfoUseStore ({ repo, branch, path }: NoteGithubPullProps|NoteGithubPushProps): Promise<void> {
    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)

    if (this.asyncGithubFormMode === 'push') {
      if (res.github.push) {
        const { repo, branch, path } = res.github.push
        await this.setRepoInfo({ repo, branch, path })
      } else {
        await this.setRepoInfo({ repo, branch, path })
      }
    } else if (this.asyncGithubFormMode === 'pull') {
      if (res.github.pull) {
        const { repo, branch, path } = res.github.pull
        await this.setRepoInfo({ repo, branch, path })
      } else {
        await this.setRepoInfo({ repo, branch, path })
      }
    }
  }

  // 设置 Repo 信息
  setRepoInfo ({ repo, branch, path }: NoteGithubPullProps|NoteGithubPushProps): void {
    if (this.asyncGithubFormMode === 'push') {
      if (repo) {
        this.asyncGithubFormPush.repos = repo
      }

      if (branch) {
        this.asyncGithubFormPush.branches = branch
      }

      if (path) {
        this.asyncGithubFormPush.path = path
      }
    } else if (this.asyncGithubFormMode === 'pull') {
      if (repo) {
        this.asyncGithubFormPull.repos = repo
      }

      if (branch) {
        this.asyncGithubFormPull.branches = branch
      }

      if (path) {
        this.asyncGithubFormPull.path = path
      }
    }
  }

  // 获取 Repo 信息
  async usersReposFn (): Promise<void> {
    this.githubLoading = true
    try {
      const res = await usersRepos({
        username: (this as any).usersGithubData.login
      })
      if (res.code === 0) {
        this.repos = res.data

        await this.setRepoInfoUseStore({
          repo: res.data[0].full_name,
          branch: '',
          path: ''
        })

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

  // 获取分支信息
  async reposBranchesFn ({ owner, repo }: reposBranchesFnProps): Promise<void> {
    this.githubLoading = true

    try {
      const res = await reposBranches({
        owner,
        repo
      })
      if (res.code === 0) {
        this.branches = res.data

        await this.setRepoInfoUseStore({
          repo: '',
          branch: res.data[0].name,
          path: ''
        })

        this.reposContentsListFn({
          owner,
          repo,
          branch: this.asyncGithubFormPush.branches
        })
      }
    } catch (e) {
      console.warn(e)
    } finally {
      this.githubLoading = false
    }
  }

  // 获取文件列表
  async reposContentsListFn ({ owner, repo, branch }: reposContentsListProps): Promise<void> {
    this.githubLoading = true

    try {
      const res = await reposContentsList({
        owner,
        repo,
        branch
      })
      if (res.code === 0) {
        this.path = res.data

        await this.setRepoInfoUseStore({
          repo: '',
          branch: '',
          path: res.data[0].name
        })
      }
    } catch (e) {
      console.warn(e.toString())
    } finally {
      this.githubLoading = false
    }
  }

  // Repo 切换
  handleChangeRepos (val: string): void {
    console.log('item', val)
    const [owner, repo] = val.split('/')
    this.reposBranchesFn({
      owner,
      repo
    })
  }

  // branches 切换
  handleChangeBranches (val: string, repos: string): void {
    console.log('item', val)
    const [owner, repo] = repos.split('/')

    this.reposContentsListFn({
      owner,
      repo,
      branch: val
    })
  }

  // push 操作
  async pushEvent (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在推送...',
      duration: 0
    })

    try {
      console.log(this.asyncGithubFormPush)

      this.githubUploadLoading = true
      const [owner, repo] = this.asyncGithubFormPush.repos.split('/')
      const res = await push({
        contents: this.markdownData,
        owner,
        path: this.asyncGithubFormPush.path,
        branch: this.asyncGithubFormPush.branches,
        repo,
        commit: this.asyncGithubFormPush.commit
      })
      if (res.code === 0) {
        // 不需要同步
        this.writePushHistory()
        this.$message.success('推送成功')
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(`推送失败: ${e.toString()}`)
    } finally {
      this.githubUploadLoading = false
      loading.close()
    }
  }

  // 处理 Push 事件
  handPush (): void {
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
        this.pushEvent()
      })
    } else {
      this.pushEvent()
    }
  }

  // pull 操作
  async handPullEvent (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在拉取...',
      duration: 0
    })

    try {
      this.githubUploadLoading = true

      const [owner, repo] = this.asyncGithubFormPull.repos.split('/')

      const res = await pull({
        owner,
        path: this.asyncGithubFormPull.path,
        branch: this.asyncGithubFormPull.branches,
        repo
      })
      if (res.code === 0) {
        this.$message.success('拉取成功')
        // 不需要同步
        this.writePullHistory()
        this.$emit('pull', res.data.content)
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(`拉取失败: ${e.toString()}`)
    } finally {
      this.githubUploadLoading = false
      loading.close()
    }
  }

  // 写入 pull 数据
  async writePullHistory () : Promise<void> {
    // 没有影响 暂不拷贝

    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
    const keyGithub: 'github' = 'github'
    const keyPull: 'pull' = 'pull'

    const data: NoteGithubPullProps = {
      repo: this.asyncGithubFormPull.repos,
      branch: this.asyncGithubFormPull.branches,
      path: this.asyncGithubFormPull.path
    }

    if (res[keyGithub]) {
      if (res[keyGithub][keyPull]) {
        //
      } else {
        res[keyGithub][keyPull] = {} as NoteGithubPullProps
      }

      res[keyGithub][keyPull] = data
    } else {
      res[keyGithub] = {
        [keyPull]: data
      } as NoteGithubProps
    }

    await (this as any).$localForage.setItem(this.$route.params.id, res)
  }

  // 写入 push 数据
  async writePushHistory () : Promise<void> {
    // 没有影响 暂不拷贝

    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
    const keyGithub: 'github' = 'github'
    const keyPull: 'push' = 'push'

    const data: NoteGithubPushProps = {
      repo: this.asyncGithubFormPush.repos,
      branch: this.asyncGithubFormPush.branches,
      path: this.asyncGithubFormPush.path
    }

    if (res[keyGithub]) {
      if (res[keyGithub][keyPull]) {
        //
      } else {
        res[keyGithub][keyPull] = {} as NoteGithubPushProps
      }

      res[keyGithub][keyPull] = data
    } else {
      res[keyGithub] = {
        [keyPull]: data
      } as NoteGithubProps
    }

    await (this as any).$localForage.setItem(this.$route.params.id, res)
  }

  // 提交 GitHub form
  submitForm (formName: string): void {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        if (this.asyncGithubFormMode === 'push') {
          this.handPush()
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

  // 重置 form
  resetForm (formName: string): void {
    (this as any).$refs[formName].resetFields()
  }
}
</script>

<style lang="less" scoped>
.async-github {
  position: relative;
}
.async-github-form {
  margin-top: 20px;
}
.user-github-link {
  font-size: 14px;
  color: #606266;
  text-decoration: underline;
}
.async-github-loading {
  position: absolute;
  right: 60px;
  bottom: 40px;
}
.more {
  margin-left: 10px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}

</style>
