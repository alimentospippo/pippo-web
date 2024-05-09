import React from "react";
import { FaMicroscope, FaRegFrown, FaSearch, FaPlus } from "react-icons/fa";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import Modal from "../../components/modal";

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
  analisisFormData,
  getListAnalisisById,
  isLoadingAnalisis,
  recoleccionSelect,
  setRecoleccionSelect,
  rutas,
  conductores,
  formCreateAnalisis,
  handleInputChange,
  modalAddAnalisis,
  setModalAddAnalisis,
  createAnalisis,
}) {
  return (
    <div className="page analisis" id="full">
      <div className="header-page">
        <Header
          title="Analisis"
          icon={<FaMicroscope />}
          action={{
            label: "Agregar analisis",
            icon: <FaPlus />,
            onClick: () => {
              setModalAddAnalisis(true);
            },
          }}
        >
          <div className="date-add">
            <div className="select-fecha">
              <label className="select-fecha-label">Seleccione fecha:</label>
              <input
                type="date"
                value={fechaSelect}
                onChange={(e) => getListAllRecolecciones(e.target.value)}
                max={moment().format("YYYY-MM-DD")}
              />
            </div>
          </div>
        </Header>
      </div>

      <div className="content-page">
        {isLoading && isLoadingAnalisis ? (
          <div className="no-data">
            <FaSearch />
            Descargando datos...
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

            <FormCompartimiento
              analisisSelect={analisisFormData}
              fechaSelect={fechaSelect}
              userLoggued={userLoggued}
              compartimientoSelect={compartimientoSelect}
              id_recoleccion={recoleccionSelect?.id}
              rutaSelected={recoleccionSelect?.ruta_id}
              fechaRecoleccion={recoleccionSelect?.fecha}
              recoleccionSelect={recoleccionSelect}
              getListAllRecolecciones={getListAllRecolecciones}
              getListAnalisisById={getListAnalisisById}
            />
          </div>
        )
      )}
      <Modal
        isOpen={modalAddAnalisis}
        title={"Agregar analisis"}
        onClose={() => setModalAddAnalisis(false)}
        footerActions={[
          {
            title: "Guardar",
            action: () => createAnalisis(),
            className: "button-ok",
          },
          {
            title: "Cancelar",
            action: () => setModalAddAnalisis(false),
            className: "button-cancel",
          },
        ]}
      >
        <div>
          <div className="add_label">
            <div>Fecha de Recolección</div>
            <input
              type="date"
              value={formCreateAnalisis.fecha}
              onChange={(e) => handleInputChange("fecha", e.target.value)}
              max={moment().format("YYYY-MM-DD")}
            />
          </div>
          <div className="add_label">
            <div>Ruta</div>
            <select
              onChange={(e) =>
                handleInputChange("ruta", parseInt(e.target.value))
              }
            >
              {rutas?.map((ruta) => (
                <option
                  value={parseInt(ruta.id)}
                  className="option"
                  selected={parseInt(ruta.id) === formCreateAnalisis.ruta}
                >
                  {ruta.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="add_label">
            <div>Conductor</div>
            <select
              onChange={(e) =>
                handleInputChange("conductor", parseInt(e.target.value))
              }
            >
              <option value={13}>Planta</option>
              {conductores?.map((c) => (
                <option
                  value={parseInt(c.id)}
                  selected={parseInt(c.id) === formCreateAnalisis.conductor}
                >
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="add_label">
            <div>Litros</div>
            <input
              type="number"
              min={0}
              value={formCreateAnalisis.litros}
              onChange={(e) =>
                handleInputChange("litros", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </Modal>

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
