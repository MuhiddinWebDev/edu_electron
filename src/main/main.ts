import { app, BrowserWindow, ipcMain, session, ipcRenderer, globalShortcut  } from "electron";
import { join } from "path";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });
  mainWindow.setMenuBarVisibility(false);;
  if (process.env.NODE_ENV === "development") {
    console.log(process.argv[2])
    console.log("---------frontend-------------")
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
  } else {
    mainWindow.loadFile(join(app.getAppPath(), "renderer", "index.html"));
  }
}
app.on('browser-window-focus', () => {
  globalShortcut.register('CommandOrControl+R', () => {
    console.log("CommandOrControl+R is pressed: Shortcut Disabled");
  })
})
app.on('browser-window-blur', function () {
  globalShortcut.unregister('CommandOrControl+R');
});
app.whenReady().then(() => {
  createWindow();
  
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": ["script-src 'self'"],
      },
    });
  })
  ipcMain.on('print', (event, printOptions) => {
    console.log("Uka")
  });
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }

  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("message", (event, message) => {
  console.log(message);
});

// ipcMain.on("print", (event, data) => {
//   electronPrint.print({
//     printable: data,
//     onPrintDialogClose: () => console.log("Print dialog closed"),
//     onError: (error: Error) => console.error(error),
//   });
// });