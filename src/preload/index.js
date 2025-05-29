/* eslint-disable node/prefer-global/process */
import { electronAPI } from '@electron-toolkit/preload'
import { BrowserWindow } from '@electron/remote'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  loadTodos: async () => {
    return ipcRenderer.invoke('load-todos')
  },
  saveTodos: async (todos) => {
    return ipcRenderer.invoke('save-todos', todos)
  },
  saveThemePreference: async (darkMode) => {
    return ipcRenderer.invoke('save-theme-preference', darkMode)
  },
  loadThemePreference: async () => {
    return ipcRenderer.invoke('load-theme-preference')
  },
}

// 窗口
const windowAPI = {
  minimize() {
    BrowserWindow.getFocusedWindow().minimize()
  },
  toggleMaximize() {
    const win = BrowserWindow.getFocusedWindow()

    if (win.isMaximized()) {
      win.unmaximize()
    }
    else {
      win.maximize()
    }
  },
  close() {
    BrowserWindow.getFocusedWindow().close()
  },
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
  onWindowMaximized: (callback) => ipcRenderer.on('window-maximized', (_event, isMaximized) => callback(isMaximized))
}

// 注意：实际文件存储操作在主进程中实现
// 数据将保存到应用的用户数据目录下的 todos.json 文件中
// 存储路径可通过 app.getPath('userData') 获取

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('windowAPI', windowAPI)
  }
  catch (error) {
    console.error(error)
  }
}
else {
  window.electron = electronAPI
  window.api = api
  window.mywindowAPI = windowAPI
}
