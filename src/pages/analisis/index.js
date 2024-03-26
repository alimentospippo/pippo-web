import React, { useEffect, useState } from 'react';
import moment from 'moment';
import View from './view';
import axios from 'axios';
import { URL_BASE } from '../../constants';
import { useContextoPippo } from '../../ContextoPippo';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

function Index() {
  const { recolecciones, userLoggued, rutas } = useContextoPippo();
  const notifySuccess = (message) => toast.success(`Se ${message} el ganadero`);
  const notifyError = () => toast.error('Error, intente de nuevo');

  const [recoleccionesNew, setRecoleccionesNew] = useState([]);
  const [analisisNew, setAnalisisNew] = useState([]);
  const [analisisSelect, setAnalisisSelect] = useState([]);
  const [fechaSelect, setFechaSelect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [compartimientoSelect, setCompartimientoSelect] = useState(1);
  const [rutaSelected, setRutaSelected] = useState(null);

  const updateAnalisisSelect = (ruta_id) => {
    console.log('ruta_id', ruta_id);
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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const body = {
      fecha: moment().format('YYYY-MM-DD'),
      fecha_recoleccion: moment(fechaSelect).format('YYYY-MM-DD'),
      ruta: rutaSelected,
      usuario: userLoggued?.id,
      compartimiento: compartimientoSelect,
      observaciones: data.observaciones,
      silo: data.silo,
      temperatura: data.temperatura,
      acidez: data.acidez,
      alcohol: data.alcohol,
      ph: data.ph,
      densidad: data.densidad,
      grasa: data.grasa,
      proteina: data.proteina,
      ciloscopia: data.ciloscopia,
      antibiotico: data.antibiotico,
      solidos_no_grasos: data.solidos_no_grasos,
      solidos_totales: data.solidos_totales,
      neutralizante: data.neutralizante,
      cloruros: data.cloruros,
      peroxido: data.peroxido,
      peroxdata: data.peroxdata,
      fosfadata: data.fosfadata,
      almidon: data.almidon,
      prueba_suero: data.prueba_suero
    };

    await fetch(`${URL_BASE}/analisis/addAnalisis.php`, {
      method: 'POST',
      body: JSON.stringify({
        item: {
          ...body
        }
      })
    })
      .then((response) => {
        console.log('response', response);
        if (response.status === 400) {
          notifyError();
        } else {
          notifySuccess('guardo');
        }
      })
      .catch((error) => {
        notifyError();
      });
  };

  const positivo_negativo = [{ name: 'positivo' }, { name: 'negativo' }];

  const FORM_FIELDS = [
    { name: 'silo', type: 'text', icon: 'local-drink' },
    { name: 'temperatura', type: 'text', icon: 'thermostat' },
    { name: 'acidez', type: 'text', icon: 'local-fire-department' },
    { name: 'alcohol', type: 'text', icon: 'science' },
    { name: 'ph', type: 'text', icon: 'device-hub' },
    { name: 'densidad', type: 'text', icon: 'shower' },
    { name: 'grasa', type: 'text', icon: 'oil-barrel' },
    { name: 'proteina', type: 'text', icon: 'timeline' },
    { name: 'ciloscopia', type: 'text', icon: 'coronavirus' },
    { name: 'solidos_no_grasos', type: 'text', icon: 'lens-blur' },
    { name: 'solidos_totales', type: 'text', icon: 'lens-blur' },
    { name: '', type: 'free' },
    {
      name: 'antibiotico',
      type: 'radio',
      options: positivo_negativo,
      icon: 'vaccines'
    },
    {
      name: 'neutralizante',
      type: 'radio',
      options: positivo_negativo,
      icon: 'close-fullscreen'
    },
    {
      name: 'cloruros',
      type: 'radio',
      options: positivo_negativo,
      icon: 'gas-meter'
    },
    {
      name: 'peroxido',
      type: 'radio',
      options: positivo_negativo,
      icon: 'webhook'
    },
    {
      name: 'peroxdata',
      type: 'radio',
      options: positivo_negativo,
      icon: 'all-out'
    },
    {
      name: 'fosfadata',
      type: 'radio',
      options: positivo_negativo,
      icon: 'whatshot'
    },
    {
      name: 'almidon',
      type: 'radio',
      options: positivo_negativo,
      icon: 'breakfast-dining'
    },
    {
      name: 'prueba_suero',
      type: 'radio',
      options: positivo_negativo,
      icon: 'biotech'
    },
    {
      name: 'observaciones',
      type: 'textarea',
      icon: 'biotech'
    }
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

  const props = {
    recoleccionesNew,
    getListAllRecolecciones,
    tableTemplate,
    fechaSelect,
    isLoading,
    compartimientoSelect,
    setCompartimientoSelect,
    userLoggued,
    FORM_FIELDS,
    handleSubmit,
    onSubmit,
    register,
    rutaSelected,
    setRutaSelected,
    rutas,
    analisisNew,
    calculateCompartimiento,
    updateAnalisisSelect
  };
  return <View {...props} />;
}

export default Index;
