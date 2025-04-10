/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-21 16:33:34
 * @LastEditors: cg
 * @LastEditTime: 2025-02-21 16:13:25
 */
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'

import IOrderedList from './index'

export const IOrderedListExtention = Node.create({
  name: 'IOrderedList',

  group: 'block',

  content: ' inline*',

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      start: {
        default: 1,
        rendered: false
      },
      tier: {
        default: 1,
        rendered: false
      },
      id: {
        default: 1,
        rendered: false
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'i-ol'
      }
    ]
  },

  addCommands() {
    return {
      setIOrderedList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!attributes.tier || !attributes.start) {
            return false
          }
          const id = nanoid()
          return commands.setNode(this.name, { ...attributes, id })
        },
      toggleIOrderedList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!attributes.tier || !attributes.start) {
            return false
          }
          const id = nanoid()
          return commands.toggleNode(this.name, 'IParagraph', { ...attributes, id })
        }
    }
  },

  // addKeyboardShortcuts() {
  //   return this.options.levels.reduce(
  //     (items, level) => ({
  //       ...items,
  //       ...{
  //         [`Mod-Alt-${level}`]: () => this.editor.commands.toggleIHeader({ level })
  //       }
  //     }),
  //     {}
  //   )
  // },

  // addInputRules() {
  //   return this.options.levels.map((level) => {
  //     return textblockTypeInputRule({
  //       find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
  //       type: this.type,
  //       getAttributes: {
  //         level
  //       }
  //     })
  //   })
  // },

  renderHTML({ HTMLAttributes }) {
    return ['i-ol', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IOrderedList
          updateAttributes={updateAttributes}
          editor={editor}
          node={node}
          getPos={getPos}
          // id={id}
        ></IOrderedList>
      )
    })
  }
})
