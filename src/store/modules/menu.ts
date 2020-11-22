import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { getMenus } from '@/api/user/index.ts'
import { RouteConfig } from 'vue-router'
import { getMenusData } from '@/utils/menuTools.ts'
export interface IMenuState {
  isMenu:boolean
  menus:RouteConfig[]
}

@Module({ dynamic: true, store, name: 'menu' })
class Menu extends VuexModule implements IMenuState {
  public isMenu = false;
  public menus: RouteConfig[] = [];

  @Mutation
  private SET_IS_MENU(isMenu:boolean) {
    this.isMenu = isMenu
  }

  @Mutation
  private SET_MENUS(menus:RouteConfig[]) {
    this.menus = menus
  }

  @Action
  public async getMenus() {
    // 获取动态的菜单
    try {
      // 获取菜单的信息
      const { data } = await getMenus({})
      // 拿到数据设置菜单获取成功
      const menus:RouteConfig[] = getMenusData(data)
      // 拿到菜单的数据，设置菜单
      this.SET_MENUS(menus)
      this.SET_IS_MENU(true)
    } catch (e) {
      console.log('getMenus is fail')
      throw e
    }
  }
}

export const MenuModule = getModule(Menu)
