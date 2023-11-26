import React, { useState } from "react";
import View from "./view";
import { toast } from "react-toastify";
import { URL_BASE } from "../../constants";
import { useContextoPippo } from "../../ContextoPippo";

function Index() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState(null);
  const notifyError = () => toast.error("Error, datos invalidos");

  const { setUserLoggued, setLogin } = useContextoPippo();

  const login = async () => {
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
  };

  const props = { user, setUser, password, setPassword, login };

  return <View {...props} />;
}

export default Index;
