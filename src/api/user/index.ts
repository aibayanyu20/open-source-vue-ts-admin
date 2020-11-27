import { get, post, deleteData } from '@/api/api'

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

// 获取用户数据的接口
export const getUsersData = (params:any) => get('/user', params)

// 获取权限接口
export const getRoles = () => get('/user/getRoles', {})

// 创建用户
export const createUser = (params:any) => post('/user', params)

// 编辑用户
export const editUser = (id:number, params:any) => get(`/user/${id}/edit`, params)

// 删除用户
export const delUser = (id:number) => deleteData(`/user/${id}`)
