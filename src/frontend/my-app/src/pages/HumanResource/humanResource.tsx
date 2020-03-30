import React, { useState, useEffect } from 'react';
import * as AuthAPI from '../../webservice/auth';
import { Button, Radio, Avatar, Modal, Form, Input } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Table, Tag } from 'antd';

import Profile from '../../images/Profile/profile1.png';

require('./humanResource.scss');

interface Worker {
  profilePic: string;
  username: string;
  blockchainAddress: string;
  status: number;
}

function HumanResource() {
  // Table Column Definition
  // Profile & Status are hardcoded fields
  const columns = [
    {
      title: 'Profile',
      dataIndex: 'profilePic',
      key: 'profilePic',
      render: (src: string) => (
        <Avatar
          size={64}
          src={require('../../images/Profile/' + src + '.png')}
        />
      )
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username'
    },
    {
      title: 'Blockchain Address',
      dataIndex: 'blockchainAddress',
      key: 'blockchainAddress'
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status: number) =>
        status === 0 ? (
          <span>
            <Tag color="green">Active</Tag>
          </span>
        ) : (
          <span>
            <Tag color="red">Freeze</Tag>
          </span>
        )
    }
  ];

  // ----------------------- STATE------------------------
  const [tableData, setTableData] = React.useState<Worker[]>([]);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [form] = Form.useForm();

  // ----------------------- Function ------------------------
  const onCreate = (values: any) => {
    AuthAPI.createWorker(values.worker)
      .then(res => {
        setVisible(false);
        fetchAllWorker();
      })
      .catch(err => console.log('Error Occur', err));
  };

  const fetchAllWorker = () => {
    AuthAPI.findWorker({ username: 'username' })
      .then(res => {
        const { username, blockchainAddress } = res.data;
        setTableData([
          { profilePic: 'profile1', username, blockchainAddress, status: 0 }
        ]);
      })
      .catch(err => console.log('Error Occur', err));
  };

  // ----------------------- USEEFFECT------------------------
  //Component Did Mount
  useEffect(() => {
    fetchAllWorker();
  }, []);

  // For Debugging
  useEffect(() => {
    console.log('Table Data', tableData);
  }, [tableData]);

  return (
    <div>
      <div className="content-header">
        <h2 className="m0">Worker</h2>
        <Button
          className="icon-flex"
          type="primary"
          icon={<PlusCircleOutlined />}
          size="middle"
          shape="round"
          onClick={() => setVisible(true)}
        >
          Add Worker
        </Button>
      </div>
      <div className="content">
        <Table columns={columns} dataSource={tableData} />
      </div>
      <Modal
        title="Add Worker"
        visible={visible}
        okText="Submit"
        cancelText="Cancel"
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              onCreate(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={() => setVisible(false)}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          size={'middle'}
        >
          <Form.Item
            name={['worker', 'username']}
            label="Name"
            rules={[{ required: true, message: 'Please input an username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['worker', 'password']}
            label="Password"
            rules={[{ required: true, message: 'Please input a password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name={['worker', 'blockchainAddress']}
            label="Blockchain Address"
            rules={[
              { required: true, message: 'Please input a blockchain address!' }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default HumanResource;
