import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve} from '@rollup/plugin-node-resolve'
import { ViteAliases} from 'vite-aliases'
import { fileURLToPath } from 'url'

const alias = (find, repl) => ({ 
  find, 
  replacement: fileURLToPath(new URL(repl, import.meta.url)),
});

const aliases = ViteAliases({
  dir: resolve('src/renderer/src'),
  useIndexes: true,
})


export default defineConfig({

  main: {
    plugins: [commonjs(), externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.js')
        }
      }
    }
  },

  preload: {
    plugins: [commonjs(), externalizeDepsPlugin()]
  },

  renderer: {
    resolve: {
      alias: [
        alias('@renderer', resolve('src/renderer/src')),
        alias('~/', './src/renderer/src/'),
        alias('utils', resolve('src/renderer/src/utils')),
        alias('store', resolve('src/renderer/src/store')),
        alias('components', resolve('src/renderer/src/components')),
        alias('keys', './src/renderer/src/keys'),
        alias('hooks', './src/renderer/src/hooks'),
      ]
    },
    plugins: [ 
      react(), 
      // aliases,
      // nodeResolve({
        // rootDir: resolve('src/renderer/src'),
        // extensions: [ '.js', '.jsx' ],
      // }),
    ] 
  }
})

