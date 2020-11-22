import request from '@/utils/request'

export const post = (url:string, params:any) => request({
  url: url,
  method: 'post',
  data: params
})

export const get = (url:string, params:any) => request({
  url: url,
  method: 'get',
  params
})

export const deleteData = (url:string) => request({
  url: url,
  method: 'delete'
})
