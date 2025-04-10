import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'

import IBulletList from './index'

export const IBulletListExtention = Node.create<any>({
  name: 'IBulletList',

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
      id: {
        default: 1,
        rendered: false
      },
      tier: {
        default: 1,
        rendered: false
      },
      alignClass: {
        default: 'align-left'
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'i-ul'
      }
    ]
  },

  addCommands() {
    return {
      setIBulletList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!attributes.tier) {
            return false
          }
          const id = nanoid()
          return commands.setNode(this.name, { ...attributes, id })
        },
      toggleIBulletList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!attributes.tier) {
            return false
          }
          const id = nanoid()
          return commands.toggleNode(this.name, 'IParagraph', { ...attributes, id })
        }
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-ul', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Shift-8': () => this.editor.commands.toggleBulletList()
  //   }
  // },

  // addInputRules() {
  //   let inputRule = wrappingInputRule({
  //     find: inputRegex,
  //     type: this.type
  //   })

  //   if (this.options.keepMarks || this.options.keepAttributes) {
  //     inputRule = wrappingInputRule({
  //       find: inputRegex,
  //       type: this.type,
  //       keepMarks: this.options.keepMarks,
  //       keepAttributes: this.options.keepAttributes,
  //       getAttributes: () => {
  //         return this.editor.getAttributes(TextStyleName)
  //       },
  //       editor: this.editor
  //     })
  //   }
  //   return [inputRule]
  // }
  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IBulletList
          updateAttributes={updateAttributes}
          editor={editor}
          node={node}
          getPos={getPos}
          // id={id}
        ></IBulletList>
      )
    })
  }
})
