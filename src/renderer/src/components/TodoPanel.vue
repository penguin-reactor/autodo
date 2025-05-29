<script setup>
import { onMounted, ref, toRaw, watch } from 'vue'
import TodoDetail from './TodoDetail.vue'

const todos = ref([])
const selectedTodo = ref(null)
const splitterModel = ref(300) // 默认分割位置

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
      id: Date.now(),
      text: text.trim(),
      completed: false,
      note: '',
      startTime: '',
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
</script>

<template>
  <div class="todo-panel full-height">
    <q-splitter
      v-model="splitterModel"
      unit="px"
      :limits="[100, 500]"
      class="h-full"
    >
      <template #before>
        <!-- <TodoList
          :todos="todos"
          :selected-todo="selectedTodo"
          @select="selectTodo"
          @remove="removeTodo"
          @toggle="toggleComplete"
          @add="addTodo"
        /> -->
      </template>

      <template #after>
        <TodoDetail
          :todo="selectedTodo"
          @update="updateTodo"
        />
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
