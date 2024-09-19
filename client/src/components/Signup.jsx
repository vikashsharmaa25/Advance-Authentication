import React from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authFailure, authRequest, authSuccess } from "../redux/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(authRequest());

      const response = await axiosInstance.post("/api/user/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      dispatch(authSuccess(response.data));

      message.success("Signup successful!");
    } catch (error) {
      dispatch(authFailure(error.response?.data?.message || "Signup failed"));

      message.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 sm:w-96 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Sign Up
      </h2>
      <Form name="signup" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Name"
            className="rounded-md"
          />
        </Form.Item>
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
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
