import React from "react";
import { Form, Input, Button } from "antd";
import { NumberOutlined } from "@ant-design/icons";

const VerifyOTP = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
    // Implement OTP verification logic here
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 sm:w-96 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Verify OTP
      </h2>
      <Form name="verify-otp" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="otp"
          rules={[{ required: true, message: "Please input the OTP!" }]}
        >
          <Input
            prefix={<NumberOutlined />}
            placeholder="Enter OTP"
            className="rounded-md"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            Verify OTP
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-4">
        Didn't receive OTP?{" "}
        <a href="#" className="text-indigo-600 hover:underline">
          Resend OTP
        </a>
      </div>
    </div>
  );
};

export default VerifyOTP;
