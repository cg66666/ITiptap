/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-10-23 17:21:01
 * @LastEditors: cg
 * @LastEditTime: 2025-02-03 21:48:12
 */
// Layout.js
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ConfigProvider, Image, Modal, message, Spin } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN'
import s from './index.module.scss'

const Layout = () => {
  return (
    <div className={s.layoutOutline}>
      <ConfigProvider
        locale={zh_CN}
        // input={{ autoComplete: "off" }}
        // renderEmpty={customizeRenderEmpty}
      >
        <Outlet></Outlet>
      </ConfigProvider>
    </div>
  )
}

export default Layout
