const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const pm2 = require('pm2');
const path = require('path')
const url = require('url')
const fixPath = require('fix-path');

let mainWindow
//process.env.ELECTRON_RUN_AS_NODE = true;

function createWindow () {


  pm2.connect(function(err) { //start up pm2 god
    if (err) {
      console.error(err);
      process.exit(2);
    }

    var bin_path = './path/to/binary';
    pm2.start({
      script    : bin_path,         // path to binary
      exec_mode : 'fork',
      cwd: './working_dir/'
    }, function(err, apps) {
      pm2.disconnect();   // Disconnect from PM2
      if (err) throw err
    });
  });

  mainWindow = new BrowserWindow({width: 800, height: 600})
  //console.log(process.env.PATH);
  fixPath();
  //console.log(process.env.PATH);

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()



  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
/*  pm2.killDaemon(function(err) {
    if (err) {
      console.error(err);
      process.exit(2);
    }
  });
  pm2.disconnect(); */

  if (process.platform !== 'darwin') {
/*    pm2.killDaemon(function(err) { 
      if (err) {
        console.error(err);
        process.exit(2);
      }
    });
    pm2.disconnect(); */
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
