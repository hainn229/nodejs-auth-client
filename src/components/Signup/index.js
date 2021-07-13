import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../actions/index";
import { postSignup } from "../../api/index";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
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
} from "antd";
const { Content } = Layout;
const { Title, Link } = Typography;

const SignupComponent = () => {
  useEffect(() => {
    document.title = `Sign Up | Double D`;
  });
  useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    return state.auth;
  });
  const onFinish = async (dataInput) => {
    try {
      if (dataInput.password === dataInput.c_password) {
        const data = {
          full_name: dataInput.full_name,
          email: dataInput.email,
          password: dataInput.password,
        };
        const request = await postSignup(data);
        if (request.status === 200) {
          localStorage.setItem("token", request.data.token);
          dispatch({ type: "FETCH_USER", payload: request.data.user });
          message.success(request.data.message);
          setTimeout(() => {
            return (window.location.href = "/");
          }, 3000);
        }
      } else {
        return message.error("Password Confirm did not match!");
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  return user ? (
    <Redirect to={"/"} />
  ) : (
    <Layout className="layout">
      <Content style={{ paddingTop: "14%", paddingBottom: "20%" }}>
        <Row justify="center" align="middle">
          <Col span={8}>
            <Title style={{ textAlign: "center", fontSize: 60 }}>Sign Up</Title>
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
              <Form.Item
                name="full_name"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input your full name!",
                  },
                ]}
              >
                <Input
                  allowClear
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Full name"
                />
              </Form.Item>

              <Form.Item
                name="email"
                hasFeedback
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your email address!",
                  },
                ]}
              >
                <Input
                  allowClear
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                hasFeedback
                rules={[
                  {
                    min: 8,
                    required: true,
                    message:
                      "Please input your password, at least 8 characters!",
                  },
                ]}
              >
                <Input.Password
                  allowClear
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
                  allowClear
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Sign Up
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <Divider />
            <Link href="/login">Had an account? Log in now!</Link>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default SignupComponent;
