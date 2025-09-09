import React, { useEffect, useState } from "react";
import View from "./view";
import { toast } from "react-toastify";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const notifyError = () => toast.error("Error, datos invalidos");

  const { setUserLoggued, setLogin } = useContextoPippo();

  const [loadingLogin, setLoadingLogin] = useState(false);

  console.log("user", user);

  const login = async () => {
    try {
      setLoadingLogin(true);
      await fetch(`${URL_BASE}/login/login.php`, {
        method: "POST",
        body: JSON.stringify({
          user: user,
          password: password,
        }),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response) {
            setLogin(true);
            localStorage.setItem("user", JSON.stringify(response));
            setUserLoggued(response);
            setLogin(true);
          } else {
            notifyError();
          }
        });
    } catch (error) {
      console.error("Error al iniciar:", error);
      notifyError();
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      login();
    }
  };

  const handleChange = (event) => {
    setUser(event.target.value);
  };

  const props = {
    user,
    setUser,
    password,
    setPassword,
    login,
    loadingLogin,
    handleKeyPress,handleChange
  };

  return <View {...props} />;
}

export default Index;
