import { hCaptchaDataProps } from '../types/index.d'
import client from './client'

interface PublishProps {
  title: string
  content: string
  shortContent: string
  platform: string
  author: string
  hCaptchaData: hCaptchaDataProps
}

export function users () {
  return client.get('/api/users', { cache: true })
}
export function push (data: any) {
  return client.put('/api/push', data)
}
export function pull (params: any) {
  return client.get('/api/pull', { params })
}
export function usersRepos (params: any) {
  return client.get('/api/users/repos', { params, cache: true })
}
export function reposBranches (params: any) {
  return client.get('/api/repos/branches', { params, cache: true })
}
export function reposContentsList (params: any) {
  return client.get('/api/repos/contents/list', { params, cache: false })
}

// image upload
export function upload (file: File) {
  const formdata = new FormData()
  formdata.append('file', file)
  return client({
    url: '/api/upload',
    method: 'POST',
    data: formdata
  })
}
// ipfs upload
export function ipfsUpload (data: { title: string, content: string }) {
  return client({
    url: '/api/ipfs/upload',
    method: 'POST',
    data
  })
}

// MTK API
export function userStats () {
  return client.get('/api/user/stats', { cache: true })
}
export function postPublish (data: PublishProps) {
  return client.post('/api/post/publish', data)
}
export function getDoINeedHCaptcha () {
  return client.get('/api/captcha/doINeedHCaptcha')
}
export function postsImport (data: { url: string }) {
  return client.post('/api/posts/importer', data)
}
export function draftSave (data: { title: string, content: string, shortContent: string }) {
  return client.post('/api/draft/save', data)
}
export function preview (data: { id: number }) {
  return client.post('/api/preview', data)
}
