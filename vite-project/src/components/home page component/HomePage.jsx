import React from "react";
import "./homepage.css";
import axios from "axios";
import { Link } from "react-router-dom";

const HomePage = () => {
  const token = localStorage.getItem("authToken");

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
        if (error.response && error.response.data && error.response.data.error) {
          alert(`Error: ${error.response.data.error.message}`);
        } else {
          alert("Failed to send verification email. Please try again.");
        }
      });
  };

  return (
    <div>
      <div className="left-Section">
        <h4>Welcome To Expense Tracker</h4>
      </div>

      <div className="right-Section">
        <h4>Your profile is Incomplete.</h4>
        <Link to="/updateProfile">Complete now</Link>
      </div>

      <div>
        <button onClick={handleEmailVerification}>Verify Your Email</button>
      </div>

      <hr />
    </div>
  );
};

export default HomePage;
