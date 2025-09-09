import React, { useEffect, useState } from "react";
import moment from "moment";
import View from "./view";
import axios from "axios";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";
import { toast } from "react-toastify";

function Index() {
  const { rutas, ganaderos, conductores } = useContextoPippo();
  const notifySuccess = (message) => toast.success(`Se ${message} el ganadero`);
  const notifySuccessApprove = (message) =>
    toast.success(`Se ${message} las recolecciones`);
  const notifyError = () => toast.error("Error, intente de nuevo");

  const [recoleccionesTemp, setRecoleccionesTemp] = useState([]);
  const [recoleccionesNew, setRecoleccionesNew] = useState([]);
  const [fechaSelect, setFechaSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toEdit, setToEdit] = useState(null);
  const [newLts, setNewLts] = useState(null);

  const [filter, setFilter] = useState("");

  const clearFilter = () => {
    setFilter("");
    setRecoleccionesNew(recoleccionesTemp);
  };

  const filterByGanadero = (ganadero_search) => {
    const filterGanadero = ganaderos.filter((ganadero) =>
      ganadero.nombre.includes(ganadero_search)
    );

    const ganaderoIds = filterGanadero.map((ganadero) => parseInt(ganadero.id));

    const filter = recoleccionesTemp.filter((recoleccion) =>
      ganaderoIds.includes(parseInt(recoleccion.ganadero))
    );
    setRecoleccionesNew(filter);
  };

  const filterByRuta = (ruta_id) => {
    if (ruta_id === "todas") {
      setRecoleccionesNew(recoleccionesTemp);
      return;
    }

    const filter = recoleccionesTemp.filter((recoleccion) =>
      recoleccion.ruta.includes(ruta_id)
    );
    setRecoleccionesNew(filter);
  };

  const getListAllRecolecciones = async (fecha) => {
    setFechaSelect(fecha);
    setIsLoading(true);

    const momentDate = moment(fecha);
    const formattedDate = momentDate.format("YYYY-MM-DD");

    try {
      await axios
        .get(
          `${URL_BASE}/recolecciones/getRecolecciones_temp.php?fecha=` +
            formattedDate
        )
        .then((response) => {
          setRecoleccionesTemp(response.data);
          setRecoleccionesNew(response.data);
        });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const [recoleccionesPendientes, setRecoleccionesPendientes] = useState([]);
  const [loadingRecoleccionesPendientes, setLoadingRecoleccionesPendientes] =
    useState(null);

  const getRecoleccionesPendientes = async () => {
    setLoadingRecoleccionesPendientes(true);
    try {
      await axios
        .get(`${URL_BASE}/recolecciones/getRecoleccionesPendientes.php`)
        .then((response) => {
          setRecoleccionesPendientes(response.data);
        });
    } catch (error) {
    } finally {
      setLoadingRecoleccionesPendientes(false);
    }
  };

  useEffect(() => {
    setRecoleccionesNew(recoleccionesTemp);
    getRecoleccionesPendientes();
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
          getRecoleccionesPendientes();
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

  const getRutaName = (id) => {
    return rutas?.find((r) => parseInt(r.id) === parseInt(id))?.nombre;
  };

  const saveRecolecciones = () => {
    axios
      .post(
        `${URL_BASE}/recolecciones/addRecoleccionesAndDeleteTemp.php`,
        recoleccionesNew
      )
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccessApprove(
            `guardaron las recolecciones de la fecha ${moment(
              fechaSelect
            ).format("DD-mm-yy")} y la ruta ${getRutaName(
              recoleccionesNew[0].ruta
            )}`
          );
          getListAllRecolecciones(fechaSelect);
          getRecoleccionesPendientes();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const recoleccionesUnicas = recoleccionesTemp?.reduce((acc, current) => {
    const existeRuta = acc.find((item) => item.ruta === current.ruta);
    if (!existeRuta) {
      acc.push(current);
    }
    return acc;
  }, []);

  const props = {
    recoleccionesNew,
    getListAllRecolecciones,
    tableTemplate,
    isLoading,
    setToEdit,
    toEdit,
    setNewLts,
    onSubmit,
    filterByGanadero,
    clearFilter,
    filter,
    setFilter,
    goToMaps,
    saveRecolecciones,
    recoleccionesPendientes,
    ganaderos,
    conductores,
    recoleccionesUnicas,
    filterByRuta,
    getRutaName,
    recoleccionesTemp,
    loadingRecoleccionesPendientes,
    fechaSelect,
  };
  return <View {...props} />;
}

export default Index;
