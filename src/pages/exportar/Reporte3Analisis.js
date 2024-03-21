import React from "react";

function Reporte3Analisis({ analisis }) {
  const tableTemplate = [
    "Fecha",
    "Ruta",
    "Analista",
    "Silo",
    "Temperatura",
    "Acidez",
    "Alcohol",
    "pH",
    "Densidad",
    "Grasa",
    "Proteina",
    "Ciloscopia",
    "Antibiotico",
    "Solidos No Grasos",
    "Solidos Totales",
    "Neutralizante",
    "Cloruros",
    "Peroxido",
    "Peroxdata",
    "Fosfadata",
    "Almidon",
    "Prueba Suero",
  ];

  return (
    <table className="tabla">
      <thead>
        <tr>
          {tableTemplate.map((item) => (
            <th key={item}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {analisis?.map((item) => (
          <tr key={item.id}>
            <td>{item.fecha}</td>
            <td>{item.nombre_ruta}</td>
            <td>{item.nombre_usuario}</td>
            <td>{item.silo}</td>
            <td>{item.temperatura}</td>
            <td>{item.acidez}</td>
            <td>{item.alcohol}</td>
            <td>{item.ph}</td>
            <td>{item.densidad}</td>
            <td>{item.grasa}</td>
            <td>{item.proteina}</td>
            <td>{item.ciloscopia}</td>
            <td>{item.antibiotico}</td>
            <td>{item.solidos_no_grasos}</td>
            <td>{item.solidos_totales}</td>
            <td>{item.neutralizante}</td>
            <td>{item.cloruros}</td>
            <td>{item.peroxido}</td>
            <td>{item.peroxdata}</td>
            <td>{item.fosfadata}</td>
            <td>{item.almidon}</td>
            <td>{item.prueba_suero}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Reporte3Analisis;
