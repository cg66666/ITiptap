/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-03-04 10:18:03
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const OtherHeader: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="24px"
      height="24px"
      style={{ padding: '3px', boxSizing: 'border-box' }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="HnOutlined"
    >
      <path
        d="M2 3a1 1 0 0 0-1 1v16a1 1 0 1 0 2 0v-7h9v7a1 1 0 1 0 2 0V4a1 1 0 1 0-2 0v7H3V4a1 1 0 0 0-1-1Zm14 9a1 1 0 0 1 1.984-.177 4.099 4.099 0 0 1 1.757-.576 3.447 3.447 0 0 1 3.759 3.432V20a1 1 0 1 1-2 0v-5.32c0-.851-.73-1.519-1.578-1.442A2.114 2.114 0 0 0 18 15.344V20a1 1 0 1 1-2 0v-8Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default OtherHeader
