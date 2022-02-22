import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { EggStateContextProvider } from "./contexts/EggStateContext";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <EggStateContextProvider>
      <App />
    </EggStateContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
