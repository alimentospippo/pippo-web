import React from "react";

import "./App.scss";
import { ContextoPippoProvider } from "./ContextoPippo";
import RoutesJS from "./Routes";
import { isMobile } from "react-device-detect";
import { icons } from "./pages/icons";

function App() {
  return (
    <div className="main-content">
      {isMobile ? (
        <div className="is_mobile">
          <div className="img-logo">{icons("logo")}</div>
          <p>¡Bienvenido a Pippo!</p>
          <p>
            Para una mejor experiencia, abre este enlace desde un pc
          </p>
        </div>
      ) : (
        <ContextoPippoProvider>
          <RoutesJS />
        </ContextoPippoProvider>
      )}
    </div>
  );
}

export default App;
