var os = require("os");
const applescript = require("applescript");
const { contextBridge } = require("electron");
const activeWindow = require("active-win");
const { getAuthStatus } = require("node-mac-permissions");

const urlAndTitleScript = `tell application "Google Chrome"
set theURL to URL of active tab of first window
set theTitle to title of active tab of first window
end tell

return [theURl, theTitle]
`;

const urlAndTitleScriptSafari = `tell application "Safari"
set theURL to URL of active tab of window 1
set theTitle to title of active tab of window 1
end tell

return [theURl, theTitle]
`;

contextBridge.exposeInMainWorld("electronDW", {
  getAuthStatus,
  activeWindowWrapper: () => {
    return activeWindow({ screenRecordingPermission: false });
  },
  getPlatformAndVersion: () => {
    const platform = os.platform(); // 'darwin'
    const release = os.release();
    return [platform, release];
  },
  askAppleScriptChromeTab: () => {
    applescript.execString(urlAndTitleScript, (err, rtn) => {
      if (err) {
        // Something went wrong!
        console.log(err);
      }
      console.log("the current active tab url is: ", rtn);
    });
  },
  askAppleScriptSafariTab: () => {
    applescript.execString(urlAndTitleScriptSafari, (err, rtn) => {
      if (err) {
        // Something went wrong!
        console.log(err);
      }
      console.log("the current active tab url is: ", rtn);
    });
  },
});
