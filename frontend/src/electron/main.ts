// // // import {app,BrowserWindow} from "electron"
// // // import path from "path"
// // // import { isDev } from "./util.js";
// // // // type test = string;


// // // app.on("ready",()=>{
// // //     const mainwindow = new BrowserWindow({
// // //         width : 500,
// // //         height:400,
// // //         webPreferences: {
// // //         preload: path.join(__dirname, "preload.js") 
// // //     }
// // //     });
// // //     if(isDev()){
// // //         mainwindow.loadURL("http://localhost:5123")
// // //     }else{
// // //         mainwindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
// // //     }
// // // })


// // // main.ts
// // import { app, BrowserWindow } from "electron";
// // import path from "path";
// // import { isDev } from "./util.js";
// // // import { fileURLToPath } from "url";

// // // // ES module __dirname for Windows
// // // const __filename = fileURLToPath(import.meta.url);
// // // const __dirname = path.dirname(__filename);

// // app.on("ready", () => {
// //   const mainWindow = new BrowserWindow({
// //     width: 500,
// //     height: 400,
   
// //   });

// //   if (isDev()) {
// //     mainWindow.loadURL("http://localhost:5123");
// //     mainWindow.webContents.openDevTools({ mode: "detach" });
// //   } else {
// //     mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
// //   }
// // });

// // // Close app on all windows closed
// // app.on("window-all-closed", () => {
// //   app.quit(); // Windows only, no Mac handling needed
// // });



// // main.ts
// import { ipcMain } from "electron";
// import { app, BrowserWindow } from "electron";
// import { generateKeyPairSync } from "crypto";
// import fs from "fs";
// import path from "path";
// import os from "os";
// import { isDev } from "./util.js";

// app.on("ready", () => {
//   // --- Windows-only folder for keys ---
//   const appDataPath = path.join(os.homedir(), ".cipher");
//   if (!fs.existsSync(appDataPath)) fs.mkdirSync(appDataPath);

//   const privateKeyPath = path.join(appDataPath, "private.pem");
//   const publicKeyPath = path.join(appDataPath, "public.pem");

//   // --- First-launch key generation ---
//   if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
//     const { publicKey, privateKey } = generateKeyPairSync("rsa", {
//       modulusLength: 2048,
//       publicKeyEncoding: { type: "pkcs1", format: "pem" },
//       privateKeyEncoding: { type: "pkcs1", format: "pem" }
//     });
//     fs.writeFileSync(privateKeyPath, privateKey);
//     fs.writeFileSync(publicKeyPath, publicKey);
//     console.log("RSA key pair generated at:", appDataPath);
//   }

//   // --- Create Electron window ---
//   const mainWindow = new BrowserWindow({
//     width: 500,
//     height: 400
//   });

    









//   if (isDev()) {
//     mainWindow.loadURL("http://localhost:5123");
//     mainWindow.webContents.openDevTools({ mode: "detach" });
//   } else {
//     mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
//   }
// });
// ipcMain.handle("get-public-key", () => {
//   const publicKeyPath = path.join(os.homedir(), ".cipher", "public.pem");
//   return fs.readFileSync(publicKeyPath, "utf-8");
// });
// // --- Quit app when all windows are closed ---
// app.on("window-all-closed", () => {
//   app.quit(); // Windows only
// });




import { ipcMain, app, BrowserWindow } from "electron";
import { generateKeyPairSync, sign, constants } from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import { isDev } from "./util.js";

app.on("ready", () => {
  // --- Windows-only folder for keys ---
  const appDataPath = path.join(os.homedir(), ".cipher");
  if (!fs.existsSync(appDataPath)) fs.mkdirSync(appDataPath);

  const privateKeyPath = path.join(appDataPath, "private.pem");
  const publicKeyPath = path.join(appDataPath, "public.pem");

  // --- First-launch key generation ---
  if (!fs.existsSync(privateKeyPath) || !fs.existsSync(publicKeyPath)) {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" }
    });
    fs.writeFileSync(privateKeyPath, privateKey);
    fs.writeFileSync(publicKeyPath, publicKey);
    console.log("RSA key pair generated at:", appDataPath);
  }

  // --- Create Electron window ---
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 400
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  // --- Sign a test challenge and log it for backend testing ---
  const challenge = "4fff90ecb4bafb89598e6fee02a5f28d29efd225133cbf4905dd95e456cf1ced";
  const privateKey = fs.readFileSync(privateKeyPath, "utf-8");
console.log(privateKey)
  const signatureBuffer = sign(
    "sha256",
    Buffer.from(challenge),
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_PADDING,
      // saltLength: constants.RSA_PSS_SALTLEN_DIGEST,
    }
  );

  console.log("Challenge:", challenge);
  console.log("RSA Signature (hex):", signatureBuffer.toString("hex"));
});

// --- IPC handler to return public key ---
ipcMain.handle("get-public-key", () => {
  const publicKeyPath = path.join(os.homedir(), ".cipher", "public.pem");
  return fs.readFileSync(publicKeyPath, "utf-8");
});

// --- Quit app when all windows are closed ---
app.on("window-all-closed", () => {
  app.quit(); // Windows only
});