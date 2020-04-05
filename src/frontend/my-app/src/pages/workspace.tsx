import React from 'react';
import { Layout, Menu, Breadcrumb, Tooltip } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { ClickParam } from 'antd/lib/menu';
import Passport from './Passport/passport';
import Custom from './Custom/custom';
import HumanResource from './HumanResource/humanResource';
import Logo from '../images/logo.svg';
const { Header, Content, Footer } = Layout;

require('./workspace.scss');

function Workspace() {
  const [selectedMenu, setSelectedMenu] = React.useState('Passport Management');
  const history = useHistory();

  const handleClick = (e: ClickParam) => {
    setSelectedMenu(e.key);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    history.push('/login');
  };

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div
            className="logo"
            style={{
              float: 'left'
            }}
          >
            <img src={Logo} width="50px" alt="Logo" />
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedMenu]}
            onClick={e => handleClick(e)}
            style={{ lineHeight: '64px', float: 'left' }}
          >
            <Menu.Item key="Passport Management">Passport Management</Menu.Item>
            <Menu.Item key="Custom Management">Custom Management</Menu.Item>
            <Menu.Item key="HR Management">HR Management</Menu.Item>
          </Menu>
        </div>
        <div>
          <Tooltip placement="bottom" title={'Logout'}>
            <PoweroffOutlined
              style={{ color: 'white', fontSize: '20px' }}
              onClick={handleLogout}
            />
          </Tooltip>
        </div>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0', display: 'flex' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>{selectedMenu}</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="site-layout-content"
          style={{
            background: '#fff',
            padding: '24px',
            minHeight: '73vh'
          }}
        >
          {selectedMenu === 'Passport Management' && <Passport />}
          {selectedMenu === 'Custom Management' && <Custom />}
          {selectedMenu === 'HR Management' && <HumanResource />}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Crypty Passta ©2020</Footer>
    </Layout>
  );
}

export default Workspace;
