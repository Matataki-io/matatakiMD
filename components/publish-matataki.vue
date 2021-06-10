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
  getDoINeedHCaptcha, postPublish
} from '../api/index'
import { generateShortContent, generateTitle } from '../utils/index'

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

  doINeedHCaptcha = true
  mtkUploadLoading = false

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
        hCaptchaData: this.hCaptchaData
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
}
</script>

<style lang="less" scoped>
.publish-matataki_form {
  text-align: center;
  max-width: 80%;
  margin: 0 auto;
}
</style>
