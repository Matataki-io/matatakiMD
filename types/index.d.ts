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

export interface PostsTimeRankingDataListProps {
  author: string
  avatar: string
  cover: string
  'create_time':string
  hash: string
  id: number
  'is_ownpost': true
  'is_recommend': number
  likes: number
  nickname: string
  'pay_decimals': null
  'pay_platform': null
  'pay_price': null
  'pay_stock_quantity': null
  'pay_symbol': null
  read: number
  'require_buy': number
  'require_holdtokens': number
  'short_content': string
  status: number
  tags: []
  title: string
  'token_amount': null
  'token_decimals': null
  'token_id': null
  'token_name': null
  'token_symbol': null
  uid: number
  'user_is_recommend': number
  'user_is_token': number
}
export interface PostsTimeRankingDataProps {
  count: number
  list: PostsTimeRankingDataListProps[]
}

export interface NoteGithubPullProps {
  repo: string
  branch: string
  path: string
}
export interface NoteGithubPushProps {
  repo: string
  branch: string
  path: string
}
export interface NoteGithubProps {
  pull: NoteGithubPullProps
  push: NoteGithubPushProps
}

export interface NotesImages {
  name: string
  type: string
  size: number
  base64: unknown
  time: number
}

export interface NotesMatatakiProps {
  pull: PostsTimeRankingDataListProps
  push: PostsTimeRankingDataListProps
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
  github: NoteGithubProps
  matataki: NotesMatatakiProps
}

export interface IpfsUploadProps {
  title: string
  content: string
}

// Github

export interface ReposProps {
  'full_name': string
  name: string
  owner: {login: string}
  private: boolean
}

export interface BranchesProps {
  commit: {
    sha: string
    url: string
  }
  name: string
  protected: boolean
  protection: {
    enabled: boolean,
    'required_status_checks': {
      'enforcement_level': string, contexts: []
    }
  }
  'protection_url': string
}

export interface pathProps {
  'html_url': string
  name: string
  path: string
  sha: string
  type: string
  url: string
}

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

export interface ImagesUploadProps {
  url: string
}
export interface ImagesProps {
  upload: ImagesUploadProps[]
}
