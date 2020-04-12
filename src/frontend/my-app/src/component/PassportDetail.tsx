import React, { useEffect } from "react";
import { EditOutlined } from "@ant-design/icons";
import * as PassportAPI from "../webservice/passport";
import { message } from "antd";
import moment from "moment";

require("./passportDetail.scss");

function PassportDetails(props: any) {
  const { passportInfo, country } = props;
  const [countryList, setCountryList] = React.useState<string[]>([]);

  // ----------------------- USEEFFECT------------------------
  //Component Did Mount
  useEffect(() => {
    PassportAPI.getCountryList()
      .then((res) => {
        const formatted = Object.keys(res.data).reduce((ret: any, key: any) => {
          ret[res.data[key]] = key;
          return ret;
        }, {});
        console.log("FORMATTED", formatted);
        setCountryList(formatted);
      })
      .catch((err) => message.error(err));
  }, []);

  return (
    <React.Fragment>
      <div className="passport">
        <div className="passport-img">
          <h4 className="title">PASSPORT</h4>

          <img
            src={require("../images/Passport/passportProfile2.jpg")}
            height="350px"
          />
        </div>
        <div className="passport-details">
          <h4>
            {country === "SG" ? "REPUBLIC OF SINGAPORE" : "OTHER COUNTRY"}
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
        <div className="passport-history">
          <h4>Travel History</h4>
          {passportInfo.travelRecord.map((r: any) => (
            <p>
              <span className="title">[{r[1]}]</span> {countryList[r[0]]}{" "}
              {moment.unix(r[2]).format("YYYY-MM-DD")}
            </p>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

export default PassportDetails;
