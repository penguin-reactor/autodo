<script setup>
import { onMounted, ref, toRaw, watch } from 'vue'

const todos = ref([])
const newTodo = ref('')

// 加载待办事项
async function loadTodos() {
  todos.value = await window.api.loadTodos()
}

// 保存待办事项
async function saveTodos() {
  const rawTodos = toRaw(todos.value)
  await window.api.saveTodos(rawTodos)
}

// 添加新待办
function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false,
    })
    newTodo.value = ''
  }
}

// 删除待办
function removeTodo(id) {
  todos.value = todos.value.filter(todo => todo.id !== id)
}

// 切换完成状态
function toggleComplete(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo)
    todo.completed = !todo.completed
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
  <div class="todolist">
    <div class="q-pa-md full-height column">
      <!-- 待办列表 -->
      <q-list bordered separator class="col-grow q-mb-md">
        <q-item v-for="todo in todos" :key="todo.id">
          <!-- 左侧复选框 -->
          <q-item-section side>
            <q-checkbox v-model="todo.completed" @click="toggleComplete(todo.id)" />
          </q-item-section>

          <!-- 待办文本 -->
          <q-item-section :class="{ 'text-strike': todo.completed }">
            {{ todo.text }}
          </q-item-section>

          <!-- 右侧删除按钮 -->
          <q-item-section side>
            <q-btn round dense flat icon="delete" @click="removeTodo(todo.id)" />
          </q-item-section>
        </q-item>
      </q-list>

      <!-- 底部输入区 -->
      <div class="row items-center">
        <q-input v-model="newTodo" label="添加新待办" dense outlined class="col-grow q-mr-sm" @keyup.enter="addTodo" />
        <q-btn color="primary" label="添加" @click="addTodo" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 待办项样式 */
.q-item {
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
}

/* 删除按钮悬停效果 */
.q-btn:hover {
  color: #f44336;
}

/* 输入区域固定底部 */
.q-pa-md {
  padding-bottom: 16px;
}

/* 完成事项的删除线效果 */
.text-strike {
  text-decoration: line-through;
  color: #9e9e9e;
}

/* 输入区域固定在底部 */
.row.items-center {
  margin-top: auto;
}
</style>
