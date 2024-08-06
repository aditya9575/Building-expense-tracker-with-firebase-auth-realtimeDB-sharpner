import React from "react";
import "./App.css";
import Navbar from "./components/navbar component/Navbar";
import SignupForm from "./components/signup form component/SignupForm";
import Products from "./components/products component/Products";


import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signupForm" element={<SignupForm />} />
      </Routes>
    </div>
  );
};

export default App;
