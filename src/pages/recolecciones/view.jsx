import React from "react";
import {
  FaStickyNote,
  FaRegFrown,
  FaSearch,
  FaMapMarked,
} from "react-icons/fa";
import {
  AiFillEdit,
  AiFillSave,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
} from "react-icons/ai";
import DatePicker from "react-datepicker";
import Header from "../header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

function View({
  recoleccionesNew,
  getListAllRecolecciones,
  tableTemplate,
  fechaSelect,
  isLoading,
  setToEdit,
  toEdit,
  newLts,
  setNewLts,
  onSubmit,
  filterByGanadero,
  clearFilter,
  filter,
  setFilter,
  goToMaps,
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
    <div className="page recolecciones" id="full">
      <div className="header-page">
        <Header title="Recolecciones" icon={<FaStickyNote />}>
          <div className="filters">
            {recoleccionesNew?.length > 0 && (
              <div className="select-ganadero">
                <label className="select-fecha-x">Ganadero:</label>
                <div className="filter">
                  <input
                    type="text"
                    name="g"
                    id="g"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                      filterByGanadero(e.target.value);
                    }}
                  />
                  <button onClick={() => clearFilter()}>
                    <AiOutlineClose />
                  </button>
                </div>
              </div>
            )}
            <div className="select-fecha">
              <label className="select-fecha-x">Seleccione fecha:</label>
              <DatePicker
                selected={fechaSelect}
                onChange={(e) => getListAllRecolecciones(e)}
                maxDate={new Date()}
                showIcon={true}
              />
            </div>
          </div>
        </Header>
      </div>
      {/*   <button onClick={() => generateGoogleMapsUrl()}>
        Generar Ruta en Google Maps
      </button> */}

      <div className="content-page">
        {isLoading ? (
          <div className="no-data">
            <FaSearch />
            Buscando...
          </div>
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
                  <td>{item?.ruta}</td>
                  <td>{item?.ganadero}</td>
                  <td>{item?.conductor}</td>
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
                  <td>$ {item?.precio * item?.litros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <FaRegFrown />
            No hay datos para esta fecha
          </div>
        )}
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
}

export default View;
