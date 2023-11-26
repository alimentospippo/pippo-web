import React from "react";

import "./App.scss";
import { ContextoPippoProvider } from "./ContextoPippo";
import RoutesJS from "./Routes";

function App() {
  return (
    <div className="main-content">
      <ContextoPippoProvider>
        <RoutesJS />
      </ContextoPippoProvider>
    </div>
  );
}

export default App;
