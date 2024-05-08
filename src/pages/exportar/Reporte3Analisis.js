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
    { title: "Hora Inicio", row: "hora_inicial" },
    { title: "Hora Fin", row: "hora_final" },
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

  function calcTimeTotal(h_i, h_f) {
    const formato = "HH:mm";
    const momentoInicial = moment(h_i, formato);
    const momentoFinal = moment(h_f, formato);

    const diferenciaEnMinutos = momentoFinal.diff(momentoInicial, "minutes");

    return diferenciaEnMinutos;
  }

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
          const t_f = calcTimeTotal(item.hora_inicial, item.hora_final);
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
                  {templateItem.row === "tram"
                    ? t_f
                      ? `${t_f} min`
                      : "-"
                    : item[templateItem.row] || "-"}
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
