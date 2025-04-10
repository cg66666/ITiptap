/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-02-17 23:11:56
 * @LastEditors: cg
 * @LastEditTime: 2025-03-02 18:21:59
 */
import React from 'react'

interface IProps {
  // Add prop types here
  style?: React.CSSProperties
  className?: string
}

const LanguageArrow: React.FC<IProps> = ({ style, className }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12">
      <path d="M5.77 8.78l-3.5-4.36a.36.36 0 010-.43c.05-.06.11-.09.17-.09h7.12c.13 0 .24.14.24.3 0 .09-.03.16-.07.22l-3.5 4.36c-.13.16-.33.16-.46 0z"></path>
    </svg>
  )
}

export default LanguageArrow
