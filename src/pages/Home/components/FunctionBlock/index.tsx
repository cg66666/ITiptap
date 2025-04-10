/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-05 13:41:09
 * @LastEditors: cg
 * @LastEditTime: 2025-04-07 17:40:58
 */
import React, { useState } from 'react'
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
import { NodeTypeEum } from '@/pages/Home'
import { Popover, Tooltip, Menu, type MenuProps } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import IIcon from '@/components/IIcon'
import { nanoid } from 'nanoid'
import { convertNode } from '@/utils/convertNode'
import { useHeader, type headItem, useMove } from '@/store'
import FunctionAddBlockIcon from './FunctionAddBlockIcon'
import FunctionBlockIcon from './FunctionBlockIcon'
import CutIcon from './CutIcon'
import DeleteIcon from './DeleteIcon'
import CopyIcon from './CopyIcon'
import s from './index.module.scss'
import { deleteOrderItem, updateAtribute, clearContent, deleteNode } from '@/utils'

type MenuItem = Required<MenuProps>['items'][number]

interface IProps {
  // Add prop types here
  editor: Editor
  functionBlockConfig: any
  setPasteContent: any
}

const FunctionBlock: React.FC<IProps> = ({ editor, functionBlockConfig, setPasteContent }) => {
  const { IHeadConfig, closeIList, closingRange, setClosingRange } = useHeader()

  const items2: MenuItem[] = [
    {
      key: 'sub1',
      label: (
        <div>
          <CutIcon /> 剪切
          {/* style={{ color: '#32a645' }} */}
        </div>
      ),
      onClick: () => {
        const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
        const { state, view } = editor
        const { tr } = state
        const contentSlice = state.doc.slice($myCustomPos.range.from - 1, $myCustomPos.range.to)
        setPasteContent(contentSlice)
        tr.deleteRange($myCustomPos.range.from - 1, $myCustomPos.range.to)
        view.dispatch(tr)
      }
    },
    {
      key: 'sub2',
      label: (
        <div>
          <CopyIcon /> 复制
          {/* style={{ color: '#1456f0' }} */}
        </div>
      ),
      onClick: () => {
        const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
        const { state } = editor
        const contentSlice = state.doc.slice($myCustomPos.range.from - 1, $myCustomPos.range.to)
        setPasteContent(contentSlice)
      }
      //   disabled: true
    },
    {
      key: 'sub4',
      label: (
        <div>
          <DeleteIcon style={{ color: '#f54a45' }} /> 删除
        </div>
      ),
      onClick: () => {
        deleteNode(editor, functionBlockConfig.pos - 1)
        // convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        //   id: nanoid()
        // })
        // const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
        // clearContent(editor, $myCustomPos.pos, $myCustomPos.size - 1)
      }
    },
    {
      key: 'sub10',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub5',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub6',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub7',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub8',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub9',
      label: '待开发',
      disabled: true
    },
    {
      key: 'sub12',
      label: '待开发',
      disabled: true
    }
  ]

  const [functionIsActive, setFunctionIsActive] = useState(false)

  // 设置头部
  const setHeader = (level: number) => {
    console.log('functionBlockConfig', functionBlockConfig)

    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos

    if (functionBlockConfig.type == NodeTypeEum.Header && $myCustomPos.attributes.level == level) {
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      if (functionBlockConfig.type == NodeTypeEum.OrderList) {
        const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
        updateAtribute(editor, changeList)
      }
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IHeader, {
        id: nanoid(),
        level
      })
    }
  }

  // 设置有序列表
  const setOrderedList = () => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    if (functionBlockConfig.type == NodeTypeEum.OrderList) {
      const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
      updateAtribute(editor, changeList)
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      const changeList: any = {}
      const children = editor.$nodes('IOrderedList', { tier: 1 }) || []
      let curIndex = 0
      let targetIndex = 0
      for (let i = 0; i < children?.length; i++) {
        if (children[i].pos > functionBlockConfig.pos) {
          if (!targetIndex) {
            targetIndex = children[i].attributes.start
            curIndex = children[i].attributes.start + 1
            changeList[children[i].attributes.id] = {
              start: Number(curIndex),
              tier: Number(1)
            }
          } else if (children[i].attributes.start === curIndex) {
            curIndex++
            changeList[children[i].attributes.id] = {
              start: Number(curIndex),
              tier: Number(1)
            }
          } else {
            break
          }
        }
      }
      updateAtribute(editor, changeList)
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IOrderedList, {
        id: nanoid(),
        tier: 1,
        start: targetIndex || 1
      })
    }
  }

  // 设置无序列表
  const setBulletList = () => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    if (functionBlockConfig.type == NodeTypeEum.BulleList) {
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      if (functionBlockConfig.type == NodeTypeEum.OrderList) {
        const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
        updateAtribute(editor, changeList)
      }
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IBulletList, {
        id: nanoid(),
        tier: 1
      })
    }
  }

  // 设置任务列表
  const setTask = () => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    if (functionBlockConfig.type == NodeTypeEum.Task) {
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      if (functionBlockConfig.type == NodeTypeEum.OrderList) {
        const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
        updateAtribute(editor, changeList)
      }
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.ITask, {
        id: nanoid()
      })
    }
  }

  // 设置引用块
  const setBlockquote = () => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    if (functionBlockConfig.type == NodeTypeEum.Blockquote) {
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      if (functionBlockConfig.type == NodeTypeEum.OrderList) {
        const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
        updateAtribute(editor, changeList)
      }
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IBlockquote, {
        id: nanoid()
      })
    }
  }

  // 设置高亮块
  const setHighlightBlock = () => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    if (functionBlockConfig.type == NodeTypeEum.HighLightBlock) {
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IParagraph, {
        id: nanoid()
      })
    } else {
      if (functionBlockConfig.type == NodeTypeEum.OrderList) {
        const changeList = deleteOrderItem(editor, $myCustomPos, functionBlockConfig.pos)
        updateAtribute(editor, changeList)
      }
      convertNode(editor, functionBlockConfig.pos - 1, editor.schema.nodes.IHighLightBlock, {
        id: nanoid(),
        emoji: '💡'
      })
    }
  }

  // 设置左对齐
  const setAlign = (alignClass: string) => {
    const $myCustomPos = editor.$pos(functionBlockConfig.pos) as NodePos
    updateAtribute(editor, { [$myCustomPos.attributes.id]: { alignClass } })
  }

  // 功能块弹出框内容
  const functionContent = (
    <div
      className={s.popover}
      onMouseMoveCapture={(e) => e.stopPropagation()}
      onMouseEnter={() => {
        setFunctionIsActive(true)
        const dom = document.querySelector('.functionSelected')
        if (dom && dom.id == functionBlockConfig.id) return
        dom?.classList.remove('functionSelected')
        document
          .getElementById(functionBlockConfig.id + '-' + functionBlockConfig.type)
          ?.children[0]?.classList.add('functionSelected')
      }}
      onMouseLeave={() => {
        setFunctionIsActive(false)
        const dom = document.querySelector('.functionSelected')
        dom?.classList.remove('functionSelected')
      }}
      onClick={() => setFunctionIsActive(false)}
    >
      <Scrollbars>
        <div className={s.label}>样式</div>
        <div className={s.functionList}>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  一级标题（Ctrl+At+1）
                  <br />
                  Markdown：# 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(1)}>
                <IIcon name="icon-h1" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  二级标题（Ctrl+AIt+2）
                  <br />
                  Markdown：## 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(2)}>
                <IIcon name="icon-h2" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  三级标题（Ctrl+AIt+3）
                  <br />
                  Markdown：### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(3)}>
                <IIcon name="icon-h3" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  四级标题（Ctrl+AIt+4）
                  <br />
                  Markdown：#### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(4)}>
                <IIcon name="icon-h4" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  五级标题（Ctrl+AIt+5）
                  <br />
                  Markdown：##### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(5)}>
                <IIcon name="icon-h5" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  六级标题（Ctrl+AIt+6）
                  <br />
                  Markdown：###### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(6)}>
                <IIcon name="icon-h6" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  七级标题（Ctrl+AIt+7）
                  <br />
                  Markdown：####### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(7)}>
                <IIcon name="icon-h7" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  八级标题（Ctrl+AIt+8）
                  <br />
                  Markdown：######## 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(8)}>
                <IIcon name="icon-h8" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  九级标题（Ctrl+AIt+9）
                  <br />
                  Markdown：######### 空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={() => setHeader(9)}>
                <IIcon name="icon-h9" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  有序列表（Ctrl+Shit+7）
                  <br />
                  Markdown：1.空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={setOrderedList}>
                <IIcon name="icon-orderList" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  无序列表（Ctrl+Shit+8）
                  <br />
                  Markdown：-空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={setBulletList}>
                <IIcon name="icon-list" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  任务列表（Ctrl+At+T）
                  <br />
                  Markdown：[]空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={setTask}>
                <IIcon name="icon-taskList" size="22" />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  引用（Ctrl+Shif+&gt;）
                  <br />
                  Markdown：&gt;空格
                </div>
              }
              color="#1f2329"
            >
              <div onClick={setBlockquote}>
                <IIcon name="icon-quote" size="17" style={{ position: 'relative', left: '3px' }} />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip title={<div style={{ textAlign: 'center' }}>高亮块</div>} color="#1f2329">
              <div onClick={setHighlightBlock}>
                <IIcon
                  name="icon-highLight"
                  size="19"
                  style={{ position: 'relative', left: '2.5px', top: '2px' }}
                />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>左对齐（Ctrl+Shit+L）</div>}
              color="#1f2329"
            >
              <div onClick={() => setAlign('align-left')}>
                <IIcon
                  name="icon-leftAlign"
                  size="20"
                  style={{ position: 'relative', left: '2px', top: '2px' }}
                />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>居中对齐（Ctrl+Shit+E）</div>}
              color="#1f2329"
            >
              <div onClick={() => setAlign('align-center')}>
                <IIcon
                  name="icon-middleAlign"
                  size="20"
                  style={{ position: 'relative', left: '2px', top: '2px' }}
                />
              </div>
            </Tooltip>
          </div>
          <div>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>右对齐（Ctr+Shift+R）</div>}
              color="#1f2329"
            >
              <div onClick={() => setAlign('align-right')}>
                <IIcon
                  name="icon-rightAlign"
                  size="20"
                  style={{ position: 'relative', left: '2px', top: '2px' }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
        <div className={s.label}>操作</div>
        <Menu mode="vertical" items={items2} />
      </Scrollbars>
    </div>
  )

  return (
    <Popover
      placement="leftTop"
      content={functionContent}
      arrow={false}
      align={{ offset: [0, 0] }}
      overlayInnerStyle={{ padding: '12px 0' }}
      open={functionIsActive}
    >
      <div
        className={`${s.functionBlock} ${functionIsActive ? s.activeFunctionBlock : ''}`}
        style={{
          top: functionBlockConfig.y - 5,
          left: functionBlockConfig.x
        }}
        onMouseEnter={() => {
          setFunctionIsActive(true)
          const dom = document.querySelector('.functionSelected')
          if (dom && dom.id == functionBlockConfig.id) return
          dom?.classList.remove('functionSelected')
          document
            .getElementById(functionBlockConfig.id + '-' + functionBlockConfig.type)
            ?.children[0]?.classList.add('functionSelected')
        }}
        onMouseLeave={() => {
          setFunctionIsActive(false)
          const dom = document.querySelector('.functionSelected')
          dom?.classList.remove('functionSelected')
        }}
      >
        {functionBlockConfig.isLast ? <FunctionAddBlockIcon /> : <FunctionBlockIcon />}
      </div>
    </Popover>
  )
}

export default FunctionBlock
