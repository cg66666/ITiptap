/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-03-03 00:32:16
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const FunctionAddBlock: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="MoreAddOutlined"
    >
      <path
        d="M11 11V8a1 1 0 1 1 2 0v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3H8a1 1 0 1 1 0-2h3Zm1 10a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 2C5.925 23 1 18.075 1 12S5.925 1 12 1s11 4.925 11 11-4.925 11-11 11Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default FunctionAddBlock
