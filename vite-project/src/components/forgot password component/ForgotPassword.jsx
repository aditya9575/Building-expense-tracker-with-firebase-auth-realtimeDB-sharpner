import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState(null);

  const handleForgotPassword = async () => {
    try {
      setLoader(true);

      const requestData = {
        requestType: 'PASSWORD_RESET',
        email: email,
      };

      await axios.post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4",
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setLoader(false);
      setMessage('Password reset link sent successfully. Check your email.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setLoader(false);
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(`Error: ${error.response.data.error.message}`);
      } else {
        setMessage('Failed to send password reset email. Please try again.');
      }
    }
  };

  return (
    <div>
      {loader ? (
        <h2>Loading...</h2>
      ) : (
        <form>
          <button onClick={() => navigate(-1)}>Go Back</button>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <button type="button" onClick={handleForgotPassword}>
            Send Password Reset Link
          </button>
          <p>
            Already a user? <Link to="/loginForm">Login</Link>
          </p>
          {message && <p>{message}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
