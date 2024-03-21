import React from 'react'
import { FaStickyNote, FaRegFrown, FaSearch } from 'react-icons/fa'
import { AiFillEdit, AiFillSave, AiOutlineClose, AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai'
import DatePicker from 'react-datepicker'
import Header from '../header'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import './styles.scss'

function View ({
  recoleccionesNew,
  getListAllRecolecciones,
  tableTemplate,
  fechaSelect,
  isLoading,
  setToEdit,
  toEdit,
  newLts,
  setNewLts,
  onSubmit,
  filterByGanadero,
  clearFilter,
  filter,
  setFilter
}) {
  return (
    <div className="page recolecciones" id="full">
      <div className="header-page">
        <Header title="Recolecciones" icon={<FaStickyNote />}>
          <div className="filters">
            <div className="select-ganadero">
              <label className="select-fecha-x">Ganadero:</label>
              <div className="filter">
                <input
                  type="text"
                  name="g"
                  id="g"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value)
                    filterByGanadero(e.target.value)
                  }}
                />
                <button onClick={() => clearFilter()}>
                  <AiOutlineClose />
                </button>
              </div>
            </div>
            <div className="select-fecha">
              <label className="select-fecha-x">Seleccione fecha:</label>
              <DatePicker
                selected={fechaSelect}
                onChange={(e) => getListAllRecolecciones(e)}
                maxDate={new Date()}
                showIcon={true}
              />
            </div>
          </div>
        </Header>
      </div>

      <div className="content-page">
        {isLoading
          ? (
          <div className="no-data">
            <FaSearch />
            Buscando...
          </div>
            )
          : recoleccionesNew?.length
            ? (
          <table className="tabla">
            <thead>
              <tr>
                {tableTemplate.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {console.log(recoleccionesNew)}
              {[
                {
                  id: '19466',
                  conductor: 'Adrian',
                  fecha: '2024-03-11',
                  ganadero: 'VELASQUEZ ROJAS ANA DEL SALVADOR',
                  ruta_id: '1',
                  litros: '139',
                  observaciones: '',
                  precio: '2000',
                  ruta: 'porvenir',
                  gps: 'Valido'
                },
                {
                  id: '19467',
                  conductor: 'Adrian',
                  fecha: '2024-03-11',
                  ganadero: 'SANCHEZ AVELLANEDA ALDEMAR',
                  ruta_id: '1',
                  litros: '40',
                  observaciones: '',
                  precio: '1900',
                  gps: 'Invalido'
                },
                {
                  id: '19468',
                  conductor: 'Adrian',
                  fecha: '2024-03-11',
                  ganadero: 'HERRERA GARZON IRMA NELLY',
                  ruta_id: '1',
                  litros: '615',
                  observaciones: '',
                  precio: '2100',
                  gps: 'Valido'
                },
                {
                  id: '19469',
                  conductor: 'Adrian',
                  fecha: '2024-03-11',
                  ganadero: 'BAUTISTA LEON ALIRIO',
                  ruta_id: '1',
                  litros: '32',
                  observaciones: '',
                  precio: '1900',
                  ruta: 'porvenir',
                  gps: 'Valido'
                },
                {
                  id: '19470',
                  conductor: 'Adrian',
                  fecha: '2024-03-11',
                  ganadero: 'GONZALES CASAS LAURA JIMENA',
                  ruta_id: '1',
                  litros: '130',
                  observaciones: '',
                  precio: '2150',
                  gps: 'Invalido',
                  ruta: 'porvenir'
                }
              ].map((item) => (

                  <tr key={item?.id}>
                  <td>{item?.id}</td>
                  <td>{item?.fecha}</td>
                  <td>{item?.ruta}</td>
                  <td>{item?.ganadero}</td>
                  <td>{item?.conductor}</td>
                  <td ><div className="column-gps">{item?.gps === 'Invalido' ? <AiOutlineCloseCircle color="red" /> : <AiOutlineCheckCircle color="green" /> } <div className={`column-gps-${item?.gps?.toLowerCase()}`}>{item?.gps}</div> </div> </td>
                  <td>{item?.observaciones}</td>
                  <td className="column-litros">
                    <div>
                      {toEdit === item.id
                        ? (
                        <input
                          className="item-edit"
                          type="number"
                          name=""
                          id=""
                          defaultValue={item?.litros}
                          min={0}
                          onChange={(e) => setNewLts(e.target.value)}
                        />
                          )
                        : (
                            item?.litros
                          )}
                    </div>
                    <div
                      className="icon"
                      onClick={() =>
                        toEdit === item.id
                          ? onSubmit(item.id)
                          : setToEdit(item?.id)
                      }
                    >
                      {toEdit === item.id ? <AiFillSave /> : <AiFillEdit />}
                    </div>
                  </td>
                  <td>$ {item?.precio * item?.litros}</td>
                </tr>
              ))}
            </tbody>
          </table>
              )
            : (
          <div className="no-data">
            <FaRegFrown />
            No hay datos para esta fecha
          </div>
              )}
      </div>
      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={3000}
        hideProgressBar={true}
        pauseOnHover={false}
      />
    </div>
  )
}

export default View
