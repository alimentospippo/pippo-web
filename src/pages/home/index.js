import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaRoute } from "react-icons/fa";
import { ImTruck } from "react-icons/im";
import Header from "../header";
import { useContextoPippo } from "../../ContextoPippo";

import "./styles.scss";

function Index() {
  const { rutas, conductores, recolecciones, ganaderos, userLoggued } =
    useContextoPippo();

  const getPorcentajeXRuta = (rutaId) => {
    const totalXRuta =
      ganaderos?.filter((g) => parseInt(g.ruta) === parseInt(rutaId))?.length ||
      1;

    const totalXRecoleccion =
      recolecciones?.filter((r) => parseInt(r.ruta_id) === parseInt(rutaId))
        ?.length || 0;

    const subTotal = Math.floor((totalXRecoleccion / totalXRuta) * 100);
    const granTotal = subTotal > 100 ? 100 : subTotal;

    return granTotal;
  };

  const ganaderosXRecoleccion = (rutaId) => {
    const totalXRecoleccion =
      recolecciones?.filter((r) => parseInt(r.ruta_id) === parseInt(rutaId))
        ?.length || 0;
    return totalXRecoleccion;
  };

  const ganaderosXRuta = (rutaId) => {
    const totalXRuta =
      ganaderos?.filter((g) => parseInt(g.ruta) === parseInt(rutaId))?.length ||
      1;
    return totalXRuta;
  };

  return (
    <div className="page home" id="full">
      <div className="header-page">
        <Header title="Inicio" icon={<AiFillHome />} />
      </div>
      {userLoggued?.tipo === "0" && (
        <div className="content-page-home">
          <div className="widget">
            <div className="widget-title">
              <FaRoute />
              Recolecciones por ruta hoy
            </div>
            <div className="widget-content">
              <div className="progreso-main">
                {recolecciones?.length > 0
                  ? rutas?.map(
                      (r) =>
                        recolecciones?.filter((item) => item.ruta_id === r.id)
                          ?.length > 0 && (
                          <div className="progreso-item">
                            <div className="progreso-title">
                              <label
                                className="progreso-title-nombre"
                                for={r.id}
                              >
                                {r.nombre}
                              </label>
                              <div></div>
                              <div className="cuentas">
                                <div className="recuento-ganaderos">
                                  {`${ganaderosXRecoleccion(r.id)} de
                                  ${ganaderosXRuta(r.id)} ganaderos`}
                                </div>
                                <div> {getPorcentajeXRuta(r.id) || 0} % </div>
                              </div>
                            </div>
                            <div class="barra-progreso">
                              <div class="barra-fondo">
                                <div
                                  class="barra-llena"
                                  style={{
                                    width: `${getPorcentajeXRuta(r.id) || 0}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )
                    )
                  : "Sin recolecciones"}
              </div>
            </div>
          </div>
          <div className="widget">
            <div className="widget-title">
              <ImTruck />
              Recolecciones por conductor hoy
            </div>
            <div className="widget-content">
              <div className="progreso-main">
                {recolecciones?.length > 0
                  ? conductores?.map(
                      (r) =>
                        recolecciones?.filter((item) => item.ruta_id === r.ruta)
                          ?.length > 0 && (
                          <div className="progreso-item">
                            <div className="progreso-title">
                              <label
                                className="progreso-title-nombre"
                                for={r.id}
                              >
                                {r.nombre}
                              </label>
                              <div>{getPorcentajeXRuta(r.ruta) || 0} %</div>
                            </div>
                            <div class="barra-progreso">
                              <div class="barra-fondo">
                                <div
                                  class="barra-llena"
                                  style={{
                                    width: `${
                                      getPorcentajeXRuta(r.ruta) || 0
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        )
                    )
                  : "Sin recolecciones"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Index;
