import React, { useEffect, useState } from "react";

import View from "./view";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const { getListAllConductores, conductores, rutas } = useContextoPippo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [dataModal, setDataModal] = useState();

  const notifySuccess = (message) =>
    toast.success(`Se ${message} el conductor`);
  const notifyError = () => toast.error("Error, intente de nuevo");

  const {
    reset,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (dataModal?.type === "Modificar") {
      setValue("id", dataModal?.id);
      setValue("nombre", dataModal?.nombre);
      setValue("ruta", dataModal?.ruta);
      setValue("placa", dataModal?.placa);
    }
  }, [dataModal]);

  const add = (data) => {
    fetch(`${URL_BASE}/conductores/add.php`, {
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
          setIsModalOpen(false);
          notifySuccess("agrego");
          getListAllConductores();
          reset();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };
  const update = (data) => {
    fetch(`${URL_BASE}.000webhostapp.com/api/conductores/update.php`, {
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
          setIsModalOpen(false);
          notifySuccess("modifico");
          getListAllConductores();
          reset();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const onSubmit = (data) => {
    if (dataModal?.type === "Agregar") {
      add(data);
    } else {
      update(data);
    }
  };

  const deleteItem = (id) => {
    fetch(`${URL_BASE}.000webhostapp.com/api/conductores/delete.php`, {
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
          setIsModalDeleteOpen(false);
          notifySuccess("elimino");
          getListAllConductores();
          reset();
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const formAdd = [
    {
      label: "Nombre",
      type: "text",
      ...register("nombre", {
        required: true,
      }),
    },
    {
      label: "Ruta",
      type: "select",
      ...register("ruta", {
        required: true,
      }),
      options: rutas,
    },
    {
      label: "Placa",
      type: "text",
      ...register("placa", {
        required: true,
      }),
    },
  ];

  const props = {
    conductores,
    onSubmit,
    handleSubmit,
    isValid,
    deleteItem,
    setIsModalDeleteOpen,
    setIsModalOpen,
    isModalOpen,
    setDataModal,
    isModalDeleteOpen,
    dataModal,
    formAdd,
    reset,
  };
  return <View {...props} />;
}

export default Index;
