/*
 * @Description: file content
 * @Author: cg
 * @Date: 2025-01-20 16:42:48
 * @LastEditors: cg
 * @LastEditTime: 2025-04-08 18:16:15
 */
import { useEffect, useRef, useState, useMemo, useCallback, memo } from 'react'
import { NodeViewWrapper, NodeViewContent, type Editor } from '@tiptap/react'
import { nanoid } from 'nanoid'
import IIcon from '@/components/IIcon'
import { TypeEnum } from '../../index'
import { useHeader, type headItem, useMove, type headd, useLogin } from '@/store'
import { Tooltip } from 'antd'
import _ from 'lodash'
import s from './index.module.scss'

interface IProps {
  editor: Editor
  node: any
  getPos: () => number
  updateAttributes: (attributes: Record<string, any>) => void
}

const IHeader = ({ editor, node, getPos, updateAttributes }: IProps) => {
  const pos = getPos()

  const { setDocumentTitle } = useLogin()

  const { curHeaderId } = useMove()

  const {
    IHeadConfig,
    closeIList,
    closingRange,
    setClosingRange,
    editIHeadConfig,
    deleteIHeadConfig
  } = useHeader()

  const { id, level, alignClass, placeholder, isTop } = node.attrs

  const text = node.textContent

  const prevConfig = useRef<headd>()

  const setEdit = useCallback(
    _.debounce(() => {
      if (!prevConfig.current) return
      editIHeadConfig([{ ...prevConfig.current }])
    }, 400),
    []
  )

  const timer = useRef<number>()

  useEffect(() => {
    clearTimeout(timer.current)
    if (!prevConfig.current) {
      prevConfig.current = IHeadConfig[id] || { id, text, pos, level }
    } else {
      if (prevConfig.current.id != id) {
        deleteIHeadConfig([prevConfig.current.id])
        prevConfig.current = IHeadConfig[id] || { id, text, pos, level }
      } else {
        if (prevConfig.current.text != text) {
          prevConfig.current.text = text
        }
        if (prevConfig.current.pos != pos) {
          prevConfig.current.pos = pos
        }
      }
    }
    setEdit()
  }, [text, pos, id, node.content.content])

  // 用于监听删除行为
  useEffect(() => {
    // console.log('node', node.content)

    return () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        deleteIHeadConfig([id])
      }, 500)
    }
  }, [node])

  const myRef = useRef<HTMLElement>(null)

  const [isClose, setIsClose] = useState(false)

  const isHidden = useMemo(() => {
    const pos = getPos()
    return closeIList.some(
      (item) => item && item.start < pos && (item.end ? item.end > pos + 1 : true)
    )
  }, [closeIList])

  const showIcon = id === curHeaderId

  const toggleClose = () => {
    const item = closingRange[id]
    setIsClose(!item)
    if (item) {
      closingRange[id] = null
    } else {
      const children = editor.$nodes('IHeader') || []
      const pos = getPos()
      for (let i = 0; i < children.length; i++) {
        if (children[i].pos > pos && children[i].attributes.level < level) {
          closingRange[id] = { start: pos, end: children[i].pos, level: level }
          break
        }
      }
      if (!closingRange[id]) {
        closingRange[id] = { start: pos, end: null, level: level }
      }
    }
    setClosingRange({ ...closingRange })
  }

  const IconSlot = memo(({ children }: { children: React.ReactNode }) => {
    return (
      <Tooltip title={isClose ? '展开' : '收起'} placement="bottom">
        <div
          className={`${s.arrow} ${isClose ? s.closeArrow : ''}`}
          style={{ opacity: showIcon || isClose ? 1 : 0 }}
          data-type={TypeEnum.HeaderIcon}
          data-id={id}
          onClick={toggleClose}
        >
          {children}
        </div>
      </Tooltip>
    )
  })

  const renderDom = () => {
    if (!level) return <NodeViewContent data-id={id} />
    // console.log('level', level)

    switch (level) {
      case 1: {
        return (
          <div className="header header-h1">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                size="24"
                hoverColor="#336df4"
              />
            </IconSlot>
            <div
              className={placeholder && !text ? 'placeholder' : ''}
              data-placeholder={placeholder}
            >
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} data-istop={isTop} />
            </div>
          </div>
        )
      }
      case 2: {
        return (
          <div className="header header-h2">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                size="22"
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 3: {
        return (
          <div className="header header-h3">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                size="22"
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 4: {
        return (
          <div className="header header-h4">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 5: {
        return (
          <div className="header header-h5">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 6: {
        return (
          <div className="header header-h6">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 7: {
        return (
          <div className="header header-h7">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 8: {
        return (
          <div className="header header-h8">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent data-id={id} data-type={TypeEnum.Header} />
            </div>
          </div>
        )
      }
      case 9: {
        return (
          <div className="header header-h9">
            <IconSlot>
              <IIcon
                name="icon-arrow"
                size="22"
                data-type={TypeEnum.HeaderIcon}
                data-id={id}
                hoverColor="#336df4"
              />
            </IconSlot>
            <div>
              <NodeViewContent
                style={{ lineHeight: 1.65 }}
                data-id={id}
                data-type={TypeEnum.Header}
              />
            </div>
          </div>
        )
      }
    }
  }

  useEffect(() => {
    if (closingRange[id]) {
      setIsClose(true)
    } else {
      setIsClose(false)
    }
  }, [closingRange])

  useEffect(() => {
    if (isTop) {
      if (text) {
        setDocumentTitle(text)
        document.title = text + ' - cg文档'
      } else {
        setDocumentTitle('未命名文档')
        document.title = '未命名文档 - cg文档'
      }
    }
  }, [isTop, text])

  return (
    <>
      {!isHidden && (
        <NodeViewWrapper
          id={`${id}-IHeader`}
          data-level={level}
          data-id={id}
          data-node="true"
          data-type={TypeEnum.Header}
          data-istop={isTop}
          ref={myRef}
          className={`${s.container} ${alignClass} nodeContainer`}
        >
          <div className={s.content}>{renderDom()}</div>
          {/* {isOutOfViewPort ? (
            <div style={{ height }}></div>
          ) : (
            <div className={s.content}>{renderDom()}</div>
          )} */}
        </NodeViewWrapper>
      )}
    </>
  )
}

export default IHeader
