import React from "react";

import { RiFileExcel2Fill } from "react-icons/ri";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { FaFileExcel, FaRegFrown, FaSearch } from "react-icons/fa";
import { AiOutlineSearch, AiOutlineFileZip } from "react-icons/ai";
import { CSVLink } from "react-csv";

import "./styles.scss";
import Reporte1 from "./Reporte1";
import Reporte2 from "./Reporte2";
import Reporte3Analisis from "./Reporte3Analisis";
import moment from "moment";

function View({
  startDate,
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
  analisis,
  tabsByTypeUser,
  userLoggued,
  setStartDate,
  setEndDate,
}) {
  return (
    <div className="page exportar" id="full">
      <div className="header-page">
        <Header title="Exportar" icon={<RiFileExcel2Fill />} />
      </div>

      <div className="content-page">
        <div className="options_search">
          <div className="option">
            <label htmlFor="ruta">Ruta</label>
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
          <div className="option">
            <label htmlFor="desde">Desde</label>
            <input
              type="date"
              name="desde"
              id="desde"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="option">
            <label htmlFor="hasta">Hasta</label>
            <input
              type="date"
              name="hasta"
              id="hasta"
              min={startDate}
              max={moment().format("YYYY-MM-DD")}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="option">
            <button className="button" onClick={() => getData()}>
              <AiOutlineSearch /> Consultar
            </button>
          </div>

          {userLoggued?.tipo === "0" && recolecciones?.length > 0 && (
            <div className="option">
              <button className="button" onClick={() => generarPDF()}>
                <AiOutlineFileZip /> Generar desprendibles
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="content-page">
        <div className="data">
          <div className="data-tabs">
            {tabsByTypeUser.map((tab) => (
              <div
                className={`data-tabs-tab ${reporte === tab.id && "active"}`}
                onClick={() => setReporte(tab.id)}
              >
                {tab.title}{" "}
                {(recolecciones?.length > 0 || analisis.length) && (
                  <div className="export-tab">
                    <CSVLink {...csvOptions}>
                      <FaFileExcel color="green" />
                    </CSVLink>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="data-contain">
            {loading ? (
              <div className="no-data-main">
                <div className="no-data">
                  <FaSearch />
                  Buscando...
                </div>
              </div>
            ) : recolecciones.length > 0 || analisis.length > 0 ? (
              <div className="tabla-main">
                {reporte === 1 && (
                  <Reporte1
                    fechasUnicas={fechasUnicas}
                    ganaderosUnicos={ganaderosUnicos}
                    litrosAgrupados={litrosAgrupados}
                    recolecciones={recolecciones}
                  />
                )}
                {reporte === 2 && <Reporte2 recolecciones={recolecciones} />}
                {reporte === 3 && <Reporte3Analisis analisis={analisis} />}
              </div>
            ) : (
              <div className="no-data-main">
                <div className="no-data">
                  <FaRegFrown />
                  No hay datos para este rango de fechas
                </div>
              </div>
            )}
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
