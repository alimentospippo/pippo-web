import React, { useEffect, useState } from 'react';
import moment from 'moment';
import View from './view';
import axios from 'axios';
import { URL_BASE } from '../../constants';
import { useContextoPippo } from '../../ContextoPippo';



function Index() {
  const { recolecciones, userLoggued, rutas } = useContextoPippo();

  const [recoleccionesNew, setRecoleccionesNew] = useState([]);
  const [analisisNew, setAnalisisNew] = useState([]);
  const [analisisSelect, setAnalisisSelect] = useState([]);
  const [fechaSelect, setFechaSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compartimientoSelect, setCompartimientoSelect] = useState(1);
  const [rutaSelected, setRutaSelected] = useState(null);

  const updateAnalisisSelect = (ruta_id) => {
    const analisis = analisisNew?.filter(
      (a) => parseInt(a?.ruta) === parseInt(ruta_id)
    );
    setAnalisisSelect(analisis);
  };

  const getListAllRecolecciones = async (fecha) => {
    setFechaSelect(fecha);
    setIsLoading(true);

    const momentDate = moment(fecha);
    const formattedDate = momentDate.format('YYYY-MM-DD');

    setTimeout(async () => {
      try {
        const response = await axios.get(
          `${URL_BASE}/recolecciones/getRecoleccionesByFecha.php?fechaIni=${formattedDate}&fechaFin=${formattedDate}`
        );
        const responseAnalisis = await axios.get(
          `${URL_BASE}/analisis/getAnalisisByDateRecolect.php?fecha_recoleccion=${formattedDate}`
        );
        setAnalisisNew(responseAnalisis.data);
        const informacionRutas = obtenerInformacionRutas(response.data);
        setRecoleccionesNew(informacionRutas);
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }

      setIsLoading(false);
    }, 1000);
  };

  console.log(recoleccionesNew);

  useEffect(() => {
    setFechaSelect(new Date());
    setRecoleccionesNew(recolecciones);
  }, []);

  function obtenerInformacionRutas(datos) {
    const rutas = {};

    datos.forEach((dato) => {
      const { fecha, ruta, ruta_id, litros, conductor } = dato;

      if (!rutas[ruta]) {
        rutas[ruta] = {
          fecha,
          ruta,
          ruta_id,
          litros: parseInt(litros),
          conductor
        };
      } else {
        rutas[ruta].litros += parseInt(litros);
      }
    });

    return Object.values(rutas);
  }

  const tableTemplate = [
    'Fecha',
    'Ruta',
    'Conductor',
    'Observaciones',
    'Litros',
    'Analisis'
  ];

  const calculateCompartimiento = () => {
    const compartimientos = [];
    const compartimientosRuta =
      rutas.find((r) => r.id === rutaSelected)?.compartimientos || 0;

    if (compartimientosRuta > 0) {
      for (let i = 1; i <= compartimientosRuta; i++) {
        compartimientos.push(`Compartimiento ${i}`);
      }
    } else {
      compartimientos.push('Compartimiento 1');
    }

    return compartimientos;
  };

  console.log('analisisSelect', analisisSelect);

  const getDataAnalisisSelect = () => {
    return (
      analisisSelect.find(
        (a) => parseInt(a.compartimiento) === parseInt(compartimientoSelect)
      ) || null
    );
  };

  const props = {
    recoleccionesNew,
    getListAllRecolecciones,
    tableTemplate,
    fechaSelect,
    isLoading,
    compartimientoSelect,
    setCompartimientoSelect,
    userLoggued,
    rutaSelected,
    setRutaSelected,
    analisisNew,
    calculateCompartimiento,
    updateAnalisisSelect,
    analisisSelect,
    getDataAnalisisSelect
  };
  return <View {...props} />;
}

export default Index;
