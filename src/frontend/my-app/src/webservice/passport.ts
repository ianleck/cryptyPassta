import axios from "axios";

export function createPassport(passport: Object) {
  var link = `/passport/createPassport`;

  return axios.post(link, passport, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
  });
}

export function searchPassport(uuid: Object) {
  var link = `/passport/searchPassport`;

  return axios.get(link, {
    params: uuid,
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
  });
}

export function freezePassport(uuid: Object) {
  var link = `/passport/freezePassport`;

  return axios.post(link, uuid, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
  });
}

export function getCountryList() {
  var link = `/passport/getCountryList`;

  return axios.get(link, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
  });
}

export function departTraveler(payload: Object) {
  var link = `/passport/travelerDeparture`;

  return axios.post(link, payload, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
  });
}

export function acceptTraveler(payload: Object) {
  var link = `/passport/acceptTraveler`;

  return axios.post(link, null, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
    params: payload,
  });
}

export function rejectTraveler(payload: Object) {
  var link = `/passport/rejectTraveler`;

  return axios.post(link, null, {
    headers: { authorization: "Bearer " + sessionStorage.getItem("session") },
    params: payload,
  });
}
