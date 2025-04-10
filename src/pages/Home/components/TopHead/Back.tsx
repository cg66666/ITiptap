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

const Back: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="LeftOutlined"
    >
      <path
        d="M16.293 2.293a1 1 0 0 1 0 1.414L8 12l8.293 8.293a1 1 0 0 1-1.414 1.414l-8.293-8.293a2 2 0 0 1 0-2.828l8.293-8.293a1 1 0 0 1 1.414 0Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default Back
