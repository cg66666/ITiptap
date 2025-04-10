/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-02-27 14:31:32
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const FunctionBlock: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="BlocknewOutlined"
    >
      <path
        d="M7 9.5a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm9 6a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2h8Z"
        fill="currentColor"
      ></path>
      <path
        d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11Zm0-2a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default FunctionBlock
