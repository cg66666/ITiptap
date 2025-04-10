/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-21 17:27:28
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 19:05:43
 */
import { type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'

// 转换节点类型
export const convertNode = (editor: Editor, pos: number, newNodeType: any, newNodeAttrs: any) => {
  if (!editor) return
  const { state, view } = editor
  const { tr } = state

  // 获取指定位置的节点
  const nodeAtPos = state.doc.nodeAt(pos)

  if (!nodeAtPos) return // 如果没有找到节点，则返回

  // 计算要替换的范围
  const start = pos
  const end = pos + nodeAtPos.nodeSize

  const id = nanoid()

  // 使用 replaceRange 或者其他方法替换节点
  // 这里我们创建一个新的节点并替换旧的节点
  const newNode = newNodeType.create({ ...newNodeAttrs, id }, nodeAtPos.content, nodeAtPos.marks)

  tr.replaceWith(start, end, newNode)

  // 应用事务
  view.dispatch(tr)
}
