import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import moment from "moment";
import View from "./view";
import { URL_BASE } from "../../constants";

function Index({ ganaderos, rutas, conductores }) {
  const notifySuccess = (message) => toast.success(message);
  const notifyWarning = (message) => toast.warning(message);
  const notifyError = () => toast.error("Error, intente de nuevo");
  const userLoggued = JSON.parse(localStorage.getItem("user"));

  const today = moment().format("YYYY-MM-DD");

  const conductorInfo = conductores?.filter(
    (c) => c.usuario === userLoggued.usuario
  )[0];

  const guardarDatos = (dataSend) => {
    fetch(`${URL_BASE}/registro/addRegistro.php`, {
      method: "POST",
      body: JSON.stringify({
        item: dataSend,
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccess(`Se agrego el registro`);
          localStorage.removeItem("registro");
          /*  getListAllGanaderos();
       reset(); */
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const dataSend = {
      conductor: conductorInfo?.id,
      fecha: today,
      ganadero: ganaderoSelect,
      ruta: conductorInfo?.ruta,
      litros: litrosSelect,
      precio: ganaderos?.filter((item) => item.documento === ganaderoSelect)[0]
        ?.precio,
      total:
        ganaderos?.filter((item) => item.documento === ganaderoSelect)[0]
          ?.precio * litrosSelect,
    };

    guardarDatos(dataSend);
  };

  const ganaderoSelect = watch("ganadero");
  const litrosSelect = watch("litros");

  const props = {
    ganaderos,
    conductorInfo,
    handleSubmit,
    onSubmit,
    register,
    ganaderoSelect,
    litrosSelect,
    isValid,
    rutas,
  };

  return <View {...props} />;
}

export default Index;
