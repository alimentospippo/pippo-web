import React from "react";
import { AiFillHome } from "react-icons/ai";
import { FaRoute } from "react-icons/fa";
import { ImTruck } from "react-icons/im";
import Header from "../header";
import { useContextoPippo } from "../../ContextoPippo";

import "./styles.scss";

function Index() {
  const { rutas, conductores, recolecciones, ganaderos } = useContextoPippo();

  const getPorcentajeXRuta = (rutaId) => {
    const totalXRuta = ganaderos?.filter((g) => g.ruta === rutaId)?.length || 1;
    const totalXRecoleccion =
      recolecciones?.filter((r) => r.ruta_id === rutaId)?.length || 0;

    return Math.floor((totalXRecoleccion / totalXRuta) * 100);
  };

  return (
    <div className="page home" id="full">
      <div className="header-page">
        <Header title="Inicio" icon={<AiFillHome />} />
      </div>
      <div className="content-page-home">
        <div className="widget">
          <div className="widget-title">
            <FaRoute />
            Recolecciones por ruta hoy
          </div>
          <div className="widget-content">
            <div className="progreso-main">
              {rutas?.map((r) => (
                <div className="progreso-item">
                  <div className="progreso-title">
                    <label className="progreso-title-nombre" for={r.id}>
                      {r.nombre}
                    </label>
                    <div></div>
                    <div>{getPorcentajeXRuta(r.id) || 0} %</div>
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
              ))}
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
              {conductores?.map((r) => (
                <div className="progreso-item">
                  <div className="progreso-title">
                    <label className="progreso-title-nombre" for={r.id}>
                      {r.nombre}
                    </label>
                    <div>{getPorcentajeXRuta(r.ruta) || 0} %</div>
                  </div>
                  <div class="barra-progreso">
                    <div class="barra-fondo">
                      <div
                        class="barra-llena"
                        style={{
                          width: `${getPorcentajeXRuta(r.ruta) || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
