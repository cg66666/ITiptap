/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-02 01:51:26
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 17:06:45
 */
import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IBlockquote from './index'
import { all, createLowlight } from 'lowlight'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

export interface ParagraphOptions {
  /**
   * The HTML attributes for a paragraph node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

export const inputRegex = /^\s*>\s$/

export const IBlockquoteExtention = Node.create<ParagraphOptions>({
  name: 'IBlockquote',

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
      },
      alignClass: {
        default: 'align-left'
      }
    }
  },

  code: true,

  group: 'block',

  content: 'inline*',

  defining: true,

  parseHTML() {
    return [{ tag: 'i-blockquote' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-blockquote', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addCommands() {
  //   return {
  //     setBlockquote:
  //       () =>
  //       ({ commands }) => {
  //         return commands.wrapIn(this.name)
  //       },
  //     toggleBlockquote:
  //       () =>
  //       ({ commands }) => {
  //         return commands.toggleWrap(this.name)
  //       },
  //     unsetBlockquote:
  //       () =>
  //       ({ commands }) => {
  //         return commands.lift(this.name)
  //       }
  //   }
  // },

  addKeyboardShortcuts() {
    return {
      // 'Mod-Shift-b': () => this.editor.commands.toggleBlockquote(),
      // exit node on triple enter
      Enter: ({ editor }) => {
        const { state } = editor
        const { selection } = state
        const { $from, empty } = selection

        if (!empty || $from.parent.type !== this.type) {
          return false
        }

        const isAtEnd = $from.parentOffset === $from.parent.nodeSize - 2
        const endsWithDoubleNewline = $from.parent.textContent.endsWith('\n\n')

        if (!isAtEnd || !endsWithDoubleNewline) {
          return false
        }
        return editor
          .chain()
          .command(({ tr }) => {
            tr.delete($from.pos - 2, $from.pos)
            return true
          })
          .exitCode()
          .setParagraph()
          .run()
      }
    }
  },

  addInputRules() {
    return [
      wrappingInputRule({
        find: inputRegex,
        type: this.type
      })
    ]
  },

  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IBlockquote
          node={node}
          getPos={getPos}
          updateAttributes={updateAttributes}
          // id={id}
        ></IBlockquote>
      )
    })
  }
})
