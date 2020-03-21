import React from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
const { Header, Content, Footer } = Layout;

function Workspace() {
  //TODO: Move Styling to SCSS
  return (
    <Layout className="layout">
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <div
          className="logo"
          style={{
            width: '120px',
            height: '31px',
            background: 'rgba(255, 255, 255, 0.2)',
            margin: '16px 24px 16px 0',
            float: 'left'
          }}
        ></div>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          style={{ lineHeight: '64px', float: 'left' }}
        >
          <Menu.Item key="1">Passport Management</Menu.Item>
          <Menu.Item key="2">Custom Management</Menu.Item>
          <Menu.Item key="3">HR Management</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px', marginTop: 64 }}>
        <Breadcrumb style={{ margin: '16px 0', display: 'flex' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Passport Mangement</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-content"
          style={{
            background: '#fff',
            padding: '24px',
            minHeight: '75vh'
          }}
        >
          Content
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Crypty Passta ©2020</Footer>
    </Layout>
  );
}

export default Workspace;
