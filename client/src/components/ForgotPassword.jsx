import React from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
    // Implement forgot password logic here
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 sm:w-96 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Forgot Password
      </h2>
      <Form name="forgot-password" onFinish={onFinish} layout="vertical">
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
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Reset Password
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-4">
        Remember your password?{" "}
        <Link to="/login" className="text-indigo-600 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
