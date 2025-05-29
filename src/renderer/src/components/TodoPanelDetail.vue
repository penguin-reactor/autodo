<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'

const _props = defineProps({
  todo: Object,
})

const emit = defineEmits(['update'])

const formData = ref({
  text: '',
  note: '',
  endTime: '',
})

watch(() => _props.todo, (newTodo) => {
  if (newTodo) {
    formData.value = {
      text: newTodo.text || '',
      note: newTodo.note || '',
      endTime: newTodo.endTime || '',
    }
  }
}, { immediate: true })

function handleUpdate() {
  if (_props.todo) {
    const updatedTodo = {
      ..._props.todo,
      ...formData.value,
    }
    emit('update', updatedTodo)
  }
}
</script>

<template>
  <div v-if="todo" class="todo-detail q-pa-md">
    <q-form class="q-gutter-md" @submit="handleUpdate">
      <q-input
        v-model="formData.text"
        label="任务名称"
        filled
        :rules="[val => !!val || '任务名称不能为空']"
      />

      <q-input
        v-model="formData.note"
        label="任务备注"
        filled
        type="textarea"
        rows="3"
      />

      <q-input
        v-model="formData.endTime"
        label="结束时间"
        filled
        type="date"
      />

      <div class="w-full">
        <q-btn
          color="primary"
          label="保存修改"
          type="submit"
        />
      </div>
    </q-form>
  </div>

  <div v-else class="text-center q-pa-lg text-grey">
    请从左侧选择一个任务进行编辑
  </div>
</template>

<style scoped>
.todo-detail {
  height: 100%;
}
</style>
