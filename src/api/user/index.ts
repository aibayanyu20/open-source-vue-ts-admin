import { get, post } from '@/api/api'

// 登录功能
export const login = (params:any) => post('/login', params)

// 获取用户的基本信息
export const getUserInfo = (params:any) => get('/getUserInfo', params)

// 修改密码的接口
export const changePass = (params:any) => post('/user/changePass', params)

// 退出登录接口
export const logout = (params:any) => get('/logout', params)

// 获取菜单的接口
export const getMenus = (params:any) => get('/getMenus', params)
