import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleUserLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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

      const { idToken, localId } = response.data;

      console.log("User has successfully logged in.", response.data);

      // Store token and userId in localStorage
      localStorage.setItem("authToken", idToken);
      localStorage.setItem("userId", localId); // Store userId for later use

      navigate("/homePage");
    } catch (error) {
      console.error("Error in logging in:", error);
      setErrorMessage(error.response?.data?.error?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
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
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <button type="button"
        onClick={() => {
          navigate("/forgotPassword");
        }}
      >
        Forgot Password
      </button>
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
