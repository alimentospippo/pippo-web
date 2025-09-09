import React from "react";
import { Navigate } from "react-router-dom";
import { useContextoPippo } from "./ContextoPippo";

const PrivateRoute = ({ children }) => {
  const { login } = useContextoPippo();
  if (!login) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
