import client from './client'

export function add (params: any) {
  return client.get('/add', { params })
}

export function remove (params: any) {
  return client.get('/remove', { params })
}

export function fetchPosts (params: any) {
  return client.get('/fetchPosts', { params })
}

export function signIn (data: any) {
  return client.post('/signIn', data)
}
export function users (params: any) {
  return client.get('/api/users', { params })
}
export function push (data: any) {
  return client.put('/api/push', data)
}
export function pull (params: any) {
  return client.get('/api/pull', { params })
}
export function usersRepos (params: any) {
  return client.get('/api/users/repos', { params })
}
export function reposBranches (params: any) {
  return client.get('/api/repos/branches', { params })
}
export function reposContentsList (params: any) {
  return client.get('/api/repos/contents/list', { params })
}
// oauth login accessToken
export function oauthLoginAccessToken (params: any) {
  return client.get('/api/oauth/login/access_token', { params })
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
