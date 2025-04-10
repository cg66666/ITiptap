/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-02 01:51:26
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 17:15:30
 */
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'
import CodeBlockLowlight from './index'
import { LowlightPlugin } from './lowlight-plugin.js'
import { Plugin, PluginKey, Selection, TextSelection } from '@tiptap/pm/state'
import highlight from 'highlight.js/lib/core'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

export interface ParagraphOptions {
  /**
   * The HTML attributes for a paragraph node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

export const ICodeBlockExtention = Node.create<ParagraphOptions>({
  name: 'ICodeBlock',

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
      language: {
        default: 'Plain Text',
        rendered: false
      }
    }
  },

  group: 'block',

  content: 'text*',

  code: true,

  defining: true,

  parseHTML() {
    return [{ tag: 'i-codeBlock' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-codeBlock', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  // addCommands() {
  //   return {
  //     setParagraph:
  //       () =>
  //       ({ commands }) => {
  //         const id = nanoid()
  //         console.log(111)

  //         return commands.setNode(this.name, { id })
  //       }
  //   }
  // },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('codeBlockVSCodeHandler'),
        props: {
          handlePaste: (view, event) => {
            if (!event.clipboardData) {
              return false
            }

            // don’t create a new code block within code blocks
            if (this.editor.isActive(this.type.name)) {
              return false
            }

            const text = event.clipboardData.getData('text/plain')
            const vscode = event.clipboardData.getData('vscode-editor-data')
            const vscodeData = vscode ? JSON.parse(vscode) : undefined
            const language = vscodeData?.mode

            if (!text || !language) {
              return false
            }

            const { tr, schema } = view.state

            // prepare a text node
            // strip carriage return chars from text pasted as code
            // see: https://github.com/ProseMirror/prosemirror-view/commit/a50a6bcceb4ce52ac8fcc6162488d8875613aacd
            const textNode = schema.text(text.replace(/\r\n?/g, '\n'))

            // create a code block with the text node
            // replace selection with the code block
            tr.replaceSelectionWith(this.type.create({ language }, textNode))

            if (tr.selection.$from.parent.type !== this.type) {
              // put cursor inside the newly created code block
              tr.setSelection(
                TextSelection.near(tr.doc.resolve(Math.max(0, tr.selection.from - 2)))
              )
            }

            // store meta information
            // this is useful for other plugins that depends on the paste event
            // like the paste rule plugin
            tr.setMeta('paste', true)

            view.dispatch(tr)

            return true
          }
        }
      }),
      LowlightPlugin()
    ]
  },

  addKeyboardShortcuts() {
    return {
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
      // Tab: ({ editor }) => {
      //   const state = editor.state
      //   if (!state.selection.empty) return false // 如果有选中的文本，则不执行
      //   editor.commands.insertContent('  ')
      //   return true
      // }
    }
  },
  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      const lowlight = createLowlight(all)

      // lowlight.register('html', html)
      // lowlight.register('css', css)
      lowlight.register('javascript', javascript)
      // lowlight.register('typescript', typescript)

      return (
        <CodeBlockLowlight
          node={node}
          getPos={getPos}
          updateAttributes={updateAttributes}
          lowlight={lowlight}
          // id={id}
        ></CodeBlockLowlight>
      )
    })
  }
})
