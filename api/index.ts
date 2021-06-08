import {
  IpfsUploadProps,
  PublishProps, PushProps, PullProps,
  UsersReposProps, ReposBranchesProps, ReposContentsListProps,
  PostsImportProps, DraftSaveProps, PreviewProps
} from '../types/index.d'
import client from './client'

// Github API
/**
 * GitHub 用户信息
 * @returns
 */
export function users () {
  return client.get('/api/users', { cache: true })
}

/**
 * Github push 数据
 * @param data
 * @returns
 */
export function push (data: PushProps) {
  return client.put('/api/push', data)
}

/**
 * GitHub pull 数据
 * @param params
 * @returns
 */
export function pull (params: PullProps) {
  return client.get('/api/pull', { params })
}

/**
 * Github user repos
 * @param params
 * @returns
 */
export function usersRepos (params: UsersReposProps) {
  return client.get('/api/users/repos', { params, cache: true })
}

/**
 * Github repos branches
 * @param params
 * @returns
 */
export function reposBranches (params: ReposBranchesProps) {
  return client.get('/api/repos/branches', { params, cache: true })
}

/**
 * Github repos content list
 * @param params
 * @returns
 */
export function reposContentsList (params: ReposContentsListProps) {
  return client.get('/api/repos/contents/list', { params, cache: false })
}

/**
 * image upload
 * @param file
 * @returns
 */
export function upload (file: File) {
  const formdata = new FormData()
  formdata.append('file', file)
  return client({
    url: '/api/upload',
    method: 'POST',
    data: formdata
  })
}

/**
 * ipfs upload
 * @param data
 * @returns
 */
export function ipfsUpload (data: IpfsUploadProps) {
  return client({
    url: '/api/ipfs/upload',
    method: 'POST',
    data
  })
}

// MTK API

/**
 * MTK 用户信息
 * @returns
 */
export function userStats () {
  return client.get('/api/user/stats', { cache: true })
}

/**
 * MTK 发布文章
 * @param data
 * @returns
 */
export function postPublish (data: PublishProps) {
  return client.post('/api/post/publish', data)
}

/**
 * MTK 验证码白名单
 * @returns
 */
export function getDoINeedHCaptcha () {
  return client.get('/api/captcha/doINeedHCaptcha')
}

/**
 * MTK 导入文章功能
 * @param data
 * @returns
 */
export function postsImport (data: PostsImportProps) {
  return client.post('/api/posts/importer', data)
}

/**
 * MTK 创建草稿
 * @param data
 * @returns
 */
export function draftSave (data: DraftSaveProps) {
  return client.post('/api/draft/save', data)
}

/**
 * MTK 预览草稿
 * @param data
 * @returns
 */
export function preview (data: PreviewProps) {
  return client.post('/api/preview', data)
}
