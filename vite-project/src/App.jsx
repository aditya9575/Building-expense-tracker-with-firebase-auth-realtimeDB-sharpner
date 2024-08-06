import React from "react";
import "./App.css";
import Navbar from "./components/navbar component/Navbar";
import SignupForm from "./components/signup form component/SignupForm";
import Products from "./components/products component/Products";
import HomePage from "./components/home page component/HomePage"


import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/login form component/LoginForm";

const App = () => {
  return (
    <div>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<SignupForm />} />
        <Route path="/products" element={<Products />} />
        <Route path="/signupForm" element={<SignupForm />} />
        <Route path="/loginForm" element={<LoginForm/>}/>
        <Route path="/homePage" element={<HomePage/>}/>
      </Routes>
    </div>
  );
};

export default App;
