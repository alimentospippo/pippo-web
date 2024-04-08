import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { URL_BASE } from "../../constants";
import { toast } from "react-toastify";
import {
  FaDrumSteelpan,
  FaTemperatureHigh,
  FaLemon,
  FaBurn,
  FaAllergies,
  FaWater,
  FaOilCan,
  FaAtom,
  FaBacterium,
  FaThLarge,
  FaTh,
  FaVial,
  FaWaveSquare,
  FaGlassWhiskey,
  FaMendeley,
  FaPoll,
  FaFireAlt,
  FaBreadSlice,
  FaFlask,
  FaPencilAlt,
} from "react-icons/fa";
import moment from "moment";

import "./styles.scss";

function FormCompartimiento({
  analisisSelect,
  fechaSelect,
  rutaSelected,
  userLoggued,
  compartimientoSelect,
  id_recoleccion,
  getListAllRecolecciones,
  getListAnalisisById,
}) {
  const notifySuccess = (message) => toast.success(`Se ${message} el analisis`);
  const notifyError = () => toast.error("Error, intente de nuevo");
  const positivo_negativo = [{ name: "positivo" }, { name: "negativo" }];
  const FORM_FIELDS = [
    { name: "silo", type: "text", icon: <FaDrumSteelpan size={12} /> },
    {
      name: "temperatura",
      type: "text",
      icon: <FaTemperatureHigh size={12} />,
    },
    { name: "acidez", type: "text", icon: <FaLemon size={12} /> },
    { name: "alcohol", type: "text", icon: <FaBurn size={12} /> },
    { name: "ph", type: "text", icon: <FaAllergies size={12} /> },
    { name: "densidad", type: "text", icon: <FaWater size={12} /> },
    { name: "grasa", type: "text", icon: <FaOilCan size={12} /> },
    { name: "proteina", type: "text", icon: <FaAtom size={12} /> },
    { name: "ciloscopia", type: "text", icon: <FaBacterium size={12} /> },
    { name: "solidos_no_grasos", type: "text", icon: <FaThLarge size={12} /> },
    { name: "solidos_totales", type: "text", icon: <FaTh size={12} /> },
    { name: "", type: "free" },
    {
      name: "antibiotico",
      type: "radio",
      options: positivo_negativo,
      icon: <FaVial size={12} />,
    },
    {
      name: "neutralizante",
      type: "radio",
      options: positivo_negativo,
      icon: <FaWaveSquare size={12} />,
    },
    {
      name: "cloruros",
      type: "radio",
      options: positivo_negativo,
      icon: <FaGlassWhiskey size={12} />,
    },
    {
      name: "peroxido",
      type: "radio",
      options: positivo_negativo,
      icon: <FaMendeley size={12} />,
    },
    {
      name: "peroxdata",
      type: "radio",
      options: positivo_negativo,
      icon: <FaPoll size={12} />,
    },
    {
      name: "fosfadata",
      type: "radio",
      options: positivo_negativo,
      icon: <FaFireAlt size={12} />,
    },
    {
      name: "almidon",
      type: "radio",
      options: positivo_negativo,
      icon: <FaBreadSlice size={12} />,
    },
    {
      name: "prueba_suero",
      type: "radio",
      options: positivo_negativo,
      icon: <FaFlask size={12} />,
    },
    {
      name: "observaciones",
      type: "textarea",
      icon: <FaPencilAlt size={12} />,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm();

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (analisisSelect) {
      setIsEdit(userLoggued?.tipo === "3");
      Object.keys(analisisSelect).forEach((key) => {
        setValue(key, analisisSelect[key], { shouldValidate: true });
      });
    } else {
      FORM_FIELDS.forEach((field) => {
        setValue(field.name, "");
      });
    }
  }, [analisisSelect, setValue]);

  const onSubmit = async (data, estadoAnalisis, toUpdate) => {
    const body = {
      id_recoleccion: parseInt(id_recoleccion),
      fecha: moment().format("YYYY-MM-DD"),
      fecha_recoleccion: moment(fechaSelect).format("YYYY-MM-DD"),
      ruta: rutaSelected,
      usuario: userLoggued?.id,
      compartimiento: compartimientoSelect,
      observaciones: data.observaciones,
      silo: data.silo,
      temperatura: data.temperatura,
      acidez: data.acidez,
      alcohol: data.alcohol,
      ph: data.ph,
      densidad: data.densidad,
      grasa: data.grasa,
      proteina: data.proteina,
      ciloscopia: data.ciloscopia,
      antibiotico: data.antibiotico,
      solidos_no_grasos: data.solidos_no_grasos,
      solidos_totales: data.solidos_totales,
      neutralizante: data.neutralizante,
      cloruros: data.cloruros,
      peroxido: data.peroxido,
      peroxdata: data.peroxdata,
      fosfadata: data.fosfadata,
      almidon: data.almidon,
      prueba_suero: data.prueba_suero,
      estado: estadoAnalisis,
    };

    if (toUpdate) {
      await fetch(`${URL_BASE}/analisis/updateAnalisis.php`, {
        method: "PUT",
        body: JSON.stringify({
          item: {
            ...body,
          },
        }),
      })
        .then((response) => {
          if (response.status === 400) {
            notifyError();
          } else {
            notifySuccess("guardo");

            getListAllRecolecciones(fechaSelect, true);
            getListAnalisisById(parseInt(id_recoleccion));
          }
        })
        .catch((error) => {
          notifyError();
        });
    } else {
      await fetch(`${URL_BASE}/analisis/addAnalisis.php`, {
        method: "POST",
        body: JSON.stringify({
          item: {
            ...body,
          },
        }),
      })
        .then((response) => {
          if (response.status === 400) {
            notifyError();
          } else {
            notifySuccess("guardo");

            getListAllRecolecciones(fechaSelect, true);
            getListAnalisisById(parseInt(id_recoleccion));
          }
        })
        .catch((error) => {
          notifyError();
        });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form_main">
      <div className="inputs_fields">
        {FORM_FIELDS.map((field, index) => (
          <div key={index}>
            {field.type === "text" ? (
              <div className="input_field">
                <div className="labels">
                  <div className="icon_field">{field.icon}</div>
                  <label>{field.name.replaceAll("_", " ")}</label>
                </div>
                <input
                  type="number"
                  min={0}
                  {...register(field.name, { required: true })}
                  disabled={!isEdit}
                />
              </div>
            ) : field.type === "radio" ? (
              <div className="input_field_radio">
                <div className="labels">
                  <div className="icon_field"> {field.icon}</div>
                  <label for={field.name}>
                    {field.name.replaceAll("_", " ")}
                  </label>
                </div>
                <div className="options_radio">
                  {field.options.map((option, index) => (
                    <div key={index} className="input_radio" id={field.name}>
                      <input
                        type="radio"
                        {...option}
                        name={field.name}
                        value={option.name}
                        {...register(field.name, { required: true })}
                        disabled={!isEdit}
                      />
                      <label>{option.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              field.type === "free" && <div className="input_field_radio"></div>
            )}
          </div>
        ))}
      </div>

      <div className="input_field observ">
        <div className="labels">
          <div className="icon_field">
            {FORM_FIELDS.find((f) => f.name === "observaciones").icon}
          </div>
          <label>
            {FORM_FIELDS.find(
              (f) => f.name === "observaciones"
            ).name.replaceAll("_", " ")}
          </label>
        </div>
        <textarea
          className="input_textarea"
          {...register(
            FORM_FIELDS.find((f) => f.name === "observaciones").name
          )}
          disabled={!isEdit}
        />
      </div>

      {!analisisSelect && (
        <div className="button_content">
          <button
            className="button-cancel"
            onClick={
              isValid && handleSubmit((data) => onSubmit(data, "rechazado"))
            }
            disabled={!isValid}
          >
            Rechazado
          </button>
          <button
            className="button-ok"
            onClick={
              isValid && handleSubmit((data) => onSubmit(data, "aceptado"))
            }
            disabled={!isValid}
          >
            Aceptado
          </button>
        </div>
      )}
      {isEdit && (
        <button
          className="button-ok"
          onClick={
            isValid && handleSubmit((data) => onSubmit(data, "update", true))
          }
          disabled={!isValid}
        >
          Actualizar
        </button>
      )}
    </form>
  );
}

export default FormCompartimiento;
