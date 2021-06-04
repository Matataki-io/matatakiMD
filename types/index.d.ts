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

export interface FleekIpfs {
  bucket: string
  hash:string
  hashV0: string
  key: string
  publicUrl: string
}

export interface Notes {
  id: number
  'id_str': string
  bookmark: boolean
  content: string
  ipfs: FleekIpfs[]
  title: string
  'create_time': number
  'update_time': number
}
