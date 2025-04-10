/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-21 17:27:28
 * @LastEditors: cg
 * @LastEditTime: 2025-02-27 11:39:26
 */
import { type Editor } from '@tiptap/react'

// 转换标记类型
export const convertMark = (
  editor: Editor,
  from: number,
  to: number,
  markType: any,
  newNodeAttrs: any
) => {
  if (!editor) return
  const { state, view } = editor
  const { tr } = state
  // 应用Mark到指定范围
  tr.addMark(from, to, markType.create(newNodeAttrs))
  // 应用这个事务到编辑器状态
  view.dispatch(tr)
}
