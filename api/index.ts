import {
  HttpResponse,
  IpfsUploadProps,
  PublishProps, PushProps, PullProps,
  UsersReposProps, ReposBranchesProps, ReposContentsListProps,
  PostsImportProps, DraftSaveProps, PreviewProps, PostsTimeRankingProps
} from '../types/index.d'
import client from './client'

// Github API
/**
 * GitHub 用户信息
 * @returns
 */
export const users = async (): Promise<HttpResponse> => {
  return await client.get('/api/users', { cache: true })
}

/**
 * Github push 数据
 * @param data
 * @returns
 */
export const push = async (data: PushProps) : Promise<HttpResponse> => {
  return await client.put('/api/push', data)
}

/**
 * GitHub pull 数据
 * @param params
 * @returns
 */
export const pull = async (params: PullProps) : Promise<HttpResponse> => {
  return await client.get('/api/pull', { params })
}

/**
 * Github user repos
 * @param params
 * @returns
 */
export const usersRepos = async (params: UsersReposProps) : Promise<HttpResponse> => {
  return await client.get('/api/users/repos', { params, cache: true })
}

/**
 * Github repos branches
 * @param params
 * @returns
 */
export const reposBranches = async (params: ReposBranchesProps) : Promise<HttpResponse> => {
  return await client.get('/api/repos/branches', { params, cache: true })
}

/**
 * Github repos content list
 * @param params
 * @returns
 */
export const reposContentsList = async (params: ReposContentsListProps) : Promise<HttpResponse> => {
  return await client.get('/api/repos/contents/list', { params, cache: false })
}

/**
 * image upload
 * @param file
 * @returns
 */
export const upload = async (file: File) : Promise<HttpResponse> => {
  const formdata = new FormData()
  formdata.append('file', file)
  return await client.post('/api/upload', formdata)
}

/**
 * ipfs upload
 * @param data
 * @returns
 */
export const ipfsUpload = async (data: IpfsUploadProps) : Promise<HttpResponse> => {
  return await client.post('/api/ipfs/upload', data)
}

// MTK API

/**
 * MTK 用户信息
 * @returns
 */
export const userStats = async () : Promise<HttpResponse> => {
  return await client.get('/api/user/stats', { cache: true })
}

/**
 * MTK 发布文章
 * @param data
 * @returns
 */
export const postPublish = async (data: PublishProps) : Promise<HttpResponse> => {
  return await client.post('/api/post/publish', data)
}

/**
 * MTK 验证码白名单
 * @returns
 */
export const getDoINeedHCaptcha = async () : Promise<HttpResponse> => {
  return await client.get('/api/captcha/doINeedHCaptcha')
}

/**
 * MTK 导入文章功能
 * @param data
 * @returns
 */
export const postsImport = async (data: PostsImportProps) : Promise<HttpResponse> => {
  return await client.post('/api/posts/importer', data)
}

/**
 * MTK 创建草稿
 * @param data
 * @returns
 */
export const draftSave = async (data: DraftSaveProps) : Promise<HttpResponse> => {
  return await client.post('/api/draft/save', data)
}

/**
 * MTK 预览草稿
 * @param data
 * @returns
 */
export const preview = async (data: PreviewProps) : Promise<HttpResponse> => {
  return await client.post('/api/preview', data)
}
/**
 * MTK 上传封面图片
 */
export const uploadImage = `${process.env.APP_API_URL}/api/post/uploadImage`

/**
 * MTK 获取文章列表
 * @returns
 */
export const getPostsTimeRanking = async (params: PostsTimeRankingProps) : Promise<HttpResponse> => {
  return await client.get('/api/posts/timeRanking', { params, cache: true })
}
/**
 * MTK 获取文章信息
 * @param hash string ipfs hash
 * @returns
 */
export const getPostIpfs = async (hash: string) : Promise<HttpResponse> => {
  return await client.get(`/api/post/ipfs/${hash}`, { cache: true })
}
