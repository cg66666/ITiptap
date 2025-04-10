/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-03-04 16:42:18
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const Arrow: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="24px"
      height="24px"
      style={{ padding: '3px', boxSizing: 'border-box', ...style }}
      viewBox="0 0 12 12"
    >
      <path d="M6 6.69l2.65-2.65a.5.5 0 11.7.7L6 8.1 2.65 4.75a.5.5 0 11.7-.71L6 6.69z"></path>
    </svg>
  )
}

export default Arrow
