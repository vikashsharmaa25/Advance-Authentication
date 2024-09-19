import React from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authFailure, authRequest, authSuccess } from "../redux/authSlice";
import axiosInstance from "../service/url.service";

const Login = () => {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(authRequest());

      const response = await axiosInstance.post("/api/user/login", {
        email: values.email,
        password: values.password,
      });

      dispatch(authSuccess(response.data));

      message.success("Login successful!");
    } catch (error) {
      dispatch(authFailure(error.response?.data?.message || "Login failed"));

      message.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 sm:w-96 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Login
      </h2>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            className="rounded-md"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            className="rounded-md"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Login
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-4">
        <Link to="/forgot-password" className="text-indigo-600 hover:underline">
          Forgot password?
        </Link>
      </div>
      <div className="text-center mt-2">
        Don't have an account?{" "}
        <Link to="/" className="text-indigo-600 hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
