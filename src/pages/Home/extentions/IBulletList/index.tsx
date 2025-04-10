/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-08 17:06:12
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IIcon from '@/components/IIcon'
import { TypeEnum } from '../../index'
import { useHeader, type headItem, useMove } from '@/store'
import s from './index.module.scss'

interface IProps {
  editor: Editor
  node: any
  getPos: () => number
  updateAttributes: any
}

const IBulletList = ({ updateAttributes, editor, node, getPos }: IProps) => {
  const { id, tier, alignClass } = node.attrs

  const { scrollTop, curSelectedIdList, curViewPortIdList } = useMove()

  const { closeIList } = useHeader()

  const myRef = useRef<HTMLElement>(null)

  const [height, setHeight] = useState(0)

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

  // useEffect(() => {
  //   if (changingOrderList[id]) {
  //     updateAttributes({ start: changingOrderList[id].start, tier: changingOrderList[id].tier })
  //   }
  // }, [changingOrderList])

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
          id={id + '-IBulletList'}
          data-id={id}
          className={`${s.ulContainer} ${alignClass} nodeContainer`}
          data-tier={tier}
          data-type={TypeEnum.BulleList}
          ref={myRef}
        >
          {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <NodeViewContent
              className={`${s.ulContent} ${
                tier % 3 === 1 ? s.icon1 : tier % 3 === 2 ? s.icon2 : s.icon3
              }`}
              data-id={id}
              data-type={TypeEnum.BulleList}
              data-tier={tier}
              style={{
                paddingLeft: '22px',
                marginLeft: `${24 * (tier - 1)}px`,
                width: `calc(100% - ${24 * (tier - 1)}px)`
              }}
            />
          )}
        </NodeViewWrapper>
      )}
    </>
  )
}

export default IBulletList
