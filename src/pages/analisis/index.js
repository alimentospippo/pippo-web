import React, { useEffect, useState } from "react";
import moment from "moment";
import View from "./view";
import axios from "axios";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const { recolecciones, userLoggued, rutas } = useContextoPippo();

  const [recoleccionesNew, setRecoleccionesNew] = useState([]);
  const [analisisNew, setAnalisisNew] = useState([]);
  const [fechaSelect, setFechaSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalisis, setIsLoadingAnalisis] = useState(false);
  const [compartimientoSelect, setCompartimientoSelect] = useState(1);
  const [recoleccionSelect, setRecoleccionSelect] = useState(null);

  const getListAnalisisById = async (id_recoleccion) => {
    setIsLoadingAnalisis(true);

    setTimeout(async () => {
      try {
        const responseAnalisis = await axios.get(
          `${URL_BASE}/analisis/getAnalisisByIDRecolect.php?id_recoleccion=${id_recoleccion}`
        );
        setAnalisisNew(responseAnalisis.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }

      setIsLoadingAnalisis(false);
    }, 1000);
  };

  const getListAllRecolecciones = async (fecha, isForm) => {
    !isForm && setRecoleccionSelect(null);
    setFechaSelect(fecha);
    setIsLoading(true);

    const momentDate = moment(fecha);
    const formattedDate = momentDate.format("YYYY-MM-DD");

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${URL_BASE}/recolecciones_ruta/getRecoleccionesRutaByDate.php?fecha=${formattedDate}`
        );

        setRecoleccionesNew(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }

      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setFechaSelect(new Date());
    setRecoleccionesNew(recolecciones);
  }, []);

  const tableTemplate = [
    "Id",
    "Fecha recoleccion",
    "Ruta",
    "Conductor",
    "Litros",
    "Analisis",
  ];

  const calculateCompartimiento = () => {
    const compartimientos = [];

    for (let i = 1; i <= 3; i++) {
      compartimientos.push(`Compartimiento ${i}`);
    }

    return compartimientos;
  };

  const [analisisFormData, setAnalisisFormData] = useState({});

  useEffect(() => {
    if (analisisNew && compartimientoSelect) {
      const filteredAnalisis = analisisNew.find(
        (a) => parseInt(a.compartimiento) === parseInt(compartimientoSelect)
      );

      setAnalisisFormData(filteredAnalisis);
    }
  }, [analisisNew, compartimientoSelect]);

  const props = {
    recoleccionesNew,
    getListAllRecolecciones,
    tableTemplate,
    fechaSelect,
    isLoading,
    compartimientoSelect,
    setCompartimientoSelect,
    userLoggued,
    calculateCompartimiento,
    getListAnalisisById,
    isLoadingAnalisis,
    recoleccionSelect,
    setRecoleccionSelect,
    analisisFormData,
  };
  return <View {...props} />;
}

export default Index;
