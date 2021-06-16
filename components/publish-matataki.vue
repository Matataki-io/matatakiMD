<template>
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
            :before-upload="beforeUpload">
              <img v-if="coverUrl" :src="coverUrl" class="cover" />
              <i v-else class="el-icon-plus image-uploader-icon"></i>
          </el-upload>
           <el-button
            v-if="coverUrl"
            icon="el-icon-close"
            class="icon"
            circle
            size="mini"
            @click="imageUrl = ''"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="publishMatatakiForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="摘要" prop="shortContent">
        <el-input
          v-model="publishMatatakiForm.shortContent"
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
        <el-button v-loading="mtkUploadLoading" :disabled="isCaptchaOK" size="small" type="primary" @click="submitPublishMatatakiForm('publishMatatakiForm')">
          发布
        </el-button>
      </el-form-item>
    </el-form>
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
import { hCaptchaDataProps, userProps } from '../types/index.d'
import {
  getDoINeedHCaptcha, postPublish, uploadImage
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
  dialogPublishMatataki!: boolean

  // publish form
  publishMatatakiForm = {
    title: '',
    shortContent: ''
  }

  // publish form rules
  publishMatatakiFormRules = {
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    shortContent: [
      { required: true, message: '请输入摘要', trigger: 'blur' }
    ]
  }

  // hcaptcha data
  hCaptchaData: hCaptchaDataProps = {
    expired: false,
    token: '',
    eKey: '',
    error: ''
  }

  doINeedHCaptcha: boolean = true
  mtkUploadLoading: boolean = false

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

  @Watch('dialogPublishMatataki')
  onDialogPublishMatatakiChangeed (val: boolean) {
    if (val) {
      const title = generateTitle('#previewContent h1')
      const _shortContent = generateShortContent('#previewContent p')

      this.publishMatatakiForm.title = title
      this.publishMatatakiForm.shortContent = _shortContent
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
  submitPublishMatatakiForm (formName: string): void {
    (this as any).$refs[formName].validate((valid: boolean) => {
      if (valid) {
        this.postPublishFn()
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  // 发布到 Matataki
  async postPublishFn (): Promise<void> {
    if (!this.publishMatatakiForm.title || !this.publishMatatakiForm.shortContent) {
      this.$message.warning('标题和摘要不能为空！')
      return
    }

    const loading = this.$notify({
      title: '提示',
      message: '正在发布...',
      duration: 0
    })

    try {
      this.mtkUploadLoading = true

      const res = await postPublish({
        title: this.publishMatatakiForm.title,
        content: this.markdownData,
        shortContent: this.publishMatatakiForm.shortContent,
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
        this.dialogPublishMatataki = false
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
.publish-matataki_form {
  max-width: 80%;
  margin: 0 auto;
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
