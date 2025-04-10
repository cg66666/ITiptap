/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-09 12:13:28
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 12:48:18
 */
import React, { useEffect, useRef, useState } from 'react'
import s from './index.module.scss'

interface IProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
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
  id,
  ...rest
}) => {
  const innerRef = useRef<HTMLDivElement>(null)

  const [curPageHeight, setCurPageHeight] = useState(1)
  const [totalHeight, setTotalHeight] = useState(1)
  const [scrollTop, setScrollTop] = useState(0)
  const [isOut, setIsOut] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [rect, setRect] = useState<DOMRect>()

  const barTop = (scrollTop / totalHeight) * curPageHeight || 0
  const barHeight = totalHeight < curPageHeight ? 0 : (curPageHeight / totalHeight) * curPageHeight

  const scrollTop2 = useRef(0)
  const totalHeight2 = useRef(1)
  const barHeight2 = useRef(0)
  const lastScroll = useRef(0)
  const pxRatio = useRef(1)
  const isDragging2 = useRef(false)
  const startY = useRef(0)
  const scrollStart = useRef(0)
  const curRect = useRef<DOMRect>()

  useEffect(() => {
    pxRatio.current = curPageHeight / barHeight || 1
    scrollTop2.current = scrollTop
    barHeight2.current = barHeight
    totalHeight2.current = totalHeight
    isDragging2.current = isDragging
    if (rect) {
      curRect.current = rect
      lastScroll.current = totalHeight - rect.height
    }
  }, [curPageHeight, barHeight, scrollTop, totalHeight, rect, isDragging])

  const innerOnScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (onScroll) onScroll(e)
    if (isDragging) return
    //@ts-ignore
    setScrollTop(e.target.scrollTop)
  }

  const innerOnMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onMouseEnter) onMouseEnter(e)
    if (isOut) setIsOut(false)
  }

  const innerOnMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onMouseMove) onMouseMove(e)
    if (isOut) setIsOut(false)
  }

  const innerOnMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (onMouseLeave) onMouseLeave(e)
    if (!isOut && !isDragging) setIsOut(true)
  }

  const content = useRef(null)

  const init = () => {
    if (IRef) {
      const rect = IRef.current?.getBoundingClientRect()
      setRect(rect)
      setCurPageHeight(rect?.height || 0)
    } else {
      const rect = innerRef.current?.getBoundingClientRect()
      setRect(rect)
      setCurPageHeight(rect?.height || 0)
    }
  }

  const moveBar = (e: any) => {
    if (!isDragging2.current) return
    const ref = IRef?.current || innerRef.current
    if (!ref) return
    e.stopPropagation()
    e.preventDefault()
    const diff = e.clientY - startY.current
    const scroll = scrollStart.current + pxRatio.current * diff
    if (diff) {
      if (scroll < 0) {
        setScrollTop(0)
        ref.scrollTo({
          top: 0
        })
      } else if (scroll > lastScroll.current) {
        setScrollTop(lastScroll.current)
        ref.scrollTo({
          top: lastScroll.current
        })
      } else {
        setScrollTop(scroll)
        ref.scrollTo({
          top: scroll
        })
      }
    }
  }

  const stopScroll = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    let resizeObserver: any
    if (content && content.current) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          //@ts-ignore
          if (totalHeight != entry.target.offsetHeight) {
            //@ts-ignore
            setTotalHeight(entry.target.offsetHeight)
          }
        }
      })
      // 开始观察指定元素
      resizeObserver.observe(content.current)
      init()
      window.addEventListener('resize', init)
      window.addEventListener('mousemove', moveBar, true)
      window.addEventListener('mouseup', stopScroll)
    }
    // 清理观察者
    return () => {
      if (resizeObserver && content && content.current) resizeObserver.unobserve(content.current)
      window.removeEventListener('resize', init)
      window.removeEventListener('mousemove', moveBar, true)
      window.removeEventListener('mouseup', stopScroll)
    }
  }, [])

  return (
    <div
      ref={IRef || innerRef}
      id={id}
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
          left: (rect?.right || 0) - 17 || 0,
          top: rect?.top || 0,
          height: rect?.height || 0
        }}
        onMouseDown={(e) => {
          if (e.clientY - 64 > barHeight + barTop) {
            if (IRef?.current) {
              IRef?.current?.scrollTo({
                top: scrollTop2.current + 60
              })
            }
          } else {
            if (IRef?.current) {
              IRef?.current?.scrollTo({
                top: scrollTop2.current - 60
              })
            }
          }
        }}
      >
        {!!barHeight && Number.isFinite(barHeight) && (
          <div
            className={`${s.bar} ${isDragging ? s.movingBar : ''}`}
            style={{
              height: barHeight,
              top: barTop > lastScroll.current ? lastScroll.current : barTop
            }}
            onMouseDownCapture={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setIsDragging(true)
              scrollStart.current = scrollTop2.current
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
