/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-02-26 10:46:28
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const EditHref: React.FC<IProps> = ({ style, className }) => {
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
        d="M3 20a1 1 0 1 0 0 2h17.996a1 1 0 0 0 0-2H3ZM19.082 2.94a1.5 1.5 0 0 0-2.122 0L15.9 4l2.121 2.121 1.06-1.06a1.5 1.5 0 0 0 0-2.122Zm-2.114 4.235-2.121-2.122-9.244 9.244a1.39 1.39 0 0 0-.387.74l-.335 1.883a.17.17 0 0 0 .194.197l1.891-.315c.292-.048.56-.186.77-.395l9.232-9.232Z"
        fill="#2B2F36"
      ></path>
    </svg>
  )
}

export default EditHref
