import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";

import HeaderComponent from "../Header";
import FooterComponent from "../Footer";

import { Layout, Image, Breadcrumb, Row, Col, Progress, List } from "antd";
import {
  GlobalOutlined,
  GithubOutlined,
  // TwitterOutlined,
  // InstagramOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

const PublicProfileComponent = () => {
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
  return user ? (
    <>
      <Layout className="layout">
        <Header>
          <HeaderComponent />
        </Header>

        <Content>
          <Row className="breadCrumb">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/profile">User Profile</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>Public Profile</Breadcrumb.Item>
            </Breadcrumb>
          </Row>
          <Row gutter={[16, 16]} justify="center">
            {/* Profile Left */}
            <Col span={6} className="profileLeft">
              {user.image ? (
                <Image
                  preview={false}
                  style={{ maxWidth: 400, width: "100%", height: "auto" }}
                  src={user.image}
                />
              ) : (
                <Image
                  preview={false}
                  style={{ maxWidth: 400, width: "100%", height: "auto" }}
                  src="https://storage.googleapis.com/elearning-305907.appspot.com/doubled/images/2df5ea7c9144bc1f5d00c85741348e18"
                />
              )}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <h2>{user.full_name}</h2>
                <p style={{ color: "gray" }}>{user.email}</p>
                <p>
                  {user.address ? (
                    <>
                      <span style={{ marginRight: 10 }}>{user.address}</span>
                      <a
                        href={`https://www.google.com/maps?q=${user.address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <EnvironmentOutlined />
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                </p>
              </div>

              <Row justify="center">
                <List
                  grid={{ gutter: 16, column: 3 }}
                  dataSource={[
                    {
                      title: (
                        <a
                          href={`https://hainn229.pythonanywhere.com`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GlobalOutlined />
                        </a>
                      ),
                    },
                    {
                      title: (
                        <a
                          href="https://github.com/hainn229"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <GithubOutlined />
                        </a>
                      ),
                    },
                    {
                      title: (
                        <a
                          href="https://www.facebook.com/hainn229"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <FacebookOutlined />
                        </a>
                      ),
                    },
                    //   {
                    //     title: (
                    //       <a>
                    //         <TwitterOutlined />
                    //       </a>
                    //     ),
                    //   },
                    //   {
                    //     title: (
                    //       <a>
                    //         <InstagramOutlined />
                    //       </a>
                    //     ),
                    //   },
                  ]}
                  renderItem={(item) => <List.Item>{item.title}</List.Item>}
                />
              </Row>
            </Col>
            <Col span={17} className="profileRight">
              <div className="profileDetails">
                <h2>Skills</h2>
                <p className="skillTitle">NodeJS</p>
                <p>
                  <Progress percent={90} showInfo={false} strokeColor="green" />
                </p>

                <p className="skillTitle">ReactJS</p>
                <p>
                  <Progress percent={85} showInfo={false} strokeColor="green" />
                </p>

                <p className="skillTitle">HTML/CSS</p>
                <p>
                  <Progress percent={70} showInfo={false} strokeColor="" />
                </p>

                <p className="skillTitle">Python</p>
                <p>
                  <Progress percent={70} showInfo={false} strokeColor="" />
                </p>

                <p className="skillTitle">C#</p>
                <p>
                  <Progress percent={50} showInfo={false} strokeColor="" />
                </p>
              </div>
            </Col>
          </Row>
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
    </>
  ) : (
    <Redirect to={"/"} />
  );
};
export default PublicProfileComponent;
