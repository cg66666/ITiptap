/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-21 17:27:28
 * @LastEditors: cg
 * @LastEditTime: 2025-04-03 11:31:02
 */
import { type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'

// 删除节点，转换为默认paragraph
export const deleteNode = (editor: Editor, pos: number) => {
  if (!editor) return
  const { state } = editor
  // 获取指定位置的节点
  const nodeAtPos = state.doc.nodeAt(pos)
  if (!nodeAtPos) return // 如果没有找到节点，则返回
  // 计算要替换的范围
  const start = pos
  const end = pos + nodeAtPos.nodeSize
  const paragraphNode = { type: 'IParagraph', attrs: { id: nanoid() } }
  // 删除目标节点的内容
  editor.chain().deleteRange({ from: start, to: end }).insertContentAt(pos, paragraphNode).run()
}
