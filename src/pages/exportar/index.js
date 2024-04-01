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
  const { rutas, userLoggued } = useContextoPippo();

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [recolecciones, setRecolecciones] = useState([]);
  const [analisis, setAnalisis] = useState([]);
  const [ruta, setRuta] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState(userLoggued?.tipo === "2" ? 3 : 1);

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
        const responseAnalisis = await axios.get(
          `${URL_BASE}/analisis/getAnalisisByDate.php?fechaIni=${fechaIni}&fechaFin=${fechaFin}&rutaId=${ruta}`
        );
        setRecolecciones(response.data);
        setAnalisis(responseAnalisis.data);
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

  const dataAnalisis = [];
  analisis?.forEach((item) => {
    const rowData = {
      Fecha: item?.fecha,
      Ruta: item?.nombre_ruta,
      Analista: item?.nombre_usuario,
      Silo: item?.silo,
      Temperatura: item?.temperatura,
      Acidez: item?.acidez,
      Alcohol: item?.alcohol,
      pH: item?.ph,
      Densidad: item?.densidad,
      Grasa: item?.grasa,
      Proteina: item?.proteina,
      Ciloscopia: item?.ciloscopia,
      Antibiotico: item?.antibiotico,
      "Solidos No Grasos": item?.solidos_no_grasos,
      "Solidos Totales": item?.solidos_totales,
      Neutralizante: item?.neutralizante,
      Cloruros: item?.cloruros,
      Peroxido: item?.peroxido,
      Peroxdata: item?.peroxdata,
      Fosfadata: item?.fosfadata,
      Almidon: item?.almidon,
      "Prueba Suero": item?.prueba_suero,
    };

    dataAnalisis.push(rowData);
  });

  const dataMap = {
    1: data,
    2: dataAll,
    3: dataAnalisis,
  };

  const csvOptions = {
    filename: `tabla_reporte_${reporte}.csv`,
    separator: ";",
    data: dataMap[reporte] || [],
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

      const logoX = 10;
      const logoY = 15;
      const logoWidth = 30;
      const logoHeight = 20;

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

      const startX = 20;
      const startY = 50;
      const rowHeight = 5;
      const colWidth = 80;

      const data = [
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
        const labelX = startX;
        const valueX = startX + colWidth;
        const y = startY + index * rowHeight;

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

  const tabsByTypeUser = [
    {
      id: 1,
      title: "Reporte 1",
      active: userLoggued?.tipo === "0",
    },
    { id: 2, title: "Reporte 2", active: userLoggued?.tipo === "0" },
    { id: 3, title: "Análisis", active: true },
  ].filter((item) => item.active);

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
    analisis,
    tabsByTypeUser,
    userLoggued,
  };

  return <View {...props} />;
}

export default Index;
