import { Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    IDefaultSelection: {
      /**
       * Set a highlight mark
       * @param attributes The highlight attributes
       * @example editor.commands.setHighlight({ color: 'red' })
       */
      setDefaultSelection: (attributes?: { color: string }) => ReturnType
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
export const IDefaultSelection = Mark.create({
  name: 'IDefaultSelection',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      color: {
        default: '#dee0e3',
        parseHTML: (element) => element.getAttribute('data-color') || element.style.backgroundColor,
        renderHTML: (attributes) => {
          return {
            'data-color': attributes.color,
            style: `background-color: ${attributes.color}; color: inherit`
          }
        }
      }
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
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setDefaultSelection:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        }
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
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-h': () => this.editor.commands.toggleHighlight()
    }
  },

  addInputRules() {
    return [
      markInputRule({
        find: inputRegex,
        type: this.type
      })
    ]
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: pasteRegex,
        type: this.type
      })
    ]
  }
})
