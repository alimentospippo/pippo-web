import React, { useState } from "react";
import { Routes, Route, Link, HashRouter } from "react-router-dom";
import Ganaderos from "./pages/ganaderos";
import Rutas from "./pages/rutas";
import Home from "./pages/home";
import Login from "./pages/login";
import Conductores from "./pages/conductores";
import Recolecciones from "./pages/recolecciones";
import Exportar from "./pages/exportar";
import Analisis from "./pages/analisis";
import { AiFillHome } from "react-icons/ai";
import {
  FaHatCowboy,
  FaRoute,
  FaStickyNote,
  FaMicroscope,
} from "react-icons/fa";
import { ImTruck } from "react-icons/im";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useContextoPippo } from "./ContextoPippo";

import "./App.scss";
import MainHeader from "./MainHeader";

function RoutesJS() {
  const { login, userLoggued } = useContextoPippo();

  const [navi, setNav] = useState("Inicio");

  const navs = [
    {
      id: 1,
      name: "Inicio",
      path: "/",
      element: <Home />,
      icon: <AiFillHome />,
      active: true,
    },
    {
      id: 2,
      name: "Recolecciones",
      path: "/recolecciones",
      element: <Recolecciones />,
      icon: <FaStickyNote />,
      active: userLoggued?.tipo === "0",
    },
    {
      id: 3,
      name: "Ganaderos",
      path: "/ganaderos",
      element: <Ganaderos />,
      icon: <FaHatCowboy />,
      active: userLoggued?.tipo === "0",
    },
    {
      id: 4,
      name: "Rutas",
      path: "/rutas",
      element: <Rutas />,
      icon: <FaRoute />,
      active: userLoggued?.tipo === "0",
    },
    {
      id: 5,
      name: "Conductores",
      path: "/conductores",
      element: <Conductores />,
      icon: <ImTruck />,
      active: userLoggued?.tipo === "0",
    },
    {
      id: 6,
      name: "Analisis",
      path: "/analisis",
      element: <Analisis />,
      icon: <FaMicroscope />,
      active: true,
    },
    {
      id: 7,
      name: "Exportar",
      path: "/exportar",
      element: <Exportar />,
      icon: <RiFileExcel2Fill />,
      active: true,
    },
  ].filter((nav) => nav.active);
  return (
    <HashRouter>
      {login ? (
        <>
          <div className={"menu movil-noview"}>
            <div className="menu-list">
              {navs.map((nav) => {
                return (
                  <Link key={nav.id} to={nav.path}>
                    <div
                      className={`menu-list-item ${
                        navi === nav.name && "active"
                      } `}
                      onClick={() => {
                        setNav(nav.name);
                      }}
                    >
                      {nav.icon}
                      {nav.name}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="main">
            <MainHeader />
            <Routes>
              {navs.map((nav) => {
                return (
                  <Route key={nav.id} path={nav.path} element={nav.element} />
                );
              })}
            </Routes>
          </div>
        </>
      ) : (
        <>
          <Routes>
            <Route path={"/"} element={<Login />} />
          </Routes>
        </>
      )}
    </HashRouter>
  );
}

export default RoutesJS;
