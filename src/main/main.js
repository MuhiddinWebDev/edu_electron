"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
function createWindow() {
    const mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: (0, path_1.join)(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });
    mainWindow.setMenuBarVisibility(false);
    ;
    if (process.env.NODE_ENV === "development") {
        console.log(process.argv[2]);
        console.log("---------frontend-------------");
        const rendererPort = process.argv[2];
        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    }
    else {
        mainWindow.loadFile((0, path_1.join)(electron_1.app.getAppPath(), "renderer", "index.html"));
    }
}
electron_1.app.on('browser-window-focus', () => {
    electron_1.globalShortcut.register('CommandOrControl+R', () => {
        console.log("CommandOrControl+R is pressed: Shortcut Disabled");
    });
});
electron_1.app.on('browser-window-blur', function () {
    electron_1.globalShortcut.unregister('CommandOrControl+R');
});
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: Object.assign(Object.assign({}, details.responseHeaders), { "Content-Security-Policy": ["script-src 'self'"] }),
        });
    });
    electron_1.ipcMain.on('print', (event, printOptions) => {
        console.log("Uka");
    });
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.ipcMain.on("message", (event, message) => {
    console.log(message);
});
//# sourceMappingURL=main.js.map