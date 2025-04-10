/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-27 09:54:28
 * @LastEditors: cg
 * @LastEditTime: 2025-04-10 10:25:00
 */
// src/Tiptap.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  Popover,
  Dropdown,
  type MenuProps,
  Popconfirm,
  InputNumber,
  Button,
  Input,
  Menu,
  message
} from 'antd'
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
  type Editor,
  NodePos
} from '@tiptap/react'
import { Transaction } from '@tiptap/pm/state'
// import { find, registerCustomProtocol, reset } from 'linkifyjs'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextSelection, Plugin } from 'prosemirror-state'
// import Highlight from '@tiptap/extension-highlight'
import IIcon from '@/components/IIcon'
import {
  IParagraph,
  IHeader,
  IOrderedList,
  IBulletList,
  ITask,
  IDefaultSelection,
  ILink,
  IBlockquote,
  ICodeBlock,
  IHighLightBlock,
  IColor,
  IHighlight,
  ICommend,
  IUserSelection
} from './extentions'
import { useHeader, useMove, useComment, useLogin } from '@/store'
import {
  setBulletList,
  setHeader,
  setOrderList,
  rearrangeOrderItem,
  deleteOrderItem,
  degradeOrderItem,
  upgradeOrderItem,
  updateAtribute,
  setTask,
  convertMark,
  removeMark,
  setQuote,
  initCursor,
  setCursor
} from '@/utils'
import { createCursorPlugin, cursorPluginKey } from './Plugins/CursorPlugin'
import { useWebSocket } from '@/hook/useWebSocket'
import EditHref from './EditHref'
import ClearHref from './ClearHref'
import BubbleMenu from './components/BubbleMenu'
import FunctionBlock from './components/FunctionBlock'
import LeftHeader from './components/LeftHeader'
import RightCommend from './components/RightCommend'
import IScrollbars from '@/components/IScrollbars'
import TopHead from './components/TopHead'
import _ from 'lodash'
import s from './index.module.scss'
import { nanoid } from 'nanoid'
import { Step, Mapping, ReplaceStep, RemoveMarkStep, AddMarkStep } from 'prosemirror-transform'
import { get, post } from '@/ajax'

// 定义初始内容
// const content = `
//         <h1>This is a 1st level heading</h1>
//         <h2>This is a 2nd level heading</h2>
//         <h3>This is a 3rd level heading</h3>
//         <h4>This 4th level heading will be converted to a paragraph, because levels are configured to be only 1, 2 or 3.</h4>
//       `

const content = `
<i-blockquote id="54h245h245h" >啊？如<a target="_blank" rel="noopener noreferrer nofollow" class="ILink" id="ZJfLbU1ykCJ_0xYY9Xfhm" data-type="ILink" href="356。56h">a 1st level</a>嗯呢</i-blockquote>
<i-highLightblock emoji="💩" id="euytkmjeaejhrnfvuejr">看看顶到底是个啥啊？！！！</i-highLightblock>
<i-codeBlock id="eyjh3563i67ujhwsaef" language="typescript">for (var i=1; i <= 20; i++){
  if (i % 15 == 0){
    console.log("FizzBuzz");
  }else if (i % 3 == 0){
    console.log("Fizz");
  }else if (i % 5 == 0){
    console.log("Buzz");
  }else{
    console.log(i);
  }
}</i-codeBlock>
<i-ul tier="1" id="yhnoiewjkrtgbbce">就这就这？</i-ul>
<i-ul tier="2" id="tyhne">就这就这？</i-ul>
<i-ul tier="3" id="wrytjwetyj">就这就这？</i-ul>
<i-ul tier="4" id="ruiklruyfv">就这就这？</i-ul>
<i-ol start="1" tier="1" id="aaa">开始了开始了</i-ol>
<p id="wrthnwrijg">冲222</p>
<i-ol start="2" tier="1" id="bbb">开始了开始了</i-ol>
<p id="etyjetyj">冲333</p>
<i-ol start="3" tier="1" id="ccc">开始了开始了</i-ol>
<i-ol start="4" tier="1" id="ddd">开始了开始了</i-ol>
<i-ol start="5" tier="1" id="eee">开始了开始了</i-ol>
<i-ol start="1" tier="1" id="fff">开始了开始了</i-ol>
<i-task id="ggg" tier="1" isChecked="false" time="">这就是任务？</i-task>
<i-task id="hhh" tier="1" isChecked="true" time="">任务就这就这？</i-task>
<i-header id='iii' level="2">头部头部222</i-header>
<i-header id='jjj' level="3">头部头部333</i-header>
<i-header id='rrr' level="4">头部头部444</i-header>
<i-header id='sss' level="5">头部头部555</i-header>
<i-header id='ttt' level="6">头部头部666</i-header>
<i-header id='uuu' level="7">头部头部777</i-header>
<i-header id='vvv' level="8">头部头部888</i-header>

`
{
  /* <i-header id='iii' level="2">头部头部111</i-header>
<i-header id='jjj' level="3">头部头部222</i-header>
<i-header id='kkk' level="3">头部头部222</i-header>
<i-header id='lll' level="3">头部头部222</i-header>
<i-header id='mmm' level="3">头部头部222</i-header>
<i-header id='nnn' level="3">头部头部222</i-header>
<i-header id='ooo' level="3">头部头部222</i-header>
<i-header id='ppp' level="3">头部头部222</i-header>
<i-header id='qqq' level="3">头部头部222</i-header>
<i-header id='rrr' level="3">头部头部222</i-header>
<i-header id='sss' level="3">头部头部222</i-header>
<i-header id='ttt' level="3">头部头部222</i-header>
<i-header id='uuu' level="3">头部头部222</i-header>
<i-header id='vvv' level="3">头部头部222</i-header>
<i-header id='www' level="3">头部头部222</i-header>
<i-header id='xxx' level="3">头部头部222</i-header>
<i-header id='yyy' level="3">头部头部222</i-header>
<i-header id='zzz' level="3">头部头部222</i-header>
<i-header id='zza' level="3">头部头部222</i-header>
<i-header id='zzb' level="3">头部头部222</i-header>
<i-header id='zzc' level="3">头部头部222</i-header>
<i-header id='zzd' level="3">头部头部222</i-header>
<i-header id='zze' level="3">头部头部222</i-header>
<i-header id='zzf' level="3">头部头部222</i-header>
<i-header id='zzg' level="3">头部头部222</i-header>
<i-header id='zzh' level="3">头部头部222</i-header> */
}
// <i-codeBlock id="eyjh3563i67ujhwsaef" language="javascript">const a = 1</i-codeBlock>
// <p id="iutt">冲111</p>
// <i-ol start="4" tier="1" id="iii">开始了开始了</i-ol>
// <p id="wrthnwrijg">冲222</p>
// <i-ol start="5" tier="1" id="jjj">开始了开始了</i-ol>
// <p id="etyjetyj">冲333</p>
// <i-ol start="1" level="1" >开始了开始</i-ol>
export enum NodeTypeEum {
  Paragraph = 'IParagraph',
  Header = 'IHeader',
  HeaderIcon = '3',
  OrderList = 'IOrderedList',
  OrderListContent = '4',
  OrderListLabel = '5',
  BulleList = 'IBulletList',
  Task = 'ITask',
  Link = 'ILink',
  HoverLink = '8',
  Blockquote = 'IBlockquote',
  CodeBlock = 'ICodeBlock',
  HighLightBlock = 'IHighLightBlock',
  CommendText = 'ICommendText',
  Commend = 'ICommend',
  Color = 'IColor',
  HighLight = 'IHighlight',
  Align = 'alignClass',
  Bold = 'bold',
  Strike = 'strike',
  Underline = 'underline',
  Italic = 'italic',
  Code = 'code'
}

