import React, { useEffect } from 'react';
import HeaderComponent from '../Header';
import FooterComponent from '../Footer';

import { Layout, BackTop, Carousel } from 'antd';
const { Header, Content, Footer } = Layout;

const contentStyle = {
  height: 250,
  color: '#fff',
  textAlign: 'center',
  background: '#364d79',
  paddingTop: '5%',
  paddingBottom: '5%',
};

const DashboardComponent = () => {
  useEffect(() => {
    document.title = 'Double D';
  });
  return (
    <>
      <BackTop />
      <Layout className='layout'>
        <Header>
          <HeaderComponent />
        </Header>
        <Content>
          <Carousel autoplay>
            <div>
              <h3 style={contentStyle}>1</h3>
            </div>
            <div>
              <h3 style={contentStyle}>2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>3</h3>
            </div>
            <div>
              <h3 style={contentStyle}>4</h3>
            </div>
          </Carousel>
          <div className='site-layout-content'>Content</div>
        </Content>
        <Footer>
          <FooterComponent />
        </Footer>
      </Layout>
    </>
  );
};

export default DashboardComponent;
