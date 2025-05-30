<script setup>
import { ref } from 'vue'

// 定义props和emits
defineProps({
  todos: {
    type: Array,
    required: true,
  },
  selectedTodo: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select', 'remove', 'toggle', 'add'])

// 新任务输入框
const newTodo = ref('')

// 添加新任务
function handleAdd() {
  if (newTodo.value.trim()) {
    emit('add', newTodo.value.trim())
    newTodo.value = ''
  }
}
</script>

<template>
  <div class="todo-panel-list">
    <!-- 待办列表 -->
    <div v-if="todos.length === 0" class="text-center q-pa-lg text-grey">
      暂无待办事项
    </div>
    <q-list separator>
      <q-item
        v-for="todo in todos"
        :key="todo.id"
        :class="{ 'bg-blue-1': todo.id === selectedTodo?.id }"
        clickable
        @click="$emit('select', todo)"
      >
        <q-item-section side>
          <q-checkbox
            :model-value="todo.completed"
            @click.stop="$emit('toggle', todo.id)"
          />
        </q-item-section>

        <q-item-section :class="{ 'text-strike': todo.completed }">
          {{ todo.text }}
        </q-item-section>

        <q-item-section side>
          <q-btn round dense flat icon="delete" @click.stop="$emit('remove', todo.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- 固定在底部的输入框 -->
    <div class="fixed-bottom-input">
      <q-input
        v-model="newTodo"
        label="添加新待办"
        dense
        outlined
        @keyup.enter="handleAdd"
      >
        <template #append>
          <q-btn
            round
            dense
            flat
            icon="add"
            :disable="!newTodo.trim()"
            @click="handleAdd"
          />
        </template>
      </q-input>
    </div>
  </div>
</template>

<style scoped>
.todo-panel-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.q-list {
  flex: 1;
  overflow-y: auto;
}

.fixed-bottom-input {
  flex: none;
  padding: 15px;
  background: var(--bg-color-container);
}
</style>
