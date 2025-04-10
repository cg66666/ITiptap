import { useState, useEffect } from 'react'

// 模块级变量：存储单例 WebSocket 实例
let ws: WebSocket | null = null

export const useWebSocket = (url: string, onOpen?: (ws: WebSocket) => void) => {
  const [backMsg, setBackMsg] = useState<any>()

  useEffect(() => {
    let ping: number
    // 重复唤醒webSocket
    const pingHeart = () => {
      clearInterval(ping)
      let time = 0
      ping = setInterval(() => {
        initWs()
        time++
        if (time === 10) clearInterval(ping)
      }, 2000)
    }
    // 心跳检测
    const checkHeart = () => {
      clearInterval(ping)
      ping = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) {
          ws?.send(JSON.stringify({ type: 'ping' }))
        }
      }, 2000)
    }
    const initWs = () => {
      const wss = new WebSocket(url)
      ws = wss
      wss.onopen = () => {
        if (!ws) return
        if (onOpen) onOpen(ws)
        console.log('WebSocket 连接已建立！')
        checkHeart()
      }
      wss.onmessage = (event) => {
        const data = JSON.parse(event.data)
        // console.log('接收', data)
        setBackMsg(data)
      }
      wss.onerror = function () {
        console.log('链接断开')
        pingHeart()
      }
      wss.onclose = function () {
        console.log('链接断开')
        pingHeart()
      }
    }
    if (!ws) initWs()
  }, [url]) // 当 url 变化时重新创建 WebSocket

  // 发送消息的方法
  const sendMessage = (message: any) => {
    // console.log(111);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not open.')
    }
  }

  return { backMsg, sendMessage }
}
