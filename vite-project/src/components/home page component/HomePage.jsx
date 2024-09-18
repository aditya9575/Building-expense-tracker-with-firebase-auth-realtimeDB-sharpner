import React, { useEffect, useState } from "react";
import "./homepage.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  // Function to check email verification status via Firebase's lookup API
  const checkEmailVerificationStatus = () => {
    axios
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4`,
        { idToken: token },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        const user = response.data.users[0]; // Assumes there's only one user
        if (user.emailVerified) {
          setIsEmailVerified(true);
          localStorage.setItem("isEmailVerified", "true"); // Persist in localStorage
        } else {
          setIsEmailVerified(false);
          localStorage.setItem("isEmailVerified", "false");
        }
      })
      .catch((error) => {
        console.error("Error checking email verification status:", error);
      });
  };

  // Check email verification status when the component mounts
  useEffect(() => {
    const verified = localStorage.getItem("isEmailVerified");
    if (verified === "true") {
      setIsEmailVerified(true);
    } else {
      checkEmailVerificationStatus(); // Check if verified from Firebase if not in localStorage
    }
  }, []);

  // Handle sending the email verification link
  const handleEmailVerification = () => {
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4",
        {
          requestType: "VERIFY_EMAIL",
          idToken: token,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Verification email sent successfully:", response.data);
        alert("Verification email sent successfully. Please check your inbox.");
      })
      .catch((error) => {
        console.error("Error sending verification email:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          alert(`Error: ${error.response.data.error.message}`);
        } else {
          alert("Failed to send verification email. Please try again.");
        }
      });
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("authToken");
      navigate("/loginForm");
    } catch (error) {
      console.log("Error logging the user out:", error);
    }
  };

  return (
    <div className="homepage-container">
      <div className="top-section">
        <div className="left-section">
          <h4>Welcome To Expense Tracker</h4>
        </div>

        <div className="right-section">
          <h4>Your profile is incomplete.</h4>
          <Link to="/updateProfile">Complete now</Link>
        </div>
      </div>

      <hr className="divider" />

      <div className="button-section">
        <button
          className="action-button"
          onClick={handleEmailVerification}
          disabled={isEmailVerified}
        >
          {isEmailVerified ? "Email Verified" : "Verify Your Email"}
        </button>
        <button
          className="action-button"
          onClick={() => {
            navigate("/expenseTracker");
          }}
        >
          Track Your Expenses
        </button>
    
        <button className="action-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
