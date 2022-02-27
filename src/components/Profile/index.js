import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import HeaderComponent from '../Header';
import FooterComponent from '../Footer';
import { putUser, uploadImage } from '../../api/index';

import {
  Layout,
  Image,
  Breadcrumb,
  Row,
  Col,
  Button,
  Divider,
  Form,
  Input,
  notification,
  Tag,
  Dropdown,
  Modal,
  Upload,
  message,
  Progress,
  Menu,
} from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  UploadOutlined,
  GlobalOutlined,
  GithubOutlined,
  // TwitterOutlined,
  // InstagramOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
  MenuOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

const ProfileComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => {
    if (state.auth !== null) {
      return state.auth;
    }
  });
  useEffect(() => {
    if (user) {
      document.title = `${user.full_name} | Double D`;
    }
  });

  const [stt, setStt] = useState({
    formName: false,
    formDob: false,
    formAddress: false,
  });

  const onFinish = async (data) => {
    try {
      if (user) {
        const request = await putUser(user._id, data);
        if (request.status === 200) {
          notification['success']({
            message: request.data.message,
            description: data.full_name ? (
              <>
                <p>You just changed your full name to</p>
                <Tag color='green' className='tagsEdit'>
                  {data.full_name}
                </Tag>
              </>
            ) : data.dob ? (
              <>
                <p>You just changed your date of birth to</p>
                <Tag color='green' className='tagsEdit'>
                  {new Date(data.dob).getFullYear() +
                    ' - ' +
                    (new Date(data.dob).getMonth() + 1) +
                    ' - ' +
                    new Date(data.dob).getDate()}
                </Tag>
              </>
            ) : (
              <>
                <p>You just changed the address information to</p>
                <Tag color='green' className='tagsEdit'>
                  {data.address}
                </Tag>
              </>
            ),
          });
          setTimeout(() => {
            dispatch({ type: 'FETCH_USER', payload: request.data });
            setStt({
              ...stt,
              formName: false,
              formDob: false,
              formAddress: false,
            });
            return window.location.reload();
          }, 2000);
        }
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

  const [stateUpload, setStateUpload] = useState({
    fileList: [],
    uploading: false,
    loading: false,
    isVisible: false,
    preview: false,
    urlImage: null,
    btnDisabled: true,
  });

  const showModal = () => {
    setStateUpload({ ...stateUpload, isVisible: true });
  };

  const onCancel = () => {
    setStateUpload({
      ...stateUpload,
      fileList: [],
      uploading: false,
      loading: false,
      isVisible: false,
      preview: false,
      urlImage: null,
      btnDisabled: true,
    });
  };

  const onFinishUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', stateUpload.fileList[0]);
      setStateUpload({ ...stateUpload, uploading: true });
      if (stateUpload.fileList) {
        const request = await uploadImage(formData);
        if (request.status === 200) {
          setStateUpload({
            ...stateUpload,
            urlImage: request.data.url,
            btnDisabled: false,
          });
          return message.success(request.data.message);
        }
      }
    } catch (error) {
      if (error.response) {
        return message.error(error.response.data.message);
      } else {
        return message.error(error.message);
      }
    }
  };

  const fileUpload = stateUpload.fileList;
  const formUpload = {
    onRemove: () => {
      setStateUpload({
        ...stateUpload,
        fileList: [],
        uploading: false,
        btnDisabled: true,
      });
    },
    beforeUpload: (file) => {
      const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/JPEG/PNG file!');
      } else {
        setStateUpload({ ...stateUpload, fileList: [file] });
        return false;
      }
    },
    fileUpload,
  };

  const onOK = async () => {
    try {
      if (stateUpload.urlImage != null) {
        const data = {
          image: stateUpload.urlImage,
        };
        const request = await putUser(user._id, data);
        if (request.status === 200) {
          setStateUpload({
            ...stateUpload,
            fileList: [],
            uploading: false,
            loading: false,
            isVisible: false,
            urlImage: null,
            btnDisabled: true,
          });
          notification['success']({
            message: request.data.message,
            description: 'You just changed your image profile!',
          });
          setTimeout(() => {
            dispatch({ type: 'FETCH_USER', payload: request.data });
            return window.location.reload();
          }, 3000);
        }
      } else {
        setStateUpload({
          ...stateUpload,
          loading: false,
        });
        return notification['error']({
          message: 'Update error!',
          description: 'You need upload image first',
        });
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
            <Col span={23}>
              <Breadcrumb separator='>'>
                <Breadcrumb.Item>
                  <Link to='/'>Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>User Profile</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={1}>
              <Dropdown
                style={{ float: 'right' }}
                overlay={
                  user.ggId || user.fbId ? (
                    'This is a normal menu'
                  ) : (
                    <Menu style={{ padding: '5px 10px' }}>
                      <Menu.Item key='change-password'>
                        <Link to={`/change-password`}>
                          <LockOutlined /> Change Password
                        </Link>
                      </Menu.Item>
                    </Menu>
                  )}
                placement='bottomCenter'
                arrow
              >
                <Button shape='round'>
                  <MenuOutlined />
                </Button>
              </Dropdown>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify='center'>
            {/* Profile Left */}
            <Col span={6} className='profileLeft'>
              <Row justify='center' style={{ marginTop: 16 }}>
                <Dropdown
                  overlay={
                    <div
                      style={{
                        border: '1px solid whitesmoke',
                        background: 'whitesmoke',
                        textAlign: 'center',
                      }}
                    >
                      {user.image ? (
                        <>
                          <Button
                            type='link'
                            icon={<EditOutlined />}
                            onClick={showModal}
                          >
                            Edit
                          </Button>
                          <Button
                            type='link'
                            icon={<EyeOutlined />}
                            onClick={() =>
                              setStateUpload({
                                ...stateUpload,
                                preview: true,
                              })
                            }
                          >
                            View
                          </Button>
                        </>
                      ) : (
                        <Button
                          type='link'
                          icon={<UploadOutlined />}
                          onClick={showModal}
                        >
                          Upload
                        </Button>
                      )}
                    </div>
                  }
                  placement='bottomCenter'
                  arrow
                >
                  {user.image ? (
                    <Image preview={false} width={200} src={user.image} />
                  ) : (
                    <Image
                      preview={false}
                      width={200}
                      src='https://storage.googleapis.com/elearning-305907.appspot.com/doubled/images/2df5ea7c9144bc1f5d00c85741348e18'
                    />
                  )}
                </Dropdown>
              </Row>
              <div style={{ textAlign: 'center', marginTop: 16 }}>
                <h2>{user.full_name}</h2>
                <p style={{ color: 'gray' }}>{user.email}</p>
                <p>
                  {user.address ? (
                    <>
                      <span style={{ marginRight: 10 }}>{user.address}</span>
                      <a
                        href={`https://www.google.com/maps?q=${user.address}`}
                        target='_blank'
                        rel='noreferrer'
                      >
                        <EnvironmentOutlined />
                      </a>
                    </>
                  ) : (
                    ''
                  )}
                </p>
              </div>
            </Col>
            {/* End Profile Left */}

            {/* Profile Right */}
            <Col span={17} className='profileRight'>
              <div className='profileDetails'>
                <tr>
                  <td className='textHeader'>Email</td>
                  <td className='textSecondary'>
                    {user.verified === true ? (
                      <>
                        {user.email}
                        <Tag className='tagsVerified' color='green'>
                          Verified
                        </Tag>
                      </>
                    ) : (
                      <>
                        {user.email}
                        <Tag className='tagsVerified' color='red'>
                          Not Verified
                        </Tag>
                      </>
                    )}{' '}
                  </td>
                </tr>
                <Divider />
                <tr>
                  <td className='textHeader'> Full Name</td>
                  {stt.formName === false ? (
                    <td className='textSecondary'>
                      {user.full_name}
                      <Button
                        type='link'
                        style={{ marginLeft: 30 }}
                        onClick={() => setStt({ ...stt, formName: true })}
                      >
                        <EditOutlined />
                      </Button>
                    </td>
                  ) : (
                    <td className='textSecondary'>
                      <Form
                        name='form edit name'
                        onFinish={onFinish}
                        layout='inline'
                      >
                        <Form.Item
                          name='full_name'
                          style={{ width: 200 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your username!',
                            },
                          ]}
                        >
                          <Input placeholder={user.full_name} />
                        </Form.Item>
                        <Form.Item>
                          <Button type='link' htmlType='submit'>
                            <CheckOutlined />
                          </Button>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            danger
                            type='link'
                            onClick={() => setStt({ ...stt, formName: false })}
                          >
                            <CloseOutlined />
                          </Button>
                        </Form.Item>
                      </Form>
                    </td>
                  )}
                </tr>
                <Divider />

                <tr>
                  <td className='textHeader'>Date of Birth</td>

                  {stt.formDob === false ? (
                    <td className='textSecondary'>
                      {user.dob
                        ? new Date(user.dob).getFullYear() +
                        ' - ' +
                        (new Date(user.dob).getMonth() + 1) +
                        ' - ' +
                        new Date(user.dob).getDate()
                        : 'Not Set'}
                      <Button
                        type='link'
                        style={{ marginLeft: 30 }}
                        onClick={() => setStt({ ...stt, formDob: true })}
                      >
                        <EditOutlined />
                      </Button>
                    </td>
                  ) : (
                    <td className='textSecondary'>
                      <Form
                        name='form edit name'
                        onFinish={onFinish}
                        layout='inline'
                      >
                        <Form.Item
                          name='dob'
                          style={{ width: 200 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your date of birth!',
                            },
                          ]}
                        >
                          <Input type='date' />
                        </Form.Item>
                        <Form.Item>
                          <Button type='link' htmlType='submit'>
                            <CheckOutlined />
                          </Button>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            danger
                            type='link'
                            onClick={() => setStt({ ...stt, formDob: false })}
                          >
                            <CloseOutlined />
                          </Button>
                        </Form.Item>
                      </Form>
                    </td>
                  )}
                </tr>
                <Divider />
                <tr>
                  <td className='textHeader'>Address</td>
                  {stt.formAddress === false ? (
                    <td className='textSecondary'>
                      {user.address ? user.address : 'Not Set'}
                      <Button
                        type='link'
                        style={{ marginLeft: 30 }}
                        onClick={() => setStt({ ...stt, formAddress: true })}
                      >
                        <EditOutlined />
                      </Button>
                    </td>
                  ) : (
                    <td className='textSecondary'>
                      <Form
                        name='form edit name'
                        onFinish={onFinish}
                        layout='inline'
                      >
                        <Form.Item
                          name='address'
                          style={{ width: 200 }}
                          rules={[
                            {
                              required: true,
                              message: 'Please input your address!',
                            },
                          ]}
                        >
                          <Input
                            placeholder={user.address ? user.address : ''}
                          />
                        </Form.Item>
                        <Form.Item>
                          <Button type='link' htmlType='submit'>
                            <CheckOutlined />
                          </Button>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            danger
                            type='link'
                            onClick={() =>
                              setStt({ ...stt, formAddress: false })
                            }
                          >
                            <CloseOutlined />
                          </Button>
                        </Form.Item>
                      </Form>
                    </td>
                  )}
                </tr>
              </div>
            </Col>
            {/* End Profile Right */}
          </Row>
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
      <Modal
        visible={stateUpload.isVisible}
        title='Edit Image Profile'
        onOk={onOK}
        onCancel={onCancel}
        footer={[
          <Button key='cancel' onClick={onCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            loading={stateUpload.loading}
            onClick={() => {
              setStateUpload({ ...stateUpload, loading: true });
              onOK();
            }}
            disabled={stateUpload.btnDisabled}
          >
            Save
          </Button>,
        ]}
      >
        <Upload {...formUpload}>
          <Button
            disabled={stateUpload.fileList.length === 1}
            icon={<UploadOutlined />}
          >
            Select File
          </Button>
        </Upload>
        <Button
          type='primary'
          onClick={onFinishUpload}
          disabled={
            stateUpload.fileList.length === 0 || stateUpload.urlImage !== null
          }
          loading={stateUpload.uploading}
          style={{ marginTop: 16 }}
        >
          {stateUpload.uploading ? 'Uploading' : 'Upload'}
        </Button>
      </Modal>
      <Modal
        visible={stateUpload.preview}
        title={'Your Image Profile'}
        footer={null}
        onCancel={() => {
          setStateUpload({ ...stateUpload, preview: false });
        }}
      >
        <img
          alt='profile'
          style={{ maxWidth: 500, width: '100%', height: 'auto' }}
          src={user.image}
        />
      </Modal>
    </>
  ) : (
    <Redirect to={'/'} />
  );
};

export default ProfileComponent;
