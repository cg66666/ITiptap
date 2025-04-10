import { type Editor } from '@tiptap/react'

// 批量更新attr
export const updateAtribute = (editor: Editor, changingOrderList: any) => {
  // console.log('changingOrderList', changingOrderList)
  if (!editor) return
  if (Object.keys(changingOrderList).length === 0) return
  const { state, view } = editor
  const { tr } = state
  let updated = false
  state.doc.descendants((node, pos) => {
    if (node.type.spec.attrs && changingOrderList[node.attrs.id]) {
      // 确保节点有属性定义且匹配ID
      tr.setNodeMarkup(pos, undefined, { ...node.attrs, ...changingOrderList[node.attrs.id] })
      delete changingOrderList[node.attrs.id]
      updated = true
    }
  })
  if (updated) {
    view.dispatch(tr)
  }
}
