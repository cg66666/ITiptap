/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-08 17:09:31
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IIcon from '@/components/IIcon'
import { NodeTypeEum } from '../../index'
import { useHeader, type headItem, useMove } from '@/store'
import s from './index.module.scss'

interface IProps {
  editor: Editor
  node: any
  getPos: () => number
  updateAttributes: any
}
// viii
// 转换罗马数字
const toRoman = (num: number) => {
  const lookup: Record<string, number> = {
    m: 1000,
    cm: 900,
    d: 500,
    cd: 400,
    c: 100,
    xc: 90,
    l: 50,
    xl: 40,
    x: 10,
    ix: 9,
    v: 5,
    iv: 4,
    i: 1
  }
  let roman = ''
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman
}

// 转换英文排序
const numberToAlpha = (num: number) => {
  const lookup: string[] = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  let result = ''
  // 将索引调整为从0开始计算
  num -= 1
  while (num >= 0) {
    result = lookup[num % 26] + result // 97 是 'a' 的 char code
    num = Math.floor(num / 26) - 1 // 调整 num 以处理下一个字符
  }
  return result
}

// console.log('toRoman', toRoman(4))

const IOrderedList = ({ updateAttributes, editor, node, getPos }: IProps) => {
  const { start, id, tier } = node.attrs
  // console.log('start', start)

  const { scrollTop, curSelectedIdList, curViewPortIdList } = useMove()

  // console.log('curViewPortIdList', id, curViewPortIdList)

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

  const dataNum = useMemo(() => {
    const curTier = tier % 3
    switch (curTier) {
      case 1: {
        return start
      }
      case 2: {
        return numberToAlpha(start)
      }
      case 0: {
        return toRoman(start)
      }
    }
  }, [start, tier])

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
          id={id + '-IOrderedList'}
          data-id={id}
          // className={s.olContainer}
          className={`${s.olContainer} nodeContainer`}
          data-start={start}
          data-num={dataNum}
          data-type={NodeTypeEum.OrderList}
          ref={myRef}
        >
          {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <NodeViewContent
              className={s.olContent}
              data-start={start}
              data-num={dataNum}
              data-type={NodeTypeEum.OrderListContent}
              data-id={id}
              style={{
                paddingLeft: `${22 + 8 * (String(dataNum).length - 1)}px`,
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

export default IOrderedList
