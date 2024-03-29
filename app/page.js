"use client"; // This is a client component

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "./dashboard/page";
import axios from "axios";

export default function Home() {
  const navigation = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showReg, setShowReg] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [loginError, setLoginError] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadLoginComponent = () => {
    setShowLogin(true);
    setShowReg(false);
    setEmail("");
    setPassword("");
    setName("");
    setPasswordError("");
    setEmailError("");
    setNameError("");
  };

  const loadRegComponent = () => {
    setShowLogin(false);
    setShowReg(true);
    setEmail("");
    setPassword("");
    setName("");
    setPasswordError("");
    setEmailError("");
    setNameError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Validate email
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const { data } = await axios.post(
        `https://sfsapi-f7a49b940304.herokuapp.com/api/login`,
        {
          email: email,
          password: password,
        }
      );

      // Extract the token from the response
      const token = data.token;

      // Store the token in localStorage
      localStorage.setItem("token", token);
      // Set the token in the Axios header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      navigation.push("/dashboard");
    } catch (error) {
      setEmail("");
      setPassword("");
      setLoginError("Invalid email or password");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate Name
    if (name.trim() === "") {
      setNameError("Fullname is required");
      return;
    } else {
      setNameError("");
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    // Validate password
    if (password.trim() === "") {
      setPasswordError("Password is required");
      return;
    } else {
      setPasswordError("");
    }
    try {
      const { data } = await axios.post(
        `https://sfsapi-f7a49b940304.herokuapp.com/api/register`,
        {
          name: name,
          email: email,
          password: password,
        }
      );

      // Registration successful
      setSuccessMessage("User created successfully proceed to Login");
      // Reset form fields
      setName("");
      setEmail("");
      setPassword("");
      setNameError("");
      setEmailError("");
      setPasswordError("");
      setRegisterError(null);
    } catch (error) {
      setPassword("");
      setRegisterError(error.response.data.error.email[0]);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <main className=" bg-white px-10 dark:bg-gray-900 md:px-20 lg:px-40">
        <section className="min-h-screen">
          <nav className="py-10 mb-12 flex justify-between">
            <h1 className="text-xl font-burtons dark:text-white">
              SFS Finance
            </h1>
          </nav>

          {/* Login form */}
          {showLogin && (
            <div className="text-center p-10">
              <div className="w-full max-w-xs">
                {/* Display login error */}
                {loginError && (
                  <p className="text-red-500 text-xs italic">{loginError}</p>
                )}
                {emailError && (
                  <p className="text-red-500 text-xs italic">{emailError}</p>
                )}

                {passwordError && (
                  <p className="text-red-500 text-xs italic">{passwordError}</p>
                )}
                {nameError && (
                  <p className="text-red-500 text-xs italic">{nameError}</p>
                )}
                <form
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  onSubmit={handleLogin}
                >
                  <div className="mb-4">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <input
                      className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Sign In
                    </button>
                    <button
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      onClick={loadRegComponent}
                    >
                      Signup
                    </button>
                  </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                  &copy;2023 sfsfinance. All rights reserved.
                </p>
              </div>
            </div>
          )}
          {/* Login form ends here */}

          {/* Create Account */}
          {showReg && (
            <div className="text-center p-10">
              <div className="w-full max-w-xs">
                {/* Display success message */}
                {successMessage && (
                  <p className="text-green-500 text-xs italic">
                    {successMessage}
                  </p>
                )}
                {/* Display login error */}
                {registerError && (
                  <p className="text-red-500 text-xs italic">{registerError}</p>
                )}
                {emailError && (
                  <p className="text-red-500 text-xs italic">{emailError}</p>
                )}

                {passwordError && (
                  <p className="text-red-500 text-xs italic">{passwordError}</p>
                )}
                {nameError && (
                  <p className="text-red-500 text-xs italic">{nameError}</p>
                )}
                <form
                  className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                  onSubmit={handleRegister}
                >
                  <div className="mb-4">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="mb-6">
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      placeholder="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Create Account
                    </button>
                    <button
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      onClick={loadLoginComponent}
                    >
                      Login
                    </button>
                  </div>
                </form>
                <p className="text-center text-gray-500 text-xs">
                  &copy;2023 sfsfinance. All rights reserved.
                </p>
              </div>
            </div>
          )}
          {/* End Create Account */}
          <div className="text-5xl flex justify-center gap-16 py-3 text-gray-600 "></div>
        </section>
        <section>
          <div></div>
        </section>
      </main>
    </div>
  );
}
