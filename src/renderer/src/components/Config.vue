<script setup>
import { useQuasar } from 'quasar'
import { onMounted, ref } from 'vue'

const $q = useQuasar()
const darkMode = ref(false)
const deepseekKey = ref('')
const testResult = ref('')
const isLoading = ref(false)
const editing = ref(true) // 添加编辑状态

// 切换暗色模式
async function toggleDarkMode(val) {
  $q.dark.set(val)
  // 保存主题偏好到本地
  window.api.saveThemePreference(val)
}

// 保存DeepSeek API Key
function saveDeepseekKey() {
  localStorage.setItem('deepseekKey', deepseekKey.value)
  testResult.value = 'API Key已保存'
  editing.value = false // 保存后退出编辑模式
}

// 测试DeepSeek API
async function testDeepseekKey() {
  if (!deepseekKey.value) {
    testResult.value = '请先输入API Key'
    return
  }

  isLoading.value = true
  testResult.value = '测试中...'

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey.value}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'user', content: '你好，请回复一个简单的“测试成功”' },
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    if (data.choices && data.choices.length > 0) {
      testResult.value = `<span class="c-green">${data.choices[0].message.content}</span>`
    }
    else {
      testResult.value = `API返回异常: <span class="c-red">${JSON.stringify(data)}</span>`
    }
  }
  catch (error) {
    testResult.value = `请求失败: <span class="c-green">${error.message}</span>`
  }
  finally {
    isLoading.value = false
  }
}

// 进入编辑模式
function enableEditing() {
  editing.value = true
}

// 组件挂载时加载主题偏好和API Key
onMounted(() => {
  window.api.loadThemePreference().then((pref) => {
    darkMode.value = pref
    $q.dark.set(darkMode.value)
  })

  const savedKey = localStorage.getItem('deepseekKey')
  if (savedKey) {
    deepseekKey.value = savedKey
    editing.value = false // 有缓存Key时关闭编辑模式
  }
  else {
    editing.value = true // 无缓存Key时开启编辑模式
  }
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

    <!-- DeepSeek API Key 配置 -->
    <q-item>
      <q-item-section avatar>
        <q-icon name="key" />
      </q-item-section>
      <q-item-section>
        <!-- 非编辑状态显示 -->
        <div v-if="!editing" class="row flex items-center w-full gap-10px justify-between">
          <span class="q-mr-sm">DeepSeek Key 已保存</span>
          <q-btn label="修改" color="primary" outline @click="enableEditing" />
        </div>

        <!-- 编辑状态显示 -->
        <div v-else class="flex flex-col gap-10px w-full">
          <div class="flex items-center gap-10px w-full justify-between">
            <q-input v-model="deepseekKey" label="DeepSeek API Key" type="password" />
            <div class="row q-gutter-sm q-mt-sm">
              <q-btn label="测试" color="positive" :loading="isLoading" @click="testDeepseekKey" />
              <q-btn label="保存" color="primary" @click="saveDeepseekKey" />
            </div>
          </div>

          <!-- 测试结果显示 -->
          <div v-if="testResult" class="text-caption">
            测试结果: <div class="inline" v-html="testResult" />
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>
