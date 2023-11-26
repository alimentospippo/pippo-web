import React from "react";

function Reporte2({ recolecciones }) {
  const tableTemplate = [
    "Fecha",
    "Ruta",
    "Ganadero",
    "Conductor",
    "Observaciones",
    "Litros",
    "Total",
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
        {recolecciones?.map((item) => (
          <tr key={item?.recoleccion_id}>
            <td>{item?.fecha}</td>
            <td>{item?.ruta}</td>
            <td>{item?.ganadero}</td>
            <td>{item?.conductor}</td>
            <td>{item?.observaciones}</td>
            <td>{item?.litros}</td>
            <td>$ {item?.precio * item?.litros}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Reporte2;
