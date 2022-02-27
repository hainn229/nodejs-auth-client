import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { postChangePassword } from '../../api/index';
import HeaderComponent from '../Header';
import FooterComponent from '../Footer';
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Button,
  notification,
} from 'antd';
import { LockOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const ChangePasswordComponent = () => {
  useEffect(() => {
    document.title = 'Change Password | Double D';
  });
  const user = useSelector((state) => {
    if (state.auth !== null) {
      return state.auth;
    }
  });
  const onFinish = async (dataInput) => {
    try {
      const data = {
        current_password: dataInput.current_password,
        new_password: dataInput.new_password,
      };
      const request = await postChangePassword(data);
      if (request.status === 200) {
        notification['success']({
          message: request.data.message,
          description: 'You just changed the password! ',
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      if (error.response) {
        return notification['error']({
          message: 'Update Failed!',
          description: error.response.data.message,
        });
      } else {
        return notification['error']({
          essage: 'Update Failed!',
          description: error.message,
        });
      }
    }
  };
  return user ? (
    <>
      <Layout className='layout'>
        <Header>
          <HeaderComponent />
        </Header>

        <Content>
          <Row className='breadCrumb'>
            <Breadcrumb separator='>'>
              <Breadcrumb.Item>
                <Link to='/'>Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to='/profile'>User Profile</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Change Password</Breadcrumb.Item>
            </Breadcrumb>
          </Row>
          <div className='site-layout-content'>
            <h1
              style={{ textAlign: 'center', paddingTop: '10%', fontSize: 40 }}
            >
              Change Password
            </h1>
            <Row gutter={[16, 16]} justify='center'>
              <Col span={12}>
                <Form
                  name='change-password'
                  className='login-form'
                  onFinish={onFinish}
                >
                  <Form.Item
                    name='current_password'
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Please input your current password!',
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className='site-form-item-icon' />}
                      placeholder='Current Password'
                    />
                  </Form.Item>

                  <Form.Item
                    name='new_password'
                    hasFeedback
                    dependencies={['current_password']}
                    rules={[
                      {
                        min: 8,
                        required: true,
                        message:
                          'Please input your password, at least 8 characters!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue('current_password') === value
                          ) {
                            return Promise.reject(
                              new Error(
                                'New password must be different from current password!'
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className='site-form-item-icon' />}
                      placeholder='New Password'
                    />
                  </Form.Item>

                  <Form.Item
                    name='confirm_password'
                    hasFeedback
                    dependencies={['new_password']}
                    rules={[
                      {
                        required: true,
                        message: 'Please input your confirm password!',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue('new_password') === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              'The two passwords that you entered do not match!'
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className='site-form-item-icon' />}
                      placeholder='Confirm Password'
                    />
                  </Form.Item>

                  <Form.Item style={{ padding: '0px 40%' }}>
                    <Button
                      type='primary'
                      htmlType='submit'
                      style={{ width: '100%' }}
                    >
                      Submit
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
    </>
  ) : (
    <Redirect to={'/'} />
  );
};

export default ChangePasswordComponent;
