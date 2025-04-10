/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-23 15:27:35
 * @LastEditors: cg
 * @LastEditTime: 2025-02-26 09:45:03
 */
// 有序列表-降级重排
import { type Editor } from '@tiptap/react'
import { NodePos } from '@tiptap/react'
import { deleteOrderItem } from './deleteOrderItem'

export const degradeOrderItem = (editor: Editor, $myCustomPos: NodePos) => {
  if (!editor) return
  const orderChildren = editor.$nodes('IOrderedList') || []
  const curPos = editor.state.selection.anchor || 0
  const tier = $myCustomPos.attributes.tier
  let prevIem
  let isFirst = true
  let curNum = 1
  const changeList = deleteOrderItem(editor, $myCustomPos) as any
  // 后续无有序列表，
  if (curPos >= orderChildren[orderChildren?.length - 1].pos) {
    // 无需续接情况
    changeList[$myCustomPos.attributes.id] = {
      start: 1,
      tier: tier + 1
    }
  } else {
    for (let i = 0; i < orderChildren?.length; i++) {
      if (orderChildren[i].pos > curPos) {
        // 下方距离最近的有序列表情况判断，特殊处理
        if (isFirst) {
          // 最近存在其他层级，无需对接
          if (orderChildren[i].attributes.tier != tier + 1) {
            changeList[$myCustomPos.attributes.id] = {
              start: 1,
              tier: tier + 1
            }
            break
          }
          // 可续接情况
          if (
            prevIem &&
            prevIem?.attributes.tier == tier + 1 &&
            orderChildren[i].attributes.start == prevIem?.attributes.start + 1
          ) {
            changeList[$myCustomPos.attributes.id] = {
              start: orderChildren[i].attributes.start,
              tier: tier + 1
            }
            curNum = orderChildren[i].attributes.start + 1
            changeList[orderChildren[i].attributes.id] = { start: curNum, tier: tier + 1 }
          } else {
            changeList[$myCustomPos.attributes.id] = {
              start: 1,
              tier: tier + 1
            }
            if (orderChildren[i].attributes.start == 1) {
              curNum++
              changeList[orderChildren[i].attributes.id] = { start: curNum, tier: tier + 1 }
            } else {
              break
            }
          }
          isFirst = false
        } else if (
          orderChildren[i].attributes.start == curNum &&
          orderChildren[i].attributes.tier == tier + 1
        ) {
          curNum++
          changeList[orderChildren[i].attributes.id] = { start: curNum, tier: tier + 1 }
        } else {
          break
        }
      } else {
        prevIem = orderChildren[i]
      }
    }
  }
  return changeList
}
