import React, { useEffect, useState } from "react";

import View from "./view";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const { usuarios, getListUsuarios, loadingUsuarios, getListAllConductores } =
    useContextoPippo();
  const [dataModal, setDataModal] = useState(null);

  const notifySuccess = (message) => toast.success(`Se ${message} el usuario `);
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
      setValue("usuario", dataModal?.usuario);
      setValue("tipo", parseInt(dataModal?.tipo));
      setValue("password", dataModal?.password);
    }
  }, [dataModal]);

  const [loading, setLoading] = useState(false);

  const add = async (data) => {
    setLoading(true);
    try {
      await fetch(`${URL_BASE}/usuarios/add.php`, {
        method: "POST",
        body: JSON.stringify({
          item: {
            ...data,
          },
        }),
      });

      notifySuccess("agrego");
      getListAllConductores();
      getListUsuarios();
      reset();
    } finally {
      setLoading(false);
    }
  };

  const update = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${URL_BASE}/usuarios/update.php`, {
        method: "POST",
        body: JSON.stringify({
          item: {
            ...data,
          },
        }),
      });

      if (response.status === 400) {
        notifyError();
      } else {
        getListAllConductores();
        notifySuccess("modifico");
        getListUsuarios();
        reset();
      }
    } catch (error) {
      notifyError();
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    if (!dataModal) {
      add(data);
    } else {
      update(data);
    }
  };

  const roles = [
    {
      id: 0,
      nombre: "Administrador",
    },
    {
      id: 1,
      nombre: "Conductor",
    },
    {
      id: 2,
      nombre: "Calidad",
    },
    {
      id: 3,
      nombre: "Supervisor de calidad",
    },
    {
      id: 4,
      nombre: "Recepcion de leche",
    },
  ];

  const generarPass = (e) => {
    e.preventDefault();
    setValue("password", Math.random().toString(36).slice(-10));
  };

  const formAdd = [
    {
      label: "Usuario",
      type: "text",
      ...register("usuario", {
        required: true,
        validate: (value) => {
          const usuarioExiste = usuarios.some(
            (u) => u.usuario.toLowerCase() === value.toLowerCase()
          );
          return !usuarioExiste || "El usuario ya existe";
        },
      }),
    },
    {
      label: "Tipo",
      type: "select",
      ...register("tipo", {
        required: true,
      }),
      options: roles,
    },
    {
      label: "Password",
      type: "text",
      ...register("password", {
        required: true,
      }),
      extraButton: () => (
        <button onClick={(e) => generarPass(e)} className="button">
          Generar
        </button>
      ),
    },
  ];

  const props = {
    onSubmit,
    handleSubmit,
    isValid,
    setDataModal,
    dataModal,
    formAdd,
    reset,
    usuarios,
    roles,
    loading,
    errors,
    loadingUsuarios,
  };
  return <View {...props} />;
}

export default Index;
