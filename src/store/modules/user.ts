import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout, getUserInfo } from '@/api/user/index.ts'
import { getToken, setToken, removeToken } from '@/utils/cookies'
import { resetRouter } from '@/router'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  userInfo: object
  roles: string[]
  email: string
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []
  public email = ''
  public userInfo = {}

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_USER_INFO(userInfo: object) {
    this.userInfo = userInfo
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Mutation
  private SET_EMAIL(email: string) {
    this.email = email
  }

  @Action
  public async Login(userInfo: { username: string, password: string}) {
    let { username, password } = userInfo
    username = username.trim()
    const { data } = await login({ username, password })
    setToken(data.accessToken)
    this.SET_TOKEN(data.accessToken)
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('为登录到当前的平台')
    }
    const { data } = await getUserInfo({ /* Your params here */ })
    if (!data) {
      throw Error('授权登录失败，请重试')
    }
    const { roles, userinfo, email } = data
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      throw Error('用户的权限信息不存在')
    }
    this.SET_ROLES(roles.map((v:any) => v.role.name))
    this.SET_NAME(userinfo.nickname)
    this.SET_AVATAR(userinfo.avatar)
    this.SET_INTRODUCTION('introduction')
    this.SET_EMAIL(email)
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('退出登录失败，用户信息不存在')
    }
    await logout({})
    removeToken()
    resetRouter()
    TagsViewModule.delAllViews()
    this.SET_USER_INFO({})
    this.SET_AVATAR('')
    this.SET_INTRODUCTION('')
    // Reset visited views and cached views
  }
}

export const UserModule = getModule(User)
