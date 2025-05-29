<script setup>
import { useQuasar } from 'quasar'
import { v4 as uuidv4 } from 'uuid'
import { onMounted, ref } from 'vue'
import FluentColorBotSparkle16 from '~icons/fluent-color/bot-sparkle-16'
import dayjs from 'dayjs'

const emits = defineEmits(["success"]);

const $q = useQuasar()
const deepseekKey = ref('')
const taskDescription = ref('')
const isLoading = ref(false)

/**
 * 移除 Markdown 代码块标记
 * @param str - 待处理字符
 */
function parseMarkdownJson(str) {
  // 使用正则移除 ```json 开头和 ``` 结尾
  const jsonStr = str
    .replace(/^```json\s*/, '')  // 移除开头的 ```json 和空白
    .replace(/\s*```$/, '');     // 移除结尾的 ``` 和空白

  // 2. 解析为 JavaScript 对象
  return JSON.parse(jsonStr);
}

// 调用DeepSeek API分析任务
async function analyzeTask() {
  if (!taskDescription.value.trim()) {
    $q.notify({ type: 'negative', message: '请输入任务描述' })
    return
  }

  isLoading.value = true

  const prompt = `你是一个严格的JSON API端点，必须遵守以下协议：

<输出协议>
1. 输出内容：仅包含纯JSON字符串
2. 数据结构：
{
  "steps": [
    {
      "text": "string",      // 任务名称
      "completed": boolean,  // 完成状态
      "note": "string",      // 详细说明
      "endTime": "string"   // 预计任务结束时间
    }
  ]
}
3. 字段约束：
   - steps: 数组最大长度为10
   - text: 最大30字符
   - completed: 初始false
   - endTime: 年-月-日 格式字符串
4. 禁止行为：
   - 不要包含任何非JSON内容
   - 不要省略或添加字段
`;

  try {
    // 使用DeepSeek官方会话接口
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${deepseekKey.value}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: `分析该事件的可拆分步骤：“${taskDescription.value}”，生成符合协议的 json 数据，不包含任何解释性文字`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const result = await response.json()

    // 从模型响应中提取内容并解析JSON
    const content = result.choices[0].message.content
    const stepData = parseMarkdownJson(content)

    if (stepData.steps && stepData.steps.length > 0) {
      const tasks = processApiResponse(stepData.steps)
      saveTasks(tasks)
      $q.notify({ type: 'positive', message: '任务分解成功!' })
      taskDescription.value = ''
      emits('success')
    }
    else {
      throw new Error('API未返回有效步骤')
    }
  }
  catch (error) {
    $q.notify({
      type: 'negative',
      message: `分析失败: ${error.message}`,
    })
  }
  finally {
    isLoading.value = false
  }
}

// 处理API返回的数据
function processApiResponse(steps) {
  return steps.map(step => ({
    id: generateUniqueId(),
    text: step.text || '',
    completed: false,
    note: step.note || '',
    createTime: dayjs().format('YYYY-MM-DD'),
    endTime: step.endTime || '',
  }))
}

// 生成唯一ID
function generateUniqueId() {
  return uuidv4()
}

// 保存任务到文件
async function saveTasks(tasks) {
  try {
    // 获取现有任务
    const existingTasks = await window.api.loadTodos() || []

    // 合并新任务
    const allTasks = [...existingTasks, ...tasks]
    console.log(allTasks, tasks)

    // 保存更新后的任务列表
    await window.api.saveTodos(allTasks)
  }
  catch (error) {
    console.error('保存任务失败:', error)
    $q.notify({
      type: 'negative',
      message: '保存任务失败，请检查控制台',
    })
  }
}

// 组件挂载时加载主题偏好和API Key
onMounted(() => {
  const savedKey = localStorage.getItem('deepseekKey')
  deepseekKey.value = savedKey
})
</script>

<template>
  <div class="ai-panel">
    <FluentColorBotSparkle16 class="text-100px" />

    <div class="input-container">
      <q-input
        v-model="taskDescription"
        label="请输入你想要完成的事情"
        outlined
        autogrow
        class="task-input"
        :disable="isLoading"
      />

      <q-btn
        label="AI 分析"
        color="primary"
        class="analyze-btn"
        :loading="isLoading"
        @click="analyzeTask"
      />
    </div>

    <div class="hint">
      <p>AI 会将你的任务分解为数个可执行的步骤，并添加到待办事项中</p>
    </div>
  </div>
</template>

<style scoped>
.ai-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  gap: 30px;
}

.input-container {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.task-input {
  width: 100%;
}

.analyze-btn {
  flex: 100px;
  height: 100%;
  align-self: flex-end;
}

.hint {
  text-align: center;
  color: #666;
  font-size: 14px;
}
</style>
