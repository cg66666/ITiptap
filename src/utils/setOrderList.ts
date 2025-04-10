import { type Editor } from '@tiptap/react'
import { updateAtribute } from './updateAtribute'
import { convertNode } from './convertNode'

export const setOrderList = (editor: Editor) => {
  if (!editor) return

  const { state } = editor

  // 获取当前选区
  const { from, to } = state.selection

  const totalList: any[] = []

  const orderList: any[] = []

  const otherList: any[] = []

  const levelConfig: any = {}

  // 遍历从from到to之间的所有节点
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isBlock || (node.isInline && !node.isText)) {
      totalList.push({
        start: node.attrs.start,
        id: node.attrs.id,
        name: node.type.name,
        pos,
        tier: node.attrs.tier
      })
      if (node.type.name !== 'IOrderedList') {
        otherList.push({ node, pos })
      }
      if (node.type.name === 'IOrderedList') {
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
  // 转换paragraph场景
  if (!otherList.length) {
    const length = orderList.length
    editor.commands.setParagraph()
    const lastPos = orderList[length - 1].pos
    const tierList = Object.keys(levelConfig)
    let curIndex = 0
    const changeList: any[] = []
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
  } else {
    // 转换orderlist场景
    const changeList = {}
    const convertList: any[] = []
    const handledTotalList: any[] = totalList.filter(
      (item) => item.name != 'IOrderedList' || item.tier == 1
    )
    const idList = totalList.map((item) => item.id)
    const children = editor.$nodes('IOrderedList', { tier: 1 }) || []
    const filterChildren = children.filter(
      (item) => !idList.includes(item.attributes.id) && item.attributes.tier == 1
    )
    const prevList = filterChildren.filter((item) => item.pos < from)
    let lastPrevItem: any = prevList[prevList.length - 1]
    let originLastItem
    let prevItem: any = {}
    // 加载后的所有跨度
    let distance = 0
    // 加载前的跨度
    let distance2 = 0
    // 加载后的增加跨度
    let distance3 = 0
    handledTotalList.forEach((item, index) => {
      // 第一个需要处理的特殊
      if (lastPrevItem) {
        originLastItem = {
          name: 'IOrderedList',
          ...lastPrevItem.attributes
        }
        distance++
        if (item.name != 'IOrderedList') {
          distance3++
          if (item.pos > lastPrevItem.pos + lastPrevItem.size) {
            convertList.push({
              pos: item.pos,
              attributes: { start: 1, tier: 1 }
            })
            prevItem = { name: 'IOrderedList', start: 1 }
          } else {
            convertList.push({
              pos: item.pos,
              attributes: { start: lastPrevItem.attributes.start + 1, tier: 1 }
            })
            prevItem = { name: 'IOrderedList', start: lastPrevItem.attributes.start + 1 }
          }
        } else {
          distance = 0
          distance2 = 0
          distance3 = 0
          prevItem = { ...item }
          originLastItem = { ...item }
        }
        lastPrevItem = null
      } else {
        if (item.name != 'IOrderedList') {
          distance++
          if (!Object.keys(prevItem).length) {
            convertList.push({
              pos: item.pos,
              attributes: { start: 1, tier: 1 }
            })
            prevItem = { name: 'IOrderedList', start: 1 }
          } else {
            distance3++
            convertList.push({
              pos: item.pos,
              attributes: { start: prevItem.start + 1, tier: 1 }
            })
            prevItem = { name: 'IOrderedList', start: prevItem.start + 1 }
          }
        } else {
          if (prevItem && item.start != 1 && prevItem.start == item.start + distance3 - 1) {
            changeList[item.id] = { tier: 1, start: prevItem.start + 1 }
            prevItem = { name: 'IOrderedList', start: prevItem.start + 1 }
            distance2++
            distance++
          } else {
            distance = 0
            distance2 = 0
            distance3 = 0
            prevItem = { ...item }
            originLastItem = { ...item }
          }
        }
      }
    })

    // 取出后面的内容
    const afterItems = filterChildren.filter((item) => item.pos > to)
    for (let i = 0; i < afterItems?.length; i++) {
      if (!distance2 && !distance) break
      if (
        afterItems[i].attributes.start != 1 &&
        originLastItem &&
        originLastItem.start + distance2 + i + 1 == afterItems[i].attributes.start
      ) {
        changeList[afterItems[i].attributes.id] = {
          tier: 1,
          start: originLastItem.start + i + 1 + distance
        }
      } else {
        break
      }
    }
    convertList.forEach((item) => {
      convertNode(editor, item.pos, editor.schema.nodes.IOrderedList, item.attributes)
    })
    updateAtribute(editor, changeList)
  }
}
