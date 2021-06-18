<template>
  <el-dialog
    title="同步到 Matataki"
    :visible.sync="dialogVisible"
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
          <el-form-item v-if="pushRadio === 'update'" label="文章" prop="article">
            <el-select v-model="pushForm.article" v-loading="pushSelectLoading" style="width: 100%" placeholder="请选择文章">
              <el-option v-for="(item, idx) of postsData.list" :key="idx" :value="item.id" :label="`${item.title}`" />
            </el-select>
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
        <el-form-item label="文章" prop="article">
          <el-select v-model="pullForm.article" v-loading="pullSelectLoading" style="width: 100%" placeholder="请选择文章">
            <el-option v-for="(item, idx) of postsData.list" :key="idx" :value="item.id" :label="`${item.title}`" />
          </el-select>
        </el-form-item>
        <el-form-item class="publish-btn">
          <el-button v-loading="pullLoading" :disabled="!pullForm.article" size="small" type="primary" @click="submitForm('pullForm')">
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
import { hCaptchaDataProps, userProps, PostsTimeRankingDataProps } from '../types/index.d'
import {
  getDoINeedHCaptcha, postPublish, uploadImage,
  getPostsTimeRanking, getPostIpfs, postEdit
} from '../api/index'
import { generateShortContent, generateTitle } from '../utils/index'
import { getCookie } from '~/utils/cookie'

@Component({
  components: {
    VueHcaptcha
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
  pushForm = {
    article: '',
    title: '',
    shortContent: ''
  }

  // publish form rules
  pushFormRules = {
    article: [
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
  pullForm = {
    article: ''
  }

  // pull form rules
  pullFormRules = {
    article: [
      { required: true, message: '请选择文章', trigger: 'change' }
    ]
  }

  // pull loading
  pullSelectLoading: boolean = false
  pullLoading: boolean = false

  // posts data
  postsData: PostsTimeRankingDataProps = {
    count: 0,
    list: []
  }

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
  get uploadImageApi () {
    if (process.client) {
      return uploadImage
    } else {
      return ''
    }
  }

  // get token
  get accessToken () {
    if (process.client) {
      return getCookie('access-token')
    } else {
      return ''
    }
  }

  // get hcaptcha key
  get hCaptchaSiteKey () {
    if (process.client) {
      return process.env.VUE_APP_HCAPTCHA_SITE_KEY
    } else {
      return ''
    }
  }

  // get is captcha is show
  get isCaptchaOK () {
    // 如果是白名单
    if (this.doINeedHCaptcha) { return false }

    if ((!this.hCaptchaData.expired) && !!(this.hCaptchaData.token)) {
      return false
    } else {
      return true
    }
  }

  // 获取封面图片
  get coverUrl () {
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

  // 获取 MTK 文章列表
  async postsTimeRanking (): Promise<void> {
    this.pullSelectLoading = true

    try {
      const res = await getPostsTimeRanking({
        author: this.usersData.id,
        page: 1,
        pagesize: 20
      })
      if (res.code === 0) {
        this.postsData = (res.data) as PostsTimeRankingDataProps
      } else {
        throw new Error(res.message)
      }
    } catch (e) {
      console.log(e.toString())
    } finally {
      this.pullSelectLoading = false
    }
  }

  // 切换模式
  toggleMode (mode: string): void {
    this.asyncFormMode = mode
    this.postsTimeRanking()
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
          const post = this.postsData.list.find(i => String(i.id) === String(this.pullForm.article))
          if (post) {
            this.postIpfsFn(post.hash)
          }
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
        content: this.markdownData.trim(),
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
        signId: Number(this.pushForm.article),
        title: this.pushForm.title.trim(),
        content: this.markdownData.trim(),
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
