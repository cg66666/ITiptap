/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-21 17:33:16
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 16:55:12
 */
import { type Editor } from '@tiptap/react'
import { updateAtribute } from './updateAtribute'
import { convertNode } from './convertNode'
import { NodeTypeEum } from '@/pages/Home'
import { setNodeOnOrderList } from './setNodeOnOrderList'

export const setCodeBlock = (editor: Editor, attributes: any) => {
  if (editor) {
    const { state } = editor

    // 获取当前选区
    const { from, to } = state.selection

    const orderList: any[] = []

    const otherList: any[] = []

    const targetList: any[] = []

    const levelConfig: any = {}

    // 遍历从from到to之间的所有节点
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (node.isBlock || (node.isInline && !node.isText)) {
        if (node.type.name === NodeTypeEum.CodeBlock) {
          targetList.push({ node, pos })
        } else {
          otherList.push({ node, pos })
        }
        if (node.type.name === NodeTypeEum.OrderList) {
          orderList.push({ node, pos })
          if (
            levelConfig[node.attrs.tier] &&
            levelConfig[node.attrs.tier].start + 1 == node.attrs.start
          ) {
            levelConfig[node.attrs.tier] = {
              start: node.attrs.start,
              length: levelConfig[node.attrs.tier].length + 1
            }
          } else {
            levelConfig[node.attrs.tier] = {
              start: node.attrs.start,
              length: 1
            }
          }
        }
      }
    })
    // 所有内容都转为paragraph
    if (!otherList.length) {
      return editor.commands.setParagraph()
    }
    setNodeOnOrderList(
      editor,
      editor.schema.nodes.ICodeBlock,
      attributes,
      orderList,
      otherList,
      levelConfig
    )
    // const changeList: any[] = []
    // // 存在orderlist情况
    // if (orderList.length) {
    //   // 转换paragraph场景
    //   const length = orderList.length
    //   const lastPos = orderList[length - 1].pos
    //   const tierList = Object.keys(levelConfig)
    //   let curIndex = 0
    //   tierList.forEach((tier) => {
    //     const children = editor.$nodes('IOrderedList', { tier: Number(tier) }) || []
    //     for (let i = 0; i < children.length; i++) {
    //       if (children[i].pos > lastPos) {
    //         if (children[i].attributes.start == levelConfig[tier].start + curIndex + 1) {
    //           changeList[children[i].attributes.id] = {
    //             start: children[i].attributes.start - levelConfig[tier].length,
    //             tier: Number(tier)
    //           }
    //           curIndex++
    //         } else {
    //           break
    //         }
    //       }
    //     }
    //   })
    //   updateAtribute(editor, changeList)
    // }

    // otherList.forEach((item) => {
    //   convertNode(editor, item.pos, editor.schema.nodes.IHeader, { level })
    // })
  }
}
