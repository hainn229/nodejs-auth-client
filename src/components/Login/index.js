import React, {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../actions/index";
import GoogleLogin from "./google";
import FacebookLogin from "./facebook";
import { postLogin } from "../../api/index";
import {
  MailOutlined,
  LockOutlined,
  // FacebookOutlined,
} from "@ant-design/icons";
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
  List,
} from "antd";
const { Content } = Layout;
const { Title, Link } = Typography;

const LoginComponent = () => {
  useEffect(() => {
    document.title = "Log In | Double D"
  })
  useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    if (state.auth !== null) {
      return state.auth;
    }
  });
  const onFinish = async (data) => {
    try {
      const request = await postLogin(data);
      if (request.status === 200) {
        if (request.data.user) {
          if (request.data.user.role !== "ADMIN") {
            if (request.data.user.status === false) {
              return message.error(
                "Your account has been locked! Please contact with the staff to fix it!"
              );
            } else {
              localStorage.setItem("token", request.data.token);
              message.success(`Login Successfully!`);
              setTimeout(() => {
                dispatch({ type: "FETCH_USER", payload: request.data.user });
                return (window.location.href = "/");
              }, 1500);
            }
          } else {
            return message.error("Please sign in with an user account!");
          }
        }
        // else {
        //   console.log(request.data);
        //   message.error(
        //     "The email address or password that you've entered is incorrect!"
        //   );
        // }
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
      <Content style={{ paddingTop: "14%", paddingBottom: "15%" }}>
        <Row justify="center" align="middle">
          <Col span={8}>
            <Title style={{ textAlign: "center", fontSize: 60 }}>Log In</Title>
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
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
                  allowClear
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password
                  allowClear
                  prefix={<LockOutlined className="site-form-item-icon" />}
                />
              </Form.Item>
              <Form.Item>
                <Link href="/forgot-password" className="login-form-forgot">
                  Forgot password
                </Link>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row justify="center" align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <Divider>
              <Title level={4}>Or sign in with</Title>
            </Divider>
            <Row justify="center" align="middle">
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 2,
                  xl: 2,
                  xxl: 2,
                }}
                dataSource={[
                  {
                    data: <GoogleLogin />,
                  },
                  {
                    data: <FacebookLogin />,
                  },
                ]}
                renderItem={(item) => <List.Item>{item.data}</List.Item>}
              />
            </Row>
          </Col>
        </Row>

        <Row justify="center" align="middle">
          <Col span={8} style={{ textAlign: "center" }}>
            <Divider />
            <Link href="/signup">Don't have account? Sign up here!</Link>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
export default LoginComponent;
