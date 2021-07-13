import React from "react";
import { useDispatch } from "react-redux";
import ReactGoogleLogin from "react-google-login";

import { postGoogleLogin } from "../../api/index";

import { GoogleOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
const GoogleLogin = () => {
  const dispatch = useDispatch();

  const responseGoogle = async (response) => {
    try {
      const request = await postGoogleLogin({
        access_token: response.accessToken,
      });
      if (request.status === 200) {
        localStorage.setItem("token", request.data.token);
        dispatch({ type: "FETCH_USER", payload: request.data.user });
        message.success("Login Successfully!");
        setTimeout(() => {
          return (window.location.href = "/");
        }, 1500);
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };
  return (
    <ReactGoogleLogin
      icon={false}
      clientId={process.env.REACT_APP_GG_CLIENT_ID}
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
      cookiePolicy={"single_host_origin"}
      render={(renderProps) => (
        <>
          <Button
            type="primary"
            style={{ width: 130 }}
            danger
            onClick={renderProps.onClick}
            icon={<GoogleOutlined />}
          >
            Google
          </Button>
        </>
      )}
    />
  );
};

export default GoogleLogin;
