import React, { useState } from "react";
import { BsNodePlusFill } from "react-icons/bs";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.scss";

function View({
  ganaderos,
  conductorInfo,
  handleSubmit,
  onSubmit,
  register,
  ganaderoSelect,
  litrosSelect,
  isValid,
  rutas,
}) {
  const existing = JSON.parse(localStorage.getItem("registro"));

  const searchGanadero = (id) => {
    return ganaderos?.filter(
      (item) => item.documento === ganaderoSelect || item.documento === id
    )[0];
  };
  const searchRuta = (id) => {
    return rutas?.filter((item) => item.id === id)[0];
  };

  const calcPromedio = () => {
    return (
      litrosSelect <= parseInt(searchGanadero()?.promedio) + 10 &&
      litrosSelect >= parseInt(searchGanadero()?.promedio) - 10
    );
  };

  return (
    <div className="page registro" id="full">
      <div className="header-page">
        <Header title="Registro" icon={<BsNodePlusFill />} />
      </div>
      <div className="content-page">
        <div className="content-form">
          <div>
            <h3>Ruta: {conductorInfo?.rutas}</h3>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="formulario">
                <div>
                  <label>Seleccione ganadero</label>
                  <select
                    {...register("ganadero", {
                      required: true,
                    })}
                  >
                    <option value="" selected disabled hidden>
                      Seleccione
                    </option>
                    {ganaderos?.map((item) => (
                      <option value={item.documento}>{item.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Litros recolectados</label>
                  <input
                    min={0}
                    type="number"
                    {...register("litros", {
                      required: true,
                    })}
                  />
                  <div className="error">
                    {litrosSelect &&
                      !calcPromedio() &&
                      "Error, no cumple el promedio de litros del ganadero"}
                  </div>
                </div>

                <div>
                  <label htmlFor="" className="price-main">
                    <div>Promedio</div>
                    <div className="price">
                      {searchGanadero()?.promedio || 0} lts
                    </div>
                  </label>
                </div>

                <div>
                  <label htmlFor="" className="price-main">
                    <div>Precio Lt</div>
                    <div className="price">
                      $ {searchGanadero()?.precio || 0}
                    </div>
                  </label>
                </div>
                <div>
                  <label htmlFor="" className="price-main">
                    <div>Precio Total</div>
                    <div className="price">
                      {`$ 
                      ${searchGanadero()?.precio * litrosSelect || 0}`}
                    </div>
                  </label>
                </div>

                <input
                  type="submit"
                  value="Guardar"
                  className="button"
                  disabled={!isValid || !calcPromedio()}
                />
                <input
                  type="button"
                  value="Imprimir"
                  className="button"
                  disabled={!isValid || !calcPromedio()}
                />
              </form>
            </div>
          </div>
        </div>
        {existing && (
          <div>
            <div className="not-save">Registros sin guardar:</div>
            <table className="tabla">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Conductor</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Ganadero</th>
                  <th scope="col">Ruta</th>
                  <th scope="col">Litros</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {existing?.map((registro, index) => (
                  <tr key={index}>
                    <td data-label="id">{index + 1}</td>
                    <td data-label="conductor">{conductorInfo?.nombre}</td>
                    <td data-label="fecha">{registro.fecha}</td>
                    <td data-label="ganadero">
                      {searchGanadero(registro.ganadero)?.nombre}
                    </td>
                    <td data-label="ruta">
                      {searchRuta(registro.ruta)?.nombre}
                    </td>
                    <td data-label="litros">{registro.litros} lts</td>
                    <td data-label="precio">$ {registro.precio}</td>
                    <td data-label="precio total">$ {registro.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <ToastContainer
          position="bottom-center"
          theme="colored"
          autoClose={5000}
        />
      </div>
    </div>
  );
}

export default View;
