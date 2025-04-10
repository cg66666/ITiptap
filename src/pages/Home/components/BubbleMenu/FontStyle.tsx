/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-03-04 17:26:47
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const FontStyle: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="24px"
      height="24px"
      style={{ padding: '3px', boxSizing: 'border-box', ...style }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="FontcolorOutlined"
    >
      <path
        d="m16.439 15 3.14 7.391a1 1 0 1 0 1.842-.782L13.38 2.692c-.518-1.218-2.244-1.218-2.761 0L2.58 21.609a1 1 0 1 0 1.84.782L7.563 15h8.877Zm-.85-2H8.412L12 4.557 15.59 13Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default FontStyle
