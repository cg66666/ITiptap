/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-03-26 01:44:52
 * @LastEditors: cg
 * @LastEditTime: 2025-03-26 02:15:58
 */
export const formatTime = (now: Date, targetTime: Date) => {
  //   const now = new Date()
  //   const targetTime = new Date(time)
  const diffInSeconds = Math.floor((now - targetTime) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 31536000) {
    const month = targetTime.getMonth() + 1
    const day = targetTime.getDate()
    const hours = String(targetTime.getHours()).padStart(2, '0')
    const minutes = String(targetTime.getMinutes()).padStart(2, '0')
    return `${month}月${day}日 ${hours}:${minutes}`
  } else {
    const year = targetTime.getFullYear()
    const month = targetTime.getMonth() + 1
    const day = targetTime.getDate()
    const hours = String(targetTime.getHours()).padStart(2, '0')
    const minutes = String(targetTime.getMinutes()).padStart(2, '0')
    return `${year}年 ${month}月${day}日 ${hours}:${minutes}`
  }
}
