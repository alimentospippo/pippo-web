import React from "react";
import { FaHatCowboy, FaUserPlus } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import Modal from "../../components/modal";
import ModalDelete from "../../components/modalDelete";
import Toogle from "../../components/toogle";

function View({
  ganaderos,
  onSubmit,
  handleSubmit,
  isValid,
  deleteItem,
  setIsModalDeleteOpen,
  setIsModalOpen,
  isModalOpen,
  setDataModal,
  isModalDeleteOpen,
  dataModal,
  reset,
  formAdd,
  ganaderosFilter,
  search,
  activeInactive,
  loadingGanaderos,
  rutas,
  filterRuta,
}) {
  return (
    <div className="page ganaderos" id="full">
      <div className="header-page">
        <Header
          title="Ganaderos"
          icon={<FaHatCowboy />}
          action={{
            label: "Agregar ganadero",
            icon: <FaUserPlus />,
            onClick: () => {
              setIsModalOpen(!isModalOpen);
              setDataModal({ type: "Agregar" });
            },
          }}
        >
          <div className="options-header">
            <select
              name="search_ruta"
              id="search_ruta"
              className="search_ruta"
              onChange={(e) => filterRuta(e.target.value)}
            >
              <option value="all">Todas</option>
              {rutas?.map((ruta) => (
                <option value={parseInt(ruta.id)}>{ruta.nombre}</option>
              ))}
            </select>
            <input
              type="search"
              name="search"
              id="search"
              placeholder="Buscar..."
              onChange={(e) => search(e.target.value)}
            />
          </div>
        </Header>
      </div>

      <div className="content-page">
        <table className="tabla">
          <thead>
            <tr>
              <th></th>
              <th>Id</th>
              <th>Documento</th>
              <th>Teléfono</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Ruta</th>
              <th>Promedio</th>
              <th className="precio_th">Precio</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ganaderosFilter
              ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
              .map((ganadero, index) => (
                <tr key={index}>
                  <td>
                    <Toogle
                      active={parseInt(ganadero.activo) === 1}
                      onClick={activeInactive}
                      id={ganadero.id}
                      disabled={loadingGanaderos}
                    />
                  </td>
                  <td>{ganadero.id}</td>
                  <td>{ganadero.documento}</td>
                  <td>{ganadero.telefono || "-"}</td>
                  <td> {ganadero.nombre.toLowerCase()}</td>
                  <td>{ganadero.direccion || "-"}</td>
                  <td>{ganadero.ruta_nombre}</td>
                  <td>
                    {ganadero.promedio ? `${ganadero.promedio} lts` : "-"}
                  </td>
                  <td>
                    <div className="precio">{`$ ${ganadero.precio}`}</div>
                  </td>
                  <td>
                    <div className="actions">
                      <div
                        className="item"
                        onClick={() => {
                          setIsModalOpen(!isModalOpen);
                          setDataModal({ ...ganadero, type: "Modificar" });
                        }}
                      >
                        <AiFillEdit />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ToastContainer
          position="bottom-center"
          theme="colored"
          autoClose={3000}
          hideProgressBar={true}
          pauseOnHover={false}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            reset();
          }}
          title={`${dataModal?.type} ganadero`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="formulario">
            <div>
              {formAdd.map((item) => (
                <div key={item.label} className="formulario-item">
                  <label>{item.label}:</label>

                  {(item.type === "text" || item.type === "number") && (
                    <input {...item} className="inputs" />
                  )}
                  {item.type === "select" && (
                    <select name="rutas" className="inputs" {...item}>
                      {item?.options?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className="button-form">
              <input
                type="submit"
                value="Guardar"
                className="button"
                disabled={!isValid}
              />
            </div>
          </form>
        </Modal>

        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onDelete={() => deleteItem(dataModal?.id)}
          type="ganadero"
          dataModal={dataModal?.nombre}
        />
      </div>
    </div>
  );
}

export default View;
