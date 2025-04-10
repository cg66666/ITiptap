/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-27 09:54:29
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 19:06:52
 */
// 有序列表-删除后重排
import { NodePos, type Editor } from '@tiptap/react'

export const deleteOrderItem = (editor: Editor, $myCustomPos: NodePos, pos?: number) => {
  if (!editor) return {}
  const curPos = pos || editor.state.selection.anchor || 0
  const tier = $myCustomPos.attributes.tier
  const children = editor.$nodes('IOrderedList', { tier: tier }) || []
  let curIndex = $myCustomPos.attributes.start
  const changeList = {}
  for (let i = 0; i < children?.length; i++) {
    if (children[i].pos > curPos) {
      if (children[i].attributes.start === curIndex + 1) {
        // @ts-ignore
        changeList[children[i].attributes.id] = { start: Number(curIndex), tier: Number(tier) }
        curIndex++
      } else {
        break
      }
    }
  }
  return changeList
}
