/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-21 17:33:16
 * @LastEditors: cg
 * @LastEditTime: 2025-02-28 16:40:23
 */
import { type Editor } from '@tiptap/react'
import { updateAtribute } from './updateAtribute'
import { convertNode } from './convertNode'

export const setNodeOnOrderList = (
  editor: Editor,
  type: any,
  attributes: any,
  orderList: any[],
  otherList: any[],
  levelConfig: any
) => {
  if (editor) {
    const changeList: any[] = []
    // 存在orderlist情况
    if (orderList.length) {
      // 转换paragraph场景
      const length = orderList.length
      const lastPos = orderList[length - 1].pos
      const tierList = Object.keys(levelConfig)
      let curIndex = 0
      tierList.forEach((tier) => {
        const children = editor.$nodes('IOrderedList', { tier: Number(tier) }) || []
        for (let i = 0; i < children.length; i++) {
          if (children[i].pos > lastPos) {
            if (children[i].attributes.start == levelConfig[tier].start + curIndex + 1) {
              changeList[children[i].attributes.id] = {
                start: children[i].attributes.start - levelConfig[tier].length,
                tier: Number(tier)
              }
              curIndex++
            } else {
              break
            }
          }
        }
      })
      updateAtribute(editor, changeList)
    }
    otherList.forEach((item) => {
      convertNode(editor, item.pos, type, attributes)
    })
  }
}
