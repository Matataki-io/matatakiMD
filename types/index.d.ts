declare module 'lodash';

declare global {
  interface This {
    '$copyText': Promise<{
      action: string,
      text: string,
      trigger: String | HTMLElement | HTMLCollection | NodeList,
      clearSelection: () => void
    }>
  }
}

export interface HttpResponse {
  code: number
  message: string
  data?: any
}

export interface FleekIpfs {
  bucket: string
  hash:string
  hashV0: string
  key: string
  publicUrl: string
}

export interface NotesImages {
  name: string
  type: string
  size: number
  base64: unknown
  time: number
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
  images?: Array<NotesImages>
}

export interface IpfsUploadProps {
  title: string
  content: string
}

// Github
export interface userProps {
  avatar: string
  id: number
  nickname: string
  platform: string
  username: string
}

export interface reposBranchesFnProps {
  owner: string
  repo: string
}
export interface reposContentsListProps {
  owner: string
  repo: string
  branch: string
}
export interface PushProps {
  contents: string
  owner: string
  path: string
  branch: string
  repo: string
  commit: string
}

export interface PullProps {
  owner: string
  path: string
  branch: string
  repo: string
}
export interface UsersReposProps {
  username: string
}

export interface ReposBranchesProps {
  owner: string
  repo: string
}

export interface ReposContentsListProps {
  owner: string
  repo: string
  branch: string
}

// MTK
export interface hCaptchaDataProps {
  expired:boolean
  token: string
  eKey: string
  error: string
}

export interface PublishProps {
  title: string
  content: string
  shortContent: string
  platform: string
  author: string
  hCaptchaData: hCaptchaDataProps
  cover: string
}
export interface EditProps extends PublishProps {
  signId: number
}
export interface PostsImportProps {
  url: string
}

export interface DraftSaveProps {
  title: string
  content: string
  shortContent: string
}

export interface PreviewProps {
  id: number
}
export interface PostsTimeRankingProps {
  author: number
  page: number
  pagesize: number
}
export interface PostsTimeRankingDataListProps {
  id: number
  title: string
  hash: string
}
export interface PostsTimeRankingDataProps {
  count: number
  list: PostsTimeRankingDataListProps[]
}

export interface ImagesUploadProps {
  url: string
}
export interface ImagesProps {
  upload: ImagesUploadProps[]
}
