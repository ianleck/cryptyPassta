import axios from "axios";

export function login(userData: Object) {
  var link = `/auth/login`;

  return axios.get(link, {
    params: userData,
  });
}

export function findWorker(username: Object) {
  var link = `/auth/findWorker`;

  return axios.get(link, {
    params: username,
  });
}

export function findAllWorkers() {
  var link = `/auth/findAllWorkers`;

  return axios.get(link);
}

export function createWorker(worker: Object) {
  var link = `/auth/createWorker`;

  return axios.post(link, worker);
}

export function freezeWorker(username: Object) {
  var link = `/auth/freezeWorker`;

  return axios.post(link, null, { params: username });
}

export function viewWorkerFreezeStatus(username: Object) {
  var link = `/auth/viewWorkerFreezeStatus`;

  return axios.get(link, {
    params: username,
  });
}
