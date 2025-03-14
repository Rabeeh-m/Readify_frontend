import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Login() {
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    email.length > 0 && loginUser(email, password);
  };

  return (
    <div className="min-h-screen flex flex-col mt-6">
      {/* Main Content */}
      <section 
        className="flex-1 flex items-center justify-center p-4" 
        style={{ backgroundColor: "#B17F59" }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center mb-6">
                <i className="fas fa-cubes text-2xl mr-3" style={{ color: "#ff6218" }}></i>
                <span className="text-2xl font-bold">Welcome back 👋</span>
              </div>

              <h5 className="text-lg font-normal mb-6 tracking-wide">
                Sign in to your account
              </h5>

              <div className="mb-6">
                <input
                  type="email"
                  id="form2Example17"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  name="email"
                />
                <label className="block mt-1 text-gray-700" htmlFor="form2Example17">
                  Email address
                </label>
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  id="form2Example27"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-base"
                  name="password"
                />
                <label className="block mt-1 text-gray-700" htmlFor="form2Example27">
                  Password
                </label>
              </div>

              <div className="mb-6">
                <button
                  className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-900 text-lg font-medium"
                  type="submit"
                >
                  Login
                </button>
              </div>

              <a className="text-sm text-gray-600 block mb-4" href="#!">
                Forgot password?
              </a>

              <p className="mb-5 text-gray-700">
                Don't have an account?{" "}
                <Link to="/register" className="text-indigo-700 hover:underline">
                  Register Now
                </Link>
              </p>

            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;