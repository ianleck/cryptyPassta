import React, { useState } from 'react';
import * as AuthAPI from '../../webservice/auth';
import LoginLogo from '../../images/login.svg';
import { Form, Input, Button, Checkbox, Typography } from 'antd';
require('./login.scss');

const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 32 }
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 32 }
};

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    AuthAPI.login({ username: username, password: password })
      .then(res => {
        sessionStorage.setItem('session', res.data);
      })
      .catch(err => console.log('Error Occur', err));
  };

  return (
    <div className="d-flex align-items-center" style={{ height: '100vh' }}>
      <div className="d-flex flex-grow-1 justify-content-center">
        <div>
          <Title level={2}>Login</Title>
          <Form
            className="mt-4"
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            //onFinish={onFinish}
            //onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input
                value={username}
                placeholder="Username"
                onChange={e => setUsername(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input
                type="password"
                value={password}
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Item>

            <Form.Item {...tailLayout} name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button
                className="login-btn"
                type="primary"
                htmlType="submit"
                block
                onClick={() => handleLogin()}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div
        className="d-flex flex-grow-1 justify-content-center align-items-center"
        style={{ backgroundColor: '#ebf4ff', height: '100%' }}
      >
        <div>
          <img src={LoginLogo} style={{ width: '20rem' }} />
        </div>
      </div>
    </div>
  );
}

export default Login;
