import React from 'react';
import { FaMicroscope, FaRegFrown, FaSearch } from 'react-icons/fa';
import {
  AiFillEdit,
  AiFillSave,
  AiOutlineClose,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle
} from 'react-icons/ai';
import DatePicker from 'react-datepicker';
import Header from '../header';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './styles.scss';
import moment from 'moment';

function View({
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
}) {
  return (
    <div className="page analisis" id="full">
      <div className="header-page">
        <Header title="Analisis" icon={<FaMicroscope />}>
          <div className="select-fecha">
            <label className="select-fecha-label">Seleccione fecha:</label>
            <DatePicker
              className="date-picker"
              selected={fechaSelect}
              onChange={(e) => getListAllRecolecciones(e)}
              maxDate={new Date()}
              showIcon={true}
            />
          </div>
        </Header>
      </div>

      <div className="content-page">
        {isLoading ? (
          <div className="no-data">
            <FaSearch />
            Buscando...
          </div>
        ) : recoleccionesNew?.length ? (
          <>
            <table className="tabla">
              <thead>
                <tr>
                  {tableTemplate.map((item) => (
                    <th key={item}>{item}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recoleccionesNew.map((item) => (
                  <tr key={item?.id}>
                    <td>{item?.fecha}</td>
                    <td>{item?.ruta}</td>
                    <td>{item?.conductor}</td>
                    <td>{item?.observaciones}</td>
                    <td>{item?.litros} Lts.</td>
                    <td>
                      <div
                        className="analisis_option"
                        onClick={() => {
                          setRutaSelected(item?.ruta_id);
                          updateAnalisisSelect(item?.ruta_id);
                        }}
                      >
                        {analisisNew?.find((a) => a?.ruta === item?.ruta_id)
                          ? 'Ver'
                          : 'Analizar'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div className="no-data">
            <FaRegFrown />
            No hay datos para esta fecha
          </div>
        )}
      </div>

      {rutaSelected && (
        <div className="content-page comp_main">
          <div className="compartimientos">
            {calculateCompartimiento().map((_, index) => (
              <div
                className={`comp ${
                  compartimientoSelect === index + 1 && 'select'
                }`}
                onClick={() => setCompartimientoSelect(index + 1)}
              >
                Compartimiento {index + 1}
              </div>
            ))}
          </div>
          <div>
            <div className="comp_title">
              <div className="ruta_select">
                {`Ruta: ${recoleccionesNew
                  ?.find((r) => r?.ruta_id === rutaSelected)
                  ?.ruta?.toUpperCase()}`}
              </div>
              <div>Fecha analisis: {moment().format('YYYY-MM-DD')} </div>
              <div>Compartimiento: {compartimientoSelect}</div>
              <div>Analista: {userLoggued?.usuario} </div>
            </div>
            <div className="form_analisis">
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
                          />
                        </div>
                      ) : field.type === 'radio' ? (
                        <div className="input_field_radio">
                          <label for={field.name}>
                            {field.name.replaceAll('_', ' ')}
                          </label>
                          <div className="options_radio">
                            {field.options.map((option, index) => (
                              <div
                                key={index}
                                className="input_radio"
                                id={field.name}
                              >
                                <input
                                  type="radio"
                                  {...option}
                                  name={field.name}
                                  value={option.name}
                                  {...register(field.name)}
                                />
                                <label>{option.name}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        field.type === 'free' && (
                          <div className="input_field_radio"></div>
                        )
                      )}
                    </div>
                  ))}
                </div>

                <div className="input_field observ">
                  <label>
                    {FORM_FIELDS.find(
                      (f) => f.name === 'observaciones'
                    ).name.replaceAll('_', ' ')}
                  </label>
                  <textarea
                    className="input_textarea"
                    {...register(
                      FORM_FIELDS.find((f) => f.name === 'observaciones').name
                    )}
                  />
                </div>

                <div className="button_content">
                  <button className="button" type="submit">
                    Guardar
                  </button>
                  <button className="button" type="submit">
                    ACEPTAR
                  </button>
                  <button className="button" type="submit">
                    RECHAZAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  );
}

export default View;
