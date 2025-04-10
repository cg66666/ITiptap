/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-02-26 10:50:57
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const ClearHref: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="m10.652 19.131 1.815-2.42 1.429 1.428-1.644 2.192a5.037 5.037 0 1 1-7.963-6.168l1.43-1.788a1 1 0 0 1 1.562 1.25l-1.43 1.787a3.037 3.037 0 1 0 4.8 3.719Zm4.455-2.61-1.45-1.45-1.161-1.16c0-.001 0 0 0 0L8.073 9.486 2.707 4.121a1 1 0 1 1 1.414-1.414l16.97 16.97a1 1 0 1 1-1.414 1.415l-4.57-4.57ZM13.348 4.869 11.532 7.29l-1.428-1.429 1.644-2.192a5.037 5.037 0 1 1 7.962 6.168l-1.43 1.788a1 1 0 1 1-1.561-1.25l1.43-1.787a3.037 3.037 0 1 0-4.801-3.719Z"
        fill="#2B2F36"
      ></path>
    </svg>
  )
}

export default ClearHref
