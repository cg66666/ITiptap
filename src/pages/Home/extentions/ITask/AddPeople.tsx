/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-02-18 17:44:42
 */
import React from 'react'

interface IProps {
  // Add prop types here
}

const AddPeople: React.FC<any> = () => {
  return (
    <svg
      width="16px"
      height="16px"
      color="rgb(100, 106, 115)"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-icon="MemberAddOutlined"
    >
      <path
        d="M15.5 6.5a5 5 0 1 0-10.002.002A5 5 0 0 0 15.5 6.5Zm-5 3a3.001 3.001 0 0 1 0-6 3.001 3.001 0 0 1 0 6ZM3 19c0-.346.045-.68.125-1 .445-1.725 2.01-3 3.875-3h5.98v-2H7a6 6 0 0 0-6 6v1c0 1.1.9 2 2 2h9.954v-2H3v-1Zm15.5 3a1 1 0 0 1-1-1v-2h-2a1 1 0 1 1 0-2h2v-2a1 1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 0 1-1 1Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export default AddPeople
