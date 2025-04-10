/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-09 21:13:20
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 12:49:44
 */
import React, { useState, useRef, useEffect } from 'react'
import { Input, Button, Spin } from 'antd'
import { useComment, type CommentItem } from '@/store'
import CommendItem from '../CommendItem'
import { type Editor } from '@tiptap/react'
import { NodeTypeEum } from '@/pages/Home'
import _ from 'lodash'
import s from './index.module.scss'
// import { deleteComment } from '@/utils/deleteComment'

interface IProps {
  // Add prop types here
  tiptapHeight: number
  editor: Editor
  isComposing: boolean
}

const RightCommend: React.FC<IProps> = ({ editor, tiptapHeight, isComposing }) => {
  const { commentList, setCommentList, editIndex, setEditIndex, editCommend, commentListObj } =
    useComment()

  // 模板渲染
  const DemoContnet = useRef<any>(null)

  const [height, setHeight] = useState('auto')
  const [outHeight, setOutHeight] = useState('auto')

  const [topList, setTopList] = useState<any>({})

  const [moveTop, setMoveTop] = useState(0)

  const prevHoverId = useRef('')

  // const onMouseMove = _.throttle((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.stopPropagation()

  //   const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
  //   let commentDom
  //   for (let i = 0; i < elements.length; i++) {
  //     const element = elements[i]
  //     if (
  //       element.dataset.type &&
  //       [NodeTypeEum.Commend].includes(element.dataset.type as NodeTypeEum)
  //     ) {
  //       commentDom = element
  //       break
  //     }
  //   }
  //   // console.log('commentDom', commentDom)
  //   if (commentDom) {

  //     // const id = commentDom.dataset.id || ''
  //     // const target = commentListObj[id]
  //     // if (target.isHover) return
  //     // 更新评论样式
  //     // const styleTag = document.querySelector('body style')

  //     // const list = []
  //     // const target2 = commentList.find((item) => item.isSelected)
  //     // if (target2) {
  //     //   target2.isSelected = false
  //     //   list.push(target2)
  //     // }
  //     // target.isSelected = true
  //     // target.isEdit = true
  //     // list.push(target)
  //     // editCommend(list)
  //   }

  //   // console.log('e', e.target)

  //   // const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
  //   // let commentDom
  //   // for (let i = 0; i < elements.length; i++) {
  //   //   const element = elements[i]
  //   //   if (
  //   //     element.dataset.type &&
  //   //     [NodeTypeEum.Commend].includes(element.dataset.type as NodeTypeEum)
  //   //   ) {
  //   //     commentDom = element
  //   //     break
  //   //   }
  //   // }
  //   // console.log('commentDom', commentDom)
  // }, 200)

  // const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  //   e.stopPropagation()
  //   const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
  //   let commentDom
  //   for (let i = 0; i < elements.length; i++) {
  //     const element = elements[i]
  //     if (
  //       element.dataset.type &&
  //       [NodeTypeEum.Commend].includes(element.dataset.type as NodeTypeEum)
  //     ) {
  //       commentDom = element
  //       break
  //     }
  //   }
  //   if (commentDom) {
  //     // console.log(111, commentDom)

  //     const id = commentDom.dataset.id || ''
  //     const target = commentListObj[id]
  //     if (target.isSelected) return
  //     target.isSelected = true
  //     target.isEdit = true
  //     const list = [target]

  //     const target2 = commentList.find((item) => item.isSelected)
  //     if (target2) {
  //       target2.isSelected = false
  //       list.push(target2)
  //     }
  //     console.log(222, list)

  //     editCommend(list)
  //   }
  // }

  useEffect(() => {
    if (!commentList.length) return
    if (editIndex < 0) return
    // 首次无法获取正确高度，进行异步获取
    setTimeout(() => {
      console.log(4262456)
      const children: HTMLDivElement[] = [...DemoContnet.current.children]
      for (let i = 0; i < children.length; i++) {
        if (!commentList[i].height) {
          commentList[i].height = children[i].offsetHeight
        }
      }
      let curTop = 0
      let selectedItem: any
      commentList.forEach((item, index) => {
        if (item.isSelected) selectedItem = item
        if (index < editIndex) {
          if (index == editIndex - 1) {
            curTop = topList[item.id] + (item.height || 0)
          }
          return
        }
        if (item.top > curTop + 11) {
          topList[item.id] = item.top
          curTop = item.top
          curTop += item.height || 0
        } else {
          curTop += 11
          topList[item.id] = curTop
          curTop += item.height || 0
        }
      })
      if (selectedItem) {
        const diff = topList[selectedItem.id] - selectedItem.top
        setMoveTop(diff)
      }
      // if (scrollIndex >= 0) {
      //   console.log('scrollIndex', scrollIndex)
      //   const target = commentList[scrollIndex]
      //   const diff = topList[target.id] - target.top
      //   setMoveTop(diff)
      // }
      const lastIndex = commentList.length - 1
      const lastId = commentList[lastIndex].id

      // 赋予高度
      setHeight(topList[lastId] + (commentList[lastIndex].height || 0) + 11 + 80 + 'px')
      setOutHeight(topList[lastId] + (commentList[lastIndex].height || 0) + 11 + 42 + 80 + 'px')
      setTopList(topList)
      setCommentList([...commentList])
      setEditIndex(-1)
      // setScrollIndex(-1)
    }, 0)
    // 两者触发顺序异步，editIndex会先触发，导致此时的commentList可能为空，因此需要监听两者
  }, [editIndex, commentList])

  const listContainer = useRef<HTMLDivElement>(null)

  const listDom = useRef([])

  useEffect(() => {
    const handleClickOutSide = (e: any) => {
      if (!listContainer.current) return
      if (!listContainer.current.contains(e.target)) {
        const target = commentList.find((item) => item.isSelected)
        if (target) {
          target.isSelected = false
          editCommend([target])
        }
      } else {
        e.stopPropagation()
        const elements = document.elementsFromPoint(e.clientX, e.clientY) as HTMLElement[]
        let commentDom
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i]
          if (
            element.dataset.type &&
            [NodeTypeEum.Commend].includes(element.dataset.type as NodeTypeEum)
          ) {
            commentDom = element
            break
          }
        }
        if (commentDom) {
          const id = commentDom.dataset.id || ''
          const target = commentListObj[id]
          if (target.isSelected) return
          const list = []
          const target2 = commentList.find((item) => item.isSelected)
          if (target2) {
            target2.isSelected = false
            list.push(target2)
          }
          target.isSelected = true
          target.isEdit = true
          list.push(target)
          editCommend(list)
        }
      }
    }

    window.addEventListener('mousedown', handleClickOutSide)
    return () => {
      window.removeEventListener('mousedown', handleClickOutSide)
    }
  }, [commentList])

  // const onKeyDownCapture = (e:any) => {
  //   console.log(e.target.value)

  //   if (e.code === 'Enter' && !e.shiftKey) {
  //     if (e.target.dataset && e.target.dataset.id) {
  //       e.preventDefault()
  //       const id = e.target.dataset.id
  //       const value = e.target.value
  //       if (value) {
  //         const item = _.cloneDeep(commentListObj[id])
  //         if (item.contentList[0].content) {
  //           item.contentList.push({
  //             content: value,
  //             name: '朱晨光',
  //             avatar: '晨光',
  //             time: String(new Date().getTime()),
  //             isEdit: false
  //           })
  //         } else {
  //           item.contentList[0].content = value
  //           item.contentList[0].time = String(new Date().getTime())
  //         }
  //         e.target.value = ''
  //         editCommend(item)
  //       }
  //     }
  //   }
  //   // console.log('eee', e.target.dataset)
  // }

  return (
    <div
      id="rightCommend"
      className={s.container}
      style={{ minHeight: tiptapHeight, height: outHeight }}
    >
      <div className={s.head}>评论</div>
      <div
        className={s.listContent}
        style={{ minHeight: tiptapHeight - 42, height, top: `${-moveTop}px` }}
      >
        <div
          ref={listContainer}
          className={s.moveDetail}
          // onMouseMove={onMouseMove}
          // 优化性能
          onMouseUpCapture={(e) => e.stopPropagation()}
        >
          {commentList.map((item) => {
            if (topList[item.id]) {
              return (
                <CommendItem
                  key={item.id}
                  item={item}
                  handledTop={topList[item.id]}
                  isComposing={isComposing}
                />
              )
            } else {
              return <React.Fragment key={item.id}></React.Fragment>
            }
          })}
        </div>
        <div className={s.moveDetail} style={{ opacity: 0, left: '-9999px' }} ref={DemoContnet}>
          {commentList.map((item) => {
            return (
              <CommendItem key={item.id} item={item} handledTop={topList[item.id]} isDemo={true} />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default RightCommend
