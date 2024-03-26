import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { URL_BASE } from '../../constants';
import { toast } from 'react-toastify';
import moment from 'moment';

import './styles.scss';

function FormCompartimiento({
  analisisSelect,
  fechaSelect,
  rutaSelected,
  userLoggued,
  compartimientoSelect
}) {
  console.log('analisisSelect....', analisisSelect);

  const notifySuccess = (message) => toast.success(`Se ${message} el analisis`);
  const notifyError = () => toast.error('Error, intente de nuevo');
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  useEffect(() => {
    if (analisisSelect) {
      Object.keys(analisisSelect).forEach((key) => {
        setValue(key, analisisSelect[key]);
      });
    } else {
      FORM_FIELDS.forEach((field) => {
        setValue(field.name, '');
      });
    }
  }, [analisisSelect, setValue]);

  const onSubmit = async (data, estadoAnalisis) => {
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
      prueba_suero: data.prueba_suero,
      estado: estadoAnalisis
    };

    console.log('body....', body);

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form_main">
      <div className="inputs_fields">
        {FORM_FIELDS.map((field, index) => (
          <div key={index}>
            {field.type === 'text' ? (
              <div className="input_field">
                <label>{field.name.replaceAll('_', ' ')}</label>
                <input
                  type="number"
                  min={0}
                  {...register(field.name)}
                  disabled={analisisSelect}
                />
              </div>
            ) : field.type === 'radio' ? (
              <div className="input_field_radio">
                <label for={field.name}>
                  {field.name.replaceAll('_', ' ')}
                </label>
                <div className="options_radio">
                  {field.options.map((option, index) => (
                    <div key={index} className="input_radio" id={field.name}>
                      <input
                        type="radio"
                        {...option}
                        name={field.name}
                        value={option.name}
                        {...register(field.name)}
                        disabled={analisisSelect}
                      />
                      <label>{option.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              field.type === 'free' && <div className="input_field_radio"></div>
            )}
          </div>
        ))}
      </div>

      <div className="input_field observ">
        <label>
          {FORM_FIELDS.find((f) => f.name === 'observaciones').name.replaceAll(
            '_',
            ' '
          )}
        </label>
        <textarea
          className="input_textarea"
          {...register(
            FORM_FIELDS.find((f) => f.name === 'observaciones').name
          )}
          disabled={analisisSelect}
        />
      </div>

      {!analisisSelect && (
        <div className="button_content">
          <button
            className="button-cancel"
            onClick={handleSubmit((data) => onSubmit(data, 'rechazado'))}
          >
            Rechazado
          </button>
          <button
            className="button-ok"
            onClick={handleSubmit((data) => onSubmit(data, 'aceptado'))}
          >
            Aceptado
          </button>
        </div>
      )}
    </form>
  );
}

export default FormCompartimiento;
