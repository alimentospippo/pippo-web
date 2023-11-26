import React from "react";
import { FaRoute, FaPlus, FaHatCowboy } from "react-icons/fa";
import Header from "../header";
import { MdDeleteForever } from "react-icons/md";
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
  upOrder,
  downOrder,
  ganaderosOrder,
  updateOrder,
}) {
  return (
    <div className="page rutas" id="full">
      <div className="header-page">
        <Header title="Rutas" icon={<FaRoute />}>
          <div
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Agregar"
            data-tooltip-place="bottom"
            className="add"
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setDataModal({ type: "Agregar" });
            }}
          >
            <FaPlus />
          </div>
        </Header>
      </div>
      <div className="content-page">
        <table className="tabla">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Direccion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rutas
              ?.sort((a, b) => a.nombre.localeCompare(b.nombre))
              ?.map((ruta) => (
                <tr key={ruta?.nombre}>
                  <td data-label="nombre">{ruta.nombre}</td>
                  <td data-label="direccion">{ruta.direccion}</td>
                  <td>
                    <div className="actions">
                      <div
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Eliminar"
                        data-tooltip-place="bottom"
                        className="item"
                        onClick={() => {
                          setIsModalDeleteOpen(true);
                          setDataModal(ruta);
                        }}
                      >
                        <MdDeleteForever />
                      </div>
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
                <div className="formulario-item">
                  <label>{item.label}:</label>
                  <input {...item} className="inputs" />
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
                          <AiOutlineCaretUp
                            cursor={"pointer"}
                            onClick={() => upOrder(ganadero.id)}
                          />

                          <AiOutlineCaretDown
                            cursor={"pointer"}
                            onClick={() => downOrder(ganadero.id)}
                          />
                        </td>
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
