import axios from 'axios';

export function login(userData: Object) {
  var link = `/auth/login`;

  return axios.get(link, {
    params: userData
  });
}

export function findWorker(username: Object) {
  var link = `/auth/findWorker`;

  return axios.get(link, {
    params: username
  });
}

export function createWorker(worker: Object) {
  var link = `/auth/createWorker`;

  return axios.post(link, worker);
}