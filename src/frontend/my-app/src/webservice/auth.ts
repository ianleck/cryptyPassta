import axios from 'axios';

export function login(userData: Object) {
  var link = `/auth/login`;

  return axios.get(link, {
    params: userData
  });
}
