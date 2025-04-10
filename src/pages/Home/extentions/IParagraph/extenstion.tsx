/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-02 01:51:26
 * @LastEditors: cg
 * @LastEditTime: 2025-03-07 17:35:02
 */
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IParagraph from './index'

export interface ParagraphOptions {
  /**
   * The HTML attributes for a paragraph node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

export const IParagraphExtention = Node.create<ParagraphOptions>({
  name: 'IParagraph',

  priority: 1000,

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
      }
      // level: {
      //   default: 1,
      //   rendered: false
      // }
    }
  },

  group: 'block',

  content: 'inline*',

  defining: true,

  parseHTML() {
    return [{ tag: 'p' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setParagraph:
        () =>
        ({ commands }) => {
          const id = nanoid()
          return commands.setNode(this.name, { id })
        }
    }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Alt-0': () => this.editor.commands.setParagraph()
    }
  },

  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IParagraph
          node={node}
          getPos={getPos}
          updateAttributes={updateAttributes}
          // id={id}
        ></IParagraph>
      )
    })
  }
})
