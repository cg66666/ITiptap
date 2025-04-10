/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 13:25:28
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { Tooltip, Popover } from 'antd'
import { TypeEnum } from '../../index'
import { useHeader, useMove } from '@/store'
import s from './index.module.scss'
import Scrollbars from 'react-custom-scrollbars'

// 表情包列表
const emojiList = [
  '💡',
  '😀',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🙂',
  '🙃',
  '🫠',
  '😉',
  '😇',
  '🥰',
  '😍',
  '😘',
  '😚',
  '🥲',
  '😋',
  '😛',
  '🤪',
  '🤑',
  '🤗',
  '🤭',
  '🫢',
  '🫣',
  '🤫',
  '🤔',
  '🫡',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '🙄',
  '😬',
  '😌',
  '😔',
  '😪',
  '🤤',
  '😴',
  '😷',
  '🤮',
  '🥵',
  '🥶',
  '😵',
  '😵‍💫',
  '🤯',
  '🥳',
  '🤓',
  '😕',
  '😟',
  '😮',
  '🥺',
  '😨',
  '😭',
  '😱',
  '😡',
  '💀',
  '💩',
  '🤡',
  '👻'
]

interface IProps {
  node: any
  getPos: () => number
  updateAttributes: (attributes: Record<string, any>) => void
}
const IHighLightBlock = ({ getPos, node, updateAttributes }: IProps) => {
  const { id, alignClass, emoji } = node.attrs

  const { scrollTop, curSelectedIdList, curViewPortIdList } = useMove()

  const { closeIList } = useHeader()

  const myRef = useRef<HTMLElement>(null)

  const [height, setHeight] = useState(0)

  const [curEmoji, setCurEmoji] = useState(emoji)

  const [popOpen, setPopOpen] = useState(false)

  const [isOutOfViewPort, setIsOutOfViewPort] = useState(false)
  // const isOutOfViewPort = curSelectedIdList.includes(id) ? false : !curViewPortIdList.has(id)
  // const isFirst = useRef(true)
  // const isOutOfViewPort = useMemo(() => {
  //   if (isFirst.current) {
  //     isFirst.current = false
  //     return false
  //   }
  //   if (curSelectedIdList.includes(id)) return false
  //   console.log('curViewPortIdList', curViewPortIdList)

  //   return !curViewPortIdList.has(id)
  // }, [curSelectedIdList, curViewPortIdList])

  const isHidden = useMemo(() => {
    const pos = getPos()
    return closeIList.some(
      (item) => item && item.start < pos && (item.end ? item.end > pos + 1 : true)
    )
  }, [closeIList])

  const content = (
    <div
      style={{ height: 200, width: 380 }}
      onMouseMoveCapture={(e) => {
        e.stopPropagation()
      }}
    >
      <Scrollbars autoHide>
        <div className={s.emojiContent}>
          {emojiList.map((emoji, index) => (
            <div
              key={index}
              onClick={() => {
                setPopOpen(false)
                setCurEmoji(emoji)
              }}
            >
              <span>{emoji}</span>
            </div>
          ))}
        </div>
      </Scrollbars>
    </div>
  )

  useEffect(() => {
    if (isOutOfViewPort) return
    if (myRef.current) {
      setTimeout(() => {
        const curHeight = myRef.current.offsetHeight
        if (curHeight > 0 && height != curHeight) {
          setHeight(curHeight)
        }
      }, 0)
    }
  }, [node.textContent])

  const isFirst = useRef(true)
  const observerRef = useRef<any>()
  useEffect(() => {
    if (!myRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.target) return
          if (isFirst.current) {
            isFirst.current = false
            setIsOutOfViewPort(false)
          }
          if (entry.isIntersecting) {
            setIsOutOfViewPort(false)
          } else {
            setIsOutOfViewPort(true)
          }
        })
      },
      { root: document.getElementById('container'), rootMargin: '300px 0px' }
    )
    if (!isHidden) {
      observer.observe(myRef.current)
    } else {
      observerRef.current.disconnect(myRef.current)
    }
    // 将 observer 存储到 observerRef 中
    observerRef.current = observer
  }, [isHidden])

  return (
    <>
      {!isHidden && (
        <NodeViewWrapper
          className={`${s.outline} ${alignClass} nodeContainer`}
          id={id + '-IHighLightBlock'}
          data-id={id}
          ref={myRef}
          data-type={TypeEnum.HighLightBlock}
        >
          {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <div className={s.highLightContainer}>
              <Popover
                content={content}
                title="表情符号与人物"
                open={popOpen}
                trigger="click"
                onOpenChange={(open) => {
                  open != popOpen && setPopOpen(open)
                }}
              >
                <Tooltip title="点击更换图标">
                  <div className={s.emoji} onClick={() => setPopOpen(!popOpen)}>
                    {curEmoji}
                  </div>
                </Tooltip>
              </Popover>
              <NodeViewContent data-id={id} data-type={TypeEnum.HighLightBlock} />
            </div>
          )}
        </NodeViewWrapper>
      )}
    </>
  )
}

export default IHighLightBlock
