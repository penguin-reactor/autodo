<script setup>
import { useQuasar } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import MingcuteListCheck3Fill from '~icons/mingcute/list-check-3-fill'
import MingcuteListCheck3Line from '~icons/mingcute/list-check-3-line'
import MingcuteSettings3Fill from '~icons/mingcute/settings-3-fill'
import MingcuteSettings3Line from '~icons/mingcute/settings-3-line'
import Config from './components/Config.vue'
import TodoPanel from './components/TodoPanel.vue'

const tab = ref('todo')
/**
 * 点击最小化
 */
function minimize() {
  window.windowAPI.minimize()
}

/**
 * 启用/取消最大化
 */
function toggleMaximize() {
  window.windowAPI.toggleMaximize()
}

/**
 * 点击关闭
 */
function closeApp() {
  window.windowAPI.close()
}

// 是否全屏
const isMaximized = ref(false)
onMounted(async () => {
  isMaximized.value = await window.windowAPI.isWindowMaximized()

  window.windowAPI.onWindowMaximized((status) => {
    isMaximized.value = status
  })
})
</script>

<template>
  <div class="app">
    <q-bar class="q-electron-drag head-bar">
      <div class="text-18px">
        AUTODO
      </div>
      <q-space />
      <q-btn dense flat icon="minimize" @click="minimize" />
      <q-btn dense flat :icon="isMaximized ? 'fullscreen_exit' : 'fullscreen'" @click="toggleMaximize" />
      <q-btn dense flat icon="close" @click="closeApp" />
    </q-bar>

    <div class="main-panel">
      <!-- 左侧菜单 -->
      <q-tabs v-model="tab" vertical class="left-menu" active-color="primary" switch-indicator>
        <q-tab name="todo">
          <div class="flex flex-col items-center justify-center gap-3px h-60px">
            <component :is="tab === 'todo' ? MingcuteListCheck3Fill : MingcuteListCheck3Line" class="text-20px" />
            <span class="text-14px">待办</span>
          </div>
        </q-tab>
        <q-tab name="config">
          <div class="flex flex-col items-center justify-center gap-3px h-60px">
            <component :is="tab === 'config' ? MingcuteSettings3Fill : MingcuteSettings3Line" class="text-20px" />
            <span class="text-14px">配置</span>
          </div>
        </q-tab>
      </q-tabs>
      <!-- 右侧内容 -->
      <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up" class="right-panel">
        <q-tab-panel name="todo">
          <TodoPanel />
        </q-tab-panel>
        <q-tab-panel name="config">
          <Config />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.head-bar {
  width: 100%;
  flex: none;
  background: var(--bg-color-page);
}

.main-panel {
  flex: auto;
  display: flex;
  /* gap: 5px; */
  padding-left: 1px;
}
.left-menu {
  flex: none;
  width: 80px;
}
.right-panel {
  flex: auto;
  background: var(--bg-color-container);
  border-radius: 8px 0 0 0;
  overflow: hidden;
}
:deep(.right-panel .q-tab-panel) {
  padding: 0;
}
</style>
