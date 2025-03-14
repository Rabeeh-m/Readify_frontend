import { useContext } from "react";
import { Navigate } from "react-router-dom"; // Replace Redirect with Navigate
import AuthContext from "../context/AuthContext.jsx"; // Ensure correct extension

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;