import React from 'react';
import { Button, Input, Empty, message } from 'antd';
import * as PassportAPI from '../../webservice/passport';
import PassportDetail from '../../component/PassportDetail';

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

  // ----------------------- Function ------------------------
  const searchPassport = (uuid: string) => {
    PassportAPI.searchPassport({ passportUUID: uuid })
      .then((res) => {
        setPassportInfo(res.data);
      })
      .catch((err) => message.error(err));
  };

  return (
    <div>
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
          <Button
            className="action-button"
            type="primary"
            size="middle"
            // onClick={() => setVisible(true)}
          >
            Approve
          </Button>
          <Button
            type="danger"
            size="middle"
            // onClick={() => freezePassport()}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

export default Custom;
