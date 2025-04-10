/*
 * @Description: file content
 * @Author: 朱晨光
 * @Date: 2023-09-16 19:34:11
 * @LastEditors: cg
 * @LastEditTime: 2025-04-06 11:21:07
 */
import { useEffect, useState } from 'react'
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import { useLogin } from '@/store'
import Layout from '@/layouts/Layout'
import Home from '@/pages/Home'
import About from '@/pages/About'
import '@/assets/iconfont'
import './App.scss'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path={import.meta.env.VITE_PREFIX} element={<Layout />}>
      <Route index element={<Home />} />
      {/* <Route path="about" element={<About />} /> */}
    </Route>
  )
)

function App() {
  const { checkLogin } = useLogin()
  useEffect(() => {
    checkLogin()
    const handleKeyDown = (e: any) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
