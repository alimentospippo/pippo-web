import React from "react";
import { FaStickyNote, FaSearch, FaMapMarked, FaCheck } from "react-icons/fa";
import { icons } from "../icons";
import {
  AiFillEdit,
  AiFillSave,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import Header from "../header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import moment from "moment";

function View({
  recoleccionesNew,
  getListAllRecolecciones,
  tableTemplate,
  isLoading,
  setToEdit,
  toEdit,
  setNewLts,
  onSubmit,
  filterByGanadero,
  clearFilter,
  filter,
  setFilter,
  goToMaps,
  saveRecolecciones,
  recoleccionesPendientes,
  ganaderos,
  conductores,
  recoleccionesUnicas,
  filterByRuta,
  getRutaName,
  recoleccionesTemp,
  loadingRecoleccionesPendientes,
  fechaSelect,
}) {
  const generateGoogleMapsUrl = () => {
    const waypoints = recoleccionesNew.filter(
      (item) => item.conductor === "Wilson"
    );

    console.log("waypoints", waypoints);

    if (waypoints.length < 2) {
      console.error("Debe haber al menos dos puntos de waypoints.");
      return "";
    }

    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const waypointsString = waypoints
      .slice(1, -1)
      .map((point) => point.gps_lat + "," + point.gps_long)
      .join("|");

    console.log("waypointsString", waypointsString);

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypointsString}&travelmode=driving`;

    // window.open(url, "_blank");
  };

  // Ejemplo de uso
  const waypoints = [
    { lat: 41.3851, lng: 2.1734 }, // Barcelona
    { lat: 40.7128, lng: -74.006 }, // New York
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
  ];

  return (
    <div className="page recolecciones_temp" id="full">
      <div className="header-page">
        <Header title="Recolecciones preliminares" icon={<FaStickyNote />} />
      </div>

      {recoleccionesPendientes?.length > 0 && (
        <>
          <div className="content-page">
            <div className="aprobar_pendientes">
              <div className="title">
                <AiOutlineExclamationCircle color="#c90000" />
                <div>
                  Hay {recoleccionesPendientes?.length} fechas pendientes para
                  aprobar
                </div>
              </div>

              <div className="list ">
                {recoleccionesPendientes?.map((item) => (
                  <button
                    className={`${
                      moment(fechaSelect).format("YYYY-MM-DD") === item.fecha &&
                      "date_button_active"
                    }`}
                    onClick={() => getListAllRecolecciones(item.fecha)}
                  >
                    {item.fecha}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {recoleccionesTemp?.length > 0 && (
            <div className="content-page">
              <div className="filtro_rutas">
                <div className="sub_filtro_rutas">
                  <div className="list-rutas">
                    <select
                      className="select-rutas"
                      name="rutas"
                      id="rutas"
                      onChange={(e) => filterByRuta(e.target.value)}
                    >
                      <option disabled>Ruta</option>
                      <option value="todas">Todas</option>
                      {recoleccionesUnicas?.map((item) => (
                        <option value={item?.ruta}>
                          {getRutaName(item?.ruta)}
                        </option>
                      ))}
                    </select>
                    <div className="filter">
                      <FaSearch color={"#aeaeae"} />
                      <input
                        type="text"
                        name="g"
                        id="g"
                        value={filter}
                        onChange={(e) => {
                          setFilter(e.target.value);
                          filterByGanadero(e.target.value);
                        }}
                        placeholder="Buscar ganadero..."
                      />
                      <button onClick={() => clearFilter()}>
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>
                  {recoleccionesNew?.length > 0 && (
                    <div className="button_aprobar">
                      <button
                        className="button-ok"
                        onClick={() => saveRecolecciones()}
                      >
                        {`Aprobar ${recoleccionesNew?.length} recolecciones`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="content-page">
        {isLoading || loadingRecoleccionesPendientes ? (
          <div className="loading">{icons("loading")}</div>
        ) : recoleccionesNew?.length ? (
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
                <tr key={item?.id}>
                  <td>{item?.id}</td>
                  <td>{item?.fecha}</td>
                  <td>{item?.hora}</td>
                  <td>{getRutaName(item?.ruta)}</td>
                  <td>
                    {
                      ganaderos?.find(
                        (r) => parseInt(r.id) === parseInt(item?.ganadero)
                      )?.nombre
                    }
                  </td>
                  <td>
                    {
                      conductores?.find(
                        (r) => parseInt(r.id) === parseInt(item?.conductor)
                      )?.nombre
                    }
                  </td>
                  <td>
                    <div className="column-gps">
                      {!item?.gps_lat && !item?.gps_long ? (
                        <AiOutlineCloseCircle color="red" />
                      ) : (
                        <AiOutlineCheckCircle color="green" />
                      )}
                      {item?.gps_lat && item?.gps_long && (
                        <div className="go_to_map">
                          <button
                            onClick={() =>
                              goToMaps({
                                lat: item?.gps_lat,
                                long: item?.gps_long,
                              })
                            }
                          >
                            <FaMapMarked />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>{item?.observaciones}</td>
                  <td className="column-litros">
                    <div>
                      {toEdit === item.id ? (
                        <input
                          className="item-edit"
                          type="number"
                          name=""
                          id=""
                          defaultValue={item?.litros}
                          min={0}
                          onChange={(e) => setNewLts(e.target.value)}
                        />
                      ) : (
                        item?.litros
                      )}
                    </div>
                    <div
                      className="icon"
                      onClick={() =>
                        toEdit === item.id
                          ? onSubmit(item.id)
                          : setToEdit(item?.id)
                      }
                    >
                      {toEdit === item.id ? <AiFillSave /> : <AiFillEdit />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            {!filter ? (
              <>
                <FaCheck />
                <div>Seleccione fecha</div>
              </>
            ) : (
              <>
                <FaSearch />
                <div>No hay datos con la busqueda {filter}</div>
              </>
            )}
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={1000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
}

export default View;
