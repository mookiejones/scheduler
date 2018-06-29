import React from "react";

const getOsVersion = () => {
  let OSName = "Unknown OS";
  let version = navigator.appVersion;
  if (/Win/.test(version)) return "Windows";
  if (/Mac/.test(version)) return "MaxOS";
  if (/X11/.test(version)) return "UNIX";
  if (/Linux/.test(version)) return "Linux";

  return OSName;
};
const currentUser = {
  id: "",
  name: ""
};

const getEnvironment = () => {
  let location = window.location.href;
  if (/localhost/i.test(location)) return "development";

  debugger;
};

const appContext = {
  currentUser: currentUser,
  environment: getEnvironment(),
  OSName: getOsVersion(),
  role: ""
};

const AppContext = React.createContext(appContext);
const ConnectionContext = React.createContext({
  connectionState: "disconnected"
});
export { AppContext, ConnectionContext };
