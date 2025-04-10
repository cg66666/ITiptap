/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-09 17:51:36
 * @LastEditors: cg
 * @LastEditTime: 2025-04-10 10:28:01
 */
import React, { useRef, useState } from 'react'
import { TypeEnum } from '@/pages/Home'
import IScrollbars from '@/components/IScrollbars'
import { useHeader } from '@/store'
import s from './index.module.scss'

interface IProps {
  // Add prop types here
  // headerRank: any[]
  scrollToPosition: any
}

const LeftHeader: React.FC<IProps> = ({ scrollToPosition }) => {
  const { IHeadConfigList } = useHeader()

  // console.log('IHeadConfigList', IHeadConfigList)

  const [selectedId, setSelectedId] = useState('')

  const getClassName = (level: number) => {
    switch (level) {
      case 1: {
        return 'indentation-level-1'
      }
      case 2: {
        return 'indentation-level-2'
      }
      case 3: {
        return 'indentation-level-3'
      }
      case 4: {
        return 'indentation-level-4'
      }
      case 5: {
        return 'indentation-level-5'
      }
      case 6: {
        return 'indentation-level-6'
      }
      case 7: {
        return 'indentation-level-7'
      }
      case 8: {
        return 'indentation-level-8'
      }
      case 9: {
        return 'indentation-level-9'
      }
    }
  }
  // console.log('headerRank', headerRank)

  return (
    // <div >
    <IScrollbars className={s.container}>
      {/* <div className={s.title}>目录</div> */}
      {IHeadConfigList.map((item, index) => {
        if (!item.text) return <React.Fragment key={index}></React.Fragment>
        const levelClass = getClassName(item.level)
        return (
          <div
            key={item.id}
            className={`r-heading ${selectedId === item.id ? 'selected-head' : ''} ${levelClass}`}
            onClick={() => {
              scrollToPosition(item)
              setSelectedId(item.id)
            }}
          >
            {item.text}
          </div>
        )
      })}
    </IScrollbars>
    // </div>
  )
}

export default LeftHeader
