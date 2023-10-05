import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessage: (message) => ipcRenderer.send('message', message)
});
contextBridge.exposeInMainWorld("electronPrint", require("electron-print"));
//# sourceMappingURL=preload.js.map