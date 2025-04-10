import { findChildren } from '@tiptap/core'
import { Node as ProsemirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
// @ts-ignore
import highlight from 'highlight.js/lib/core'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

function parseNodes(nodes: any[], className: string[] = []): { text: string; classes: string[] }[] {
  return nodes
    .map((node) => {
      const classes = [...className, ...(node.properties ? node.properties.className : [])]

      if (node.children) {
        return parseNodes(node.children, classes)
      }

      return {
        text: node.value,
        classes
      }
    })
    .flat()
}

function getHighlightNodes(result: any) {
  // `.value` for lowlight v1, `.children` for lowlight v2
  return result.value || result.children || []
}

function registered(aliasOrLanguage: string) {
  return Boolean(highlight.getLanguage(aliasOrLanguage))
}

function getDecorations({ doc, lowlight }: { doc: ProsemirrorNode; lowlight: any }) {
  const decorations: Decoration[] = []
  findChildren(doc, (node) => node.type.name === 'ICodeBlock').forEach((block) => {
    let from = block.pos + 1
    const language = block.node.attrs.language || null
    const languages = lowlight.listLanguages()
    if (
      !(
        language &&
        (languages.includes(language) || registered(language) || lowlight.registered?.(language))
      )
    ) {
      return
    }
    const nodes = getHighlightNodes(lowlight.highlight(language, block.node.textContent))
    const nodeList = parseNodes(nodes)
    let to = 0
    nodeList.forEach((node) => {
      to = from + node.text.length
      const decoration = Decoration.inline(from, to, {
        class: node.classes.join(' ')
      })
      decorations.push(decoration)
      from = to
    })
  })

  return DecorationSet.create(doc, decorations)
}

export function LowlightPlugin() {
  // if (!['highlight', 'highlightAuto', 'listLanguages'].every((api) => isFunction(lowlight[api]))) {
  //   throw Error(
  //     'You should provide an instance of lowlight to use the code-block-lowlight extension'
  //   )
  // }

  const lowlight = createLowlight(all)

  // lowlight.register('html', html)
  // lowlight.register('css', css)
  // lowlight.register('javascript', javascript)
  // lowlight.register('typescript', typescript)

  const lowlightPlugin: Plugin<any> = new Plugin({
    key: new PluginKey('lowlight'),

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          lowlight
          // defaultLanguage
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name
        const newNodeName = newState.selection.$head.parent.type.name
        const oldNodes = findChildren(oldState.doc, (node) => node.type.name === 'ICodeBlock')
        const newNodes = findChildren(newState.doc, (node) => node.type.name === 'ICodeBlock')

        let attributesChanged = false

        // 检查是否存在属性变化
        if (transaction.docChanged) {
          oldNodes.forEach((oldNode) => {
            const newNode = newState.doc.nodeAt(oldNode.pos)
            if (newNode && newNode.type.name === 'ICodeBlock') {
              // 假设你关注一个名为'language'的属性
              if (newNode.attrs.language !== oldNode.node.attrs.language) {
                attributesChanged = true
              }
            }
          })
        }

        if (
          (transaction.docChanged &&
            // Apply decorations if:
            // selection includes named node,
            ([oldNodeName, newNodeName].includes('ICodeBlock') ||
              // OR transaction adds/removes named node,
              newNodes.length !== oldNodes.length ||
              // OR transaction has changes that completely encapsulte a node
              // (for example, a transaction that affects the entire document).
              // Such transactions can happen during collab syncing via y-prosemirror, for example.
              transaction.steps.some((step) => {
                // @ts-ignore
                return (
                  // @ts-ignore
                  step.from !== undefined &&
                  // @ts-ignore
                  step.to !== undefined &&
                  oldNodes.some((node) => {
                    // @ts-ignore
                    return (
                      // @ts-ignore
                      node.pos >= step.from &&
                      // @ts-ignore
                      node.pos + node.node.nodeSize <= step.to
                    )
                  })
                )
              }))) ||
          attributesChanged
        ) {
          return getDecorations({
            doc: transaction.doc,
            lowlight
            // defaultLanguage
          })
        }

        return decorationSet.map(transaction.mapping, transaction.doc)
      }
    },

    props: {
      decorations(state) {
        return lowlightPlugin.getState(state)
      }
    }
  })

  return lowlightPlugin
}
