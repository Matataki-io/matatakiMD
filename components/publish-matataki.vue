<template>
  <el-dialog
    title="同步到 Matataki"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="600px"
  >
    <div class="async-dialog">
      <div>
        <el-button size="small" @click="toggleMode('push')">
          发布到 Matataki
        </el-button>
        <el-button size="small" @click="toggleMode('pull')">
          从 Matataki 拉取
        </el-button>
        <a class="more" href="https://matataki.io/" target="_blank">了解更多</a>
      </div>
      <div v-if="asyncFormMode === 'push'">
        <el-radio-group v-model="pushRadio" class="push-raido">
          <el-radio label="create">
            创建文章
          </el-radio>
          <el-radio label="update">
            更新文章
          </el-radio>
        </el-radio-group>
        <el-form

          ref="pushForm"
          class="dialog_form"
          :model="pushForm"
          :rules="pushFormRules"
        >
          <el-form-item v-if="pushRadio === 'update'" label="文章" prop="id">
            <br>
            <PostsSelectMatataki :form="pushForm" :users-data="usersData" @changedValue="pushSelectChanged" />
          </el-form-item>
          <el-form-item label="封面">
            <br>
            <div class="image-container">
              <el-upload
                class="image-uploader"
                :action="uploadImageApi"
                :headers="{
                  'access-token': accessToken
                }"
                :show-file-list="false"
                accept="image/jpeg, image/png"
                :on-success="handleUploadSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="coverUrl" :src="coverUrl" class="cover">
                <i v-else class="el-icon-plus image-uploader-icon" />
              </el-upload>
              <el-button
                v-if="coverUrl"
                icon="el-icon-close"
                class="icon"
                circle
                size="mini"
                @click="imageUrl = ''"
              />
            </div>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="pushForm.title" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="摘要" prop="shortContent">
            <el-input
              v-model="pushForm.shortContent"
              type="textarea"
              :rows="6"
              placeholder="请输入摘要"
            />
          </el-form-item>
          <div class="hcaptcha-box">
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
          <el-form-item class="publish-btn">
            <el-button v-loading="pushLoading" :disabled="isCaptchaOK" size="small" type="primary" @click="submitForm('pushForm')">
              {{ pushRadio === 'create' ? '发布' : pushRadio === 'update' ? '更新' : '' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-form
        v-else-if="asyncFormMode === 'pull'"
        ref="pullForm"
        class="dialog_form"
        :model="pullForm"
        :rules="pullFormRules"
      >
        <el-form-item label="文章" prop="id">
          <br>
          <PostsSelectMatataki :form="pullForm" :users-data="usersData" @changedValue="pullSelectChanged" />
        </el-form-item>
        <el-form-item class="publish-btn">
          <el-button v-loading="pullLoading" :disabled="!pullForm.id" size="small" type="primary" @click="submitForm('pullForm')">
            拉取
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  PropSync,
  Prop,
  Watch
} from 'nuxt-property-decorator'
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'
import { isEmpty } from 'lodash'
import {
  hCaptchaDataProps, userProps,
  Notes, PostsTimeRankingDataListProps, NotesMatatakiProps
} from '../types/index.d'
import {
  getDoINeedHCaptcha, postPublish, uploadImage,
  getPostIpfs, postEdit
} from '../api/index'
import { generateShortContent, generateTitle } from '../utils/index'
import PostsSelectMatataki from './posts-select-matataki.vue'
import { getCookie } from '~/utils/cookie'

interface PushFormProps {
  id: string|number
  title: string
  shortContent: string
}
interface PullFormProps {
  id: string|number
  title: string
  hash: string
}

@Component({
  components: {
    VueHcaptcha,
    PostsSelectMatataki
  }
})
export default class HeaderIpfs extends Vue {
  @Prop({
    type: String,
    required: true
  })
  readonly markdownData!: string

  @Prop({
    type: Object,
    required: true
  })
  readonly usersData!: userProps

  @PropSync('visible', { type: Boolean, required: true })
  dialogVisible!: boolean

  // publish form
  pushForm: PushFormProps = {
    id: '',
    title: '',
    shortContent: ''
  }

  // publish form rules
  pushFormRules = {
    id: [
      { required: true, message: '请选择文章', trigger: 'change' }
    ],
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    shortContent: [
      { required: true, message: '请输入摘要', trigger: 'blur' }
    ]
  }

  // push loading
  pushSelectLoading: boolean = false
  pushLoading: boolean = false

  // push radio
  pushRadio: string = 'create' // create update

  // pull form
  pullForm: PullFormProps = {
    id: '',
    title: '',
    hash: ''
  }

  // pull form rules
  pullFormRules: {} = {
    id: [
      { required: true, message: '请选择文章', trigger: 'change' }
    ]
  }

  // pull loading
  pullSelectLoading: boolean = false
  pullLoading: boolean = false

  // form 模式
  asyncFormMode: string = '' // push pull

  // hcaptcha data
  hCaptchaData: hCaptchaDataProps = {
    expired: false,
    token: '',
    eKey: '',
    error: ''
  }

  doINeedHCaptcha: boolean = true

  imageUrl: string = '' // 封面

  // get upload image api url
  get uploadImageApi (): string {
    if (process.client) {
      return uploadImage
    } else {
      return ''
    }
  }

  // get token
  get accessToken (): string {
    if (process.client) {
      return getCookie('access-token') || ''
    } else {
      return ''
    }
  }

  // get hcaptcha key
  get hCaptchaSiteKey (): string {
    if (process.client) {
      return (process.env.VUE_APP_HCAPTCHA_SITE_KEY) as string
    } else {
      return ''
    }
  }

  // get is captcha is show
  get isCaptchaOK (): boolean {
    // 如果是白名单
    if (this.doINeedHCaptcha) { return false }

    if ((!this.hCaptchaData.expired) && !!(this.hCaptchaData.token)) {
      return false
    } else {
      return true
    }
  }

  // 获取封面图片
  get coverUrl (): string {
    if (this.imageUrl) {
      return `${process.env.APP_SSIMG}${this.imageUrl}`
    } else {
      return ''
    }
  }

  @Watch('dialogVisible')
  onDialogPublishMatatakiChangeed (val: boolean) {
    if (val) {
      const title = generateTitle('#previewContent h1')
      const _shortContent = generateShortContent('#previewContent p')

      this.pushForm.title = title
      this.pushForm.shortContent = _shortContent
    }

    this.onCaptchaReset()
    if (process.client) {
      if (this.$refs.hcaptchaRef && !val) {
        (this.$refs.hcaptchaRef as any).reset()
      }
    }
  }

  mounted () {
    if (process.browser) {
      this.doINeedHCaptchaFn()
    }
  }

  // 切换模式
  toggleMode (mode: string): void {
    this.asyncFormMode = mode

    this.setPostInfoUseStore()
  }

  // 获取白名单状态
  async doINeedHCaptchaFn (): Promise<void> {
    try {
      const res = await getDoINeedHCaptcha()
      if (res.code === 0) {
        this.doINeedHCaptcha = res.data.isInWhiteList
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e.toString())
    }
  }

  onCaptchaVerify (token: string, eKey: string): void {
    this.hCaptchaData = { token, eKey, expired: false, error: '' }
  }

  onExpire (): void {
    this.hCaptchaData = { token: '', eKey: '', expired: true, error: 'current token expires.' }
  }

  onError (e: any): void {
    this.hCaptchaData = { token: '', eKey: '', expired: true, error: e }
    console.error('captcha error: ', e)
  }

  // 当hCaptcha状态重置时，重置hCaptchaData对象的值
  onCaptchaReset (): void {
    this.hCaptchaData = {
      expired: false,
      token: '',
      eKey: '',
      error: ''
    }
  }

  // 提交表单
  submitForm (formName: string): void {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        if (this.asyncFormMode === 'push') {
          if (this.pushRadio === 'create') {
            this.postPublishFn()
          } else if (this.pushRadio === 'update') {
            this.postUpdateFn()
          }
        } else if (this.asyncFormMode === 'pull') {
          this.postIpfsFn(this.pullForm.hash)
        }
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 处理文章内容
  processContent ({ title, content }: { title: string, content: string }): string {
    // 只判断第一个字符是不是 #
    const _content = content.trim()
    if (_content[0] === '#') {
      return _content
    } else {
      return `# ${title.trim()}\n\n${_content}`
    }
  }

  // 获取 ipfs 信息
  async postIpfsFn (hash: string) :Promise<void> {
    this.pullLoading = true

    try {
      const res = await getPostIpfs(hash)
      if (res.code === 0) {
        this.$message.success('拉取成功')
        const content: string = this.processContent({
          title: res.data.title,
          content: res.data.content
        })

        this.$emit('pull', content)
        this.dialogVisible = false
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e.toString())
    } finally {
      this.pullLoading = false
    }
  }

  // 发布到 Matataki
  async postPublishFn (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    try {
      this.pushLoading = true

      const res = await postPublish({
        title: this.pushForm.title.trim(),
        content: this.markdownData.trim(), // 在 mtk 会有两个标题，问题好像不大 暂不处理
        shortContent: this.pushForm.shortContent.trim(),
        platform: this.usersData.platform,
        author: this.usersData.username || this.usersData.nickname,
        hCaptchaData: this.hCaptchaData,
        cover: this.imageUrl
      })
      console.log('res', res)
      if (res.code === 0) {
        this.$notify({
          title: '提示',
          message: `View:${process.env.APP_MATATAKI_URL}/p/${res.data}`
        })

        // 不需要同步
        this.writePushHistory({ id: Number(res.data), title: this.pushForm.title.trim() } as PostsTimeRankingDataListProps)

        this.dialogVisible = false
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      this.pushLoading = false
      loading.close()
    }
  }

  // 更新到 Matataki
  async postUpdateFn (): Promise<void> {
    const loading = this.$notify({
      title: '提示',
      message: '正在更新...',
      duration: 0
    })

    try {
      this.pushLoading = true

      const res = await postEdit({
        signId: Number(this.pushForm.id),
        title: this.pushForm.title.trim(),
        content: this.markdownData.trim(), // 在 mtk 会有两个标题，问题好像不大 暂不处理
        shortContent: this.pushForm.shortContent.trim(),
        platform: this.usersData.platform,
        author: this.usersData.username || this.usersData.nickname,
        hCaptchaData: this.hCaptchaData,
        cover: this.imageUrl
      })
      console.log('res', res)
      if (res.code === 0) {
        this.$notify({
          title: '提示',
          message: `View:${process.env.APP_MATATAKI_URL}/p/${res.data}`
        })

        // 不需要同步
        this.writePushHistory({ id: Number(this.pushForm.id), title: this.pushForm.title.trim() } as PostsTimeRankingDataListProps)
        this.dialogVisible = false
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      this.$message.error(e.toString())
    } finally {
      this.pushLoading = false
      loading.close()
    }
  }

  // pull select changed
  pullSelectChanged (val: PostsTimeRankingDataListProps|null): void {
    if (val && val.id && val.hash) {
      this.pullForm.id = val.id
      this.pullForm.hash = val.hash

      // 不需要同步
      this.writePullHistory({ id: Number(val.id), title: val.title, hash: val.hash } as PostsTimeRankingDataListProps)
    } else {
      this.pullForm.id = ''
      this.pullForm.hash = ''
    }
  }

  // push select chnged
  pushSelectChanged (val: PostsTimeRankingDataListProps|null): void {
    if (val && val.id) {
      this.pushForm.id = val.id
      if (val.cover) {
        this.imageUrl = val.cover
      }

      // 不需要同步
      this.writePushHistory({ id: Number(val.id), title: val.title, hash: val.hash } as PostsTimeRankingDataListProps)
    } else {
      this.pushForm.id = ''
      this.imageUrl = ''
    }
  }

  // 处理图片上传成功
  handleUploadSuccess (res: any): void {
    if (res.code === 0) {
      this.$message.success('上传成功')
      this.imageUrl = res.data.cover
    } else {
      this.$message.error('上传失败')
    }
  }

  // 图片上传之前
  beforeUpload (file: File): boolean {
    const isType: boolean = file.type === 'image/jpeg' || file.type === 'image/png'
    const maxSize: number = 8
    const isLtMB: boolean = file.size / 1024 / 1024 < maxSize

    if (!isType) {
      this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
    }
    if (!isLtMB) {
      this.$message.error(`上传头像图片大小不能超过 ${maxSize}MB!`)
    }

    const result: boolean = isType && isLtMB
    if (result) {
      this.$message.info('开始上传')
    }
    return result
  }

  // 写入 pull 数据
  async writePullHistory (data: PostsTimeRankingDataListProps) : Promise<void> {
    // 没有影响 暂不拷贝
    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
    const key: 'matataki' = 'matataki'
    const keyPull: 'pull' = 'pull'

    if (res[key]) {
      if (res[key][keyPull]) {
        //
      } else {
        res[key][keyPull] = {} as PostsTimeRankingDataListProps
      }

      res[key][keyPull] = data
    } else {
      res[key] = {
        [keyPull]: data
      } as NotesMatatakiProps
    }

    await (this as any).$localForage.setItem(this.$route.params.id, res)
  }

  // 写入 push 数据
  async writePushHistory (data: PostsTimeRankingDataListProps) : Promise<void> {
    // 没有影响 暂不拷贝

    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)
    const key: 'matataki' = 'matataki'
    const keyPull: 'push' = 'push'

    if (res[key]) {
      if (res[key][keyPull]) {
        //
      } else {
        res[key][keyPull] = {} as PostsTimeRankingDataListProps
      }

      res[key][keyPull] = data
    } else {
      res[key] = {
        [keyPull]: data
      } as NotesMatatakiProps
    }

    await (this as any).$localForage.setItem(this.$route.params.id, res)
  }

  // 设置 文章 信息 使用缓存
  async setPostInfoUseStore (): Promise<void> {
    const res: Notes = await (this as any).$localForage.getItem(this.$route.params.id)

    if (isEmpty(res.matataki)) {
      return
    }

    if (this.asyncFormMode === 'push') {
      if (res.matataki.push && res.matataki.push.id && res.matataki.push.title) {
        this.pushForm.id = res.matataki.push.id
        this.pushForm.title = res.matataki.push.title
      }
    } else if (this.asyncFormMode === 'pull') {
      if (res.matataki.pull && res.matataki.pull.id && res.matataki.pull.hash && res.matataki.pull.title) {
        this.pullForm.id = res.matataki.pull.id
        this.pullForm.hash = res.matataki.pull.hash
        this.pullForm.title = res.matataki.pull.title
      }
    }
  }
}
</script>

<style lang="less" scoped>
.async-dialog {
  max-width: 80%;
  margin: 0 auto;
}
.dialog_form {
  margin: 20px 0 0 0;
}
.more {
  margin-left: 10px;
  color: #333;
  font-size: 14px;
  text-decoration: none;
}
.push-raido {
  margin: 20px 0 0 0;
}
.publish-btn,
.hcaptcha-box {
  text-align: center;
}
</style>

<style lang="less" scoped>
.image-container {
  display: flex;
  align-items: center;
  .icon {
    margin-left: 10px;
  }
}
.image-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-uploader /deep/ .el-upload:hover {
  border-color: #409EFF;
}
.image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.cover {
  width: 200px;
  height: 100px;
  display: block;
  object-fit: cover;
}
</style>
