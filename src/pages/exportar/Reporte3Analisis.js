import React from "react";
import moment from "moment";

function Reporte3Analisis({ analisis }) {
  const tableTemplate = [
    { title: "Ruta", row: "nombre_ruta" },
    { title: "Analista", row: "nombre_usuario" },
    { title: "Fecha Recoleccion", row: "fecha_recoleccion" },
    { title: "Fecha Analisis", row: "fecha" },
    { title: "Compartimiento", row: "compartimiento" },
    { title: "Estado", row: "estado" },
    { title: "Silo", row: "silo" },
    { title: "Puebra TRAM", row: "prueba_tram" },
    { title: "Resultado TRAM", row: "resultado_tram" },
    { title: "TRAM", row: "tram" },
    { title: "Acidez", row: "acidez" },
    { title: "Alcohol", row: "alcohol" },
    { title: "pH", row: "ph" },
    { title: "Densidad", row: "densidad" },
    { title: "Grasa", row: "grasa" },
    { title: "Proteina", row: "proteina" },
    { title: "Crioscopia", row: "crioscopia" },
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
    { title: "Observaciones", row: "observaciones" },
  ];

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
          return (
            <tr key={item.id}>
              {tableTemplate.map((templateItem, index) => (
                <td
                  key={index}
                  className={
                    templateItem.row +
                    (templateItem.row === "estado"
                      ? " estado-" + item[templateItem.row]
                      : "")
                  }
                >
                  {item[templateItem.row] || "-"}
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
