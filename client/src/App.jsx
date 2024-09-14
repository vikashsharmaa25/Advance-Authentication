import React from "react";
import { Route, Routes } from "react-router-dom";
import SignUp from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import VerifyOTP from "./components/OtpVefication";
import Dashboard from "./components/Dashboard";

const App = () => {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
        <Routes>
          <Route exact path="/" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/profile" element={<Dashboard />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
