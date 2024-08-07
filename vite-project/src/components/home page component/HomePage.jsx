import React from "react";
import "./homepage.css";

import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="left-Section">
        <h4>Welcome To Expense Tracker </h4>
      </div>

      <div className="right-Section">
        <h4>Your profile is Incomplete.</h4>
        <Link to="/updateProfile">Complete now</Link>
      </div>

      <hr />
    </div>
  );
};

export default HomePage;
