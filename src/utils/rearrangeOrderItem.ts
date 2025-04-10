import { type Editor } from '@tiptap/react'

// 重新布局有序列表
export const rearrangeOrderItem = (editor: Editor, id: number) => {
  if (!editor) return
  const node = editor.$node('IOrderedList', { id: id })
  if (!node) return
  // console.log('node', node.pos)
  const curPos = node.pos
  const tier = node.attributes.tier
  let curIndex = node.attributes.start
  const children = editor.$nodes('IOrderedList', { tier }) || []
  let newIndex = 1
  const changeList = {
    [node.attributes.id]: { start: newIndex, tier }
  }
  newIndex++
  curIndex++
  for (let i = 0; i < children?.length; i++) {
    if (children[i].pos > curPos) {
      if (children[i].attributes.start === curIndex) {
        changeList[children[i].attributes.id] = { start: Number(newIndex), tier: Number(tier) }
        newIndex++
        curIndex++
      } else {
        break
      }
    }
  }
  return changeList
}
