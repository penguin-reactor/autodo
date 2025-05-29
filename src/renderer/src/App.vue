<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'
import MingcuteListCheck3Fill from '~icons/mingcute/list-check-3-fill'
import MingcuteListCheck3Line from '~icons/mingcute/list-check-3-line'
import MingcuteSettings3Fill from '~icons/mingcute/settings-3-fill'
import MingcuteSettings3Line from '~icons/mingcute/settings-3-line'
import Config from './components/Config.vue'
import Todolist from './components/Todolist.vue'

const splitterModel = ref(20) // 初始分割比例
const tab = ref('todo')
/**
 * 点击最小化
 */
function minimize() {
  window.windowAPI.minimize()
}

/**
 * 点击关闭
 */
function closeApp() {
  window.windowAPI.close()
}
</script>

<template>
  <div class="app">
    <q-bar class="q-electron-drag">
      <div class="text-18px">
        AUTODO
      </div>
      <q-space />
      <q-btn dense flat icon="minimize" @click="minimize" />
      <q-btn dense flat icon="close" @click="closeApp" />
    </q-bar>

    <!-- 左右分栏布局 -->
    <q-splitter v-model="splitterModel" style="height: calc(100vh - 30px)">
      <!-- 左侧菜单 -->
      <template #before>
        <q-tabs v-model="tab" vertical class="text-teal">
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
      </template>

      <!-- 右侧内容 -->
      <template #after>
        <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up">
          <q-tab-panel name="todo">
            <Todolist />
          </q-tab-panel>
          <q-tab-panel name="config">
            <Config />
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<style scoped>
.app {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* 分割线样式 */
.q-splitter__separator {
  background: #e0e0e0;
  width: 1px;
}

/* 菜单项激活样式 */
.q-item--active {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
</style>
