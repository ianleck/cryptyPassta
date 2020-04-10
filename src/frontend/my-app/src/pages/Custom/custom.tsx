import React, { useEffect } from 'react';
import { Button, Input, Empty, message, Tabs, Modal, Form, Select } from 'antd';
import * as PassportAPI from '../../webservice/passport';
import PassportDetail from '../../component/PassportDetail';
const { TabPane } = Tabs;
const { Option } = Select;

require('./custom.scss');

interface Passport {
  passportUUID: string;
  name: string;
  dateOfBirth: string;
  ic: string;
  address: string;
}

function Custom() {
  // ----------------------- STATE------------------------
  const [passportInfo, setPassportInfo] = React.useState<Passport | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>('1');
  const [visible, setVisible] = React.useState<boolean>(false);
  const [countryList, setCountryList] = React.useState<string[]>([]);
  const [form] = Form.useForm();

  // ----------------------- Function ------------------------
  const searchPassport = (uuid: string) => {
    PassportAPI.searchPassport({ passportUUID: uuid })
      .then((res) => {
        setPassportInfo(res.data);
      })
      .catch((err) => message.error(err));
  };

  const departTraveller = (values: any) => {
    if (passportInfo != null)
      PassportAPI.departTraveler({
        passportUUID: passportInfo.passportUUID,
        ...values.details,
      })
        .then((res) => {
          // setVisible(false);
          console.log(res.data);
          message.success('Traveller departed');
          setPassportInfo(null);
          // use the UUID to search for the new passport
        })
        .catch((err) => message.error(err));
  };

  const approveTraveller = () => {
    if (passportInfo != null) {
      PassportAPI.acceptTraveler({
        passportUUID: passportInfo.passportUUID,
      })
        .then((res) => {
          message.success('Traveller approved');
          setPassportInfo(null);
        })
        .catch((err) => message.error(err));
    }
  };

  const rejectTravller = () => {
    if (passportInfo != null) {
      PassportAPI.rejectTraveler({
        passportUUID: passportInfo.passportUUID,
      })
        .then((res) => {
          message.success('Traveller rejected');
          setPassportInfo(null);
        })
        .catch((err) => message.error(err));
    }
  };

  // ----------------------- USEEFFECT------------------------
  //Component Did Mount
  useEffect(() => {
    PassportAPI.getCountryList()
      .then((res) => {
        setCountryList(Object.keys(res.data));
      })
      .catch((err) => message.error(err));
  }, []);

  return (
    <React.Fragment>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          setPassportInfo(null);
        }}
      >
        <TabPane tab="Departure" key="1"></TabPane>
        <TabPane tab="Arrival" key="2"></TabPane>
      </Tabs>
      <div className="mt-3">
        <div className="content-header">
          <h2 className="m0">Custom</h2>
          <Input.Search
            className="search"
            placeholder="Enter Passport Number"
            onSearch={(value) => searchPassport(value)}
            enterButton
          />
        </div>
        <div className="content-passport">
          {passportInfo === null ? (
            <Empty />
          ) : (
            <PassportDetail passportInfo={passportInfo} country={'SG'} />
          )}
        </div>
        {passportInfo !== null && (
          <div className="content-footer">
            {activeTab === '1' ? (
              <React.Fragment>
                <Button
                  className="action-button"
                  type="primary"
                  size="middle"
                  onClick={() => setVisible(true)}
                >
                  Depart
                </Button>
                <Button
                  className="action-button"
                  type="default"
                  size="middle"
                  onClick={() => setPassportInfo(null)}
                >
                  Clear
                </Button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Button
                  className="action-button"
                  type="primary"
                  size="middle"
                  onClick={() => approveTraveller()}
                >
                  Approve
                </Button>
                <Button
                  type="danger"
                  size="middle"
                  onClick={() => rejectTravller()}
                >
                  Reject
                </Button>
              </React.Fragment>
            )}
          </div>
        )}
      </div>
      <Modal
        title="Depart Traveller"
        visible={visible}
        okText="Submit"
        cancelText="Cancel"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              departTraveller(values);
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
            name={['details', 'countryList']}
            label="Country list"
            rules={[
              { required: true, message: 'Please select at least one country' },
            ]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"
            >
              {countryList.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  );
}

export default Custom;
