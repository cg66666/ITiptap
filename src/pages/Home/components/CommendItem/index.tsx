/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-09 21:13:20
 * @LastEditors: cg
 * @LastEditTime: 2025-04-02 18:20:39
 */
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Input, Button, List } from 'antd'
import { useComment, type CommentItem } from '@/store'
import { TypeEnum } from '@/pages/Home'
import _ from 'lodash'
import s from './index.module.scss'

const { TextArea } = Input

interface IProps {
  item: CommentItem
  handledTop?: number
  // 避免闪现情况，渲染假模板
  isDemo?: boolean
  isComposing?: boolean
}

const CommendItem: React.FC<IProps> = ({ item, handledTop, isDemo, isComposing }) => {
  const { commentList, editCommend, deleteCommend } = useComment()

  const container = useRef<HTMLDivElement>(null)

  const [addText, setAddText] = useState('')

  const textArea = useRef<HTMLDivElement>(null)

  const isEmpty = !item.contentList[0].content

  const close2 = (e?: any) => {
    if (e) e.stopPropagation()
    if (isEmpty) {
      deleteCommend(item.id)
    } else {
      item.isSelected = false
      item.isEdit = false
      setAddText('')
      editCommend([item])
    }
  }

  const saveComment = (e?: any) => {
    if (e) e.stopPropagation()
    if (addText) {
      const list = []
      if (item.contentList[0].content) {
        item.contentList.push({
          content: addText,
          name: '朱晨光',
          avatar: '晨光',
          time: String(new Date().getTime()),
          isEdit: false
        })
      } else {
        item.contentList[0].content = addText
        item.contentList[0].time = String(new Date().getTime())
      }
      // 对未选择状态进行处理
      if (!item.isSelected) {
        const target = commentList.find((item) => item.isSelected)
        if (target) {
          target.isSelected = false
          list.push(target)
        }
        item.isSelected = true
      }
      list.push(item)
      setAddText('')
      editCommend(list)
    }
  }

  const onKeyDownCapture = (e: any) => {
    if (e.code === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isComposing) saveComment()
    }
  }

  useEffect(() => {
    if (isDemo) return
    // 监听更新高度
    if (container && container.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (!container.current) return
          const height = container.current.offsetHeight
          if (height != item.height) {
            // const n = _.cloneDeep(item)
            item.height = height
            editCommend([item])
          }
        }
      })
      // 开始观察指定元素
      resizeObserver.observe(container.current)

      // 清理观察者
      return () => {
        if (container && container.current) resizeObserver.unobserve(container.current)
      }
    }
  }, [item, isDemo])

  useEffect(() => {
    if (isDemo) return
    if (!item.isSelected && !addText) {
      if (!item.contentList[0].content) {
        deleteCommend(item.id)
      } else {
        item.isEdit = false
        editCommend([item])
      }
    }
  }, [item.isSelected, isDemo])

  return (
    <div
      ref={container}
      id={item.id}
      className={`${s.container} ${item.isSelected ? s.isSelected : ''}`}
      style={{ top: handledTop || item.top }}
      // onClick={addCommend}
      data-id={item.id}
      data-type={TypeEnum.Commend}
    >
      <div className={s.header}>{item.selectedText}</div>
      <div className={s.content}>
        {item.contentList.map((commend, index) => {
          const lines = commend.content.split('\n')

          return (
            <div className={s.comment} key={index}>
              {/* <div className={s.itemOperate}>就是这个了</div> */}
              <div className={s.avatar}>{commend.avatar}</div>
              <div className={s.innerContent}>
                <div className={s.commentDetail}>
                  <div className={s.name}>{commend.name}</div>
                  {/* <div className={s.time}>1月16日 16:25</div> */}
                  <div className={s.time}>{commend.time}</div>
                </div>
                <div className={s.text}>
                  {lines.map((text, index) => (
                    <div key={index}>{text}</div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {item.isEdit ? (
        <div className={s.operate}>
          <TextArea
            id="addText"
            ref={textArea}
            autoFocus
            placeholder={isEmpty ? '输入评论' : '回复'}
            onChange={(e) => setAddText(e.target.value)}
            value={addText}
            autoSize
            onKeyDownCapture={!isDemo ? onKeyDownCapture : undefined}
          />
          {addText && (
            <div className={s.commentBtn}>
              <Button style={{ marginRight: '8px' }} onClick={close2}>
                取消
              </Button>
              <Button type="primary" onMouseDownCapture={saveComment}>
                {isEmpty ? '发送' : '回复'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={s.placement}>回复...</div>
      )}
    </div>
  )
}

export default CommendItem
