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
import Books from "./views/Books.jsx";
import BookDetails from "./views/BookDetails.jsx";

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
          <Route path="/books" element={<Books />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
        </Routes>
        <Footer></Footer>
      </AuthProvider>
    </Router>
  );
}

export default App;