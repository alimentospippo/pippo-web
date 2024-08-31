import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { URL_BASE } from "./constants";
import moment from "moment";

const contextoPippo = createContext();

const ContextoPippoProvider = ({ children }) => {
  const [ganaderos, setGanaderos] = useState(null);
  const [conductores, setConductores] = useState(null);
  const [rutas, setRutas] = useState(null);
  const [recolecciones, setRecolecciones] = useState(null);
  const [userLoggued, setUserLoggued] = useState(null);
  const [login, setLogin] = useState(false);
  const [loadingRutas, setLoadingRutas] = useState(null);

  const getListAllGanaderos = () => {
    axios
      .get(`${URL_BASE}/ganaderos/getListGanaderosAll.php`)
      .then((response) => {
        setGanaderos(response.data);
      });
  };

  const getListAllConductores = () => {
    axios
      .get(`${URL_BASE}/conductores/getListConductores.php`)
      .then((response) => {
        setConductores(response.data);
      });
  };

  const getListAllRutas = async () => {
    try {
      setLoadingRutas(true);
      const response = await axios.get(`${URL_BASE}/rutas/getListRutas.php`);
      setRutas(response.data);
    } catch (error) {
      console.error("Error al obtener la lista de rutas:", error);
    } finally {
      setLoadingRutas(false);
    }
  };

  const getListAllRecolecciones = async () => {
    const momentDate = moment();
    const formattedDate = momentDate.format("YYYY-MM-DD");

    axios
      .get(
        `${URL_BASE}/recolecciones/getRecolecciones.php?fecha=${formattedDate}`
      )
      .then((response) => {
        setRecolecciones(response.data);
      });
  };

  useEffect(() => {
    const userLOCAL = localStorage.getItem("user");
    if (userLOCAL) {
      setLogin(true);
    }
  }, []);

  useEffect(() => {
    if (login) {
      setUserLoggued(JSON.parse(localStorage.getItem("user")));
      getListAllGanaderos();
      getListAllConductores();
      getListAllRutas();
      getListAllRecolecciones();
    }
  }, [login]);

  return (
    <contextoPippo.Provider
      value={{
        ganaderos,
        conductores,
        rutas,
        recolecciones,
        setUserLoggued,
        userLoggued,
        setLogin,
        login,
        getListAllGanaderos,
        getListAllRutas,
        getListAllConductores,
        loadingRutas,
      }}
    >
      {children}
    </contextoPippo.Provider>
  );
};

const useContextoPippo = () => {
  return useContext(contextoPippo);
};

export { ContextoPippoProvider, useContextoPippo };
