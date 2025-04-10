/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-24 17:51:34
 * @LastEditors: cg
 * @LastEditTime: 2025-04-08 17:10:11
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useEditor, type Editor } from '@tiptap/react'
import {
  setBulletList,
  setHeader,
  setOrderList,
  deleteOrderItem,
  degradeOrderItem,
  updateAtribute,
  setTask,
  setQuote,
  setCommend,
  setCodeBlock,
  setHightLightBlock
} from '@/utils'
import { Tooltip, Popover } from 'antd'
import { NodeTypeEum } from '@/pages/Home'
import { useMove, useComment } from '@/store'
import CommendIcon from './CommendIcon'
import FontStyle from './FontStyle'
import OtherHeader from './OtherHeader'
import Arrow from './Arrow'
import IIcon from '@/components/IIcon'
import s from './index.module.scss'
import { nanoid } from 'nanoid'

interface IProps {
  // Add prop types here
  // show: boolean
  close: () => void
  setShowLinkInput: React.Dispatch<React.SetStateAction<boolean>>
  editor: Editor
  position?: { x: number; y: number; from: number; to: number }
  functionId?: string
}

enum AlignEnum {
  TOP,
  BOTTOM
}

const BubbleMenu: React.FC<IProps> = ({
  // show,
  close,
  setShowLinkInput,
  editor,
  position
}) => {
  // console.log('position', position)

  const { commentList, setCommentList, setEditIndex } = useComment()

  const { scrollTop } = useMove()

  const [showSubMenu, setShowSubMenu] = useState(false)
  const [showSubMenu2, setShowSubMenu2] = useState(false)

  const shouldBlur = useRef(true)

  const [align, setAlign] = useState(AlignEnum.TOP)
  // console.log('align', align)

  const [prevColor, setPrevColor] = useState('')

  const [isReady, setIsReady] = useState(false)

  const [idObj, setIdObj] = useState<any>({})

  const [curType, setCurType] = useState<Record<string, any>>()
  // console.log('curType', curType)

  // 标题节点内容
  const headerSizeContent = useMemo(
    () =>
      curType ? (
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
            <button
              onClick={() => setHeader(editor, 4)}
              className={curType[NodeTypeEum.Header] == 4 ? 'is-active' : ''}
            >
              <IIcon name="icon-h4" />
            </button>
          </Tooltip>
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
            <button
              onClick={() => setHeader(editor, 5)}
              className={curType[NodeTypeEum.Header] == 5 ? 'is-active' : ''}
            >
              <IIcon name="icon-h5" />
            </button>
          </Tooltip>
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
            <button
              onClick={() => setHeader(editor, 6)}
              className={curType[NodeTypeEum.Header] == 6 ? 'is-active' : ''}
            >
              <IIcon name="icon-h6" />
            </button>
          </Tooltip>
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
            <button
              onClick={() => setHeader(editor, 7)}
              className={curType[NodeTypeEum.Header] == 7 ? 'is-active' : ''}
            >
              <IIcon name="icon-h7" />
            </button>
          </Tooltip>
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
            <button
              onClick={() => setHeader(editor, 8)}
              className={curType[NodeTypeEum.Header] == 8 ? 'is-active' : ''}
            >
              <IIcon name="icon-h8" />
            </button>
          </Tooltip>
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
            <button
              onClick={() => setHeader(editor, 9)}
              className={curType[NodeTypeEum.Header] == 9 ? 'is-active' : ''}
            >
              <IIcon name="icon-h9" />
            </button>
          </Tooltip>
        </div>
      ) : (
        <></>
      ),
    [showSubMenu, editor]
  )

  const colorList = ['#d83931', '#de7802', '#dc9b04', '#2ea121', '#245bdb', '#6425d0', '#8f959e']

  const backgroundColorList = [
    '#fbbfbc',
    '#fedcb6',
    '#fff794',
    '#c5f0c0',
    '#cedcfd',
    '#dcc9fb',
    '#e4e6e8',
    '#f76964',
    '#ffa53d',
    '#ffe928',
    '#62d256',
    '#9dbbfe',
    '#c3a4fa',
    '#bbbfc4'
  ]

  // 字体样式内容
  const fontStyleContent = () =>
    curType ? (
      <>
        <div className={s.label}>字体颜色</div>
        <div className={s.colorContent}>
          {colorList.map((color) => (
            <div
              key={color}
              onClick={() => {
                editor.commands.toggleColor({ color })
                setConfig()
              }}
              className={curType[NodeTypeEum.Color].includes(color) ? s.activeItem : ''}
            >
              <FontStyle style={{ color }} />
            </div>
          ))}
        </div>
        <div className={s.label}>背景颜色</div>
        <div className={s.colorContent}>
          {backgroundColorList.map((color) => (
            <div
              key={color}
              style={{ background: color, borderColor: 'transparent' }}
              onClick={() => {
                editor.commands.toggleHighlight({ color })
                setConfig()
              }}
              className={curType[NodeTypeEum.HighLight].includes(color) ? s.activeItem : ''}
            >
              <FontStyle />
            </div>
          ))}
        </div>
      </>
    ) : (
      <></>
    )

  const initConfig = () => {
    setCurType(undefined)
    setIdObj({})
    setIsReady(false)
    setAlign(AlignEnum.TOP)
    shouldBlur.current = true
  }

  // 更新当前节点配置
  const setConfig = () => {
    if (!position) return
    const { state } = editor
    const obj: Record<string, any> = {
      [NodeTypeEum.Header]: 0,
      [NodeTypeEum.Color]: [],
      [NodeTypeEum.HighLight]: [],
      [NodeTypeEum.Align]: []
    }
    // 获取从from到to范围内包含的所有节点
    state.doc.nodesBetween(position.from, position.to, (node, pos) => {
      // console.log('node', node, node.isInline)
      // if (node.isBlock || (node.isInline && !node.isText)) {
      //   idObj[node.attrs.id] = { pos: pos }
      // }
      if (node.isBlock) {
        idObj[node.attrs.id] = { pos: pos }
        // 头部节点需要特殊处理
        if (node.type.name == NodeTypeEum.Header) {
          obj[NodeTypeEum.Header] = node.attrs.level
        } else {
          obj[node.type.name] = []
        }
        // 存储对齐配置
        if (node.attrs[NodeTypeEum.Align]) {
          obj[NodeTypeEum.Align] = [node.attrs[NodeTypeEum.Align]]
        }
      }
      // 检查当前节点的标记
      if (node.marks && node.marks.length > 0) {
        node.marks.forEach((mark) => {
          switch (mark.type.name) {
            // 针对颜色的特殊处理
            case NodeTypeEum.Color:
            case NodeTypeEum.HighLight: {
              const color = mark.attrs.color
              if (obj[mark.type.name] && !obj[mark.type.name].includes(color)) {
                obj[mark.type.name].push(color)
              } else {
                obj[mark.type.name] = [color]
              }
              break
            }
            default: {
              obj[mark.type.name] = []
            }
          }
        })
      }
    })
    setIdObj({ ...idObj })
    // console.log('setCurType', obj)
    setCurType(obj)
  }

  // 边界碰撞判断
  useEffect(() => {
    if (position) {
      if (position.y - 46 < scrollTop) {
        setAlign(AlignEnum.BOTTOM)
      } else {
        setAlign(AlignEnum.TOP)
      }
      // 添加动画，异步修改
      setTimeout(() => {
        setIsReady(true)
      }, 200)

      setConfig()
    } else {
      initConfig()
    }
  }, [position])

  return position && curType ? (
    <div
      onMouseMoveCapture={(e) => e.stopPropagation()}
      className={s.container}
      // style={{ top: position.y + (align == AlignEnum.BOTTOM ? 90 : 0), left: position.x }}
      style={{
        top: isReady
          ? position.y + (align == AlignEnum.BOTTOM ? 40 : -46)
          : position.y + (align == AlignEnum.BOTTOM ? 30 : -36),
        left: position.x,
        opacity: isReady ? 1 : 0
      }}
      onMouseDownCapture={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      // onClick={() => {
      //   // setShow(false)
      //   // if (shouldBlur.current) editor.commands.blur()
      // }}
    >
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
        <button
          onClick={() => setHeader(editor, 1)}
          className={curType[NodeTypeEum.Header] == 1 ? 'is-active' : ''}
        >
          <IIcon name="icon-h1" />
        </button>
      </Tooltip>
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
        <button
          onClick={() => setHeader(editor, 2)}
          className={curType[NodeTypeEum.Header] == 2 ? 'is-active' : ''}
        >
          <IIcon name="icon-h2" />
        </button>
      </Tooltip>
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
        <button
          onClick={() => setHeader(editor, 3)}
          className={curType[NodeTypeEum.Header] == 3 ? 'is-active' : ''}
        >
          <IIcon name="icon-h3" />
        </button>
      </Tooltip>
      <Popover
        overlayClassName={s.menuBtn}
        content={headerSizeContent}
        arrow={false}
        onOpenChange={setShowSubMenu}
        align={{ offset: [0, -15] }}
      >
        <button className={showSubMenu ? 'is-hover' : ''}>
          {/* <IIcon name="icon-fontSize" /> */}
          <OtherHeader />
          <Arrow
            style={{ transition: 'all 0.2s', transform: `rotate(${showSubMenu ? '180deg' : 0})` }}
          />
          {/* <IIcon
            name="icon-down"
            size="24"
            style={{
              // width: '24px',
              // height: '24px',
              // boxSizing: 'borderColor-box',

              padding: ' 0 5px 14px 0',
              // marginTop: '-20px',
              transition: 'all 0.2s',
              transform: `rotate(${showSubMenu ? '180deg' : 0})`
            }}
          /> */}
        </button>
      </Popover>
      <Tooltip
        title={
          <div style={{ textAlign: 'center' }}>
            粗体（Ctrl+B）
            <br />
            Markdown：**文字** 空格
          </div>
        }
        color="#1f2329"
      >
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={curType[NodeTypeEum.Bold] ? 'is-active' : ''}
        >
          <IIcon name="icon-bold" />
        </button>
      </Tooltip>
      <Tooltip
        title={
          <div style={{ textAlign: 'center' }}>
            删除线（Ctrl+Shit+X）
            <br />
            Markdown：~~文字~~ 空格
          </div>
        }
        color="#1f2329"
      >
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={curType[NodeTypeEum.Strike] ? 'is-active' : ''}
        >
          <IIcon name="icon-strickout" />
        </button>
      </Tooltip>
      <Popover
        overlayClassName={s.fontStyleContent}
        content={fontStyleContent}
        arrow={false}
        // align={{ offset: [0, -50] }}
        // align={{ offset: [0, -15] }}
        // align={{ offset: [0, align == AlignEnum.BOTTOM ? 135 : -200] }}
      >
        <button>
          <FontStyle style={{ color: 'red' }} />
        </button>
      </Popover>
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
        <button
          onClick={() => setOrderList(editor)}
          className={curType[NodeTypeEum.OrderList] ? 'is-active' : ''}
        >
          <IIcon name="icon-orderList" />
        </button>
      </Tooltip>
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
        <button
          // onClick={() => editor.chain().focus().toggleBulletList().run()}
          onClick={() => setBulletList(editor, { tier: 1 })}
          className={curType[NodeTypeEum.BulleList] ? 'is-active' : ''}
        >
          <IIcon name="icon-list" />
        </button>
      </Tooltip>
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
        <button
          onClick={() => setTask(editor, { isChecked: false, tier: 1 })}
          // onClick={() => editor.chain().focus().toggleStrike().run()}
          className={curType[NodeTypeEum.Task] ? 'is-active' : ''}
        >
          <IIcon name="icon-taskList" />
        </button>
      </Tooltip>
      <Tooltip title={<div style={{ textAlign: 'center' }}>链接（Ctrl+K）</div>} color="#1f2329">
        <button
          onClick={() => {
            close()
            editor.commands.setDefaultSelection({ color: '#dee0e3' })
            setShowLinkInput(true)
          }}
          className={curType[NodeTypeEum.Link] ? 'is-active' : ''}
        >
          <IIcon name="icon-link" />
        </button>
      </Tooltip>
      <Popover
        overlayClassName={s.menuBtn}
        content={
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
              <button
                onClick={() => setQuote(editor, {})}
                className={curType[NodeTypeEum.Blockquote] ? 'is-active' : ''}
              >
                <IIcon name="icon-quote" size="17" style={{ position: 'relative', top: -1.5 }} />
              </button>
            </Tooltip>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  下划线（Ctrl+U）
                  <br />
                  Markdown：~文字~空格
                </div>
              }
              color="#1f2329"
            >
              <button
                onClick={() => {
                  editor.chain().focus().toggleUnderline().run()
                  setConfig()
                }}
                className={curType[NodeTypeEum.Underline] ? 'is-active' : ''}
              >
                <IIcon name="icon-underline" size="19" />
              </button>
            </Tooltip>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  斜体（Ctrl+）
                  <br />
                  Markdown：*文字* 空格
                </div>
              }
              color="#1f2329"
            >
              <button
                onClick={() => {
                  editor.chain().focus().toggleItalic().run()
                  setConfig()
                }}
                className={curType[NodeTypeEum.Italic] ? 'is-active' : ''}
              >
                <IIcon name="icon-italic" size="23" style={{ position: 'relative', top: 1.5 }} />
              </button>
            </Tooltip>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  代码（Ctrl+Shit+C）
                  <br />
                  Markdown：`代码`
                </div>
              }
              color="#1f2329"
            >
              <button
                onClick={() => {
                  editor.chain().focus().toggleCode().run()
                  setConfig()
                }}
                className={curType[NodeTypeEum.Code] ? 'is-active' : ''}
              >
                <IIcon name="icon-code" size="23" style={{ position: 'relative', top: 1.5 }} />
              </button>
            </Tooltip>
            <Tooltip title={<div style={{ textAlign: 'center' }}>高亮块</div>} color="#1f2329">
              <button
                onClick={() => setHightLightBlock(editor, {})}
                className={curType[NodeTypeEum.HighLightBlock] ? 'is-active' : ''}
              >
                <IIcon
                  name="icon-highLight"
                  size="19"
                  style={{ position: 'relative', top: '-0.5px' }}
                />
              </button>
            </Tooltip>
            <Tooltip
              title={
                <div style={{ textAlign: 'center' }}>
                  代码块（Ctrl+AIt+C）
                  <br />
                  Markdown：```空格 或``` 代码语言 空格
                </div>
              }
              color="#1f2329"
            >
              <button
                onClick={() => setCodeBlock(editor, {})}
                className={curType[NodeTypeEum.CodeBlock] ? 'is-active' : ''}
              >
                <IIcon name="icon-codeBlock" size="21" style={{ position: 'relative', top: 0.5 }} />
              </button>
            </Tooltip>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>左对齐（Ctrl+Shit+L）</div>}
              color="#1f2329"
            >
              <button
                onClick={() => {
                  if (curType[NodeTypeEum.CodeBlock]) return
                  Object.keys(idObj).forEach((name) => {
                    idObj[name] = { alignClass: 'align-left' }
                  })
                  updateAtribute(editor, idObj)
                  setConfig()
                }}
                className={`${
                  curType[NodeTypeEum.Align].includes('align-left') ? 'is-active' : ''
                } ${curType[NodeTypeEum.CodeBlock] ? s.disabled : ''}`}
              >
                <IIcon name="icon-leftAlign" size="20" />
              </button>
            </Tooltip>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>居中对齐（Ctrl+Shit+E）</div>}
              color="#1f2329"
            >
              <button
                onClick={() => {
                  if (curType[NodeTypeEum.CodeBlock]) return
                  Object.keys(idObj).forEach((name) => {
                    idObj[name] = { alignClass: 'align-center' }
                  })
                  updateAtribute(editor, idObj)
                  setConfig()
                }}
                className={`${
                  curType[NodeTypeEum.Align].includes('align-center') ? 'is-active' : ''
                } ${curType[NodeTypeEum.CodeBlock] ? s.disabled : ''}`}
              >
                <IIcon name="icon-middleAlign" size="20" />
              </button>
            </Tooltip>
            <Tooltip
              title={<div style={{ textAlign: 'center' }}>右对齐（Ctr+Shift+R）</div>}
              color="#1f2329"
            >
              <button
                onClick={() => {
                  if (curType[NodeTypeEum.CodeBlock]) return
                  Object.keys(idObj).forEach((name) => {
                    idObj[name] = { alignClass: 'align-right' }
                  })
                  updateAtribute(editor, idObj)
                  setConfig()
                }}
                className={`${
                  curType[NodeTypeEum.Align].includes('align-right') ? 'is-active' : ''
                } ${curType[NodeTypeEum.CodeBlock] ? s.disabled : ''}`}
              >
                <IIcon name="icon-rightAlign" size="20" />
              </button>
            </Tooltip>
          </div>
        }
        arrow={false}
        onOpenChange={setShowSubMenu2}
        align={{ offset: [0, -15] }}
      >
        <button className={showSubMenu2 ? 'is-hover' : ''}>
          <IIcon name="icon-other" size="17" />
        </button>
      </Popover>
      <div className={s.verticalLine}></div>
      <Tooltip
        title={<div style={{ textAlign: 'center' }}>添加评论（Ctrl+AIt+M）</div>}
        color="#1f2329"
      >
        <button
          onClick={() => {
            const idd = nanoid()
            const { selectedText, from } = setCommend(editor, {
              class: `comment-id-${idd}`,
              id: idd
            })
            // const { view } = editor
            // const { node, pos } = nodeList[0]
            // const pidList = nodeList.map(({ node }) => node.attrs.id)
            const top = position.y - 42
            // const { node, pos } = nodeList[0]
            commentList.push({
              top,
              class: `comment-id-${idd}`,
              id: idd,
              selectedText,
              contentList: [
                {
                  content: '',
                  name: '朱晨光',
                  avatar: '晨光',
                  time: '',
                  isEdit: false
                }
              ],
              isEdit: true,
              isSelected: true,
              isHover: false,
              from
            })
            commentList.sort((a, b) => a.from - b.from)
            const index = commentList.findIndex((item) => item.id == idd)
            // setScrollIndex(index)
            setEditIndex(index)
            setCommentList([...commentList])
            editor.commands.blur()
            close()
          }}
        >
          <CommendIcon />
        </button>
      </Tooltip>
    </div>
  ) : (
    <></>
  )
}

export default BubbleMenu
