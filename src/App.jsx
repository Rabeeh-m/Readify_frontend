import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Switch -> Routes
import PrivateRoute from "./utils/PrivateRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import Profile from "./views/Profile.jsx";
import Header from "./views/partials/Header.jsx";
import Footer from "./views/partials/Footer.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={ <PrivateRoute> <Profile /> </PrivateRoute> }/>
        </Routes>
        <Footer></Footer>
      </AuthProvider>
    </Router>
  );
}

export default App;