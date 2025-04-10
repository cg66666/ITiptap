import { Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core'

export interface HighlightOptions {
  /**
   * HTML attributes to add to the highlight element.
   * @default {}
   * @example { class: 'foo' }
   */
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    IColor: {
      /**
       * Set a highlight span
       * @param attributes The highlight attributes
       * @example editor.commands.setHighlight({ color: 'red' })
       */
      setColor: (attributes?: { color: string }) => ReturnType
      /**
       * Toggle a highlight span
       * @param attributes The highlight attributes
       * @example editor.commands.toggleHighlight({ color: 'red' })
       */
      toggleColor: (attributes?: { color: string }) => ReturnType
      /**
       * Unset a highlight span
       * @example editor.commands.unsetHighlight()
       */
      unsetColor: () => ReturnType
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
export const IColor = Mark.create<HighlightOptions>({
  name: 'IColor',

  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-color') || element.style.color,
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {}
          }

          return {
            'data-color': attributes.color,
            style: `background-color: inherit ; color: ${attributes.color}`
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
      setColor:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes)
        },
      toggleColor:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes)
        },
      unsetColor:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        }
    }
  }

  //   addKeyboardShortcuts() {
  //     return {
  //       'Mod-Shift-h': () => this.editor.commands.toggleHighlight()
  //     }
  //   },

  //   addInputRules() {
  //     return [
  //       markInputRule({
  //         find: inputRegex,
  //         type: this.type
  //       })
  //     ]
  //   },

  //   addPasteRules() {
  //     return [
  //       markPasteRule({
  //         find: pasteRegex,
  //         type: this.type
  //       })
  //     ]
  //   }
})
