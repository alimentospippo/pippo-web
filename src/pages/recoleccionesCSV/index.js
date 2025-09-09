import React, { useState } from "react";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import { URL_BASE } from "../../constants";
import { toast } from "react-toastify";

import { FaFileExcel } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

const CSVUploader = () => {
  const [file, setFile] = useState(null);
  const [isValidated, setIsValidated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const notifySuccess = (message) => toast.success(message);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setIsValidated(false);
      setErrors([]);
    } else {
      setFile(null);
      setErrors(["Por favor seleccione un archivo CSV válido"]);
    }
  };

  const handleValidate = async () => {
    if (!file) {
      setErrors(["Por favor seleccione un archivo antes de validar"]);
      return;
    }

    setIsLoading(true);
    try {
      // Crear FormData y añadir el archivo
      const formData = new FormData();
      formData.append("csv-file", file);

      // Realizar la petición al backend
      const response = await fetch(
        `${URL_BASE}/recolecciones/comprobar_csv.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      const data = await response.json();

      if (data.success) {
        setIsValidated(true);
        setErrors([]);
      } else {
        // Si hay errores en la validación, mostrarlos
        const errorMessages = data.errors.map(
          (error) => `Fila ${error.row}: ${error.message}`
        );
        setErrors(errorMessages);
        setIsValidated(false);
      }
    } catch (error) {
      setErrors(["Error al validar el archivo: " + error.message]);
      setIsValidated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!file || !isValidated) return;

    setIsLoading(true);
    try {
      // Crear FormData y añadir el archivo
      const formData = new FormData();
      formData.append("csv-file", file);

      // Realizar la petición al backend
      const response = await fetch(
        `${URL_BASE}/recolecciones/cinsertar_csv.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error en la petición");
      }

      const data = await response.json();

      if (data.success) {
        notifySuccess(
          `Archivo guardado exitosamente. Se insertaron ${data.insertedRows} registros.`
        );
        // Resetear el estado
        setFile(null);
        setIsValidated(false);
        setErrors([]);
      } else {
        // Si hay errores en la inserción, mostrarlos
        const errorMessages = Array.isArray(data.errors)
          ? data.errors
          : ["Error al guardar el archivo"];
        setErrors(errorMessages);
      }
    } catch (error) {
      setErrors(["Error al guardar el archivo: " + error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page recolecciones_csv" id="full">
      <div className="header-page">
        <Header title="Recolecciones CSV" icon={<FaFileExcel />} />
      </div>
      <div className="content-page">
        <div className="input-file">
          <input
            type="file"
            name="csv-file"
            id="csv-file"
            accept=".csv"
            onChange={handleFileChange}
            className="input-file__input"
          />
        </div>
        {errors && errors.length > 0 && (
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
        {isValidated && errors.length === 0 && (
          <ul className="list-disc pl-4">
            <li>El archivo ha sido validado correctamente</li>
          </ul>
        )}

        <div className="input-file-buttons">
          {isValidated ? (
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="button"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          ) : (
            <button
              onClick={handleValidate}
              disabled={!file || isLoading}
              className="button"
            >
              {isLoading ? "Procesando..." : "Comprobar"}
            </button>
          )}
        </div>
      </div>
      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
};

export default CSVUploader;
