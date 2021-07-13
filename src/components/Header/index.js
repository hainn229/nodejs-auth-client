import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAuth } from "../../actions/index";
import StripeCheckout from "react-stripe-checkout";
import PaypalCheckout from "react-paypal-checkout";
import { postStripe } from "../../api";

import { UserOutlined } from "@ant-design/icons";
import {
  Button,
  Menu,
  Dropdown,
  Avatar,
  Card,
  Modal,
  notification,
  InputNumber,
  Form,
} from "antd";
const { Meta } = Card;

const HeaderComponent = () => {
  useAuth();
  const user = useSelector((state) => {
    return state.auth;
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const [totalAmount, setTotalAmount] = useState(0);

  const onFinish = async (data) => {
    console.log(data);
  };

  const onSuccessStripe = async (token) => {
    try {
      const request = await postStripe(token);
      if (request) {
        console.log(request.data);
        hideModal();
      }
    } catch (error) {
      return notification["error"]({
        message: "Transaction Failed!",
        description: error.response,
      });
    }
  };

  const onSuccessPaypal = async (data) => {
    try {
      console.log(data);
      hideModal();
    } catch (error) {
      return notification["error"]({
        message: "Transaction Failed!",
        description: error.response,
      });
    }
  };
  const onError = async (error) => {
    hideModal();
    return notification["error"]({
      message: "Transaction Error!!",
      description: error.message,
    });
  };
  const onCancel = async () => {
    hideModal();
    return notification["success"]({
      message: "Transaction Canceled!",
      description: `Transaction has been cancelled !`,
    });
  };

  return (
    <>
      <span>
        <Link to={"/"} style={{ fontSize: 20, color: "white" }}>
          <img
            // src="https://storage.googleapis.com/elearning-305907.appspot.com/images/teacher_man.png"
            src="https://storage.googleapis.com/elearning-305907.appspot.com/doubled/images/dd.png"
            width={40}
            alt="logo"
            style={{ marginRight: 10 }}
          />
          Double D
        </Link>
      </span>
      {user === null ? (
        <span style={{ float: "right" }}>
          <Button style={{ width: 90 }}>
            <Link to={`/login`}>Log in</Link>
          </Button>
          <Button type="primary" style={{ marginLeft: 10, width: 90 }}>
            <Link to={`/signup`}>Sign up</Link>
          </Button>
        </span>
      ) : (
        <>
          <span style={{ float: "right" }}>
            <Button type="link" style={{ marginRight: 10, color: "yellow" }}>
              Balance: ${user.amount}
            </Button>
            <Dropdown
              overlay={
                <div style={{ marginTop: 15, border: "1px solid whitesmoke" }}>
                  <Link to={`/profile`}>
                    <Card>
                      <Meta
                        avatar={
                          user.image ? (
                            <Avatar src={user.image} shape="square" size={58} />
                          ) : (
                            <Avatar
                              icon={<UserOutlined />}
                              shape="square"
                              size={58}
                            />
                          )
                        }
                        title={<Link to={`/profile`}>{user.full_name}</Link>}
                        description={user.email}
                      />
                    </Card>
                  </Link>
                  <Menu>
                    <Menu.Item key="wishlist">
                      <Link to={`/profile/wishlist`}>Wishlist</Link>
                    </Menu.Item>
                    <Menu.Item key="amount" onClick={showModal}>
                      Update Amount
                    </Menu.Item>
                    <Menu.Item
                      key="logout"
                      onClick={() => {
                        localStorage.removeItem("token");
                        window.location.href = "/";
                      }}
                      style={{ color: "red" }}
                    >
                      Log Out
                    </Menu.Item>
                  </Menu>
                </div>
              }
              placement="bottomRight"
            >
              {user.image ? (
                <Avatar src={user.image} size="large" />
              ) : (
                <Avatar size="large" icon={<UserOutlined />} />
              )}
            </Dropdown>
          </span>
          <Modal
            title="Update Amount"
            visible={isModalVisible}
            onCancel={hideModal}
            footer={
              <>
                <Button
                  key="cancel"
                  onClick={hideModal}
                  style={{ marginRight: 10 }}
                >
                  Cancel
                </Button>
                <StripeCheckout
                  name="Double D - Update Amount"
                  description={`Pay $${totalAmount} for $${totalAmount} !`}
                  amount={totalAmount * 100}
                  email={user.email}
                  currency="USD"
                  token={(token) => onSuccessStripe(token)}
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  // closed={onSuccessStripe}
                >
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 10 }}
                  >
                    Stripe Checkout
                  </Button>
                </StripeCheckout>
                <PaypalCheckout
                  env="sandbox"
                  client={{
                    sandbox: process.env.REACT_APP_CLIENT_SANDBOX_KEY,
                    production: "",
                  }}
                  currency="USD"
                  total={totalAmount}
                  onSuccess={onSuccessPaypal}
                  onError={onError}
                  onCancel={onCancel}
                  style={{
                    size: "small",
                    shape: "rect",
                  }}
                />
              </>
            }
          >
            <h6>Balance:</h6>
            <h1>{"$ " + user.amount}</h1>

            <Form name="update amount" onFinish={onFinish}>
              <Form.Item name="amount">
                <InputNumber
                  style={{ width: 200 }}
                  min={1}
                  onChange={(value) => {
                    setTotalAmount(value);
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </>
  );
};

export default HeaderComponent;
