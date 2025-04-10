/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-10 16:48:33
 * @LastEditors: cg
 * @LastEditTime: 2025-03-14 16:58:06
 */
// 设置评论
import { useEditor, type Editor, type Node } from '@tiptap/react'

export const setCommend = (editor: Editor, attributes: any) => {
  const { state, view } = editor
  const { empty, ranges, from } = state.selection
  const { tr } = state
  const type = editor.schema.marks.ICommend
  // const nodeList: { node: any; pos: number }[] = []
  let text = ''

  ranges.forEach((range) => {
    const from = range.$from.pos
    const to = range.$to.pos
    const selectedText = view.state.doc.textBetween(from, to, ' ')
    text += selectedText
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText) {
        // nodeList.push({ node, pos })
        return
      }
      const trimmedFrom = Math.max(pos, from)
      const trimmedTo = Math.min(pos + node.nodeSize, to)
      const someHasMark = node.marks.find((mark) => mark.type === type)
      if (someHasMark) {
        node.marks.forEach((mark) => {
          if (type === mark.type) {
            const class2 = `${mark.attrs.class} ${attributes.class}`
            tr.addMark(
              trimmedFrom,
              trimmedTo,
              type.create({
                ...attributes,
                class: class2
              })
            )
          }
        })
      } else {
        tr.addMark(trimmedFrom, trimmedTo, type.create(attributes))
      }
    })
  })
  view.dispatch(tr)

  return { selectedText: text, from }
}
