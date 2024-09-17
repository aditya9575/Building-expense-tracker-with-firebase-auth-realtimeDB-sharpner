import React, { useState } from "react";
import axios from "axios";
import "./signupform.css"; 
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSignupForm = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email.includes('@')) {
      setErrorMessage("Invalid email address.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    // Reset error message
    setErrorMessage("");

    // Form data
    const formData = {
      email,
      password,
      returnSecureToken: true
    };

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("User has successfully signed up.", response.data);
      setSuccessMessage("Signup successful!");
      navigate("/loginForm")

      // Reset form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error.message);
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    }
  };

  return (
    <form className="form-container" onSubmit={handleSignupForm}>
    <h1>Signup</h1>
      <input
        type="email"
        required
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        required
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <button type="submit">Signup</button>
      <button type="button" onClick={()=>{
        navigate("/loginForm")
      }}>Have an account? Login</button>
    </form>
  );
};

export default SignupForm;
