import React from "react";
import { icons } from "../icons";
import { FaUserPlus, FaUserFriends } from "react-icons/fa";
import { AiFillEdit } from "react-icons/ai";
import Header from "../header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

function View({
  onSubmit,
  handleSubmit,
  isValid,
  setDataModal,
  dataModal,
  formAdd,
  reset,
  usuarios,
  roles,
  loading,
  errors,
  loadingUsuarios,
}) {
  return (
    <div className="page usuarios" id="full">
      <div className="header-page">
        <Header
          title="Usuarios"
          icon={<FaUserFriends />}
          action={{
            label: "Agregar usuario",
            icon: <FaUserPlus />,
            onClick: () => {
              setDataModal(null);
              reset();
            },
          }}
        />
      </div>

      <div className="content-page">
        {loadingUsuarios ? (
          <div className="loading">{icons("loading")}</div>
        ) : (
          <>
            <table className="tabla tabla_usuario">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {usuarios?.map((usuario) => (
                  <tr
                    key={usuario?.id}
                    className={dataModal?.id === usuario.id && "tr_active"}
                  >
                    <td>{usuario?.id}</td>
                    <td>{usuario?.usuario.toLowerCase()}</td>
                    <td>
                      {
                        roles.find(
                          (rol) => parseInt(rol.id) === parseInt(usuario?.tipo)
                        )?.nombre
                      }
                    </td>

                    <td>
                      <div className="actions">
                        <div
                          className="item"
                          onClick={() => {
                            reset();

                            setDataModal({ ...usuario, type: "Modificar" });
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
            <div className="formulario_usuario">
              <h4>{dataModal ? "Modificar" : "Crear"} usuario</h4>
              <form onSubmit={handleSubmit(onSubmit)} className="formulario">
                {formAdd.map((item) => (
                  <div className="formulario-item" key={item.label}>
                    <label>{item.label}:</label>

                    {item.type === "text" && (
                      <div className="inputs_control">
                        <div className="inputs_flex">
                          <input
                            {...item}
                            className={`inputs ${
                              errors[item.name] && "input_error"
                            } `}
                          />
                          {item?.extraButton && item?.extraButton()}
                        </div>

                        {errors[item.name] && (
                          <span>{errors.usuario.message}</span>
                        )}
                      </div>
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
                <div className="button-form">
                  <input
                    type="submit"
                    value={
                      loading
                        ? dataModal
                          ? "Guardando..."
                          : "Creando..."
                        : dataModal
                        ? "Guardar"
                        : "Crear"
                    }
                    className="button"
                    disabled={!isValid || loading}
                  />
                </div>
              </form>
            </div>
            <ToastContainer
              position="bottom-center"
              theme="colored"
              autoClose={3000}
              hideProgressBar={true}
              pauseOnHover={false}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default View;
