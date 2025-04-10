/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-09 12:13:28
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 12:44:47
 */
import React, { useEffect, useRef, useState } from 'react'
import s from './index.module.scss'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children: any
  IRef?: React.RefObject<HTMLDivElement>
}

const IScrollbars: React.FC<IProps> = ({
  IRef,
  children,
  style = {},
  className,
  onScroll,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...rest
}) => {
  const innerRef = useRef<HTMLDivElement>(null)
  // console.log('innerRef', innerRef)

  const [curPageHeight, setCurPageHeight] = useState(1)

  const [totalHeight, setTotalHeight] = useState(1)

  const totalHeight2 = useRef(1)

  const [scrollTop2, setScrollTop2] = useState(0)

  const scrollTop = useRef(0)

  const barTop = (scrollTop2 / totalHeight) * curPageHeight || 0

  const barHeight = totalHeight < curPageHeight ? 0 : (curPageHeight / totalHeight) * curPageHeight

  const barHeight2 = useRef(0)

  const pxRatio = useRef(1)

  useEffect(() => {
    pxRatio.current = curPageHeight / barHeight || 1
    barHeight2.current = barHeight
  }, [curPageHeight, barHeight])

  const [isOut, setIsOut] = useState(true)

  const [isDragging, setIsDragging] = useState(false)

  const isDraggingInt = useRef(false)

  const startY = useRef(0)

  const scrollStart = useRef(0)

  const [rect, setRect] = useState<any>()

  const curRect = useRef<any>()

  const handleEvent =
    (callback: any, condition?: boolean) => (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      if (callback) callback(e)
      if (condition !== undefined && condition) setIsOut(false)
    }

  const innerOnScroll = handleEvent(onScroll, false)
  const innerOnMouseEnter = handleEvent(onMouseEnter, true)
  const innerOnMouseMove = handleEvent(onMouseMove, true)
  const innerOnMouseLeave = handleEvent(onMouseLeave, !isDragging)

  const content = useRef(null)

  const init = () => {
    if (IRef) {
      const rect = IRef.current?.getBoundingClientRect()
      curRect.current = rect
      setRect(rect)
      setCurPageHeight(rect?.height || 0)
    } else {
      const rect = innerRef.current?.getBoundingClientRect()
      curRect.current = rect
      setRect(rect)
      setCurPageHeight(rect?.height || 0)
    }
  }

  const moveBar = (e: any) => {
    if (!isDraggingInt.current) return
    const ref = IRef?.current || innerRef.current
    if (!ref) return
    e.stopPropagation()
    e.preventDefault()
    const diff = e.clientY - startY.current
    const scroll = scrollStart.current + pxRatio.current * diff
    if (diff) {
      const lastScroll = totalHeight2.current - curRect.current.height
      if (scroll < 0) {
        scrollTop.current = 0
        setScrollTop2(0)
        ref.scrollTo({
          top: 0
        })
      } else if (scroll > lastScroll) {
        setScrollTop2(lastScroll)
        ref.scrollTo({
          top: lastScroll
        })
      } else {
        scrollTop.current = scroll
        setScrollTop2(scroll)
        ref.scrollTo({
          top: scroll
        })
      }
    }
  }

  const stopScroll = () => {
    setIsDragging(false)
    isDraggingInt.current = false
  }

  useEffect(() => {
    let resizeObserver: any
    const ref = content.current
    if (ref) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // @ts-ignore
          if (totalHeight != entry.target.offsetHeight) {
            // @ts-ignore
            setTotalHeight(entry.target.offsetHeight)
            // @ts-ignore
            totalHeight2.current = entry.target.offsetHeight
          }
        }
      })
      // 开始观察指定元素
      resizeObserver.observe(ref)
      init()
      window.addEventListener('resize', init)
      window.addEventListener('mousemove', moveBar, true)
      window.addEventListener('mouseup', stopScroll)
    }
    // 清理观察者
    return () => {
      if (resizeObserver && ref) resizeObserver.unobserve(ref)
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', moveBar, true)
      window.removeEventListener('mouseup', stopScroll)
    }
  }, [])

  return (
    <div
      ref={IRef || innerRef}
      style={{
        position: 'relative',
        overflowY: 'scroll',
        height: '100%'
      }}
      className={`${s.container}`}
      onScroll={innerOnScroll}
      onMouseEnter={innerOnMouseEnter}
      onMouseMove={innerOnMouseMove}
      onMouseLeave={innerOnMouseLeave}
    >
      <div
        className={s.track}
        style={{
          // top: scrollTop2,
          opacity: isOut ? 0 : 1,
          left: rect?.right - 17 || 0,
          top: rect?.top || 0,
          height: rect?.height || 0
        }}
        onMouseDown={(e) => {
          if (e.clientY - 64 > barHeight + barTop) {
            if (IRef?.current) {
              IRef?.current?.scrollTo({
                top: scrollTop.current + 60
              })
            }
          } else {
            if (IRef?.current) {
              IRef?.current?.scrollTo({
                top: scrollTop.current - 60
              })
            }
          }
        }}
      >
        {!!barHeight && Number.isFinite(barHeight) && (
          <div
            className={`${s.bar} ${isDragging ? s.movingBar : ''}`}
            style={{ height: barHeight, top: barTop }}
            onMouseDownCapture={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setIsDragging(true)
              isDraggingInt.current = true
              scrollStart.current = scrollTop.current
              startY.current = e.clientY
            }}
          ></div>
        )}
      </div>
      <div ref={content} className={`${className}`} style={{ ...style }} {...rest}>
        {children}
      </div>
    </div>
  )
}

export default IScrollbars
