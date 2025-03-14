import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    registerUser(email, username, password, password2);
  };

  return (
    <div className="min-h-screen flex flex-col mt-8">
      <section 
        className="flex-1 flex items-center justify-center" 
        style={{ backgroundColor: "#B17F59" }}
      >
        <div className="w-full max-w-md px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold">
                  Welcome to <b>Readify</b>
                </span>
              </div>

              <h5 className="text-lg font-normal mb-6 tracking-wide">
                Sign Up
              </h5>

              <div className="mb-6">
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  placeholder="Email Address"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  id="username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  placeholder="Username"
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  id="password"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  placeholder="Password"
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  id="password2"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  placeholder="Confirm Password"
                  onChange={e => setPassword2(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <button
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 text-lg font-medium"
                  type="submit"
                >
                  Register
                </button>
              </div>

              <a className="text-sm text-gray-600 block mb-4" href="#!">
                Forgot password?
              </a>

              <p className="mb-5 text-gray-700">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-700 hover:underline">
                  Login Now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Register;