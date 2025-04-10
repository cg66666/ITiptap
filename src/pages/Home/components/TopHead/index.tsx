import React, { useState } from 'react'
import { useLogin } from '@/store'
import Back from './Back'
import { Tooltip } from 'antd'
import s from './index.module.scss'

interface IProps {
  // Add prop types here
  loading: boolean
}

const TopHead: React.FC<IProps> = ({ loading }) => {
  const { userName, userColor, toLogOut, documentTitle } = useLogin()

  const [updaeTime, setUpdateTime] = useState()

  return userName ? (
    <div className={s.container}>
      <div className={s.left}>
        <Tooltip title="退出登录">
          <div className={s.backBtn}>
            <Back />
          </div>
        </Tooltip>
        <div>
          <div className={s.title}>{documentTitle}</div>
          <div className={s.updateTime}>{loading ? '更新中……' : '已保存到云端'}</div>
        </div>
      </div>
      <div className={s.right}></div>
    </div>
  ) : (
    <></>
  )
}

export default TopHead
