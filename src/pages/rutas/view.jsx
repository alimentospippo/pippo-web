import React from "react";
import { FaRoute, FaPlus, FaHatCowboy } from "react-icons/fa";
import Header from "../header";
import { icons } from "../icons";
import {
  AiFillEdit,
  AiOutlineCaretUp,
  AiOutlineCaretDown,
} from "react-icons/ai";
import "./styles.scss";
import Modal from "../../components/modal";
import ModalDelete from "../../components/modalDelete";
import { ToastContainer } from "react-toastify";
import { Tooltip } from "react-tooltip";
import Toogle from "../../components/toogle";

function View({
  rutas,
  deleteItem,
  setIsModalDeleteOpen,
  setIsModalOpen,
  isModalOpen,
  setDataModal,
  isModalDeleteOpen,
  dataModal,
  reset,
  formAdd,
  onSubmit,
  handleSubmit,
  isValid,
  modalByGanaderos,
  setModalByGanaderos,
  updateOrderGanaderos,
  ganaderosOrder,
  updateOrder,
  errors,
  loading,
  activeInactive,
  loadingRutas,
}) {
  return (
    <div className="page rutas" id="full">
      <div className="header-page">
        <Header
          title="Rutas"
          icon={<FaRoute />}
          action={{
            label: "Agregar ruta",
            icon: <FaPlus />,
            onClick: () => {
              setIsModalOpen(!isModalOpen);
              setDataModal({ type: "Agregar" });
            },
          }}
        />
      </div>
      <div className="content-page">
        <div className="table-main">
          <table className="tabla ">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col">Id</th>
                <th scope="col">Nombre</th>
                <th scope="col">Latitud</th>
                <th scope="col">Longitud</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rutas
                ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
                ?.map((ruta) => (
                  <tr key={ruta?.nombre}>
                    <td data-label="nombre">
                      <Toogle
                        active={parseInt(ruta.activo) === 1}
                        onClick={activeInactive}
                        id={ruta.id}
                        disabled={loadingRutas}
                      />
                    </td>
                    <td data-label="nombre">{ruta.id}</td>
                    <td data-label="nombre">{ruta.nombre}</td>
                    <td data-label="direccion">{ruta.latitud || "-"}</td>
                    <td data-label="direccion">{ruta.longitud || "-"}</td>
                    <td>
                      <div className="actions">
                        <div
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Editar"
                          data-tooltip-place="bottom"
                          className="item"
                          onClick={() => {
                            setIsModalOpen(!isModalOpen);
                            setDataModal({ ...ruta, type: "Modificar" });
                          }}
                        >
                          <AiFillEdit />
                        </div>
                        <div
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content="Ganaderos"
                          data-tooltip-place="bottom"
                          className="item"
                          onClick={() => {
                            setModalByGanaderos(true);
                            setDataModal(ruta);
                          }}
                        >
                          <FaHatCowboy />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

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
          title={`${dataModal?.type} ruta`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="formulario">
            <div>
              {formAdd.map((item) => (
                <div className="formulario-item" key={item.label}>
                  <label>{item.label}:</label>
                  <div className="inputs-main">
                    <input
                      {...item}
                      className={`inputs ${
                        errors[item.field] ? "input-error" : ""
                      }`}
                    />
                    {errors[item.field] && (
                      <p className="error">{errors[item.field].message}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="button-form">
              <button
                type="submit"
                className="button"
                disabled={!isValid || loading}
              >
                {loading && (
                  <div className="icon-loading">{icons("loading")}</div>
                )}
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </Modal>
        <Modal
          isOpen={modalByGanaderos}
          onClose={() => {
            setModalByGanaderos(false);
          }}
          title={`Ganaderos ruta ${dataModal?.nombre}`}
          actions={ganaderosOrder?.length > 1 && updateOrder}
        >
          {ganaderosOrder?.length ? (
            <div className="tabla-g">
              <table className="tabla">
                <thead>
                  <tr>
                    <th></th>
                    <th>Orden</th>
                    <th>Documento</th>
                    <th>Nombre</th>
                    <th>Promedio</th>
                  </tr>
                </thead>
                <tbody>
                  {ganaderosOrder
                    .sort((a, b) => a.orden - b.orden)
                    ?.map((ganadero, index) => (
                      <tr key={index}>
                        <td>
                          <div className="up-down">
                            {index > 0 && (
                              <AiOutlineCaretUp
                                cursor={"pointer"}
                                onClick={() =>
                                  updateOrderGanaderos(ganadero.id, "up")
                                }
                              />
                            )}

                            {ganaderosOrder.length !== index + 1 && (
                              <AiOutlineCaretDown
                                cursor={"pointer"}
                                onClick={() =>
                                  updateOrderGanaderos(ganadero.id, "down")
                                }
                              />
                            )}
                          </div>
                        </td>
                        <td>{ganadero?.orden}</td>
                        <td>{ganadero?.documento}</td>
                        <td>{ganadero?.nombre}</td>
                        <td>{ganadero?.promedio} lts</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No hay ganaderos en esta ruta</div>
          )}
        </Modal>
        <ModalDelete
          isOpen={isModalDeleteOpen}
          onClose={() => setIsModalDeleteOpen(false)}
          onDelete={() => deleteItem(dataModal?.id)}
          type="ruta"
          dataModal={dataModal?.nombre}
        />
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
}

export default View;
