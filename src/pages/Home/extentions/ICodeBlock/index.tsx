/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-02 19:57:46
 */
import { useEffect, useRef, useState, useMemo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IIcon from '@/components/IIcon'
import { TypeEnum } from '../../index'
import { useHeader, type headItem, useMove } from '@/store'
import { Select, Divider, Input, Tooltip } from 'antd'
import LanguageArrow from './LanguageArrow'
import InputSearch from './InputSearch'
import s from './index.module.scss'

const List = [
  'Plain Text',
  'Ada',
  'Apache',
  'Bash',
  'C',
  'C#',
  'C++',
  'CSS',
  'CoffeeScript',
  'D',
  'Dart',
  'Delphi',
  'Django',
  'Dockerfile',
  'Erlang',
  'Fortran',
  'Gherkin',
  'Go',
  'Groovy',
  'HTML',
  'HTMLBars',
  'HTTP',
  'Haskell',
  'JSON',
  'Java',
  'JavaScript',
  'Julia',
  'Kotlin',
  'LaTeX',
  'Lisp',
  'Lua',
  'MATLAB',
  'Makefile',
  'Markdown',
  'Nginx',
  'Objective-C',
  'PHP',
  'Perl',
  'PowerShell',
  'Prolog',
  'ProtoBuf',
  'Python',
  'R',
  'Ruby',
  'Rust',
  'SAS',
  'SCSS',
  'SQL',
  'Scala',
  'Scheme',
  'Shell',
  'Swift',
  'Thrift',
  'TypeScript',
  'VBScript',
  'Visual Basic',
  'XML',
  'YAML'
].map((item) => ({ label: item, value: item }))

interface IProps {
  node: any
  getPos: () => number
  updateAttributes: (attributes: Record<string, any>) => void
  lowlight: any
}
const CodeBlockLowlight = ({ getPos, node, updateAttributes, lowlight }: IProps) => {
  // console.log('node.textContent', node)

  const { id, language } = node.attrs

  const { scrollTop, curSelectedIdList, curViewPortIdList } = useMove()

  const { closeIList } = useHeader()

  const myRef = useRef<HTMLElement>(null)

  // const [labelList, setLabelList] = useState<any[]>([])

  const [searchVal, setSearchVal] = useState('')

  const [height, setHeight] = useState(0)

  const handleList = useMemo(() => {
    if (!searchVal) return List
    const val = searchVal.toLowerCase()
    return List.filter((item) => item.value.toLowerCase().includes(val))
  }, [searchVal])

  // const isOutOfViewPort = false
  const [isOutOfViewPort, setIsOutOfViewPort] = useState(false)
  // const isOutOfViewPort = curSelectedIdList.includes(id) ? false : !curViewPortIdList.has(id)
  // const isFirst = useRef(true)
  // const isOutOfViewPort = useMemo(() => {
  //   if (isFirst.current) {
  //     isFirst.current = false
  //     return false
  //   }
  //   if (curSelectedIdList.includes(id)) return false
  //   console.log('curViewPortIdList', curViewPortIdList)

  //   return !curViewPortIdList.has(id)
  // }, [curSelectedIdList, curViewPortIdList])

  const isHidden = useMemo(() => {
    const pos = getPos()
    return closeIList.some(
      (item) => item && item.start < pos && (item.end ? item.end > pos + 1 : true)
    )
  }, [closeIList])
  // console.log('isHidden',isHidden);

  useEffect(() => {
    if (isOutOfViewPort) return
    if (myRef.current) {
      setTimeout(() => {
        const curHeight = myRef.current.offsetHeight
        if (curHeight > 0 && height != curHeight) {
          setHeight(curHeight)
        }
      }, 0)
    }
  }, [node.textContent])

  const isFirst = useRef(true)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.target) return
        if (isFirst.current) {
          isFirst.current = false
          setIsOutOfViewPort(false)
        }
        if (entry.isIntersecting) {
          setIsOutOfViewPort(false)
        } else {
          setIsOutOfViewPort(true)
        }
      })
    },
    { root: document.getElementById('container'), rootMargin: '300px 0px' }
  )
  useEffect(() => {
    if (!myRef.current) return
    if (!isHidden) {
      observer.observe(myRef.current)
    } else {
      observer.disconnect()
    }
  }, [isHidden])

  return (
    <>
      {!isHidden && (
        <NodeViewWrapper
          id={id + '-ICodeBlock'}
          data-id={id}
          ref={myRef}
          data-type={TypeEnum.CodeBlock}
          data-language={language}
          className={`${s.outline} nodeContainer`}
        >
          {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <div className={s.container}>
              <div className="header">
                <Tooltip title="切换代码语言">
                  <div className="showInput">
                    <div style={{ zIndex: 999 }}>
                      {language}
                      <LanguageArrow />
                    </div>
                    <Select
                      className="input"
                      options={handleList}
                      popupMatchSelectWidth={228}
                      onBlur={() => setSearchVal('')}
                      dropdownRender={(menu) => (
                        <div className={s.innerMenu}>
                          <Input
                            placeholder="搜索"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                            prefix={<InputSearch />}
                            style={{ border: 'none' }}
                          />
                          <Divider style={{ margin: '2px 0' }} />
                          {menu}
                        </div>
                      )}
                      onChange={(value) => {
                        console.log('value', value)
                        updateAttributes({ language: value })
                      }}
                    />
                  </div>
                </Tooltip>
              </div>
              <div className="content">
                <div className="codeLabel">
                  {/* {labelList.map((item, index) => (
                    <div key={index}>{index + 1}</div>
                  ))} */}
                </div>
                <NodeViewContent data-id={id} className="text" data-language={language} />
              </div>
            </div>
          )}
        </NodeViewWrapper>
      )}
    </>
  )
}

export default CodeBlockLowlight
