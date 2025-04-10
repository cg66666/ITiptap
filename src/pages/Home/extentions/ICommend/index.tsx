/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-10 14:52:43
 * @LastEditors: cg
 * @LastEditTime: 2025-04-04 16:39:05
 */
import { Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ICommend: {
      /**
       * Set a highlight mark
       * @param attributes The highlight attributes
       * @example editor.commands.setHighlight({ color: 'red' })
       */
      // setCommend: (attributes?: { class: string; from: number; to: number }) => ReturnType
    }
  }
}

/**
 * Matches a highlight to a ==highlight== on input.
 */
export const inputRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))$/

/**
 * Matches a highlight to a ==highlight== on paste.
 */
export const pasteRegex = /(?:^|\s)(==(?!\s+==)((?:[^=]+))==(?!\s+==))/g

/**
 * This extension allows you to highlight text.
 * @see https://www.tiptap.dev/api/marks/highlight
 */
export const ICommend = Mark.create({
  name: 'ICommend',

  addOptions() {
    // return {
    //   HTMLAttributes: {
    //     ['data-type']: 'ICommendText'
    //   }
    // }
  },

  addAttributes() {
    return {
      class: {
        default: '#dee0e3',
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          return {
            class: attributes.class
          }
        }
      },
      id: {
        default: 0,
        rendered: false
        // parseHTML: (element) => element.getAttribute('id'),
        // renderHTML: (attributes) => {
        //   return {
        //     id: attributes.id
        //   }
        // }
      }
      // from: {
      //   default: 0,
      //   rendered: false
      // },
      // to: {
      //   default: 0,
      //   rendered: false
      // }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span'
      }
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes({ ['data-type']: 'ICommendText' }, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      // setCommend:
      //   (attributes) =>
      //   ({ commands, editor }) => {
      //     // console.log('attributes', attributes)
      //     if (!attributes || !attributes.from || !attributes.to) return false
      //     // const { from, to } = attributes
      //     const { state, view } = editor
      //     const { empty, ranges } = state.selection
      //     const { tr } = state
      //     const type = editor.schema.marks.ICommend
      //     ranges.forEach((range) => {
      //       const from = range.$from.pos
      //       const to = range.$to.pos
      //       state.doc.nodesBetween(from, to, (node, pos) => {
      //         const trimmedFrom = Math.max(pos, from)
      //         const trimmedTo = Math.min(pos + node.nodeSize, to)
      //         const someHasMark = node.marks.find((mark) => mark.type === type)
      //         console.log('someHasMark', someHasMark)
      //         if (someHasMark) {
      //           node.marks.forEach((mark) => {
      //             if (type === mark.type) {
      //               console.log('mark', mark)
      //               // return false
      //               // attributes.class = `${mark.attrs.class} ${attributes.class}`
      //               // tr.addMark(
      //               //   trimmedFrom,
      //               //   trimmedTo,
      //               //   type.create({
      //               //     ...attributes
      //               //   })
      //               // )
      //             }
      //           })
      //           // return false
      //         } else {
      //           tr.addMark(trimmedFrom, trimmedTo, type.create(attributes))
      //         }
      //       })
      //     })
      //     // view.dispatch(tr)
      //     // commands.
      //     return true
      //     // schema.marks
      //     // tr.delete(from, from + size)
      //     // if (!tr.docChanged) return false
      //     // // 应用这个事务
      //     // view.dispatch(tr)
      //     // return commands.setMark(this.name, attributes)
      //   }
      // toggleHighlight:
      //   (attributes) =>
      //   ({ commands }) => {
      //     return commands.toggleMark(this.name, attributes)
      //   },
      // unsetHighlight:
      //   () =>
      //   ({ commands }) => {
      //     return commands.unsetMark(this.name)
      //   }
    }
  }
  // onDestroy() {
  //   console.log('销毁了！！！', this)
  // },
  // addKeyboardShortcuts() {
  //   return {
  //     'Mod-Shift-h': () => this.editor.commands.toggleHighlight()
  //   }
  // }
  // addProseMirrorPlugins() {
  //   return [

  //   ]
  // }

  // addInputRules() {
  //   return [
  //     markInputRule({
  //       find: inputRegex,
  //       type: this.type
  //     })
  //   ]
  // },

  // addPasteRules() {
  //   return [
  //     markPasteRule({
  //       find: pasteRegex,
  //       type: this.type
  //     })
  //   ]
  // }
})
