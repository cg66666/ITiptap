/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-21 16:33:34
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 12:51:26
 */
import { mergeAttributes, Node, textblockTypeInputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { nanoid } from 'nanoid'

import IHeader from './index'

export const IHeaderExtention = Node.create({
  name: 'IHeader',

  group: 'block',

  content: 'inline*',

  defining: true,

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false
      },
      id: {
        default: 1,
        rendered: false
      },
      alignClass: {
        default: 'align-left'
      },
      placeholder: {
        default: '',
        rendered: false
      },
      isTop: {
        default: false,
        rendered: false
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'i-header'
      }
    ]
  },
  // @ts-ignore
  addCommands() {
    return {
      setIHeading:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }
          const id = nanoid()
          return commands.setNode(this.name, { ...attributes, id })
        },
      toggleIHeader:
        (attributes: any) =>
        ({ commands }: any) => {
          if (!this.options.levels.includes(attributes.level)) {
            return false
          }
          const id = nanoid()
          return commands.toggleNode(this.name, 'IParagraph', { ...attributes, id })
        }
    }
  },

  addKeyboardShortcuts() {
    return this.options.levels.reduce(
      (items, level) => ({
        ...items,
        ...{
          [`Mod-Alt-${level}`]: () => this.editor.commands.toggleIHeader({ level })
        }
      }),
      {}
    )
  },

  addInputRules() {
    return this.options.levels.map((level) => {
      return textblockTypeInputRule({
        find: new RegExp(`^(#{${Math.min(...this.options.levels)},${level}})\\s$`),
        type: this.type,
        getAttributes: {
          level
        }
      })
    })
  },

  renderHTML({ HTMLAttributes }) {
    return ['i-header', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(({ editor, getPos, node, updateAttributes }) => {
      return (
        <IHeader
          editor={editor}
          node={node}
          getPos={getPos}
          updateAttributes={updateAttributes}
        ></IHeader>
      )
    })
  }
})
