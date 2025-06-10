const { app, BrowserWindow } = require('electron');

function createWindow () {
  console.log("Creating Electron window...");
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  console.log("Window loaded.");
}

app.whenReady().then(() => {
  console.log("App is ready.");
  createWindow();
});
