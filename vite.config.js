const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')

const { defineConfig } = require('vite');

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    root: Path.join(__dirname, 'src', 'renderer'),
    publicDir: 'public',
    server: {
        port: 5173,
    },
    open: false,
    build: {
        outDir: Path.join(__dirname, 'build', 'renderer'),
        emptyOutDir: true,
    },
    plugins: [vuePlugin()],
    include: ['electron'],

    pluginOptions: {
        electronBuilder: {
          builderOptions: {
            appId: "EduApp",
            productName: "EduApp",
            // win: {
            //   target: ["nsis"],
            //   icon: "./build/icos.ico"
            // },
            // nsis: {
            //   oneClick: false,
            //   installerIcon: "./build/icos.ico",
            //   uninstallerIcon: "./build/icos.ico",
            //   uninstallDisplayName: "EduApp Unistaller",
            //   license: "license.md",
            //   allowToChangeInstallationDirectory: true
            // }
          }
        }
    },
});

module.exports = config;


// import vue from '@vitejs/plugin-vue';
// import path from 'path';

// export default {
//   root: './src/renderer',
//   publicDir: 'public',
//   server: {
//     port: 5173,
//   },
//   build: {
//     outDir: './build/renderer',
//     emptyOutDir: true,
//     target: 'esnext', // Set the target here
//     assetsDir: 'assets',
//   },
//   plugins: [
//     vue({
//       include: [/\.vue$/, /\.md$/],
//     }),
//   ],
//   define: {
//     'process.env': process.env,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src/renderer'),
//     },
//   },
//   base: './', // Set the base URL for your application
//   optimizeDeps: {
//     include: ['electron'],
//   },
//   // Electron Builder Configuration
//   build: {
//     target: 'nsis',
//     icon: './build/icos.ico',
//     // other Electron Builder options
//     // ...
//   },
// };
