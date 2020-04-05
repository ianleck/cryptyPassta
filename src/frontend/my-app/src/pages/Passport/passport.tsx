import React, { useEffect } from 'react';
import * as PassportAPI from '../../webservice/passport';
import { Button, Modal, Form, Input, DatePicker, Empty } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

require('./passport.scss');

interface Passport {
  passportUUID: string;
  name: string;
  dateOfBirth: string;
  ic: string;
  address: string;
}

const sampleData = {
  passportUUID: '08e78f3d-3038-4f26-b011-c235d69661d8',
  name: 'Yuan Rong',
  dateOfBirth: '1995-07-28',
  ic: 'S9876543A',
  address: 'Blk 99 Singapore River #99-00 S(990099)'
};

function Passport() {
  // ----------------------- STATE------------------------
  const [passportInfo, setPassportInfo] = React.useState<Passport | null>(null);
  const [visible, setVisible] = React.useState<boolean>(false);
  const [form] = Form.useForm();

  // ----------------------- Function ------------------------
  const onCreate = (values: any) => {
    PassportAPI.createPassport({
      passportUUID: '',
      ...values.passport,
      dateOfBirth: values.passport.dateOfBirth.format('YYYY-MM-DD')
    })
      .then(res => {
        setVisible(false);
        console.log(res.data);
        // use the UUID to search for the new passport
      })
      .catch(err => console.log('Error Occur', err));
  };

  const searchPassport = (uuid: string) => {
    PassportAPI.searchPassport({ passportUUID: uuid })
      .then(res => {
        setPassportInfo(res.data);
      })
      .catch(err => console.log('Error Occur', err));
  };

  // ----------------------- USEEFFECT------------------------
  //Component Did Mount
  useEffect(() => {
    //setPassportInfo(sampleData);
  }, []);

  return (
    <div>
      <div className="content-header">
        <h2 className="m0">Passport</h2>
        <Button
          className="icon-flex"
          type="primary"
          icon={<PlusCircleOutlined />}
          size="middle"
          shape="round"
          onClick={() => setVisible(true)}
        >
          Create Passport
        </Button>
      </div>
      <div className="content">
        <Input.Search
          className="search"
          placeholder="Enter Passport Number"
          onSearch={value => searchPassport(value)}
          enterButton
        />
        <div className="content-passport">
          {passportInfo === null ? (
            <Empty />
          ) : (
            <div className="passport">
              <div className="passport-photo"></div>
              <div className="passport-details"></div>
            </div>
          )}
        </div>
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
            name={['passport', 'name']}
            label="Name"
            rules={[{ required: true, message: 'Please input a name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['passport', 'dateOfBirth']}
            label="Date Of Birth"
            rules={[{ required: true, message: 'Please input date of birth!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name={['passport', 'ic']}
            label="Identity Card No"
            rules={[{ required: true, message: 'Please input an IC!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name={['passport', 'address']}
            label="Address"
            rules={[{ required: true, message: 'Please input an address!' }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Passport;
