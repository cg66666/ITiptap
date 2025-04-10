/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-05 16:21:15
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 19:05:16
 */
import { type Editor } from '@tiptap/react'

export const clearContent = (editor: Editor, from: any, size: any) => {
  const { state, view } = editor
  const { tr } = state
  tr.delete(from, from + size)
  if (!tr.docChanged) return false
  // 应用这个事务
  view.dispatch(tr)
}
