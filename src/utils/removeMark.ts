import { type Editor } from '@tiptap/react'

// 取消某个标记类型
export const removeMark = (editor: Editor, from: number, to: number, markType: any) => {
  const { state, view } = editor
  const { tr } = state

  // 使用 removeMark 方法创建一个新的事务
  tr.removeMark(from, to, markType)

  // 应用这个事务
  view.dispatch(tr)
}
