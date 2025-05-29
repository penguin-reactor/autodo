import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import UnoCSS from 'unocss/vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
    plugins: [
      vue({
        template: { transformAssetUrls },
      }),
      UnoCSS(),
      quasar({
        // sassVariables: resolve('src/renderer/src/quasar-variables.sass')
        sassVariables: fileURLToPath(
          new URL('./src/renderer/src/quasar-variables.sass', import.meta.url),
        ),
        lessVariables: fileURLToPath(
          new URL('./src/assets/vars.less', import.meta.url),
        ),
      }),
      Icons({ compiler: 'vue3', autoInstall: true }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "quasar/src/css/variables.sass"`,
        },
        less: {
          additionalData: `@import "quasar/src/css/variables.less"`,
        },
      },
    },
  },
})
