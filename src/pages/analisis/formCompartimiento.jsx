import React, { useEffect, useState, useCallback } from "react";
import { URL_BASE } from "../../constants";
import { toast } from "react-toastify";
import { positivo_negativo, FORM_FIELDS } from "./constants";

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
  fechaRecoleccion,
  recoleccionSelect,
}) {
  const notifySuccess = (message) => toast.success(`Se ${message} el analisis`);
  const notifyError = () => toast.error("Error, intente de nuevo");

  /* const formMethods = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid, errors, touchedFields, dirtyFields },
  } = formMethods; */

  const [isEditor, setIsEditor] = useState(false);

  const onSubmit = async (data, estadoAnalisis, toUpdate) => {
    const body = {
      ...(toUpdate && { id: analisisSelect.analisis_id }),
      id_recoleccion: parseInt(id_recoleccion),
      fecha: moment().format("YYYY-MM-DD"),
      fecha_recoleccion: moment(fechaRecoleccion).format("YYYY-MM-DD"),
      ruta: rutaSelected,
      usuario: userLoggued?.id,
      compartimiento: compartimientoSelect,
      observaciones: data.observaciones || "",
      silo: data.silo,
      temperatura: data.temperatura,
      acidez: data.acidez,
      alcohol: data.alcohol,
      ph: data.ph,
      densidad: data.densidad,
      grasa: data.grasa,
      proteina: data.proteina,
      crioscopia: data.crioscopia,
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
      estado: analisisSelect?.estado ?? estadoAnalisis,
    };

    console.log("body", body);

    /*  await fetch(
      `${URL_BASE}/analisis/${toUpdate ? "update" : "add"}Analisis.php`,
      {
        method: "POST",
        body: JSON.stringify({
          item: {
            ...body,
          },
        }),
      }
    )
      .then((response) => {
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccess(toUpdate ? "actualizo" : "guardo");

          getListAllRecolecciones(fechaSelect, true);
          getListAnalisisById(parseInt(id_recoleccion));
        }
      })
      .catch((error) => {
        notifyError();
      }); */
  };

  const [values, setValues] = useState({});
  const [fieldsRange, setFieldsRange] = useState({});

  const handleFieldsRange = (value, name, min, max) => {
    if (min === undefined || max === undefined) return;
    const numericValue = parseFloat(value);
    const isValid =
      !isNaN(numericValue) && numericValue >= min && numericValue <= max;
    setFieldsRange((prevFieldsRange) => {
      const newFieldsRange = { ...prevFieldsRange };
      if (value === "") {
        delete newFieldsRange[name];
      } else {
        newFieldsRange[name] = isValid;
      }
      return newFieldsRange;
    });
  };

  console.log("fieldsRange", fieldsRange);

  const calculateSolidosNoGrasos = (v) => {
    const formula = (v["densidad"] - 1) * 250 + 0.14 + 0.2 * v["grasa"];
    return formula.toFixed(1);
  };

  const calculateSolidosTotales = (v, SNG) => {
    const formula = (SNG / 100) * v["grasa"];
    return formula.toFixed(1);
  };

  useEffect(() => {
    const SNG = calculateSolidosNoGrasos(values);
    const ST = calculateSolidosTotales(values, SNG);
    if (!isNaN(SNG)) {
      handleInputChange(SNG, "solidos_no_grasos");
      handleFieldsRange(
        SNG,
        "solidos_no_grasos",
        FORM_FIELDS.find((f) => f.name === "solidos_no_grasos")?.min,
        FORM_FIELDS.find((f) => f.name === "solidos_no_grasos")?.max
      );
    }
    if (!isNaN(ST)) {
      handleInputChange(ST, "solidos_totales");
      handleFieldsRange(
        ST,
        "solidos_totales",
        FORM_FIELDS.find((f) => f.name === "solidos_totales")?.min,
        FORM_FIELDS.find((f) => f.name === "solidos_totales")?.max
      );
    }
  }, [values.densidad, values.grasa]);

  const handleInputChange = (value, name) => {
    setValues((prevValues) => {
      const newValues = { ...prevValues };
      if (value === "") {
        delete newValues[name];
      } else {
        newValues[name] = value;
      }
      return newValues;
    });
  };

  useEffect(() => {
    setIsEditor(parseInt(userLoggued?.tipo) === 3);

    if (analisisSelect?.estado) {
      Object.keys(analisisSelect).forEach((key) => {
        handleInputChange(analisisSelect[key], key);
        handleFieldsRange(
          analisisSelect[key],
          key,
          FORM_FIELDS.find((f) => f.name === key)?.min,
          FORM_FIELDS.find((f) => f.name === key)?.max
        );
      });
    } else {
      FORM_FIELDS.forEach((field) => {
        if (field.type === "radio") {
          handleInputChange(field.def ? field.def : "negativo", field?.name);
        } else {
          handleInputChange("", field.name);
        }
        setFieldsRange({});
      });
    }
  }, [analisisSelect, compartimientoSelect]);
  /* 
  useEffect(() => {
    
  }, [compartimientoSelect]) */

  console.log("values", values);

  const handleKeyDown = (event) => {
    const regex = /^[0-9.-]$/;
    const allowedKeys = ["ArrowLeft", "ArrowRight", "Backspace", "Delete"];
    if (!regex.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const isValid = Object.keys(values).length === 19 ? true : false;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="form_analisis">
      <div className="comp_title">
        <div className="ruta_select">
          {`Ruta: ${recoleccionSelect?.ruta?.toUpperCase()}`}
        </div>
        <div>
          Fecha analisis:{" "}
          {analisisSelect?.fecha || moment().format("YYYY-MM-DD")}
        </div>
        <div>
          Fecha recoleccion:{" "}
          {analisisSelect?.fecha_recoleccion ||
            moment(fechaSelect).format("YYYY-MM-DD")}
        </div>
        <div>Compartimiento: {compartimientoSelect}</div>
        <div>
          Analista: {analisisSelect?.nombre_usuario || userLoggued?.nombre}
        </div>
        <div className="status_analisis">
          <div>Estado:</div>
          <div
            className={`pill_status ${analisisSelect?.estado || "pendiente"}`}
          >
            {analisisSelect?.estado || "Pendiente"}
          </div>
        </div>
      </div>
      <form className="form_main">
        <div className="inputs_fields">
          {FORM_FIELDS.map(
            (field, index) =>
              field.type === "time" && (
                <div key={index}>
                  <div className="input_field">
                    <div className="labels">
                      <div className="icon_field">{field.icon}</div>
                      <label>{field.name.replaceAll("_", " ")}</label>
                    </div>
                    <input
                      type="time"
                      value={values[field.name] || ""}
                      onChange={(e) => {
                        handleInputChange(e.target.value, field.name);
                      }}
                      disabled={isEditor ? false : analisisSelect?.estado}
                    />
                  </div>
                </div>
              )
          )}
        </div>

        <div className="inputs_fields">
          {FORM_FIELDS.map(
            (field, index) =>
              field.type === "text" && (
                <div key={index}>
                  <div className="input_field">
                    <div className="labels">
                      <div className="icon_field">{field.icon}</div>
                      <label>{field.name.replaceAll("_", " ")}</label>
                      {field.min !== undefined && field.max !== undefined && (
                        <label className="range">
                          ({field.min}
                          {field.max !== 1000 && ` - ${field.max}`})
                        </label>
                      )}
                    </div>
                    <input
                      type="text"
                      value={values[field.name] || ""}
                      step={field.step || "1"}
                      readOnly={field.readOnly || false}
                      onChange={(e) => {
                        handleInputChange(e.target.value, field.name);
                        handleFieldsRange(
                          e.target.value,
                          field.name,
                          field.min,
                          field.max
                        );
                      }}
                      onKeyDown={handleKeyDown}
                      className={
                        values[field.name]
                          ? !fieldsRange[field.name]
                            ? "input-error"
                            : "input-ok"
                          : ""
                      }
                      disabled={isEditor ? false : analisisSelect?.estado}
                    />
                  </div>
                </div>
              )
          )}
        </div>
        <div className="inputs_fields">
          {FORM_FIELDS.map(
            (field, index) =>
              field.type === "radio" && (
                <div key={index}>
                  <div className="input_field_radio">
                    <div className="labels">
                      <div className="icon_field"> {field.icon}</div>
                      <label for={field.name}>
                        {field.name.replaceAll("_", " ")}
                      </label>
                    </div>
                    <div className="options_radio">
                      {positivo_negativo.map((option, index) => (
                        <div
                          key={index}
                          className="input_radio"
                          id={field.name}
                        >
                          <input
                            type="radio"
                            {...option}
                            name={field.name}
                            checked={values[field.name] === option.name}
                            disabled={isEditor ? false : analisisSelect?.estado}
                            onChange={(e) =>
                              handleInputChange(option.name, field.name)
                            }
                          />
                          <label>{option.name}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
        <div className="observaciones">
          <div className="input_field observ">
            <div className="labels">
              <div className="icon_field">
                {FORM_FIELDS.find((f) => f.name === "observaciones").icon}
              </div>
              <label>Observaciones</label>
            </div>
            <textarea
              className="input_textarea"
              value={values["observaciones"] || ""}
              onChange={(e) => {
                handleInputChange(e.target.value, "observaciones");
              }}
              disabled={isEditor ? false : analisisSelect?.estado}
            />
          </div>

          <div className="input_field observ">
            <div className="labels">
              <div className="icon_field">
                {FORM_FIELDS.find((f) => f.name === "observaciones").icon}
              </div>
              <label>Nota:</label>
            </div>
            <div
              disabled={true}
              className="input_textarea_anot"
              value={values["observaciones"] || ""}
            >
              <div className="params_title">Parametros con diferencia:</div>
              <div className="params">
                {Object.keys(fieldsRange).length
                  ? Object.keys(fieldsRange)
                      .filter((key) => fieldsRange[key] === false)
                      .map((key) => (
                        <span key={key}>
                          {capitalizeFirstLetter(key).replaceAll("_", " ")}:{" "}
                          {values[key]}
                        </span>
                      ))
                  : "Ninguno"}
              </div>
            </div>
          </div>
        </div>

        {!analisisSelect?.estado && (
          <div className="button_content">
            <button
              className="button-cancel"
              /* onClick={
                isValid && handleSubmit((data) => onSubmit(data, "rechazado"))
              } */
              disabled={!isValid}
            >
              Rechazado
            </button>
            <button
              className="button-ok"
              onClick={() => onSubmit(values, "aceptado")}
              disabled={!isValid}
            >
              Aceptado
            </button>
          </div>
        )}
        {isEditor && analisisSelect?.estado && (
          <button
            className="button-ok"
            /* onClick={
              isValid && handleSubmit((data) => onSubmit(data, "update", true))
            } */
            disabled={!isValid}
          >
            Actualizar
          </button>
        )}
      </form>
    </div>
  );
}

export default FormCompartimiento;
