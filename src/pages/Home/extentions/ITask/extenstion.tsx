/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-02 01:51:26
 * @LastEditors: cg
 * @LastEditTime: 2025-03-05 14:52:11
 */
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'
import ITask from './index'

export interface ParagraphOptions {
  /**
   * The HTML attributes for a paragraph node.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

export const ITaskExtention = Node.create<ParagraphOptions>({
  name: 'ITask',

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
      isChecked: {
        default: false,
        rendered: false
      },
      // tier: {
      //   default: 1,
      //   rendered: false
      // },
      time: {
        default: '',
        rendered: false
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'i-task'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-task', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setITaskList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (typeof attributes.isChecked != 'boolean') {
            return false
          }
          const id = nanoid()
          return commands.setNode(this.name, { ...attributes, id })
        },
      toggleITaskList:
        (attributes: any) =>
        ({ commands }: any) => {
          if (typeof attributes.isChecked != 'boolean') {
            return false
          }
          const id = nanoid()
          return commands.toggleNode(this.name, 'IParagraph', { ...attributes, id })
        }
    }
  },

  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Alt-0': () => this.editor.commands.setIParagraph()
  //   }
  // },

  addNodeView() {
    // const id = nanoid()
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return <ITask node={node} getPos={getPos} updateAttributes={updateAttributes}></ITask>
    })
  }
})
