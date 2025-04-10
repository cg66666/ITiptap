/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-04-05 09:49:35
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 00:44:04
 */
import { Extension } from '@tiptap/core'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
// import { Plugin, PluginKey } from 'prosemirror-state'
import { Plugin, PluginKey } from '@tiptap/pm/state'

// 插件 Key
export const cursorPluginKey = new PluginKey('cursor')

export const createCursorPlugin = Extension.create({
  name: 'userCursor',
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: cursorPluginKey,
        state: {
          init() {
            return DecorationSet.empty
          },
          apply(transaction, decorationSet) {
            const meta = transaction.getMeta(cursorPluginKey)
            if (meta?.cursors) {
              const decorations: Decoration[] = []
              Object.values(meta.cursors).forEach((item: any) => {
                if (!item || item.name == meta.name) return
                const { from, to, name, colorConfig } = item
                if (!from || !to) return
                decorations.push(
                  Decoration.widget(from, () => {
                    const cursorElement = document.createElement('span')
                    cursorElement.className = 'remote-cursor'
                    cursorElement.style.borderColor = colorConfig.opacityColor
                    cursorElement.dataset.name = name
                    cursorElement.contentEditable = 'false'
                    cursorElement.style.pointerEvents = 'none' // 禁用鼠标事件
                    cursorElement.style.userSelect = 'none' // 禁止文本选择
                    const nameElement = document.createElement('div')
                    nameElement.textContent = name
                    nameElement.className = 'remote-cursor-name'
                    nameElement.style.background = colorConfig.color
                    nameElement.contentEditable = 'false'
                    nameElement.style.pointerEvents = 'none' // 禁用鼠标事件
                    nameElement.style.userSelect = 'none' // 禁止文本选择
                    nameElement.style.wordBreak = 'normal'
                    cursorElement.appendChild(nameElement)
                    return cursorElement
                  })
                )
                if (from != to) {
                  decorations.push(
                    Decoration.inline(from, to, {
                      class: 'remote-selection',
                      style: `background-color: ${colorConfig.opacityColor};`
                    })
                  )
                }
              })
              return DecorationSet.create(transaction.doc, decorations)
            }
            return decorationSet.map(transaction.mapping, transaction.doc)
          }
        },
        props: {
          decorations(state) {
            return cursorPluginKey.getState(state)
          }
        }
      })
    ]
  }
})

// () => {
//   return
// }
