/*
 * @Description: file content/
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-08 21:27:27
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { Tooltip, DatePicker, message } from 'antd'
import { TypeEnum } from '../../index'
import { useHeader, type headItem, useMove } from '@/store'
import AddPeople from './AddPeople'
import AddTime from './AddTime'
import { CloseOutlined } from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import s from './index.module.scss'

interface IProps {
  node: any
  getPos: () => number
  updateAttributes: (attributes: Record<string, any>) => void
}
const ITask = ({ getPos, node, updateAttributes }: IProps) => {
  const { isChecked, id, time } = node.attrs

  const { scrollTop, curTaskIdList, curSelectedIdList, curViewPortIdList } = useMove()

  const { closeIList } = useHeader()

  const myRef = useRef<HTMLElement>(null)

  const [curTime, setCurTime] = useState<Dayjs>()

  const [timeString, setTimeString] = useState<string>()

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
  // const observerRef = useRef<any>()
  useEffect(() => {
    if (!myRef.current) return
    if (!isHidden) {
      observer.observe(myRef.current)
    } else {
      observer.disconnect()
    }
    // 将 observer 存储到 observerRef 中
    // observerRef.current = observer
  }, [isHidden])

  const formatTime = (date: Dayjs) => {
    // console.log(date.format('DD'))
    const now = dayjs()
    const nowWeekDay = now.day() || 7
    const diffDays = 14 - (now.day() || 7)
    const nowDate = Number(now.format('DD'))
    const nowMonth = Number(now.format('MM'))
    const targetWeekDay = date.day() || 7
    const targetDate = Number(date.format('DD'))
    const targetMonth = Number(date.format('MM'))

    if (nowMonth == targetMonth && nowDate + 1 == targetDate) {
      return '明天 ' + date.format('HH:mm')
    }
    if (nowMonth == targetMonth && nowDate - 1 == targetDate) {
      return '昨天 ' + date.format('HH:mm')
    }
    if (nowMonth == targetMonth && nowDate == targetDate) {
      return '今天 ' + date.format('HH:mm')
    }

    // 时间是否特殊展示
    let isSpecial = false
    // 是否为下一周
    let isNextWeek = false
    if (nowMonth == targetMonth) {
      const diff = Math.abs(targetDate - nowDate)
      if (targetDate > nowDate) {
        if (diff < diffDays) {
          isSpecial = true
          if (nowWeekDay + diff > 7) {
            isNextWeek = true
          }
        }
      } else {
        if (diff < nowWeekDay) {
          isSpecial = true
          isNextWeek = false
        }
      }
    } else if (targetMonth - nowMonth == 1) {
      const daysInSpecificMonth = now.daysInMonth()
      const diff = targetDate - nowDate
      if (daysInSpecificMonth + diff <= diffDays) {
        isSpecial = true
        if (nowWeekDay + diff > 7) {
          isNextWeek = true
        }
      }
    }
    // console.log('isSpecial', isSpecial)
    // console.log('isNextWeek', isNextWeek)

    let string = ''

    if (isSpecial) {
      switch (targetWeekDay) {
        case 1: {
          string = string + '周一'
          break
        }
        case 2: {
          string = string + '周二'
          break
        }
        case 3: {
          string = string + '周三'
          break
        }
        case 4: {
          string = string + '周四'
          break
        }
        case 5: {
          string = string + '周五'
          break
        }
        case 6: {
          string = string + '周六'
          break
        }
        case 7: {
          string = string + '周日'
          break
        }
      }
      if (isNextWeek) {
        string = '下' + string
      }
    } else {
      string = targetMonth + '月' + targetDate + '日'
    }
    return string + ' ' + date.format('HH:mm')
  }

  useEffect(() => {
    if (!time) {
      setTimeString('')
      setCurTime(undefined)
      return
    }
    const date = dayjs.unix(time)
    const string = formatTime(date)
    setTimeString(string)
    setCurTime(date)
  }, [time])

  return (
    <>
      {!isHidden && (
        <NodeViewWrapper
          id={id + '-ITask'}
          data-id={id}
          ref={myRef}
          data-ischeckedbody={true}
          data-type={TypeEnum.Task}
          data-ischecked={isChecked}
          // data-tier={tier}
          style={{ position: 'relative', display: 'flex' }}
          className={`${s.container} nodeContainer`}
        >
          {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <div
              className={s.contentContainer}
              // style={{ paddingLeft: '28px', width: '100%', display: 'flex' }}
            >
              <NodeViewContent
                data-type={TypeEnum.Task}
                data-ischecked={isChecked}
                data-id={id}
                // data-tier={tier}
                className={`${s.content} ${isChecked ? s.isChecked : ''}`}
                // style={{
                //   marginLeft: `${24 * (tier - 1)}px`
                // }}
              />
              {timeString && (
                <div
                  contentEditable={false}
                  className={`${s.timeContainer} ${isChecked ? s.isTimeChecked : ''}`}
                >
                  {timeString}
                  <DatePicker
                    value={curTime}
                    className={s.timerPicker}
                    // defaultValue={dayjs().add(24, 'hours').startOf('hour')}
                    showTime={{ format: 'HH:mm' }}
                    onChange={(date, dateString) => {
                      updateAttributes({
                        time: date.unix()
                      })
                      // setCurTime(date)
                      // const now = dayjs()
                      // const diffDays = date.diff(now, 'day')
                      // console.log('diffDays', diffDays)
                      // console.log('dddd', date.format('dddd'))
                      // console.log('date', date)
                      // console.log('dateString', dateString)
                    }}
                  />
                  <Tooltip title="删除">
                    <CloseOutlined
                      className={s.deleteIcon}
                      style={{
                        marginLeft: 4,
                        position: 'relative',
                        top: '0px',
                        fontSize: 14,
                        color: '#626569'
                      }}
                      onClick={() => {
                        console.log('CloseOutlined')
                        updateAttributes({ time: '' })
                      }}
                    />
                  </Tooltip>
                </div>
              )}
              <div
                className={`${s.taskFunc} ${curTaskIdList.includes(id) ? s.taskFuncShow : ''}`}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '2px',
                  zIndex: 999
                }}
              >
                <Tooltip title="提及人员并通知">
                  <div
                    style={{ marginRight: 10, cursor: 'pointer' }}
                    onClick={() => message.info('待开发！')}
                  >
                    <AddPeople />
                  </div>
                </Tooltip>
                <Tooltip title="插入截至时间">
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (time) {
                        return message.info('当前截至时间已添加')
                      }
                      updateAttributes({
                        time: dayjs()
                          .add(1 * 24, 'hours')
                          .startOf('hour')
                          .unix()
                      })
                    }}
                  >
                    <AddTime />
                  </div>
                </Tooltip>
              </div>
            </div>
          )}
        </NodeViewWrapper>
      )}
    </>
  )
}

export default ITask
