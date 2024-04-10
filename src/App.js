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
            Para una mejor experiencia, por favor descarga nuestra aplicación.
          </p>
          <p>
            <a href="https://pippo-test.000webhostapp.com/app_pippo.zip">
              Haz click aqui
            </a>
            .
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
