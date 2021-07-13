import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../actions/index";
import { getOtp, verifyOtp, postForgotPassword } from "../../api/index";
import { MailOutlined, KeyOutlined, LockOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Layout,
  Typography,
  Row,
  Col,
  message,
  Divider,
  Steps,
} from "antd";
const { Content } = Layout;
const { Title, Link } = Typography;
const { Step } = Steps;

const ForgotPasswordComponent = () => {
  useEffect(() => {
    document.title = "Reset Password | Double D";
  });
  useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.auth;
  });
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const [emailAddress, setEmailAddress] = useState();

  const onFinishGetOTP = async (data) => {
    try {
      setEmailAddress(data.email);
      const request = await getOtp(data);
      if (request.status === 200) {
        message.success(request.data.message);
        setTimeout(() => {
          next();
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const onFinishVerifyOTP = async (dataInput) => {
    try {
      const data = {
        email: emailAddress,
        otp: dataInput.otp,
      };
      const request = await verifyOtp(data);
      if (request.status === 200) {
        message.success(request.data.message);
        setTimeout(() => {
          next();
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const onFinish = async (dataInput) => {
    try {
      const data = {
        email: emailAddress,
        password: dataInput.password,
      };
      const request = await postForgotPassword(data);
      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        dispatch({ type: "FETCH_USER", payload: request.data.user });
        message.success(request.data.message);
        setTimeout(() => {
          return (window.location.href = "/");
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const steps = [
    {
      title: "Get OTP",
      content: (
        <>
          <Form name="get-otp" className="login-form" onFinish={onFinishGetOTP}>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email address!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined className="site-form-item-icon" />}
                placeholder="Enter your email address"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      title: "OTP Verification",
      content: (
        <>
          <Form
            name="otp-verification"
            className="login-form"
            onFinish={onFinishVerifyOTP}
          >
            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Please input OTP!",
                },
              ]}
            >
              <Input
                prefix={<KeyOutlined className="site-form-item-icon" />}
                placeholder="Enter your OTP"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
    {
      title: "Create New Password",
      content: (
        <>
          <Form name="new-password" className="login-form" onFinish={onFinish}>
            <Form.Item
              name="password"
              hasFeedback
              rules={[
                {
                  min: 8,
                  required: true,
                  message: "Please input your password, at least 8 characters!",
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="c_password"
              hasFeedback
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please input your confirm password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </>
      ),
    },
  ];

  return user ? (
    <Redirect to={"/"} />
  ) : (
    <Layout className="layout">
      <Content style={{ paddingTop: "14%", paddingBottom: "15%" }}>
        <Row justify="center" align="middle">
          <Title style={{ textAlign: "center", fontSize: 60 }}>
            Reset Password
          </Title>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>

          <div className="steps-content">{steps[current].content}</div>
        </Row>

        <Row justify="center" align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <Divider />
            <Link href="/login">Back to Login!</Link>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default ForgotPasswordComponent;
