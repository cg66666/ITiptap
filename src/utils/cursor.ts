import { type Editor } from '@tiptap/react'

type IConfig = { from: number; to: number; name: string; color: string } | null
let userObj: Record<string, IConfig> = {}

// init
export const initCursor = (
  editor: Editor,
  userList2: Record<string, IConfig>,
  curUserName: string
) => {
  userObj = {}
  const { state, view } = editor
  const { tr } = state
  Object.keys(userList2).forEach((name) => {
    if (name == curUserName || userList2[name]?.from == 0 || userList2[name]?.to == 0) return
    setCursor(editor, tr, name, userList2[name])
  })
  view.dispatch(tr)
}

// addUser/removeUser
export const setCursor = (editor: any, tr: any, name: string, config: IConfig) => {
  // const { state, view } = editor
  // const { tr } = state
  const target = userObj[name]
  if (target) {
    if (!config) {
      // 删除场景
      tr.removeMark(target.from, target.to, editor.schema.marks.IUserSelection)
      userObj[name] = null
    } else if (target.from != config.from || target.to != config.to) {
      // 修改场景
      tr.removeMark(target.from, target.to, editor.schema.marks.IUserSelection)
      tr.addMark(
        config.from,
        config.to,
        editor.schema.marks.IUserSelection.create({ color: config.color, name: config.name })
      )
      userObj[name] = config
    }
  } else if (config) {
    // console.log(
    //   'marks',
    //   config.color,
    //   editor.schema.marks.IUserSelection.create({ color: config.color, name: config.name })
    // )

    // 新增场景
    userObj[name] = config
    tr.addMark(
      config.from,
      config.to,
      editor.schema.marks.IDefaultSelection.create({ color: config.color })
    )
  }
  // if (!isInit) view.dispatch(tr)
}
