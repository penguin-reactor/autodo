<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'

const _props = defineProps({
  todo: Object,
})

const emit = defineEmits(['update'])

const formData = ref({
  text: '',
  note: '',
  startTime: '',
  endTime: '',
})

watch(() => _props.todo, (newTodo) => {
  if (newTodo) {
    formData.value = {
      text: newTodo.text || '',
      note: newTodo.note || '',
      startTime: newTodo.startTime || '',
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
        outlined
        dense
        :rules="[val => !!val || '任务名称不能为空']"
      />

      <q-input
        v-model="formData.note"
        label="任务备注"
        outlined
        dense
        type="textarea"
        rows="3"
      />

      <div class="row q-gutter-sm">
        <q-input
          v-model="formData.startTime"
          label="开始时间"
          outlined
          dense
          class="col"
          type="datetime-local"
        />
        <q-input
          v-model="formData.endTime"
          label="结束时间"
          outlined
          dense
          class="col"
          type="datetime-local"
        />
      </div>

      <div class="q-mt-lg">
        <q-btn
          color="primary"
          label="保存修改"
          type="submit"
          class="full-width"
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
