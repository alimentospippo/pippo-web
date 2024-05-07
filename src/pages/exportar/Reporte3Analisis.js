import React from "react";

function Reporte3Analisis({ analisis }) {
  const tableTemplate = [
    { title: "Ruta", row: "nombre_ruta" },
    { title: "Analista", row: "nombre_usuario" },
    { title: "Fecha Recoleccion", row: "fecha_recoleccion" },
    { title: "Fecha Analisis", row: "fecha" },
    { title: "Compartimiento", row: "compartimiento" },
    { title: "Estado", row: "estado" },
    { title: "Observaciones", row: "observaciones" },
    { title: "Silo", row: "silo" },
    { title: "Temperatura", row: "temperatura" },
    { title: "Acidez", row: "acidez" },
    { title: "Alcohol", row: "alcohol" },
    { title: "pH", row: "ph" },
    { title: "Densidad", row: "densidad" },
    { title: "Grasa", row: "grasa" },
    { title: "Proteina", row: "proteina" },
    { title: "Ciloscopia", row: "ciloscopia" },
    { title: "Antibiotico", row: "antibiotico" },
    { title: "Solidos No Grasos", row: "solidos_no_grasos" },
    { title: "Solidos Totales", row: "solidos_totales" },
    { title: "Neutralizante", row: "neutralizante" },
    { title: "Cloruros", row: "cloruros" },
    { title: "Peroxido", row: "peroxido" },
    { title: "Peroxidasa", row: "peroxidasa" },
    { title: "Fosfatasa", row: "fosfatasa" },
    { title: "Almidon", row: "almidon" },
    { title: "Prueba Suero", row: "prueba_suero" },
  ];

  let currentRoute = null;
  let isEvenRouteGroup = true;

  return (
    <table className="tabla">
      <thead>
        <tr>
          {tableTemplate.map((item, index) => (
            <th key={index}>{item.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {analisis?.map((item) => {
          if (item.nombre_ruta !== currentRoute) {
            currentRoute = item.nombre_ruta;
            isEvenRouteGroup = !isEvenRouteGroup;
          }

          return (
            <tr
              key={item.id}
              className={
                isEvenRouteGroup ? "even-route-group" : "odd-route-group"
              }
            >
              {tableTemplate.map((templateItem, index) => (
                <td
                  key={index}
                  className={
                    templateItem.row === "estado" &&
                    "estado-" + item[templateItem.row]
                  }
                >
                  {item[templateItem.row]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Reporte3Analisis;
