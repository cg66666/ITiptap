import { NodePos, type Editor } from '@tiptap/react'
import { deleteOrderItem } from './deleteOrderItem'

export const upgradeOrderItem = (editor: Editor, $myCustomPos: NodePos) => {
  if (!editor) return
  const changeList = deleteOrderItem(editor, $myCustomPos) as any
  if ($myCustomPos.attributes.tier == 1) {
    editor.commands.setParagraph()
  } else {
    let isFirst = true
    const tier = $myCustomPos.attributes.tier
    const curPos = editor.state.selection.anchor || 0
    const orderChildren = editor.$nodes('IOrderedList', { tier: tier - 1 }) || []
    let prevIem
    let curNum = 1
    if (!orderChildren.length) {
      changeList[$myCustomPos.attributes.id] = {
        start: 1,
        tier: tier - 1
      }
    } else if (orderChildren[orderChildren.length - 1].pos < curPos) {
      changeList[$myCustomPos.attributes.id] = {
        start: orderChildren[orderChildren.length - 1].attributes.start + 1,
        tier: tier - 1
      }
    } else {
      for (let i = 0; i < orderChildren.length; i++) {
        if (orderChildren[i].pos > curPos) {
          if (isFirst) {
            if (prevIem && prevIem.attributes.start == orderChildren[i].attributes.start - 1) {
              changeList[$myCustomPos.attributes.id] = {
                start: orderChildren[i].attributes.start,
                tier: tier - 1
              }
              curNum = orderChildren[i].attributes.start + 1
              changeList[orderChildren[i].attributes.id] = {
                start: curNum,
                tier: tier - 1
              }
              isFirst = false
            } else {
              changeList[$myCustomPos.attributes.id] = {
                start: 1,
                tier: tier - 1
              }
              break
            }
          } else if (curNum == orderChildren[i].attributes.start) {
            curNum++
            changeList[orderChildren[i].attributes.id] = {
              start: curNum,
              tier: tier - 1
            }
          } else {
            break
          }
        } else {
          prevIem = orderChildren[i]
        }
      }
    }
  }
  return changeList
}
