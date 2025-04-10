/*
 * @Description: file content
 * @Author: cg
 * @Date: 2024-10-09 16:21:43
 * @LastEditors: cg
 * @LastEditTime: 2024-10-11 18:07:08
 */
function hashString(str: string) {
  let hash = 0
  if (str.length === 0) return hash
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function generateColorFromHash(hash: number) {
  // 将哈希值映射到0-255范围内的三个整数，分别对应RGB颜色
  const r = (hash >> 16) & 0xff
  const g = (hash >> 8) & 0xff
  const b = hash & 0xff
  return { color: `rgb(${r},${g},${b})`, opacityColor: `rgba(${r},${g},${b},0.44)` }
}

export function generateColorFromString(str: string) {
  const hash = Math.abs(hashString(str))
  return generateColorFromHash(hash)
}
