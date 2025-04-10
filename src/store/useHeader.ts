/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-21 11:06:54
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 18:08:55
 */
import { text } from 'linkifyjs'
import { create } from 'zustand'

export type headd = { pos: number; text: string; level: number; id: string }

export type headItem = Record<string, headd>

export type closeConfig = { start: number; end: number | null; level: number } | null

export type closeItem = Record<string, closeConfig>

export type orderItem = Record<string, { level: number; children: string[] }>

export type changeOrderItem = Record<string, { start: string; tier: number }>

interface IState {
  IHeadConfigList: headd[]
  setIHeadConfigList: (val: headd[]) => void
  IHeadConfig: headItem
  setIHeadConfig: (val: headItem) => void
  deleteIHeadConfig: (idList: string[]) => void
  editIHeadConfig: (val: headd[]) => void
  headerRank: any[]
  setHeaderRank: (val: any[]) => void
  closeIList: closeConfig[]
  closingRange: closeItem
  setClosingRange: (val: closeItem) => void
  // changingOrderList: changeOrderItem
  // setChangingOrderList: (val: changeOrderItem) => void
}

export const useHeader = create<IState>((set, get) => ({
  IHeadConfigList: [],
  setIHeadConfigList: (val) => {
    set({ IHeadConfigList: val })
  },
  IHeadConfig: {},
  setIHeadConfig: async (val) => {
    console.log('setIHeadConfig', val)

    // console.log('timer', timer)
    set({ IHeadConfig: val, IHeadConfigList: Object.values(val).sort((a, b) => a.pos - b.pos) })
  },
  deleteIHeadConfig: async (idList) => {
    console.log('deleteIHeadConfig')

    const IHeadConfig = get().IHeadConfig
    const IHeadConfigList = get().IHeadConfigList
    idList.forEach((id) => {
      const index = IHeadConfigList.findIndex((item) => item.id == id)
      if (index >= 0) {
        IHeadConfigList.splice(index, 1)
        delete IHeadConfig[id]
      }
    })
    set({ IHeadConfig: { ...IHeadConfig }, IHeadConfigList: [...IHeadConfigList] })
  },
  editIHeadConfig: async (list) => {
    console.log('editIHeadConfig', list)

    const IHeadConfig = get().IHeadConfig
    const IHeadConfigList = get().IHeadConfigList
    list.forEach((val) => {
      const index = IHeadConfigList.findIndex((item) => item.id == val.id)
      if (index < 0) {
        IHeadConfigList.push(val)
        IHeadConfigList.sort((a, b) => a.pos - b.pos)
        IHeadConfig[val.id] = val
      } else if (IHeadConfigList[index].pos != val.pos) {
        IHeadConfigList[index] = val
        IHeadConfigList.sort((a, b) => a.pos - b.pos)
        IHeadConfig[val.id] = val
      } else if (index >= 0 && IHeadConfigList[index].text != val.text) {
        IHeadConfigList[index] = val
        IHeadConfig[val.id] = val
      } else {
        return
      }
    })
    set({ IHeadConfig: { ...IHeadConfig }, IHeadConfigList: [...IHeadConfigList] })
  },
  headerRank: [],
  setHeaderRank: (val) => {
    set({ headerRank: val })
  },
  closeIList: [],
  closingRange: {},
  setClosingRange: async (val) => {
    const newCloseIList = Object.keys(val).map((id) => val[id])
    set({ closingRange: val, closeIList: newCloseIList })
  }
}))
