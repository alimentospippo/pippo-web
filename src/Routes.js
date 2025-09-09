import React, { useState } from "react";
import { Routes, Route, Link, BrowserRouter, Navigate } from "react-router-dom";
import Ganaderos from "./pages/ganaderos";
import Rutas from "./pages/rutas";
import Home from "./pages/home";
import Login from "./pages/login";
import Conductores from "./pages/conductores";
import Recolecciones from "./pages/recolecciones";
import RecoleccionesTemporales from "./pages/recoleccionesTemporales";
import Exportar from "./pages/exportar";
import Analisis from "./pages/analisis";
import Usuarios from "./pages/usuarios";
import RecoleccionesCSV from "./pages/recoleccionesCSV";
import { AiFillHome } from "react-icons/ai";
import {
  FaHatCowboy,
  FaRoute,
  FaStickyNote,
  FaMicroscope,
  FaClock,
  FaUserFriends,
  FaFileExcel
} from "react-icons/fa";
import { ImTruck } from "react-icons/im";
import { RiFileExcel2Fill } from "react-icons/ri";
import { useContextoPippo } from "./ContextoPippo";

import "./App.scss";
import MainHeader from "./MainHeader";
import PrivateRoute from "./PrivateRoute";

function RoutesJS() {
  const { login, userLoggued } = useContextoPippo();
  const [navi, setNav] = useState("Inicio");

  const isAdmin = userLoggued?.tipo === "0";

  const navs = [
    {
      name: "Inicio",
      path: "/",
      element: <Home />,
      icon: <AiFillHome />,
      active: true,
    },
    {
      name: "Rutas",
      path: "/rutas",
      element: <Rutas />,
      icon: <FaRoute />,
      active: isAdmin,
    },
    {
      name: "Recolecciones preliminares",
      path: "/recolecciones-temporales",
      element: <RecoleccionesTemporales />,
      icon: <FaClock size={20} />,
      active: isAdmin,
    },
    {
      name: "Recolecciones",
      path: "/recolecciones",
      element: <Recolecciones />,
      icon: <FaStickyNote />,
      active: isAdmin,
    },
    {
      name: "Recolecciones csv",
      path: "/recolecciones-csv",
      element: <RecoleccionesCSV />,
      icon: <FaFileExcel />,
      active: isAdmin,
    },
    {
      name: "Ganaderos",
      path: "/ganaderos",
      element: <Ganaderos />,
      icon: <FaHatCowboy />,
      active: isAdmin,
    },
    {
      name: "Conductores",
      path: "/conductores",
      element: <Conductores />,
      icon: <ImTruck />,
      active: isAdmin,
    },
    {
      name: "Analisis",
      path: "/analisis",
      element: <Analisis />,
      icon: <FaMicroscope />,
      active: true,
    },
    {
      name: "Exportar",
      path: "/exportar",
      element: <Exportar />,
      icon: <RiFileExcel2Fill />,
      active: true,
    },
    {
      name: "Usuarios",
      path: "/usuarios",
      element: <Usuarios />,
      icon: <FaUserFriends />,
      active: isAdmin,
    },
   
  ].filter((nav) => nav.active);

  return (
    <BrowserRouter basename="/app-alimentospippo/app">
      {login ? (
        <>
          <div className={"menu"}>
            <div className="menu-list">
              {navs.map((nav, index) => (
                <Link key={index} to={nav.path}>
                  <div
                    className={`menu-list-item ${
                      navi === nav.name && "active"
                    } `}
                    onClick={() => setNav(nav.name)}
                  >
                    {nav.icon}
                    {nav.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="main">
            <MainHeader />
            <Routes>
              {navs.map((nav, index) => (
                <Route
                  key={index}
                  path={nav.path}
                  element={<PrivateRoute>{nav.element}</PrivateRoute>}
                />
              ))}
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default RoutesJS;
