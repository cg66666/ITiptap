/*
 * @Description: 更新频率较高，优化性能，单独使用
 * @Author: cg
 * @Date: 2024-11-20 16:16:46
 * @LastEditors: cg
 * @LastEditTime: 2025-04-10 16:14:24
 */
import { create } from 'zustand'
import { notification } from 'antd'
import { get as Get, post } from '@/ajax'
import { getCookie, getQueryParams, generateColorFromString } from '@/utils'

interface IState {
  config: any
  userColor: { color: string; opacityColor: string } | null
  userName: string
  documentTitle: string
  setDocumentTitle: (val: string) => void
  toLogin: () => void
  checkLogin: () => void
  toLogOut: () => void
}

export const useLogin = create<IState>((set, get) => ({
  config: {},
  userName: '',
  userColor: null,
  documentTitle: '',
  setDocumentTitle: (title) => {
    set({ documentTitle: title })
  },
  // 去登陆
  toLogin: () => {
    const urlObj = new URL(window.location.href)
    const searchParams = new URLSearchParams(urlObj.search)
    // 防止特殊情况，查询字符串中的ticket参数不能保存
    searchParams.delete('ticket')
    urlObj.search = searchParams.toString()
    window.location.href = import.meta.env.VITE_LOGIN_URL + '?redirectUrl=' + urlObj.href
  },
  // 用于首次打开项目查看登录状态
  checkLogin: async () => {
    const { toLogin } = get()
    const query = getQueryParams()
    const SToken = getCookie('T-TOKEN')
    // 判断是否ticket第一次登录后进入页面
    if (query.ticket) {
      try {
        const res = await post('/tiptap/getToken', { ticket: query.ticket })
        if (res.successful) {
          // 获取当前 URL
          const currentUrl = new URL(window.location.href)
          // 删除查询参数
          currentUrl.search = ''
          // 替换当前 URL
          history.replaceState({}, document.title, currentUrl.href)
          // 刷新页面
          location.reload()
        }
      } catch (err) {
        console.log('err', err)
      }
    } else if (SToken) {
      const res = await Get<{ ok: boolean }>('/tiptap/checkToken')
      if (res.successful && res.data.ok) {
        const res = await Get<{ name: string; config: any }>('/tiptap/getUserInfo')
        if (res.successful) {
          const colorConfig = generateColorFromString(res.data.name)
          set({ userName: res.data.name, userColor: colorConfig, config: res.data.config })
        }
      } else {
        toLogin()
      }
    } else {
      toLogin()
    }
  },
  // 退出登录
  toLogOut: async () => {
    const res = await Get('/tiptap/logout')
    if (res.successful) {
      // 清除cookie
      // document.cookie = 'S-TOKEN' + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      set({ userName: '' })
      notification.info({ message: '退出成功！' })
    }
  }
}))
