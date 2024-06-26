import React, { useEffect, useState } from "react";
import moment from "moment";
import View from "./view";
import axios from "axios";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";
import { toast } from "react-toastify";

function Index() {
  const { recolecciones } = useContextoPippo();
  const notifySuccess = (message) => toast.success(`Se ${message} el ganadero`);
  const notifyError = () => toast.error("Error, intente de nuevo");

  const [recoleccionesNew, setRecoleccionesNew] = useState([]);
  const [fechaSelect, setFechaSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [newLts, setNewLts] = useState(null);

  const [filter, setFilter] = useState("");

  const clearFilter = () => {
    setFilter("");
    setRecoleccionesNew(recolecciones);
  };
  const filterByGanadero = (ganadero) => {
    const filter = recolecciones.filter((recoleccion) =>
      recoleccion.ganadero.toLowerCase().includes(ganadero)
    );
    setRecoleccionesNew(filter);
  };

  const getListAllRecolecciones = async (fecha) => {
    setFechaSelect(fecha);
    setIsLoading(true);

    const momentDate = moment(fecha);
    const formattedDate = momentDate.format("YYYY-MM-DD");

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${URL_BASE}/recolecciones/getRecolecciones.php?fecha=` +
            formattedDate
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
    "Fecha",
    "Hora",
    "Ruta",
    "Ganadero",
    "Conductor",
    "GPS",
    "Observaciones",
    "Litros",
    "Total",
  ];

  const update = (data) => {
    fetch(`${URL_BASE}/recolecciones/updateRecoleccion.php`, {
      method: "POST",
      body: JSON.stringify({
        item: {
          ...data,
        },
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          setToEdit(null);
          notifySuccess("modifico");
          getListAllRecolecciones(fechaSelect);
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const onSubmit = (id) => {
    const data = {
      id,
      litros: newLts,
    };
    update(data);
  };

  const goToMaps = ({ lat, long }) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${long}`,
      "_blank"
    );
  };

  const props = {
    recoleccionesNew,
    getListAllRecolecciones,
    tableTemplate,
    fechaSelect,
    isLoading,
    setToEdit,
    toEdit,
    newLts,
    setNewLts,
    onSubmit,
    filterByGanadero,
    clearFilter,
    filter,
    setFilter,
    goToMaps,
  };
  return <View {...props} />;
}

export default Index;