// const mapping = new Mapping()

const Tiptap = () => {
  const settingOrderLabel = useRef(false)
  // editor.commands.scrollIntoView();
  const { userName, userColor, documentTitle } = useLogin()

  const {
    curHeaderId,
    setCurHeaderId,
    scrollTop,
    setScrollTop,
    curTaskIdList,
    setCurTaskIdList,
    setCurSelectedIdList,
    setViewPortId,
    deleteViewPortId
  } = useMove()

  const {
    setClosingRange,
    closingRange,
    IHeadConfig,
    setIHeadConfig,
    setIHeadConfigList,
    IHeadConfigList
  } = useHeader()

  // console.log('IHeadConfig', IHeadConfig)
  // console.log('IHeadConfigList', IHeadConfigList)

  const {
    isCommentEdit,
    commentList,
    setCommentList,
    editCommend,
    commentListObj,
    deleteCommend,
    setDeleteCommentListObj,
    deleteCommentListObj,
    clearDeleteCommentListObj
  } = useComment()

  // 选择范围（用于链接输入操作）
  const selectionRange = useRef<any>({ from: 0, to: 0 })
  const [selectionRange2, setSelectionRange2] = useState<any>(null)
  // console.log('selectionRange2', selectionRange2)

  // const onWsOpen = (ws: WebSocket) => {
  //   console.log();

  //   ws.send(
  //     JSON.stringify({
  //       type: 'addUser',
  //       userConfig: {
  //         from: selectionRange.current.from,
  //         to: selectionRange.current.to,
  //         name: userNameRef.current,
  //         color: userColorRef.current
  //       }
  //     })
  //   )
  // }

  const { backMsg, sendMessage } = useWebSocket('ws://localhost:8888/ws/tiptap')

  // 当前链接内容
  const [linkHref, setLinkHref] = useState('')

  const [tiptapHeight, setTiptapHeight] = useState(0)

  // 当前最后一个节点的id
  const curLastId = useRef('')

  // 复制保存的节点内容
  const [pasetContent, setPasteContent] = useState<any>(null)

  const scrollbarRef = useRef<HTMLDivElement>(null)

  // 当前是否为输入法状态
  // const isComposing = useRef(false)
  const [isComposing, setIsComposing] = useState(false)

  // 有序列表label位置配置
  const [orderLabelConfig, setOrderLabelConfig] = useState<any>()
  // console.log('orderLabelConfig',orderLabelConfig);

  const [orderLabelSet, setOrderLabelSet] = useState<any>()

  const prevTaskDom = useRef<any>()

  const curLinkMarkConfig = useRef<any>(undefined)

  // 链接悬浮位置
  const [hoverLinkPosition, setHoverLinkPosition] = useState<any>()

  // 左侧功能块配置
  const [functionBlockConfig, setFunctionBlockConfig] = useState<any>({ show: false })

  // 当前是否为保存状态
  const [isSaving, setIsSaving] = useState(false)

  // 延时器
  const timer = useRef<number>()

  const hoverId = useRef('')

  const customStarterKit = StarterKit.configure({
    paragraph: false,
    heading: false,
    bulletList: false,
    listItem: false,
    orderedList: false,
    codeBlock: false
    // history: false
    // history: { newGroupDelay: 10000 }
  })

  // 扩展数组
  const extensions = [
    customStarterKit,
    IParagraph,
    IHeader,
    IOrderedList,
    IBulletList,
    ITask,
    IDefaultSelection,
    ILink.configure({
      openOnClick: true,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https'],
      HTMLAttributes: {
        class: 'ILink',
        ['data-type']: NodeTypeEum.Link
      },
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL
          const parsedUrl = url.includes(':')
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`)

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false
          }

          // disallowed protocols
          const disallowedProtocols = ['ftp', 'file', 'mailto']
          const protocol = parsedUrl.protocol.replace(':', '')

          if (disallowedProtocols.includes(protocol)) {
            return false
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p) => (typeof p === 'string' ? p : p.scheme))

          if (!allowedProtocols.includes(protocol)) {
            return false
          }

          // disallowed domains
          const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
          const domain = parsedUrl.hostname

          if (disallowedDomains.includes(domain)) {
            return false
          }

          // all checks have passed
          return true
        } catch {
          return false
        }
      },
      shouldAutoLink: (url) => {
        try {
          // construct URL
          const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
          const domain = parsedUrl.hostname

          return !disallowedDomains.includes(domain)
        } catch {
          return false
        }
      }
    }),
    IBlockquote,
    Underline,
    ICodeBlock,
    IHighLightBlock,
    IColor,
    IHighlight,
    ICommend,
    createCursorPlugin
    // IUserSelection
  ]

  const wsStepList = useRef<any[]>([])

  const stepsTimer = useRef<number>()

  const sendTransaction = async (transaction: Transaction) => {
    if (!editor) return
    if (!stopWs.current) setIsSaving(true)
    clearTimeout(stepsTimer.current)
    const stepList = transaction.steps.map((step) => step.toJSON())
    wsStepList.current = wsStepList.current.concat(stepList)
    await new Promise((resolve) => {
      stepsTimer.current = setTimeout(resolve, 500)
    })
    if (stopWs.current) {
      stopWs.current = false
      wsStepList.current = []
      return
    } else {
      // console.log('json', editor.getJSON())
      post('/saveData', { data: editor.getJSON() }).then(() => setIsSaving(false))
      sendMessage({
        type: 'transaction',
        steps: wsStepList.current,
        name: userName
      })
      wsStepList.current = []
    }
  }

  // 用于历史事件的评论模块特殊处理
  const isHistoryOperate = useRef(false)

  // 处理comment
  const handleComment = (transaction: Transaction) => {
    transaction.steps.forEach((step) => {
      if (step instanceof ReplaceStep) {
        if (
          isHistoryOperate.current &&
          step.slice.content.content.length &&
          Object.keys(deleteCommentListObj).length
        ) {
          // 新增场景
          // console.log('add', step.slice.content.content)
          handleRecoverComment(step.slice.content.content)
        } else if (!step.slice.content.content.length) {
          // 删除场景
          const { from, to } = step
          const beforeDoc = transaction.before
          const deletedContent = beforeDoc.slice(from, to)
          // console.log('delete', deletedContent)
          handleDeleteComment(deletedContent.content.content)
        }
        isHistoryOperate.current = false
      }
      // 新增mark场景
      if (step instanceof RemoveMarkStep && step.mark.type.name == NodeTypeEum.Commend) {
        const mark = step.mark
        const classist = mark.attrs.class.split(' ')
        const tiptap = document.getElementById('tiptap')
        classist.forEach((class2) => {
          if (!tiptap?.querySelector(`.${class2}`)) {
            const target = { ...commentListObj[class2.slice(11)] }
            deleteCommend(target.id)
            setDeleteCommentListObj({ ...target })
          }
        })
      }
      // 删除mark场景
      if (
        step instanceof AddMarkStep &&
        step.mark.type.name == NodeTypeEum.Commend &&
        deleteCommentListObj[step.mark.attrs.id]
      ) {
        const mark = step.mark
        const target = deleteCommentListObj[mark.attrs.id]
        commentList.splice(target.index || 0, 0, target)
        setCommentList([...commentList])
        clearDeleteCommentListObj(mark.attrs.id)
      }
    })
  }

  // 恢复comment的场景
  const handleRecoverComment = (list: readonly any[]) => {
    if (!list.length) return
    list.forEach((item) => {
      if (item.isBlock) {
        handleRecoverComment(item.content.content)
      } else if (item.isText && item.marks.length) {
        item.marks.forEach((item2) => {
          if (item2.type.name === NodeTypeEum.Commend && deleteCommentListObj[item2.attrs.id]) {
            const target = deleteCommentListObj[item2.attrs.id]
            commentList.splice(target.index || 0, 0, target)
            setCommentList([...commentList])
            clearDeleteCommentListObj(item2.attrs.id)
          }
        })
      }
      // console.log('item', item)
    })
  }

  // 删除comment的场景
  const handleDeleteComment = (list: readonly any[]) => {
    if (!list.length) return
    list.forEach((item) => {
      if (item.isBlock) {
        handleDeleteComment(item.content.content)
      } else if (item.isText && item.marks.length) {
        item.marks.forEach((item2) => {
          if (item2.type.name === NodeTypeEum.Commend) {
            const classist = item2.attrs.class.split(' ')
            const tiptap = document.getElementById('tiptap')
            classist.forEach((class2) => {
              if (!tiptap?.querySelector(`.${class2}`)) {
                const target = { ...commentListObj[class2.slice(11)] }
                deleteCommend(target.id)
                setDeleteCommentListObj({ ...target })
              }
            })
          }
        })
      }
    })
  }

  // 首次selection不记录
  const isSelectionFirst = useRef(true)

  // 禁止用户鼠标选择选择更新
  const stopUpdateSelection = useRef(false)

  useEffect(() => {
    if (userName && userColor) {
      sendMessage({
        type: 'updateUser',
        userConfig: {
          from: selectionRange2?.from || 0,
          to: selectionRange2?.to || 0,
          name: userName,
          colorConfig: userColor
        },
        stopUpdate: stopUpdateSelection.current
      })
      if (stopUpdateSelection.current) stopUpdateSelection.current = false
    }
  }, [userName, userColor, selectionRange2])

  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        spellcheck: 'false' // 禁用拼写检查
      }
    },
    onPaste(e, slice) {
      // 复制粘贴功能
      slice.content.forEach((node) => {
        node.attrs.id = nanoid()
      })
    },
    onSelectionUpdate: ({ editor }) => {
      const { state } = editor
      // 选择范围已更改。
      const from = editor.state.selection.from
      const to = editor.state.selection.to
      if (isSelectionFirst.current) {
        isSelectionFirst.current = false
      } else {
        selectionRange.current = { from, to }
        setSelectionRange2({ from, to })
      }
      if (from == to) {
        bubbleMenuPosition && setBubbleMenuPosition(undefined)
      }
      const list: any[] = []
      state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.isBlock || (node.isInline && !node.isText)) {
          list.push(node.attrs.id)
        }
      })
      setCurSelectedIdList(list)
    },
    onBeforeCreate: async ({ editor }) => {
      // 在视图创建之前。
      document.title = '未命名文档 - cg文档'
      // const res = await get('/getData')
      // if (res.successful) {
      //   editor.commands.setContent(res.data)
      // }
    },
    onCreate({ editor }) {
      // 编辑器已准备好。
      // console.log('onCreate')
      // const { state, view } = editor
      // const { tr } = state
      // const newNode = editor.schema.nodes.IHeader.createAndFill({
      //   id: nanoid(),
      //   level: 1,
      //   placeholder: '请输入标题',
      //   isTop: true
      // })
      // // // isStopUpdate.current = true
      // if (!newNode) return
      // tr.insert(0, newNode)
      // view.dispatch(tr)
      const obj: any = {}
      const list = editor.$nodes('IHeader') || []
      list.forEach((item, i) => {
        // console.log('item', item)
        const { level, id } = item.attributes
        // const scroll = scrollTop + view.coordsAtPos(item.pos).top - 104 - 150
        const value = {
          pos: item.pos,
          text: item.textContent,
          level,
          id
          // scroll: scroll > 0 ? scroll : 0
        }
        obj[id] = value
        return value
      })
      if (list.length) list.sort((a, b) => a.pos - b.pos)
      setIHeadConfig(obj)
    },
    onUpdate: ({ editor, transaction }) => {
      console.log('onUpdate', transaction)

      // 用于判断是否需要更新光标，仅更新mark的场景是不需要的
      if (selectionRange2) {
        const shouldStop = transaction.steps.some((item) => !(item instanceof AddMarkStep))
        if (shouldStop) {
          stopUpdateSelection.current = true
        } else {
          stopUpdateSelection.current = false
        }
      }

      sendTransaction(transaction)

      handleComment(transaction)

      // 内容已更改。
      const innerHeight = window.innerHeight - 64
      const tiptapHeight2 = document.getElementById('tiptap')?.children[0]?.offsetHeight + 38 || 0
      setTiptapHeight(innerHeight > tiptapHeight2 ? innerHeight : tiptapHeight2)
      const { state } = editor
      const doc = state.doc
      const lastNode = doc.lastChild
      // 判断是否需要更新最后一个默认段落节点
      if (
        !lastNode ||
        lastNode.type.name !== 'IParagraph' ||
        lastNode.textContent.trim().length > 0
      ) {
        curLastId.current = nanoid()
        editor.commands.insertContentAt(doc.content.size, `<p id='${curLastId.current}'></p>`, {
          updateSelection: false,
          parseOptions: {
            preserveWhitespace: 'full'
          }
        })
      }
    },
    onTransaction: ({ editor, transaction }) => {
      // console.log();
      // 编辑器状态已改变。
      // console.log('updateStep222', transaction)
      // console.log('transaction', transaction)
      // console.log('step', transaction.steps)
      // console.log('editor', editor.state.tr.setMeta)
      // transaction.setMeta('addToHistory', false)
      // const transaction2 = editor.state.tr.setMeta('addToHistory', false)
      // 执行一些改变
      // editor.view.dispatch(transaction2)
    },
    onFocus({ editor, event }) {
      // 编辑器获得焦点。
    },
    onBlur({ editor, event }) {
      // 编辑器失去焦点。
      // console.log();
      selectionRange.current = { from: 0, to: 0 }
      // setSelectionRange2(null)
      bubbleMenuPosition && setBubbleMenuPosition(undefined)
      stopUpdateSelection.current = false
    },
    onDestroy() {
      // 编辑器正在销毁。
    },
    onContentError({ editor, error, disableCollaboration }) {
      // 内容不符合模式。
    }
  })

  // 滚动到指定位置的函数
  const scrollToPosition = (item: any) => {
    if (scrollbarRef.current) {
      const dom = document.getElementById(item.id + '-' + NodeTypeEum.Header)?.children[0]
      dom?.classList.add('scrollHeaderTempShow')
      setTimeout(() => {
        dom?.classList.remove('scrollHeaderTempShow')
      }, 1400)
      const rect = dom?.getBoundingClientRect()
      const scroll = scrollTop + (rect?.top || 0) - 104 - 160
      scrollbarRef.current.scrollTo({
        top: scroll > 0 ? scroll : 0,
        behavior: 'smooth'
      })
    }
  }

  // 移动事件
  const onMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!editor) return

    // 性能优化
    const tiptap = document.getElementById('tiptap')?.children[0]
    const rightCommend = document.getElementById('rightCommend')
    if (
      tiptap &&
      !tiptap.contains(e.target) &&
      !rightCommend?.contains(e.target) &&
      hoverId.current
    ) {
      hoverId.current = ''
      const styleTag = document.querySelectorAll('body style')[1]
      if (styleTag) styleTag.innerHTML = ''
      return
    }

    if (e.target.className == 'ant-popover-inner') return
    if (settingOrderLabel.current) return
    // 有序列表事件
    if (
      e.target.dataset.type &&
      [NodeTypeEum.OrderListLabel].includes(e.target.dataset.type as NodeTypeEum)
    ) {
      return
    }
    if (
      e.target.dataset.type &&
      [NodeTypeEum.OrderListContent].includes(e.target.dataset.type as NodeTypeEum)
    ) {
      const orderDom = e.target
      if (!orderLabelConfig || orderLabelConfig.id != orderDom.dataset.id) {
        const rect = orderDom.getBoundingClientRect()
        if (rect.x + 20 + 8 * (orderDom.dataset.num.length - 1) < e.clientX || e.clientX < rect.x) {
          orderLabelConfig && setOrderLabelConfig(null)
          return
        }
        setOrderLabelConfig({
          x: rect.x,
          y: rect.y - 64,
          id: orderDom.dataset.id,
          start: orderDom.dataset.start,
          width: 20 + 8 * (orderDom.dataset.num.length - 1)
        })
      }
    } else {
      orderLabelConfig && setOrderLabelConfig(null)
    }

    const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
    let nodeDom: any
    let headerDom: any
    let linkDom: any
    let commentDom: any

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (
        element.dataset.type &&
        [NodeTypeEum.Link].includes(element.dataset.type as NodeTypeEum)
      ) {
        linkDom = element
      }

      // 节点类型可以直接结束
      if (
        element.dataset.type &&
        [NodeTypeEum.Header, NodeTypeEum.HeaderIcon].includes(element.dataset.type as NodeTypeEum)
      ) {
        nodeDom = element
        headerDom = element
        // break
      }
      if (
        element.dataset.type &&
        [
          NodeTypeEum.BulleList,
          NodeTypeEum.Header,
          NodeTypeEum.HeaderIcon,
          NodeTypeEum.OrderList,
          NodeTypeEum.Paragraph,
          NodeTypeEum.Task,
          NodeTypeEum.Blockquote,
          NodeTypeEum.CodeBlock,
          NodeTypeEum.HighLightBlock
        ].includes(element.dataset.type as NodeTypeEum)
      ) {
        nodeDom = element
      }

      if (
        element.dataset.type &&
        [NodeTypeEum.Commend].includes(element.dataset.type as NodeTypeEum)
      ) {
        commentDom = element
        break
      }
    }

    // console.log('nodeDom', nodeDom)
    // console.log('headerDom', headerDom)
    // console.log('hoverLinkDom', hoverLinkDom)
    // console.log('linkDom', linkDom)
    // console.log('commentDom', commentDom)

    // 评论悬浮事件
    if (commentDom) {
      const id = commentDom.dataset.id
      if (id == hoverId.current) return
      // 更新评论样式
      const styleTag = document.querySelectorAll('body style')[1]
      if (!styleTag) return
      const selectedStyleContent = `.comment-id-${id} {background:#faedc2}`
      styleTag.innerHTML = selectedStyleContent
      hoverId.current = commentDom.dataset.id
      return
    } else if (hoverId.current) {
      hoverId.current = ''
      const styleTag = document.querySelectorAll('body style')[1]
      if (styleTag) styleTag.innerHTML = ''
    }

    if (nodeDom && (!functionBlockConfig || functionBlockConfig.id != nodeDom.dataset.id)) {
      const id = nodeDom.dataset.id
      let type = nodeDom.dataset.type

      // 头部的标题特殊处理
      if (
        type === NodeTypeEum.Header &&
        nodeDom.dataset &&
        nodeDom.dataset.istop &&
        JSON.parse(nodeDom.dataset.istop)
      ) {
        return setFunctionBlockConfig({ id, show: false })
      }

      // 特殊处理
      if (type == NodeTypeEum.HeaderIcon) type = NodeTypeEum.Header

      const rect = nodeDom.getBoundingClientRect()
      const x = (window.innerWidth - 750) / 2
      const node = editor.$node(type, { id })
      const showAdd = id == curLastId.current
      setFunctionBlockConfig({
        x: x + ([NodeTypeEum.Header].includes(type) ? 0 : 20),
        y: rect.y - 64 + scrollTop,
        id,
        type,
        isLast: showAdd,
        pos: node?.pos,
        show: true
      })
    }

    // 链接悬浮事件
    if (linkDom) {
      if (curLinkMarkConfig.current && curLinkMarkConfig.current.id == e.target.id) return
      let nodeDom = linkDom.parentElement
      while (nodeDom.getAttribute('data-node-view-content-react') != undefined) {
        nodeDom = nodeDom.parentElement
      }
      const { id } = nodeDom.dataset
      let { type } = nodeDom.dataset
      // 特殊情况
      if (type === NodeTypeEum.OrderListContent) type = NodeTypeEum.OrderList
      const node = editor.$node(type, { id })
      const tempConfig = {
        start: 0,
        end: 0
      }
      const curConfig = {
        href: '',
        id: '',
        start: 0,
        end: 0
      }
      editor.state.doc.nodesBetween(node?.from, node?.to, (node, pos) => {
        if (node.attrs.id == id) {
          tempConfig.start = pos + 1
          const children = node.children
          for (let i = 0; i < children.length; i++) {
            if (children[i].marks.length) {
              const linkItem = children[i].marks.find((mark) => {
                return mark.attrs.id == linkDom.id && mark.type.name == NodeTypeEum.Link
              })
              if (linkItem) {
                if (!curConfig.start) {
                  curConfig.href = linkItem.attrs.href
                  curConfig.id = linkItem.attrs.id
                  curConfig.start = tempConfig.start
                  curConfig.end = tempConfig.start + children[i].nodeSize
                } else {
                  curConfig.end += children[i].nodeSize
                }
              } else {
                if (curConfig.start) break
                tempConfig.start += children[i].nodeSize
              }
            } else {
              if (curConfig.start) break
              tempConfig.start += children[i].nodeSize
            }
          }
          return false
        }
      })
      curLinkMarkConfig.current = curConfig
      const rect = linkDom.getBoundingClientRect()
      const handleX = rect.x - 80
      const handleY = rect.y + scrollTop - 64 + 25
      if (
        !(hoverLinkPosition && hoverLinkPosition.x == handleX && hoverLinkPosition.y == handleY)
      ) {
        timer.current && clearTimeout(timer.current)
        timer.current = setTimeout(() => {
          setHoverLinkPosition({
            x: handleX,
            y: handleY,
            href: linkDom.href
          })
          timer.current = undefined
        }, 500)
      }
    }

    if (hoverLinkPosition) {
      timer.current = setTimeout(() => {
        curLinkMarkConfig.current = undefined
        hoverLinkPosition && setHoverLinkPosition(undefined)
        timer.current = undefined
      }, 500)
    }

    // 标题节点悬浮事件
    if (headerDom) {
      curHeaderId !== headerDom.dataset.id && setCurHeaderId(headerDom.dataset.id)
      return
    } else {
      curHeaderId && setCurHeaderId('')
    }
  }

  // 气泡菜单位置
  const [bubbleMenuPosition, setBubbleMenuPosition] = useState<any>(undefined)

  // 链接输入框位置
  const [linkInputPosition, setLinkInputPosition] = useState({ x: 0, y: 0 })

  // 展示链接输入框
  const [showLinkInput, setShowLinkInput] = useState(false)

  // 初始化链接输入框配置
  const resetLinkInput = () => {
    if (!editor) return
    selectionRange.current = { from: 0, to: 0 }
    curLinkMarkConfig.current = undefined
    setShowLinkInput(false)
    setLinkHref('')
  }

  // 点击事件
  const onMouseDown = (e: any) => {
    if (!editor) return

    if (showLinkInput) {
      editor.commands.undo()
      resetLinkInput()
    }

    // 禁止某些默认事件
    if (e.target.dataset.type === NodeTypeEum.HeaderIcon) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    // 禁止某些默认事件
    if (e.target.dataset.type === NodeTypeEum.Task && !e.target.dataset.ischeckedbody) {
      e.preventDefault()
      e.stopPropagation()
      const isChecked = JSON.parse(e.target.dataset.ischecked)
      const id = e.target.dataset.id
      const tier = Number(e.target.dataset.tier)
      updateAtribute(editor, { [id]: { isChecked: !isChecked, tier } })
      return
    }

    // 任务节点事件
    if (e.target.dataset.ischeckedbody) {
      if (prevTaskDom.current && e.target.dataset.id == prevTaskDom.current.dataset.id) return
      if (prevTaskDom.current) {
        const id = prevTaskDom.current.dataset.id
        const index = curTaskIdList.indexOf(id)
        if (index >= 0) {
          curTaskIdList.splice(index, 1)
        }
        prevTaskDom.current.classList.remove('taskSelected')
      }
      curTaskIdList.push(e.target.dataset.id)
      setCurTaskIdList([...curTaskIdList])
      e.target.classList.add('taskSelected')
      prevTaskDom.current = e.target
      return
    } else if (prevTaskDom.current) {
      prevTaskDom.current.classList.remove('taskSelected')
      const id = prevTaskDom.current.dataset.id
      const index = curTaskIdList.indexOf(id)
      if (index >= 0) {
        curTaskIdList.splice(index, 1)
        setCurTaskIdList([...curTaskIdList])
      }
      prevTaskDom.current = null
      return
    }

    // 评论节点相关事件
    const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
    let commendTextDom
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (
        element.dataset.type &&
        [NodeTypeEum.CommendText].includes(element.dataset.type as NodeTypeEum)
      ) {
        commendTextDom = element
        break
      }
    }

    if (commendTextDom) {
      // 避免重复触发清除效果
      e.stopPropagation()
      const classList = Array.from(commendTextDom?.classList)
      const target = commentList.find((item) => classList.includes(item.class))
      const target2 = commentList.find((item) => item.isSelected)
      const list = []
      if (target && !target.isSelected) {
        list.push(target)
        target.isEdit = true
        target.isSelected = true
        if (target2) {
          target2.isSelected = false
          list.push(target2)
        }
        editCommend(list)
      }
    }
  }

  function minMax(value = 0, min = 0, max = 0): number {
    return Math.min(Math.max(value, min), max)
  }

  // 根据pos获取当前位置
  const posToDOMRect = (view: any, from: number, to: number): any => {
    const minPos = 0
    const maxPos = view.state.doc.content.size
    const resolvedFrom = minMax(from, minPos, maxPos)
    const resolvedEnd = minMax(to, minPos, maxPos)
    const start = view.coordsAtPos(resolvedFrom)
    const end = view.coordsAtPos(resolvedEnd, -1)
    const top = Math.min(start.top, end.top)
    const left = Math.min(start.left, end.left)
    const x = left
    const y = top
    const data = {
      // top,
      // bottom,
      // left,
      // right,
      // width,
      // height,
      x,
      y
    }

    return {
      ...data,
      toJSON: () => data
    }
  }

  // 鼠标抬起事件
  const onMouseUp = (e: any) => {
    if (!editor) return
    const { from, to } = selectionRange.current
    // console.log('selectionRange', selectionRange.current)
    console.log('onMouseUp', selectionRange.current)

    if (from !== to) {
      const { view } = editor
      const { state, composing } = view
      const rect = posToDOMRect(view, from, to)
      setLinkInputPosition({
        x: rect.x - 155,
        y: rect.y - 39 + scrollTop
      })

      setBubbleMenuPosition({
        x: rect.x - 155,
        y: rect.y - 67 + scrollTop,
        from,
        to
      })
    }
  }

  // 用于有序列表中的回车事件
  const oldOrderItemList = useRef<any>([])

  // 键盘事件
  const onKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // 避免触发评论事件
    if (!editor) return
    if (isComposing) {
      e.stopPropagation()
      e.preventDefault()
      return
    }
    const { state, view } = editor
    const { tr } = state

    // @ts-ignore
    const { from, to } = state.selection

    if (e.ctrlKey && e.code === 'KeyY') {
      if (isCommentEdit) {
        message.info('评论编辑中，无法执行恢复！')
        e.stopPropagation()
        e.preventDefault()
        return
      } else {
        isHistoryOperate.current = true
      }
    }
    if (e.ctrlKey && e.code === 'KeyZ') {
      if (isCommentEdit) {
        message.info('评论编辑中，无法执行撤回！')
        e.stopPropagation()
        e.preventDefault()
        return
      } else {
        isHistoryOperate.current = true
      }
    }

    if (e.ctrlKey && e.code === 'KeyC' && pasetContent) setPasteContent(null)

    if (e.ctrlKey && e.code === 'KeyV' && pasetContent && from) {
      const newPos = tr.mapping.map(from)
      tr.insert(newPos, pasetContent.content)
      tr.setSelection(new TextSelection(tr.doc.resolve(newPos)))
      view.dispatch(tr)
      e.stopPropagation()
      e.preventDefault()
      return
    }

    const $myCustomPos = editor?.$pos(from) as NodePos
    const $toMyCustomPos = editor?.$pos(to) as NodePos
    oldOrderItemList.current = [$myCustomPos]
    // @ts-ignore
    switch ($myCustomPos.name) {
      case 'IHeader': {
        if (!$myCustomPos.element.parentElement) break
        if (e.code === 'Enter') {
          const curId = $myCustomPos.element.parentElement.dataset.id
          if (curId && closingRange[curId]) {
            closingRange[curId] = null
            setClosingRange({ ...closingRange })
          }
        }
        if (e.code === 'Backspace') {
          if ($myCustomPos.textContent) {
            const curId = $myCustomPos.element.parentElement.parentElement?.dataset.id
            if (curId && closingRange[curId]) {
              closingRange[curId] = null
              setClosingRange({ ...closingRange })
            }
          } else if ($myCustomPos.attributes.isTop) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      }
      case 'IOrderedList': {
        // 换行
        if (e.code === 'Enter') {
          if (!$myCustomPos.textContent) {
            const changeList = deleteOrderItem(editor, $myCustomPos) as any
            editor.commands.setParagraph()
            updateAtribute(editor, changeList)
            e.preventDefault()
            e.stopPropagation()
          } else {
            // 当光标处于第一位的时候,换行特殊处理
            if (($myCustomPos.before?.pos || 0) + 2 == from) {
              oldOrderItemList.current = [
                {
                  name: 'IOrderedList',
                  isSpecial: true,
                  pos: $myCustomPos.pos,
                  attributes: $myCustomPos.attributes
                }
              ]
            }
          }
        }
        // 去除类型
        if (e.code === 'Backspace') {
          // 框选删除的特殊情况处理
          if ($toMyCustomPos.attributes.id != $myCustomPos.attributes.id) {
            const orderList: any[] = []
            const levelConfig: any = {}
            let isFirst = true
            // 遍历从from到to之间的所有节点
            state.doc.nodesBetween(from, to, (node, pos) => {
              if (node.isBlock || (node.isInline && !node.isText)) {
                if (node.type.name === 'IOrderedList') {
                  orderList.push({
                    name: 'IOrderedList',
                    pos: pos,
                    attributes: node.attrs
                  })
                  if (
                    levelConfig[node.attrs.tier] &&
                    levelConfig[node.attrs.tier].start + 1 == node.attrs.start
                  ) {
                    levelConfig[node.attrs.tier] = {
                      start: node.attrs.start,
                      length: levelConfig[node.attrs.tier].length + 1
                    }
                  } else {
                    if (isFirst) {
                      levelConfig[node.attrs.tier] = {
                        start: node.attrs.start,
                        length: 0
                      }
                      isFirst = false
                    } else {
                      levelConfig[node.attrs.tier] = {
                        start: node.attrs.start,
                        length: 1
                      }
                    }
                  }
                }
              }
            })
            const idList = orderList.map((item) => item.attributes.id)
            const changeList: any = {}
            let curIndex = 0
            const tierList = Object.keys(levelConfig)
            const lastPos = orderList[orderList.length - 1].pos
            tierList.forEach((tier) => {
              const children = editor.$nodes('IOrderedList', { tier: Number(tier) }) || []
              for (let i = 0; i < children.length; i++) {
                if (children[i].pos > lastPos && !idList.includes(children[i].attributes.id)) {
                  if (children[i].attributes.start == levelConfig[tier].start + curIndex + 1) {
                    changeList[children[i].attributes.id] = {
                      start: children[i].attributes.start - levelConfig[tier].length,
                      tier: Number(tier)
                    }
                    curIndex++
                  } else {
                    break
                  }
                }
              }
            })
            updateAtribute(editor, changeList)
          } else {
            if (!$myCustomPos.textContent) {
              const changeList = deleteOrderItem(editor, $myCustomPos) as any
              editor.commands.setParagraph()
              updateAtribute(editor, changeList)
              e.preventDefault()
              e.stopPropagation()
            }
          }
        }
        // 降级
        if (e.shiftKey && e.code === 'Tab') {
          const changeList = upgradeOrderItem(editor, $myCustomPos)
          updateAtribute(editor, changeList)
          e.preventDefault()
          e.stopPropagation()
        }
        // 升级
        if (!e.shiftKey && e.code === 'Tab') {
          const changeList = degradeOrderItem(editor, $myCustomPos)
          updateAtribute(editor, changeList)
          e.preventDefault()
          e.stopPropagation()
        }
        break
      }
      case 'IBulletList': {
        if (e.code === 'Enter') {
          // 当光标处于第一位的时候,换行特殊处理
          if ($myCustomPos.before.pos + 2 == from) {
            oldOrderItemList.current = [
              {
                name: 'IBulletList',
                isSpecial: true,
                pos: $myCustomPos.pos,
                attributes: $myCustomPos.attributes
              }
            ]
          }
        }
        // 降级
        if (e.shiftKey && e.code === 'Tab') {
          if ($myCustomPos.attributes.tier == 1) {
            editor.commands.setParagraph()
          } else {
            const changeList = {
              [$myCustomPos.attributes.id]: { tier: $myCustomPos.attributes.tier - 1 }
            }
            updateAtribute(editor, changeList)
          }
          e.preventDefault()
          e.stopPropagation()
        }
        // 升级
        if (!e.shiftKey && e.code === 'Tab') {
          const changeList = {
            [$myCustomPos.attributes.id]: { tier: $myCustomPos.attributes.tier + 1 }
          }
          updateAtribute(editor, changeList)
          e.preventDefault()
          e.stopPropagation()
        }
        // 去除类型
        if (e.code === 'Backspace') {
          if (!$myCustomPos.textContent) {
            editor.commands.setParagraph()
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      }
      case 'IBlockquote': {
        // if (e.code === 'Enter') {
        //   editor.chain().focus().setHardBreak().run()
        //   e.stopPropagation()
        //   e.preventDefault()
        // }
        // 去除类型
        if (e.code === 'Backspace') {
          if (!$myCustomPos.textContent) {
            editor.commands.setParagraph()
            e.preventDefault()
            e.stopPropagation()
          }
        }
        break
      }
      case 'ICodeBlock': {
        // if (e.code === 'Enter') {
        //   editor.chain().focus().setHardBreak().run()
        //   e.stopPropagation()
        //   e.preventDefault()
        // }
        // 去除类型
        if (e.code === 'Backspace') {
          if (!$myCustomPos.textContent) {
            e.preventDefault()
            e.stopPropagation()
          }
        }
        if (e.code === 'Tab') {
          const state = editor.state
          // if (!state.selection.empty) {
          // } else {
          editor.commands.insertContent('  ')
          // }
          e.preventDefault()
          e.stopPropagation()
        }
        break
      }
    }
  }

  // 键盘事件
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!editor || !oldOrderItemList.current.length) return
    if (isComposing) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    switch (oldOrderItemList.current[0].name) {
      case 'IBlockquote': {
        break
      }
      case 'ICodeBlock': {
        break
      }
      case 'IHighLightBlock': {
        break
      }
      case 'IOrderedList': {
        if (e.code === 'Enter') {
          const attributes = oldOrderItemList.current[0].attributes

          const curPos = editor?.state.selection.anchor || 0

          const children = editor.$nodes('IOrderedList', { tier: attributes.tier }) || []

          let curIndex = attributes.start + 1
          const changeList = {}
          for (let i = 0; i < children?.length; i++) {
            if (children[i].pos > curPos) {
              if (
                children[i].attributes.start === curIndex &&
                children[i].attributes.tier === attributes.tier
              ) {
                // @ts-ignore
                changeList[children[i].attributes.id] = {
                  start: curIndex + 1,
                  tier: attributes.tier
                }
                curIndex++
              } else {
                break
              }
            }
          }
          // console.log('changeList', changeList)
          updateAtribute(editor, changeList)
          // @ts-ignore
          editor?.commands.setIOrderedList({
            ...attributes,
            start: attributes.start + 1
          })
          // 当光标处于第一位的时候,换行特殊处理
          if (oldOrderItemList.current[0] && oldOrderItemList.current[0].isSpecial) {
            const targetPos = editor.state.selection.anchor
            editor.commands.focus(oldOrderItemList.current[0].pos)
            // @ts-ignore
            editor.commands.setIOrderedList(attributes)
            editor.commands.focus(targetPos)
          }
        }
        break
      }
      case 'IBulletList': {
        // console.log(111,oldOrderItemList.current[0].name ,e.code)
        if (e.code === 'Enter') {
          const item = oldOrderItemList.current[0]
          // @ts-ignore
          editor.commands.setIBulletList({ tier: item.attributes.tier })
          if (item && item.isSpecial) {
            const targetPos = editor.state.selection.anchor
            editor.commands.focus(item.pos)
            // @ts-ignore
            editor.commands.setIBulletList({ tier: item.attributes.tier })
            editor.commands.focus(targetPos)
          }
        }
        break
      }
      default: {
        // 当前换行默认执行的事件
        if (e.code === 'Enter') {
          editor.commands.setParagraph()
        }
      }
    }
    oldOrderItemList.current = []
  }

  // 判断当前是否为输入法使用中
  const handleComposition = (e: any) => {
    if (e.type === 'compositionstart') {
      // 开始使用输入法
      setIsComposing(true)
      // isComposing.current = true
    }
    if (e.type === 'compositionend') {
      // 结束使用输入法
      setIsComposing(false)
      // isComposing.current = false
    }
  }

  // 有序列表标题点击弹出框
  const items: MenuProps['items'] = [
    {
      label: (
        <Tooltip title="未实现">
          <div>
            <IIcon
              name="icon-backOrderList"
              style={{ marginRight: '12px', top: '2px' }}
              size="17"
            />
            继续之前的编号
          </div>
        </Tooltip>
      ),
      key: '0',
      disabled: true
    },
    {
      label: (
        <div>
          <IIcon name="icon-newOrderList" style={{ marginRight: '12px', top: '2px' }} size="17" />
          开始新列表
        </div>
      ),
      key: '1',
      onClick: () => {
        if (!editor) return
        const changeList = rearrangeOrderItem(editor, orderLabelConfig.id)
        updateAtribute(editor, changeList)
      },
      disabled: orderLabelConfig?.start == 1
    },
    {
      label: (
        <Tooltip title="未实现">
          <div>
            <IIcon
              name="icon-editOrderList"
              style={{ marginRight: '12px', top: '2px' }}
              size="17"
            />
            修改编号值
          </div>
        </Tooltip>
      ),
      key: '2',
      onClick: () => setOrderLabelSet(orderLabelConfig),
      disabled: true
    }
  ]

  // 滚动条滚动事件
  const updateScrollPosition = (e: any) => {
    setScrollTop(e.target.scrollTop)
  }

  const resetLinkHref = () => {
    if (!editor) return
    if (!linkHref.trim()) {
      editor.commands.undo()
      resetLinkInput()
    } else {
      editor.commands.undo()
      convertMark(
        editor,
        curLinkMarkConfig.current ? curLinkMarkConfig.current.start : selectionRange.current.from,
        curLinkMarkConfig.current ? curLinkMarkConfig.current.end : selectionRange.current.to,
        editor.schema.marks.ILink,
        { href: linkHref, id: nanoid() }
      )
      resetLinkInput()
    }
  }

  useEffect(() => {
    const updateScrollPosition2 = () => {
      const innerHeight = window.innerHeight - 64
      const tiptapHeight2 = document.getElementById('tiptap')?.children[0]?.offsetHeight + 38 || 0
      setTiptapHeight(innerHeight > tiptapHeight2 ? innerHeight : tiptapHeight2)
    }
    // 需要异步获取，内容有二次变化
    setTimeout(() => {
      updateScrollPosition2()
    }, 0)
    window.addEventListener('resize', updateScrollPosition2)
    return () => window.removeEventListener('resize', updateScrollPosition2)
  }, [])

  // 对于ws返回内容，暂停触发ws行为
  const stopWs = useRef(false)
  // 更新用户防抖
  const updateUserTimer = useRef<number>(0)

  useEffect(() => {
    if (!editor || !backMsg) return
    // console.log('backMsg', backMsg)

    switch (backMsg.type) {
      case 'transaction': {
        if (backMsg.name !== userName) {
          const steps = backMsg.steps.map((step) => {
            return Step.fromJSON(editor?.schema, step)
          })
          // console.log('返回', steps)
          const transaction = editor.state.tr
          steps.forEach((step) => {
            transaction.step(step)
          })
          // 更新避免与react冲突，需要异步更新
          setTimeout(() => {
            editor.view.dispatch(transaction)
            // console.log('html', editor.getJSON());
          }, 0)
          stopWs.current = true
        }
        break
      }
      case 'updateUser': {
        // 增加防抖，优化性能
        clearTimeout(updateUserTimer.current)
        if (!backMsg.stopUpdate) {
          updateUserTimer.current = setTimeout(() => {
            console.log('updateUser', backMsg)
            editor.view.dispatch(
              editor.state.tr.setMeta(cursorPluginKey, {
                cursors: backMsg.tiptapUserList,
                name: userName
              })
            )
          }, 500)
        }

        break
      }
      // case 'init': {
      //   console.log('init', backMsg)
      //   // initCursor(editor, backMsg.tiptapUserList, userName)
      //   break
      // }
      // case 'addUser': {
      //   if (backMsg.userConfig.name !== userName) {
      //     console.log('addUser', backMsg)
      //   }
      //   break
      // }
      // case 'removeUser': {
      //   console.log('removeUser', backMsg)
      //   break
      // }
    }
  }, [backMsg])

  // 用于节流行为
  const isThrottle = useRef(false)

  return (
    <div className={s.container}>
      <div className={s.header}>
        <TopHead loading={isSaving} />
      </div>
      <div className={s.content}>
        {editor && (
          <>
            {/* 修改编号 */}
            {/* {orderLabelSet && (
              <div
                className={s.orderLabelSet}
                style={{ left: orderLabelSet.x - 142, top: orderLabelSet.y + 19 - 60 }}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                新编号为
                <InputNumber />
                <Button type="primary" style={{ width: '80px', background: 'rgb(20, 86, 240)' }}>
                  确定
                </Button>
              </div>
            )} */}
            <div style={{ height: 'calc(100vh - 64px)', position: 'relative' }}>
              <div className={s.leftHeader}>
                <LeftHeader
                  // headerRank={headerRank}
                  scrollToPosition={scrollToPosition}
                />
              </div>
              <IScrollbars
                IRef={scrollbarRef}
                onMouseMove={async (e) => {
                  if (isThrottle.current) return
                  isThrottle.current = true
                  await new Promise((resolve) => setTimeout(resolve, 75)) // 防抖
                  isThrottle.current = false
                  onMove(e)
                }}
                onScroll={updateScrollPosition}
                // onMouseDownCapture={onMouseDownCapture}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                className={s.rightContainer}
                onCompositionStart={handleComposition}
                onCompositionEnd={handleComposition}
                id="container"
              >
                {/* 有序列表 */}
                <Dropdown
                  menu={{ items }}
                  trigger={['click']}
                  onOpenChange={(open) => {
                    settingOrderLabel.current = open
                    !open && setOrderLabelConfig(null)
                  }}
                >
                  <Tooltip title="设置编号">
                    <div
                      data-type={NodeTypeEum.OrderListLabel}
                      className={s.orderLabel}
                      style={{
                        left: orderLabelConfig ? orderLabelConfig.x : 0,
                        top: orderLabelConfig ? orderLabelConfig.y + scrollTop + 4 : 0,
                        width: orderLabelConfig ? orderLabelConfig.width : 0,
                        display: orderLabelConfig ? 'block' : 'none'
                      }}
                    />
                  </Tooltip>
                </Dropdown>
                {/* <div
                ref={scrollbarRef}
                onScroll={updateScrollPosition}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                style={{
                  flex: '1',
                  justifyContent: 'space-between',
                  display: 'flex',
                  overflowY: 'scroll',
                  height: '100%'
                }}
              > */}
                <EditorContent
                  editor={editor}
                  onKeyDownCapture={onKeyDownCapture}
                  onKeyDown={onKeyDown}
                  onMouseLeave={() => setFunctionBlockConfig({ show: false })}
                  id="tiptap"
                />
                <RightCommend
                  tiptapHeight={tiptapHeight}
                  editor={editor}
                  isComposing={isComposing}
                />
                <BubbleMenu
                  setShowLinkInput={setShowLinkInput}
                  editor={editor}
                  position={bubbleMenuPosition}
                  close={() => {
                    setBubbleMenuPosition(undefined)
                    selectionRange.current = { from: 0, to: 0 }
                  }}
                />
                {/* 链接内容输入修改框 */}
                {showLinkInput && (
                  <div
                    className={s.linkPopup}
                    style={{
                      left: linkInputPosition.x,
                      top: linkInputPosition.y
                    }}
                    onKeyDownCapture={(e) => {
                      if (e.code === 'Enter') {
                        resetLinkHref()
                      }
                    }}
                    onMouseDownCapture={(e) => {
                      e.stopPropagation()
                    }}
                    onMouseUpCapture={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <div className={s.label}>链接</div>
                    <Input
                      style={{ width: '288px' }}
                      value={linkHref}
                      onChange={(e) => setLinkHref(e.target.value)}
                      placeholder="粘贴或输入一个链接"
                    />
                    <Button
                      type="primary"
                      style={{ width: '80px' }}
                      onClick={() => {
                        resetLinkHref()
                      }}
                    >
                      确定
                    </Button>
                  </div>
                )}
                {/* 链接悬浮弹出框 */}
                {hoverLinkPosition && (
                  <div
                    className={s.showHref}
                    style={{ top: hoverLinkPosition.y, left: hoverLinkPosition.x }}
                    data-type={NodeTypeEum.HoverLink}
                    onMouseMove={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      if (timer.current) clearTimeout(timer.current)
                    }}
                  >
                    <div className={s.text} title={hoverLinkPosition.href}>
                      {hoverLinkPosition.href}
                    </div>
                    <div
                      onClick={() => {
                        if (!curLinkMarkConfig.current) return
                        convertMark(
                          editor,
                          curLinkMarkConfig.current.start,
                          curLinkMarkConfig.current.end,
                          editor.schema.marks.IDefaultSelection,
                          {}
                        )
                        setLinkHref(curLinkMarkConfig.current.href)
                        setLinkInputPosition(hoverLinkPosition)
                        setHoverLinkPosition(undefined)
                        setShowLinkInput(true)
                        selectionRange.current = { from: 0, to: 0 }
                      }}
                    >
                      <EditHref className={s.hrefIcon} />
                    </div>
                    <div
                      onClick={() => {
                        removeMark(
                          editor,
                          curLinkMarkConfig.current.start,
                          curLinkMarkConfig.current.end,
                          editor.schema.marks.ILink
                        )
                        setHoverLinkPosition(undefined)
                        curLinkMarkConfig.current.href = undefined
                        selectionRange.current = { from: 0, to: 0 }
                      }}
                    >
                      <ClearHref className={s.hrefIcon} style={{ marginLeft: 12 }} />
                    </div>
                  </div>
                )}
                {/* 左侧功能块 */}
                {functionBlockConfig.show && (
                  <FunctionBlock
                    editor={editor}
                    functionBlockConfig={functionBlockConfig}
                    setPasteContent={setPasteContent}
                  />
                )}
                {/* </div> */}
              </IScrollbars>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Tiptap
