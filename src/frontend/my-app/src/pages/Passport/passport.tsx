import React, { useEffect } from 'react';
import * as PassportAPI from '../../webservice/passport';
import { Button, Modal, Form, Input, DatePicker, Empty, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import PassportDetail from '../../component/PassportDetail';

require('./passport.scss');

interface Passport {
  passportUUID: string;
  name: string;
  dateOfBirth: string;
  ic: string;
  address: string;
}

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
      dateOfBirth: values.passport.dateOfBirth.format('YYYY-MM-DD'),
    })
      .then((res) => {
        setVisible(false);
        console.log(res.data);
        message.success('Passport Created');
        // use the UUID to search for the new passport
      })
      .catch((err) => message.error('Fail to create passport'));
  };

  const searchPassport = (uuid: string) => {
    PassportAPI.searchPassport({ passportUUID: uuid })
      .then((res) => {
        setPassportInfo(res.data);
      })
      .catch((err) => message.error('Fail to find passport'));
  };

  const freezePassport = () => {
    const uuid = passportInfo ? passportInfo.passportUUID : '';
    PassportAPI.freezePassport({ passportUUID: uuid })
      .then((res) => {
        console.log(res.data);
        message.success('Passport Freeze');
      })
      .catch((err) => message.error('Fail to freeze passport'));
  };

  // ----------------------- USEEFFECT------------------------
  //Component Did Mount
  useEffect(() => {
    //searchPassport('d60434aa-7fb3-48c6-bac5-77d6761f0a7c');
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
          // shape="round"
          onClick={() => setVisible(true)}
        >
          Create Passport
        </Button>
      </div>
      <div className="content">
        <div className="search-bar">
          <Input.Search
            className="search"
            placeholder="Enter Passport Number"
            onSearch={(value) => searchPassport(value)}
            enterButton
          />
          <Button
            className="icon-flex"
            type="danger"
            size="middle"
            disabled={passportInfo === null}
            onClick={() => freezePassport()}
          >
            Freeze Passport
          </Button>
        </div>
        <div className="content-passport">
          {passportInfo === null ? (
            <Empty />
          ) : (
            <PassportDetail passportInfo={passportInfo} country={'SG'} />
          )}
        </div>
      </div>
      <Modal
        title="Create Passport"
        visible={visible}
        okText="Submit"
        cancelText="Cancel"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
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
