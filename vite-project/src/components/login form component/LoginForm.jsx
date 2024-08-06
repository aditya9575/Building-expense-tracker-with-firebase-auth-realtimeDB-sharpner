import React, { useState } from "react";
import "./loginform.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleUserLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      returnSecureToken: true,
    };

    try {
      const response = await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("User has successfully logged in.", response.data);

      // Store the token in local storage
      localStorage.setItem("authToken", response.data.idToken);

      navigate("/homePage");
    } catch (error) {
      console.error("Error in logging in:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <form onSubmit={handleUserLogin} className="form-container">
      <h1>Login</h1>
      <input
        type="email"
        required
        placeholder="Enter Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Enter Your Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit">Login</button>
      <a href="">Forgot Password</a>
      <button
        type="button"
        onClick={() => {
          navigate("/signupForm");
        }}
      >
        Don't Have An Account
      </button>
    </form>
  );
};

export default LoginForm;
