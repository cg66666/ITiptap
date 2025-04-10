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
  const { userName, toLogin, toLogOut, documentTitle, userConfig } = useLogin()

  const userList = userConfig
    ? Object.values(userConfig).filter((item: any) => item && item.name != userName)
    : []

  return userName ? (
    <div className={s.container}>
      <div className={s.left}>
        <Tooltip title="退出登录">
          <div
            className={s.backBtn}
            onClick={async () => {
              await toLogOut()
              toLogin()
            }}
          >
            <Back />
          </div>
        </Tooltip>
        <div>
          <div className={s.title}>{documentTitle}</div>
          <div className={s.updateTime}>{loading ? '更新中……' : '已保存到云端'}</div>
        </div>
      </div>
      <div className={s.right}>
        {userList.map((item: any) => (
          <div className={s.avatar} key={item.name} style={{ background: item.colorConfig.color }}>
            {item.name}
          </div>
        ))}
        <div className={s.line} />
        <div className={s.avatar}>{userName}</div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default TopHead
