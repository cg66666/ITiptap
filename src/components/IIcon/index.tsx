/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-17 16:54:16
 * @LastEditors: cg
 * @LastEditTime: 2025-04-09 12:28:16
 */
import React, { useState } from 'react'
import s from './index.module.scss'

interface IProps {
  // Add prop types here
  name:
    | 'icon-operate'
    | 'icon-h1'
    | 'icon-h2'
    | 'icon-h3'
    | 'icon-h4'
    | 'icon-h5'
    | 'icon-h6'
    | 'icon-h7'
    | 'icon-h8'
    | 'icon-h9'
    | 'icon-bold'
    | 'icon-list'
    | 'icon-orderList'
    | 'icon-strickout'
    | 'icon-taskList'
    | 'icon-color'
    | 'icon-link'
    | 'icon-italic'
    | 'icon-fontSize'
    | 'icon-down'
    | 'icon-arrow'
    | 'icon-newOrderList'
    | 'icon-backOrderList'
    | 'icon-editOrderList'
    | 'icon-other'
    | 'icon-leftAlign'
    | 'icon-code'
    | 'icon-quote'
    | 'icon-underline'
    | 'icon-middleAlign'
    | 'icon-rightAlign'
    | 'icon-codeBlock'
    | 'icon-highLight'
  color?: string
  size?: string
  style?: React.CSSProperties
  hoverColor?: string
}

const IIcon: React.FC<IProps> = ({ name, color, size, style, hoverColor, ...rest }) => {
  const [showHover, setShowHover] = useState(false)

  // const addProps = hoverColor
  //   ? {
  //       onMouseEnter: () => {
  //         if (hoverColor) setShowHover(true)
  //       },
  //       onMouseLeave: () => {
  //         if (hoverColor) setShowHover(false)
  //       }
  //     }
  //   : {}

  return (
    <>
      <svg
        className={`icon ${s.innerIcon}`}
        aria-hidden="true"
        style={{ width: size, height: size, ...style, position: 'relative' }}
        onMouseEnter={() => {
          if (hoverColor) setShowHover(true)
        }}
        onMouseLeave={() => {
          if (hoverColor) setShowHover(true)
        }}
        // {...addProps}
        {...rest}
      >
        <use xlinkHref={`#${name}`} fill={showHover ? hoverColor : 'black'}></use>
      </svg>
    </>
  )
}

export default IIcon
