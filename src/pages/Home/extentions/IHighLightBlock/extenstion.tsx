/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-02 01:51:26
 * @LastEditors: cg
 * @LastEditTime: 2025-03-05 15:03:20
 */
import { mergeAttributes, Node, wrappingInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IHighLightBlock from './index'
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

export const IHighLightBlockExtention = Node.create<ParagraphOptions>({
  name: 'IHighLightBlock',

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
      emoji: {
        default: '💡',
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
    return [{ tag: 'i-highLightblock' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-highLightblock', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addCommands() {
  //   return {
  //     setHighLightBlock:
  //       () =>
  //       ({ commands }) => {

  //         return commands.wrapIn(this.name)
  //       },
  //     toggleHighLightBlock:
  //       () =>
  //       ({ commands }) => {
  //         return commands.toggleWrap(this.name)
  //       },
  //     unsetHighLightBlock:
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

  // addInputRules() {
  //   return [
  //     wrappingInputRule({
  //       find: inputRegex,
  //       type: this.type
  //     })
  //   ]
  // },

  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IHighLightBlock
          node={node}
          getPos={getPos}
          updateAttributes={updateAttributes}
          // id={id}
        ></IHighLightBlock>
      )
    })
  }
})
