/* eslint-disable node/prefer-global/process */
import { join } from 'node:path'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { enable, initialize } from '@electron/remote/main' // <-- a添加这个
import { app, BrowserWindow, ipcMain, shell } from 'electron'
// import icon from '../../resources/icon.png?asset'

initialize() // <-- 添加这个

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 750,
    height: 650,
    // resizable: false,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      sandbox: false,
      preload: join(__dirname, '../preload/index.js'),
    },
  })

  // mainWindow.setBackgroundColor('#2e2c29') // 设置窗口背景颜色

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  enable(mainWindow.webContents) // <-- 添加这个

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  }
  else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  const fs = require('node:fs')
  const path = require('node:path')

  // 获取待办事项存储路径
  const getTodosPath = () => {
    return path.join(app.getPath('userData'), 'todos.json')
  }

  // 获取主题偏好存储路径
  const getThemePath = () => {
    return path.join(app.getPath('userData'), 'theme-preference.json')
  }

  // 加载待办事项
  ipcMain.handle('load-todos', async () => {
    try {
      const filePath = getTodosPath()
      const data = await fs.promises.readFile(filePath, 'utf-8')
      return JSON.parse(data)
    }
    catch (error) {
      if (error.code === 'ENOENT') {
        return [] // 文件不存在时返回空数组
      }
      throw error
    }
  })

  // 保存待办事项
  ipcMain.handle('save-todos', async (_, todos) => {
    const filePath = getTodosPath()
    await fs.promises.writeFile(filePath, JSON.stringify(todos, null, 2))
  })

  // 保存主题偏好
  ipcMain.handle('save-theme-preference', async (_, darkMode) => {
    const filePath = getThemePath()
    await fs.promises.writeFile(filePath, JSON.stringify({ darkMode }))
  })

  // 加载主题偏好
  ipcMain.handle('load-theme-preference', async () => {
    try {
      const filePath = getThemePath()
      const data = await fs.promises.readFile(filePath, 'utf-8')
      return JSON.parse(data).darkMode
    }
    catch (error) {
      if (error.code === 'ENOENT') {
        return false // 文件不存在时返回默认值
      }
      throw error
    }
  })

  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
