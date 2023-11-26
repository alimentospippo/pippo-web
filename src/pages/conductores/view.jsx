import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { ImTruck } from "react-icons/im";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";
import ModalDelete from "../../components/modalDelete";
import Modal from "../../components/modal";

function View({
  conductores,
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
  formAdd,
  reset,
}) {
  return (
    <div className="page conductores" id="full">
      <div className="header-page">
        <Header title="Conductores" icon={<ImTruck />}>
          <div
            className="add"
            onClick={() => {
              setIsModalOpen(!isModalOpen);
              setDataModal({ type: "Agregar" });
            }}
          >
            <FaUserPlus />
          </div>
        </Header>
      </div>

      <div className="content-page">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ruta</th>
              <th>Placa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {conductores?.map((conductor) => (
              <tr key={conductor?.id}>
                <td>{conductor?.nombre}</td>
                <td>{conductor?.rutas}</td>
                <td>{conductor?.placa}</td>

                <td>
                  <div className="actions">
                    <div
                      className="item"
                      onClick={() => {
                        setIsModalDeleteOpen(true);
                        setDataModal(conductor);
                      }}
                    >
                      <MdDeleteForever />
                    </div>
                    <div
                      className="item"
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                        setDataModal({ ...conductor, type: "Modificar" });
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
          title={`${dataModal?.type} conductor`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="formulario">
            {formAdd.map((item) => (
              <div className="formulario-item" key={item.label}>
                <label>{item.label}:</label>

                {item.type === "text" && <input {...item} className="inputs" />}
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
          type="conductor"
          dataModal={dataModal?.nombre}
        />
      </div>
    </div>
  );
}

export default View;
