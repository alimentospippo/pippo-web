import React, { useEffect, useState } from "react";

import View from "./view";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const {
    getListAllRutas,
    rutas,
    ganaderos,
    getListAllGanaderos,
    loadingRutas,
  } = useContextoPippo();

  const notifySuccess = (message) => toast.success(`Se ${message} la ruta`);
  const notifySuccessOrden = (message) => toast.success(`Se modifico el orden`);
  const notifyError = () => toast.error("Error, intente de nuevo");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [modalByGanaderos, setModalByGanaderos] = useState(false);
  const [dataModal, setDataModal] = useState();
  const [loading, setLoading] = useState(null);

  const {
    reset,
    register,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (dataModal?.type === "Modificar") {
      setValue("nombre", dataModal?.nombre);
      setValue("latitud", dataModal?.latitud);
      setValue("longitud", dataModal?.longitud);
    }
  }, [dataModal]);

  const add = (data) => {
    setLoading(true);
    fetch(`${URL_BASE}/rutas/add.php`, {
      method: "POST",
      body: JSON.stringify({
        item: {
          ...data,
        },
      }),
    }).then((response) => {
      if (response.status === 400) {
        notifyError();
      } else {
        setIsModalOpen(false);
        notifySuccess("agrego");
        getListAllRutas();
        reset();
      }
    });
    setLoading(false);
  };

  const update = (data) => {
    setLoading(true);
    fetch(`${URL_BASE}/rutas/update.php`, {
      method: "POST",
      body: JSON.stringify({
        item: {
          id: dataModal?.id,
          ...data,
        },
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          setIsModalOpen(false);
          notifySuccess("modifico");
          getListAllRutas();
          reset();
        }
      })
      .catch((error) => {
        notifyError();
      });
    setLoading(false);
  };

  const onSubmit = (data) => {
    if (dataModal?.type === "Agregar") {
      add(data);
    } else {
      update(data);
    }
  };

  const deleteItem = (id) => {
    fetch(`${URL_BASE}/rutas/delete.php`, {
      method: "POST",
      body: JSON.stringify({
        item: {
          id: id,
        },
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccess("elimino");
          getListAllRutas();
          reset();
          setIsModalDeleteOpen(false);
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const validateLatitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    if (!/^-?\d+(\.\d+)?$/.test(value)) {
      return "Latitud no valida";
    }
    if (num < -90 || num > 90) {
      return "Latitud no valida";
    }
    return true;
  };

  const validateLongitude = (value) => {
    if (value === "") return true;
    const num = parseFloat(value);
    if (!/^-?\d+(\.\d+)?$/.test(value)) {
      return "Longitud no valida";
    }
    if (num < -180 || num > 180) {
      return "Longitud no valida";
    }
    return true;
  };

  const validateNombre = (value) => {
    if (/ruta/i.test(value)) {
      return "El nombre no debe contener la palabra 'ruta'";
    }
    return true;
  };

  const formAdd = [
    {
      label: "Nombre",
      field: "nombre",
      type: "text",
      ...register("nombre", {
        required: true,
        validate: validateNombre,
      }),
    },
    {
      label: "Latitud",
      field: "latitud",
      type: "text",
      ...register("latitud", {
        validate: validateLatitude,
      }),
    },
    {
      label: "Longitud",
      field: "longitud",
      type: "text",
      ...register("longitud", {
        validate: validateLongitude,
      }),
    },
  ];

  const [ganaderosOrder, setGanaderosOrder] = useState([]);

  useEffect(() => {
    const filteredGanaderos = ganaderos?.filter(
      (g) => g.ruta === dataModal?.id
    );

    filteredGanaderos?.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));

    filteredGanaderos?.forEach((ganadero, index) => {
      ganadero.orden = index;
    });

    setGanaderosOrder(filteredGanaderos);
  }, [dataModal, ganaderos]);

  const updateOrderGanaderos = (id, direction) => {
    const index = ganaderosOrder.findIndex((ganadero) => ganadero.id === id);
    const newOrder = [...ganaderosOrder];

    if (
      index >= 0 &&
      index < ganaderosOrder.length - 1 &&
      direction === "down"
    ) {
      [newOrder[index].orden, newOrder[index + 1].orden] = [
        newOrder[index + 1].orden,
        newOrder[index].orden,
      ];
    } else if (index > 0 && direction === "up") {
      [newOrder[index].orden, newOrder[index - 1].orden] = [
        newOrder[index - 1].orden,
        newOrder[index].orden,
      ];
    }

    setGanaderosOrder(newOrder);
  };

  const updateOrder = () => {
    fetch(`${URL_BASE}/ganaderos/updateOrder.php`, {
      method: "POST",
      body: JSON.stringify({
        ganaderos: ganaderosOrder.map(({ id, orden }) => ({ id, orden })),
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccessOrden("modifico");
          getListAllGanaderos();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const activeInactive = (id, activo) => {
    fetch(`${URL_BASE}/rutas/updateActiveInactive.php`, {
      method: "POST",
      body: JSON.stringify({
        item: {
          id: id,
          activo: activo ? 0 : 1,
        },
      }),
    })
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          setIsModalOpen(false);
          notifySuccess("modifico");
          getListAllRutas();
          reset();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const props = {
    rutas,
    deleteItem,
    setIsModalDeleteOpen,
    setIsModalOpen,
    isModalOpen,
    setDataModal,
    isModalDeleteOpen,
    dataModal,
    reset,
    formAdd,
    onSubmit,
    handleSubmit,
    isValid,
    modalByGanaderos,
    setModalByGanaderos,
    updateOrderGanaderos,
    ganaderosOrder,
    updateOrder,
    errors,
    loading,
    activeInactive,
    loadingRutas,
  };
  return <View {...props} />;
}

export default Index;
