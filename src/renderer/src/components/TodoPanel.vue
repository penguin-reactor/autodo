<script setup>
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref, toRaw, watch } from 'vue'
import TodoPanelDetail from './TodoPanelDetail.vue'
import TodoPanelList from './TodoPanelList.vue'
import dayjs from 'dayjs'

const todos = ref([])
const selectedTodo = ref(null)
const splitterModel = ref(40) // 默认分割位置

// 加载待办事项
async function loadTodos() {
  const loadedTodos = await window.api.loadTodos()
  // 确保每个任务都有扩展字段
  todos.value = loadedTodos.map(todo => ({
    ...todo,
    note: todo.note || '',
    startTime: todo.startTime || '',
    endTime: todo.endTime || '',
  }))
}

// 保存待办事项
async function saveTodos() {
  const rawTodos = toRaw(todos.value)
  await window.api.saveTodos(rawTodos)
}

// 添加新待办
function addTodo(text) {
  if (text.trim()) {
    const newTodo = {
      id: uuidv4(),
      text: text.trim(),
      completed: false,
      note: '',
      createTime: dayjs().format('YYYY-MM-DD'),
      endTime: '',
    }
    todos.value.push(newTodo)
    selectedTodo.value = newTodo
  }
}

// 删除待办
function removeTodo(id) {
  todos.value = todos.value.filter(todo => todo.id !== id)
  if (selectedTodo.value?.id === id) {
    selectedTodo.value = null
  }
}

// 切换完成状态
function toggleComplete(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 更新任务详情
function updateTodo(updatedTodo) {
  const index = todos.value.findIndex(t => t.id === updatedTodo.id)
  if (index !== -1) {
    todos.value[index] = updatedTodo
  }
}

// 选择任务
function selectTodo(todo) {
  selectedTodo.value = todo
}

// 组件挂载时加载数据
onMounted(() => {
  loadTodos()
})

// 监听 todos 变化并保存
watch(todos, () => {
  saveTodos()
}, { deep: true })

defineExpose({
  loadTodos
})
</script>

<template>
  <div class="todo-panel full-height">
    <q-splitter v-model="splitterModel" :limits="[40, 80]" class="h-full">
      <template #before>
        <TodoPanelList :todos="todos" :selected-todo="selectedTodo" @select="selectTodo" @remove="removeTodo"
          @toggle="toggleComplete" @add="addTodo" />
      </template>

      <template #after>
        <TodoPanelDetail :todo="selectedTodo" @update="updateTodo" />
      </template>
    </q-splitter>
  </div>
</template>

<style scoped>
.todo-panel {
  height: calc(100vh - 32px);
}

/* 分割线样式 */
.q-splitter__separator {
  background-color: #e0e0e0;
}
</style>
