/*
 * @Description: 用以移动事件，单独抽出
 * @Author: cg
 * @Date: 2025-01-21 11:06:54
 * @LastEditors: cg
 * @LastEditTime: 2025-04-02 12:24:21
 */
import { create } from 'zustand'

interface IState {
  curHeaderId: string
  setCurHeaderId: (val: string) => void
  scrollTop: number
  setScrollTop: (val: number) => void
  curTaskIdList: string[]
  setCurTaskIdList: (val: string[]) => void
  // 当前光标所在位置，避免虚拟滚动功能影响
  curSelectedIdList: string[]
  setCurSelectedIdList: (val: string[]) => void
  curViewPortIdList: Set<string>
  setViewPortId: (val: string) => void
  deleteViewPortId: (val: string) => void
}

export const useMove = create<IState>((set, get) => ({
  curHeaderId: '',
  setCurHeaderId: async (val) => {
    set({ curHeaderId: val })
  },
  scrollTop: 0,
  setScrollTop: async (val) => {
    set({ scrollTop: val })
  },
  curTaskIdList: [],
  setCurTaskIdList: async (val) => {
    set({ curTaskIdList: val })
  },
  curSelectedIdList: [],
  setCurSelectedIdList: async (val) => {
    set({ curSelectedIdList: val })
  },
  curViewPortIdList: new Set<string>(),
  setViewPortId: (id) => {
    const { curViewPortIdList } = get()
    curViewPortIdList.add(id)
    set({ curViewPortIdList: new Set(curViewPortIdList) })

    // const index = curViewPortIdList.indexOf(id)
    // if (index < 0) {
    //   curViewPortIdList.push(id)
    //   set({ curViewPortIdList: [...curViewPortIdList] })
    // }
  },
  deleteViewPortId: (id) => {
    const { curViewPortIdList } = get()
    curViewPortIdList.delete(id)
    set({ curViewPortIdList: new Set(curViewPortIdList) })
    // const index = curViewPortIdList.indexOf(id)
    // if (index >= 0) {
    //   curViewPortIdList.splice(index, 1)
    //   set({ curViewPortIdList: [...curViewPortIdList] })
    // }
  }
}))
