import React from 'react';
import { useDispatch } from 'react-redux';
import ReactFacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { postFacebookLogin } from '../../api/index';

import { FacebookOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
const FacebookLogin = () => {
  const dispatch = useDispatch();

  const responseFacebook = async (response) => {
    try {
      const request = await postFacebookLogin({
        access_token: response.accessToken,
      });
      if (request.status === 200) {
        localStorage.setItem('token', request.data.token);
        dispatch({ type: 'FETCH_USER', payload: request.data.user });
        message.success(`Welcome, ${request.data.user.full_name}!`);
        setTimeout(() => {
          return (window.location.href = '/');
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
    <ReactFacebookLogin
      icon={false}
      appId={process.env.REACT_APP_FB_ID}
      autoLoad={false}
      callback={responseFacebook}
      render={(renderProps) => (
        <Button
          type='primary'
          style={{ width: 130 }}
          onClick={renderProps.onClick}
          icon={<FacebookOutlined />}
        >
          Facebook
        </Button>
      )}
    />
  );
};

export default FacebookLogin;
