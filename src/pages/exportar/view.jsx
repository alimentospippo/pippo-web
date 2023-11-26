import React from "react";

import { RiFileExcel2Fill } from "react-icons/ri";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { FaFileExcel, FaRegFrown, FaSearch } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineFileZip } from "react-icons/ai";
import { CSVLink } from "react-csv";

import "./styles.scss";
import Reporte1 from "./Reporte1";
import Reporte2 from "./Reporte2";

function View({
  startDate,
  onChangeDate,
  endDate,
  getData,
  loading,
  rutas,
  setRuta,
  litrosAgrupados,
  recolecciones,
  fechasUnicas,
  ganaderosUnicos,
  csvOptions,
  reporte,
  setReporte,
  generarPDF,
}) {
  return (
    <div className="page exportar" id="full">
      <div className="header-page">
        <Header title="Exportar" icon={<RiFileExcel2Fill />} />
      </div>
      <div className="content-page">
        <div className="content-data">
          <div className="date">
            <div className="date-section">
              <h4>Seleccione ruta</h4>
              <select
                name="ruta"
                id="ruta"
                className="select-ruta"
                onChange={(e) => setRuta(e.target.value)}
              >
                <option value={0}>Todas</option>
                {rutas?.map((r) => (
                  <option value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>

            <div className="date-section">
              <h4>Seleccione fechas</h4>
              <DatePicker
                selected={startDate}
                onChange={onChangeDate}
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                selectsRange
                selectsDisabledDaysInRange
                inline
              />
            </div>

            <div className="dates-select">
              {startDate && (
                <div>{`Desde ${moment(startDate).format("YYYY-MM-DD")}`}</div>
              )}
              {endDate && (
                <div>{`Hasta ${moment(endDate).format("YYYY-MM-DD")}`}</div>
              )}
            </div>

            <button className="button" onClick={() => getData()}>
              <AiOutlineSearch /> Consultar datos
            </button>

            {recolecciones?.length > 0 && (
              <CSVLink className="button button-green" {...csvOptions}>
                <FaFileExcel /> Exportar reporte {reporte}
              </CSVLink>
            )}

            {recolecciones?.length > 0 && (
              <button className="button" onClick={() => generarPDF()}>
                <AiOutlineFileZip /> Generar desprendibles
              </button>
            )}
          </div>
          <div className="data">
            <div className="data-tabs">
              <div
                className={`data-tabs-tab ${reporte === 1 && "active"}`}
                onClick={() => setReporte(1)}
              >
                Reporte 1
              </div>
              <div
                className={`data-tabs-tab ${reporte === 2 && "active"}`}
                onClick={() => setReporte(2)}
              >
                Reporte 2
              </div>
            </div>
            <div className="data-contain">
              {loading ? (
                <div className="no-data-main">
                  <div className="no-data">
                    <FaSearch />
                    Buscando...
                  </div>
                </div>
              ) : recolecciones.length > 0 ? (
                <div className="tabla-main">
                  {reporte === 1 ? (
                    <Reporte1
                      fechasUnicas={fechasUnicas}
                      ganaderosUnicos={ganaderosUnicos}
                      litrosAgrupados={litrosAgrupados}
                      recolecciones={recolecciones}
                    />
                  ) : (
                    <Reporte2 recolecciones={recolecciones} />
                  )}
                </div>
              ) : (
                <div className="no-data-main">
                  <div className="no-data">
                    <FaRegFrown />
                    No hay datos para esta fecha
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
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
