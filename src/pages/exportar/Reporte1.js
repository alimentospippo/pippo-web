import React from "react";

function Reporte1({
  fechasUnicas,
  ganaderosUnicos,
  litrosAgrupados,
  recolecciones,
}) {
  return (
    <table className="tabla">
      <thead>
        <tr>
          <th>Documento</th>
          <th>Ganadero</th>
          <th>Ruta</th>
          {fechasUnicas?.map((fecha) => (
            <th key={fecha} className="fecha-title">
              {fecha}
            </th>
          ))}
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {ganaderosUnicos?.map((ganaderoId) => {
          const totalPorGanadero = fechasUnicas?.map((fecha) =>
            litrosAgrupados[`${fecha}-${ganaderoId}`]
              ? litrosAgrupados[`${fecha}-${ganaderoId}`].litros
              : 0
          );
          return (
            <tr key={ganaderoId}>
              <td>
                {
                  recolecciones.find((item) => item.ganadero_id === ganaderoId)
                    ?.ganadero_documento
                }
              </td>
              <td>
                {
                  recolecciones.find((item) => item.ganadero_id === ganaderoId)
                    ?.ganadero
                }
              </td>
              <td>
                {
                  recolecciones.find((item) => item.ganadero_id === ganaderoId)
                    ?.ruta
                }
              </td>
              {fechasUnicas?.map((fecha, index) => (
                <td key={fecha} className="litros">
                  {totalPorGanadero[index]}
                </td>
              ))}
              <td className="litros">
                {totalPorGanadero.reduce((a, b) => a + b, 0)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Reporte1;
