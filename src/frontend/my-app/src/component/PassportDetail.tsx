import React, { useEffect } from 'react';
import { EditOutlined } from '@ant-design/icons';

require('./passportDetail.scss');

function PassportDetails(props: any) {
  const { passportInfo, country } = props;
  return (
    <React.Fragment>
      <div className="passport">
        <div className="passport-img">
          <h4 className="title">PASSPORT</h4>

          <img
            src={require('../images/Passport/passportProfile2.jpg')}
            height="350px"
          />
        </div>
        <div className="passport-details">
          <h4>
            {country === 'SG' ? 'REPUBLIC OF SINGAPORE' : 'OTHER COUNTRY'}
          </h4>
          <p className="title">Passport No</p>
          <h5>{passportInfo.passportUUID}</h5>
          <p className="title">Name</p>
          <h5>{passportInfo.name}</h5>
          <p className="title">Date Of Birth</p>
          <h5>{passportInfo.dateOfBirth}</h5>
          <p className="title">Identity Card Number</p>
          <h5>{passportInfo.ic}</h5>
          <p className="title">Address</p>
          <h5>{passportInfo.address}</h5>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PassportDetails;
