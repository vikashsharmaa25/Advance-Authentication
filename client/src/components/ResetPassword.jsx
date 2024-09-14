import React from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

const ResetPassword = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
    // Implement reset password logic here
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl transform hover:scale-105 transition-all duration-300 sm:w-96 w-full">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
        Reset Password
      </h2>
      <Form name="reset-password" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="New Password"
            className="rounded-md"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm New Password"
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
    </div>
  );
};

export default ResetPassword;
