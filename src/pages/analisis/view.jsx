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
import FormCompartimiento from './formCompartimiento';

function View({
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
              <div>
                Fecha analisis:{' '}
                {getDataAnalisisSelect()?.fecha ||
                  moment().format('YYYY-MM-DD')}
              </div>
              <div>
                Fecha recoleccion:{' '}
                {getDataAnalisisSelect()?.fecha_recoleccion ||
                  moment(fechaSelect).format('YYYY-MM-DD')}
              </div>
              <div>Compartimiento: {compartimientoSelect}</div>
              <div>Analista: {userLoggued?.usuario} </div>
              <div className="status_analisis">
                <div>Estado:</div>
                <div
                  className={`pill_status ${
                    getDataAnalisisSelect()?.estado || 'pendiente'
                  }`}
                >
                  {getDataAnalisisSelect()?.estado || 'Pendiente'}
                </div>
              </div>
            </div>
            <div className="form_analisis">
              <FormCompartimiento
                analisisSelect={getDataAnalisisSelect()}
                fechaSelect={fechaSelect}
                rutaSelected={rutaSelected}
                userLoggued={userLoggued}
                compartimientoSelect={compartimientoSelect}
              />
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
