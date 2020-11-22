// 遍历当前的菜单
import { RouteConfig } from 'vue-router'
interface MenuInfo {
  id:number
  title:string
  uid: number
  status: number
  type: number
  order: number
  pid: number
  component: string
  redirect: string
  metaIcon: string
  metaHidden: number
  metaAlwaysShow: number
  metaBreadcrumb: number
  metaCache: number
  metaAffix: number
  metaActiveMenu: string
  roles:string[]
}
export const getMenusData = (menus:MenuInfo[]):RouteConfig[] => {
  // 遍历并生成菜单树
  const MenusData:RouteConfig[] = []
  menus.forEach((menu:MenuInfo) => {
    const children:RouteConfig[] = []
    menus.forEach((v:MenuInfo) => {
      if (menu.id === v.pid) {
        children.push(formatMenus(v))
      }
    })
    // 当前是主菜单catalog
    if (menu.type === 0) {
      const catalog:RouteConfig = formatMenus(menu)
      if (children.length > 0) {
        // 存在子菜单
        catalog.children = children
      }
      MenusData.push(catalog)
    }
  })
  MenusData.push({ path: '*', redirect: '/404', meta: { hidden: true, title: '404' } })
  return MenusData
}

// 将当前的菜单进行格式化处理
const formatMenus = (menu:MenuInfo):RouteConfig => {
  const path = menu.type === 0 ? getPatch(menu.redirect, false) : getPatch(menu.component)
  const name = menu.type === 0 ? getName(menu.redirect, false) : getName(menu.component)
  return {
    path,
    name,
    component: menu.component === 'Layout' ? () => import('@/layout/index.vue') : menu.component === 'Blank' ? () => import('@/layout/Blank.vue') : () => import('@/views/setting/Menu.vue'),
    redirect: menu.type === 0 ? (menu.redirect.length > 0 ? menu.redirect : 'noredirect') : '',
    meta: {
      title: menu.title,
      roles: menu.roles,
      icon: menu.metaIcon,
      hidden: menu.metaHidden === 1,
      alwaysShow: menu.metaAlwaysShow === 1,
      breadcrumb: menu.metaBreadcrumb === 1,
      noCache: menu.metaCache === 1,
      affix: menu.metaAffix === 1,
      activeMenu: menu.metaActiveMenu
    }
  }
}

const getPatch = (path:string, isMenu = true) => {
  if (!isMenu) {
    const arr:string[] = path.split('/')
    return '/' + arr[1]
  }
  // 拿到当前的组件的信息开始获取当前的菜单
  return path.toLowerCase()
}

const getName = (path:string, isMenu = true) => {
  const arr:string[] = path.split('/')
  if (!isMenu) {
    return arr[1]
  } else {
    let name = ''
    arr.forEach((v, index) => {
      if (v !== '/' && index === 1) {
        name = v
      } else {
        name += v.charAt(0).toUpperCase() + v.slice(1)
      }
    })
    return name
  }
}
