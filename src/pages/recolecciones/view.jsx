import React from "react";
import { FaStickyNote, FaRegFrown, FaSearch } from "react-icons/fa";
import { AiFillEdit, AiFillSave } from "react-icons/ai";
import DatePicker from "react-datepicker";
import Header from "../header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

function View({
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
}) {
  return (
    <div className="page recolecciones" id="full">
      <div className="header-page">
        <Header title="Recolecciones" icon={<FaStickyNote />}>
          <div className="select-fecha">
            <label className="select-fecha">Seleccione fecha:</label>
            <DatePicker
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
          <table className="tabla">
            <thead>
              <tr>
                {tableTemplate.map((item) => (
                  <th key={item}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recoleccionesNew?.map((item) => (
                <tr key={item?.id}>
                  <td>{item?.id}</td>
                  <td>{item?.fecha}</td>
                  <td>{item?.ruta}</td>
                  <td>{item?.ganadero}</td>
                  <td>{item?.conductor}</td>
                  <td>{item?.observaciones}</td>
                  <td className="column-litros">
                    <div>
                      {toEdit === item.id ? (
                        <input
                          className="item-edit"
                          type="number"
                          name=""
                          id=""
                          defaultValue={item?.litros}
                          min={0}
                          onChange={(e) => setNewLts(e.target.value)}
                        />
                      ) : (
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
        ) : (
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
  );
}

export default View;
