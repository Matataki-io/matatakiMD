declare module 'lodash';

export interface ApiResult {
  code: number,
  data: any
}

export interface hCaptchaDataProps {
  expired:boolean
  token: string
  eKey: string
  error: string
}
