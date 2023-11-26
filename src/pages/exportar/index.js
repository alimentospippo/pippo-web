import React, { useState } from "react";
import moment from "moment";
import View from "./view";
import { URL_BASE } from "../../constants";
import axios from "axios";
import { useContextoPippo } from "../../ContextoPippo";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "./logo_pipo.png";

function Index() {
  const { rutas } = useContextoPippo();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [recolecciones, setRecolecciones] = useState([]);
  const [ruta, setRuta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(1);

  const onChangeDate = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const getData = async (fecha) => {
    setLoading(true);

    const fechaIni = moment(startDate).format("YYYY-MM-DD");
    const fechaFin = moment(endDate).format("YYYY-MM-DD");

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${URL_BASE}/recolecciones/getRecoleccionesByFecha.php?fechaIni=${fechaIni}&fechaFin=${fechaFin}&rutaId=${ruta}`
        );
        setRecolecciones(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }

      setLoading(false);
    }, 1000);
  };

  const litrosAgrupados = recolecciones?.reduce((agrupados, item) => {
    const key = `${item.fecha}-${item.ganadero_id}`;
    if (!agrupados[key]) {
      agrupados[key] = {
        fecha: item.fecha,
        ganadero_id: item.ganadero_id,
        ganadero_documento: item.ganadero_documento,
        ganadero: item.ganadero,
        ruta: item.ruta,
        litros: 0,
      };
    }
    agrupados[key].litros += parseFloat(item.litros);
    return agrupados;
  }, {});

  const fechasUnicas = [...new Set(recolecciones?.map((item) => item.fecha))];

  const ganaderosUnicos = [
    ...new Set(recolecciones?.map((item) => item.ganadero_id)),
  ];

  const data = [];
  ganaderosUnicos?.forEach((ganaderoId) => {
    const totalPorGanadero = fechasUnicas?.map((fecha) =>
      litrosAgrupados[`${fecha}-${ganaderoId}`]
        ? litrosAgrupados[`${fecha}-${ganaderoId}`].litros
        : 0
    );

    const rowData = {
      Documento: recolecciones?.find((item) => item.ganadero_id === ganaderoId)
        ?.ganadero_documento,
      Ganadero: recolecciones?.find((item) => item.ganadero_id === ganaderoId)
        ?.ganadero,
      Ruta: recolecciones?.find((item) => item.ganadero_id === ganaderoId)
        ?.ruta,
      ...fechasUnicas?.reduce((acc, fecha, index) => {
        acc[fecha] = totalPorGanadero[index];
        return acc;
      }, {}),
      Total: totalPorGanadero.reduce((a, b) => a + b, 0),
    };
    data.push(rowData);
  });

  const dataAll = [];
  recolecciones?.forEach((item) => {
    const rowData = {
      recoleccion_id: item?.recoleccion_id,
      fecha: item?.fecha,
      ruta: item?.ruta,
      ganadero: item?.ganadero,
      conductor: item?.conductor,
      observaciones: item?.observaciones,
      litros: item?.litros,
      precio_total: `$${item?.precio * item?.litros}`,
    };

    dataAll.push(rowData);
  });

  const csvOptions = {
    filename: `tabla_reporte_${reporte}.csv`,
    separator: ";",
    data: reporte === 1 ? data : dataAll,
    uFEFF: true,
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    const ganaderosData = {};
    recolecciones.forEach((item) => {
      const ganaderoId = item.ganadero_id;
      if (!ganaderosData[ganaderoId]) {
        ganaderosData[ganaderoId] = [];
      }
      ganaderosData[ganaderoId].push(item);
    });

    Object.keys(ganaderosData).forEach((ganaderoId, index) => {
      const ganaderoData = ganaderosData[ganaderoId];
      const ganaderoInfo = ganaderosData[ganaderoId][0];

      if (index > 0) {
        doc.addPage();
      }

      doc.setFontSize(12);

      var logoX = 10;
      var logoY = 15;
      var logoWidth = 30;
      var logoHeight = 20;

      doc.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

      const getCenterX = (text) => {
        return doc.getTextWidth(text);
      };

      const headerTemplate = [
        "Documento equivalente a factura, (art3 dec.522 de 2003) No.: PLGUL",
        "ALIMENTOS PIPPO SAS",
        "NIT 900.031.833-6",
        "Responsable del IVA-Régimen Común",
      ];

      headerTemplate.forEach((item, index) => {
        doc.text(
          item,
          (doc.internal.pageSize.width - getCenterX(item)) / 2,
          20 + index * 5
        );
      });

      var startX = 20;
      var startY = 50;
      var rowHeight = 5;
      var colWidth = 80;

      var data = [
        {
          label: "Persona natural de quien ",
          value: "",
        },
        {
          label: "se adquieren los bienes y/o servicios",
          value: ganaderoInfo.ganadero,
        },
        { label: "Nit", value: ganaderoInfo.ganadero_documento },
        {
          label: "Ciudad y fecha de la operación",
          value: `Guasca Cuad. ${moment().format("DD/MM/YYYY")}`,
        },
      ];

      data.forEach((item, index) => {
        var labelX = startX;
        var valueX = startX + colWidth;
        var y = startY + index * rowHeight;

        doc.text(item.label, labelX, y).setFont(undefined, "bold");
        doc.text(item.value, valueX, y).setFont(undefined, "normal");
      });

      const valorTotalQuincena = ganaderoData.reduce(
        (total, { litros, precio }) =>
          total + parseInt(litros * precio - (litros * precio * 0.75) / 100),
        0
      );

      const headers = [
        "Fecha",
        "Litros",
        "Valor Unitario",
        "Valor Total",
        "Descuento Fomento",
        "Valor Total Día",
      ];

      const rows = ganaderoData.map(({ fecha, litros, precio }) => [
        fecha,
        litros,
        precio,
        parseInt(litros * precio),
        parseInt((litros * precio * 0.75) / 100),
        parseInt(litros * precio - (litros * precio * 0.75) / 100),
        "",
      ]);

      rows.push(["", "", "", "", "TOTAL", valorTotalQuincena]);

      doc.autoTable({
        startY: 70,
        head: [headers],
        body: rows,
      });
    });

    doc.save("reporte.pdf");
  };

  const props = {
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
  };

  return <View {...props} />;
}

export default Index;
