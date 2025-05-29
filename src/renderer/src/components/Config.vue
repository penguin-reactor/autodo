<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const darkMode = ref(false)

// 切换暗色模式
async function toggleDarkMode(val) {
  $q.dark.set(val)
  // 保存主题偏好到本地
  window.api.saveThemePreference(val)
}

// 组件挂载时加载主题偏好
onMounted(() => {
  window.api.loadThemePreference().then((pref) => {
    darkMode.value = pref
    $q.dark.set(darkMode.value)
  })
})
</script>

<template>
  <div class="config q-pa-md">
    <div class="text-h6 q-mb-md">
      应用配置
    </div>

    <!-- 暗色模式切换 -->
    <q-item>
      <q-item-section avatar>
        <q-icon :name="darkMode ? 'dark_mode' : 'light_mode'" />
      </q-item-section>
      <q-item-section>
        {{ darkMode ? '暗色模式' : '亮色模式' }}
      </q-item-section>
      <q-item-section side>
        <q-toggle v-model="darkMode" @update:model-value="toggleDarkMode" />
      </q-item-section>
    </q-item>
  </div>
</template>
