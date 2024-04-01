import React from "react";
import { FaMicroscope, FaRegFrown, FaSearch } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Header from "../header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import moment from "moment";
import FormCompartimiento from "./formCompartimiento";

function View({
  recoleccionesNew,
  getListAllRecolecciones,
  tableTemplate,
  fechaSelect,
  isLoading,
  compartimientoSelect,
  setCompartimientoSelect,
  userLoggued,
  calculateCompartimiento,
  getDataAnalisisCompartimiento,
  getListAnalisisById,
  isLoadingAnalisis,
  recoleccionSelect,
  setRecoleccionSelect,
}) {
  return (
    <div className="page analisis" id="full">
      <div className="header-page">
        <Header title="Analisis" icon={<FaMicroscope />}>
          <div className="select-fecha">
            <label className="select-fecha-label">Seleccione fecha:</label>
            <DatePicker
              className="date-picker"
              selected={fechaSelect}
              onChange={(e) => getListAllRecolecciones(e)}
              maxDate={new Date()}
              showIcon={true}
            />
          </div>
        </Header>
      </div>

      <div className="content-page">
        {isLoading && isLoadingAnalisis ? (
          <div className="no-data">
            <FaSearch />
            Actualizando data
          </div>
        ) : isLoading ? (
          <div className="no-data">
            <FaSearch />
            Buscando recolecciones...
          </div>
        ) : recoleccionesNew?.length ? (
          <>
            <table className="tabla">
              <thead>
                <tr>
                  {tableTemplate.map((item) => (
                    <th key={item}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recoleccionesNew.map((item) => (
                  <tr
                    key={item?.id}
                    className={
                      recoleccionSelect?.id === item?.id && "row_select"
                    }
                  >
                    <td>{item?.id}</td>
                    <td>{item?.fecha}</td>
                    <td>{item?.ruta}</td>
                    <td>{item?.conductor}</td>
                    <td>{item?.litros} Lts.</td>
                    <td>
                      <div
                        className="analisis_option"
                        onClick={() => {
                          setRecoleccionSelect(item);
                          getListAnalisisById(item?.id);
                          setCompartimientoSelect(1);
                        }}
                      >
                        Ver
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="no-data">
            <FaRegFrown />
            No hay datos para esta fecha
          </div>
        )}
      </div>
      {isLoadingAnalisis && !isLoading ? (
        <div className="no-data">
          <FaSearch />
          Buscando analisis...
        </div>
      ) : (
        recoleccionSelect && (
          <div className="content-page comp_main">
            <div className="compartimientos">
              {calculateCompartimiento().map((_, index) => (
                <div
                  className={`comp ${
                    compartimientoSelect === index + 1 && "select"
                  }`}
                  onClick={() => setCompartimientoSelect(index + 1)}
                >
                  <div>Compartimiento {index + 1}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="comp_title">
                <div className="ruta_select">
                  {`Ruta: ${recoleccionSelect?.ruta?.toUpperCase()}`}
                </div>
                <div>
                  Fecha analisis:{" "}
                  {getDataAnalisisCompartimiento()?.fecha ||
                    moment().format("YYYY-MM-DD")}
                </div>
                <div>
                  Fecha recoleccion:{" "}
                  {getDataAnalisisCompartimiento()?.fecha_recoleccion ||
                    moment(fechaSelect).format("YYYY-MM-DD")}
                </div>
                <div>Compartimiento: {compartimientoSelect}</div>
                <div>Analista: {userLoggued?.usuario} </div>
                <div className="status_analisis">
                  <div>Estado:</div>
                  <div
                    className={`pill_status ${
                      getDataAnalisisCompartimiento()?.estado || "pendiente"
                    }`}
                  >
                    {getDataAnalisisCompartimiento()?.estado || "Pendiente"}
                  </div>
                </div>
              </div>
              <div className="form_analisis">
                <FormCompartimiento
                  analisisSelect={getDataAnalisisCompartimiento()}
                  fechaSelect={fechaSelect}
                  userLoggued={userLoggued}
                  compartimientoSelect={compartimientoSelect}
                  id_recoleccion={recoleccionSelect?.id}
                  rutaSelected={recoleccionSelect?.ruta_id}
                  getListAllRecolecciones={getListAllRecolecciones}
                  getListAnalisisById={getListAnalisisById}
                />
              </div>
            </div>
          </div>
        )
      )}
      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
}

export default View;
