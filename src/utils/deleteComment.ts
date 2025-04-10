/*
 * @Description: 废弃
 * @Author: cg
 * @Date: 2025-03-10 16:48:33
 * @LastEditors: cg
 * @LastEditTime: 2025-04-10 10:25:26
 */
// 设置评论
import { NodeTypeEum } from '@/pages/Home'
import { useEditor, type Editor, type Node } from '@tiptap/react'

export const deleteComment = (editor: Editor, id: string) => {
  const { state, view } = editor
  // const { empty, ranges, from } = state.selection
  const { tr } = state

  const type = editor.schema.marks.ICommend

  const className = `.comment-id-${id}`
  const tiptap = document.getElementById('tiptap')
  if (tiptap) {
    const domList = Array.from(tiptap.querySelectorAll(className))
    const nodeList = domList.map((dom) => {
      let pDom = dom.parentElement as HTMLElement
      while (!pDom.dataset || !pDom.dataset.type) {
        pDom = pDom?.parentElement as HTMLElement
      }
      const { id } = pDom.dataset
      let { type } = pDom.dataset
      // console.log('id', id)
      // console.log('type', type)
      if (type === NodeTypeEum.OrderListContent) type = NodeTypeEum.OrderList
      return { id, type }
    })
    // let from = 0
    // let to = 0
    const lastIndex = nodeList.length - 1
    const from = editor.$node(nodeList[0].type, { id: nodeList[0].id })?.from || 0
    const to = editor.$node(nodeList[lastIndex].type, { id: nodeList[lastIndex].id })?.to || 0
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText) return
      console.log('node', node)
    })
    // nodeList.forEach((item) => {
    //   console.log('node', node)
    // })
  }

  // const nodeList: { node: any; pos: number }[] = []
  // let text = ''

  // ranges.forEach((range) => {
  //   const from = range.$from.pos
  //   const to = range.$to.pos
  //   const selectedText = view.state.doc.textBetween(from, to, ' ')
  //   text += selectedText
  //   state.doc.nodesBetween(from, to, (node, pos) => {
  //     if (!node.isText) {
  //       nodeList.push({ node, pos })
  //       return
  //     }
  //     const trimmedFrom = Math.max(pos, from)
  //     const trimmedTo = Math.min(pos + node.nodeSize, to)
  //     const someHasMark = node.marks.find((mark) => mark.type === type)
  //     if (someHasMark) {
  //       node.marks.forEach((mark) => {
  //         if (type === mark.type) {
  //           const class2 = `${mark.attrs.class} ${attributes.class}`
  //           tr.addMark(
  //             trimmedFrom,
  //             trimmedTo,
  //             type.create({
  //               ...attributes,
  //               class: class2
  //             })
  //           )
  //         }
  //       })
  //     } else {
  //       tr.addMark(trimmedFrom, trimmedTo, type.create(attributes))
  //     }
  //   })
  // })
  // view.dispatch(tr)

  // return { nodeList, selectedText: text, from }
}
