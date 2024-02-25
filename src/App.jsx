import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBookReader } from "react-icons/fa";
import { useUserAuth } from "./context/UserAuthContext";
import Swal from 'sweetalert2'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { logIn } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await logIn(email, password);
      navigate("/book"); // Assuming '/book' is the path you want to navigate to after login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="font-sarabun min-h-screen bg-gradient-to-br from-[#77BA47] to-[#47BA6E] flex justify-center items-center">
      <div className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="mb-4">
          <div className="flex justify-center mb-6">
            <span className="text-[#77BA47] text-2xl font-bold">
              <FaBookReader size={64} />
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome to librarian system
          </h2>
          {error && <p className="text-red-600 text-center">{error}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-4">
            <input
              className="px-4 py-2 border rounded-lg text-gray-900 focus:outline-none focus:border-[#77BA47]"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-[#77BA47]"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="px-4 py-2 bg-[#47BA6E] text-white rounded-lg hover:bg-[#77BA47] transition"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="text-[#77BA47] hover:text-[#77BA47]">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default App;
