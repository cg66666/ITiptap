/*
 * @Description: 用以移动事件，单独抽出
 * @Author: cg
 * @Date: 2025-01-21 11:06:54
 * @LastEditors: cg
 * @LastEditTime: 2025-04-04 13:53:45
 */
import { create } from 'zustand'

interface commentConig {}

export interface CommentItem {
  top: number
  class: string
  id: string
  selectedText: string
  contentList: { content: string; name: string; avatar: string; time: string; isEdit: boolean }[]
  isEdit?: boolean
  isSelected: boolean
  // pid: string[]
  // ptype: string
  isHover: boolean
  from: number
  height?: number
  index?: number
}

// interface CommentList {
//   list: CommentItem[]
// }

interface CommentStructure {
  [key: string]: {
    // top: number
    id: string
    list: Record<string, CommentItem>
  }
}

interface IState {
  // 当前是否为编辑状态
  isCommentEdit: boolean
  commentList: CommentItem[]
  setCommentList: (val: CommentItem[]) => void
  editCommend: (val: CommentItem[]) => void
  // 删除行为会返回原来位置index
  deleteCommend: (val: string) => void
  // 需要更新的commentList中的位置，用于优化性能（仅有editCommend，deleteCommend才能联动触发更新此内容，如果需要使用setCommentList场景，请在该场景手动调用setEditId）
  editIndex: number
  setEditIndex: (val: number) => void
  scrollIndex: number
  setScrollIndex: (val: number) => void
  commentListObj: Record<string, CommentItem>
  deleteCommentListObj: Record<string, CommentItem>
  setDeleteCommentListObj: (val: CommentItem) => void
  clearDeleteCommentListObj: (id: string) => void
  // hoverId: string
  // setHoverId: (val: string) => void
}

export const useComment = create<IState>((set, get) => ({
  isCommentEdit: false,
  scrollIndex: -1,
  setScrollIndex: (val) => {
    set({ scrollIndex: val })
  },
  editIndex: -1,
  setEditIndex: (val) => {
    set({ editIndex: val })
  },
  commentList: [],
  setCommentList: (list) => {
    let isCommentEdit = false
    const commentListObj: any = {}
    // 更新评论样式
    const styleTag = document.querySelector('body style')
    if (styleTag) {
      if (list.length) {
        const styleSelectors = list
          .map((item, index) => {
            if (item.isEdit) isCommentEdit = true
            item.index = index
            commentListObj[item.id] = item
            return `.${item.class}`
          })
          .join(', ')
        let cssContent = `${styleSelectors} {padding:2px 0px;border-bottom:2px solid rgb(255, 198, 10);} `
        const selectedItem = list.find((item) => item.isSelected)
        if (selectedItem) {
          const selectedStyleContent = `.${selectedItem.class} {background:#faedc2}`
          cssContent += selectedStyleContent
        }
        styleTag.innerHTML = cssContent
      } else {
        styleTag.innerHTML = ''
      }
    }

    set({ commentList: list, commentListObj, isCommentEdit })
  },
  editCommend: (list) => {
    const { commentList } = get()
    let startIndex = -1
    const idList = list.map((item) => item.id)
    commentList.forEach((item, index2) => {
      const index = idList.indexOf(item.id)
      if (index >= 0) {
        if (startIndex < 0 || startIndex > index2) startIndex = index2
        commentList[index2] = list[index]
      }
    })
    set({ commentList: [...commentList], editIndex: startIndex })
  },
  deleteCommend: (id) => {
    const { commentList } = get()
    let isCommentEdit = false
    let index = -1
    commentList.forEach((item, index2) => {
      if (item.id == id) {
        return (index = index2)
      }
      if (item.isEdit) isCommentEdit = true
    })
    if (index < 0) return
    commentList.splice(index, 1)
    // 当为空的时候需要清空样式，因为清空后无法监听到，所以需要在这里处理
    if (!commentList.length) {
      const styleTag = document.querySelector('body style')
      if (styleTag) {
        styleTag.innerHTML = ''
      }
    }
    set({ commentList: [...commentList], editIndex: index, isCommentEdit })
  },
  commentListObj: {},
  deleteCommentListObj: {},
  setDeleteCommentListObj: (val) => {
    const { deleteCommentListObj } = get()
    deleteCommentListObj[val.id] = val
    set({ deleteCommentListObj: { ...deleteCommentListObj } })
  },
  clearDeleteCommentListObj: (id) => {
    const { deleteCommentListObj } = get()
    delete deleteCommentListObj[id]
    set({ deleteCommentListObj: { ...deleteCommentListObj } })
  }
  // hoverId: '',
  // setHoverId: (id: string) => {
  //   const { commentList, hoverId } = get()
  //   if (hoverId == id) return
  //   const prevList = Array.from(document.getElementsByClassName('hoverComment'))
  //   console.log('prevList', prevList)

  //   // const prevList = Array.from(document.getElementsByClassName('comment-id-' + hoverId))
  //   prevList.forEach((dom) => {
  //     dom.classList.remove('hoverComment')
  //     // dom.classList.toggle('hoverComment')
  //   })
  //   const list = Array.from(document.getElementsByClassName('comment-id-' + id))
  //   console.log('list', list)

  //   list.forEach((dom) => {
  //     dom.classList.add('hoverComment')
  //     // dom.classList.toggle('hoverComment')
  //   })
  //   // console.log('list', list)
  //   set({ hoverId: id })
  // }
}))
