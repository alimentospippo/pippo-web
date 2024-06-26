import React from "react";
import { icons } from "../icons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.scss";

function View({
  user,
  setUser,
  password,
  setPassword,
  login,
  loadingLogin,
  handleKeyPress,
}) {
  return (
    <div className=" login" id="full">
      <div className="login-content">
        <div className="login-content-logo">{icons("logo")}</div>
        <div className="login-content-text">
          <div className="label">Usuario:</div>
          <input
            type="text"
            name="user"
            id="user"
            onChange={(e) => setUser(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <div className="label">Contraseña:</div>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            className="button"
            onClick={() => login()}
            disabled={!user || !password || loadingLogin}
          >
            <div className="button-content">
              {loadingLogin && (
                <div className="icon-loading">{icons("loading")}</div>
              )}
              <div>{loadingLogin ? "Iniciando..." : "Iniciar"}</div>
            </div>
          </button>
        </div>
      </div>

      <ToastContainer
        position="bottom-center"
        theme="colored"
        autoClose={5000}
      />
    </div>
  );
}

export default View;
