import axios from 'axios';

export function createPassport(passport: Object) {
  var link = `/passport/createPassport`;

  return axios.post(link, passport, {
    headers: { authorization: 'Bearer ' + sessionStorage.getItem('session') }
  });
}

export function searchPassport(uuid: Object) {
  var link = `/passport/searchPassport`;

  return axios.get(link, {
    params: uuid,
    headers: { authorization: 'Bearer ' + sessionStorage.getItem('session') }
  });
}
