import database = require('firebase');
import { WorkerEntity } from '../model/WorkerEntity';

export interface IPassportDao {
  findAllWorkers(): Promise<WorkerEntity[]>;
}

class PassportDao implements IPassportDao {
  constructor() {}

  findAllWorkers(): Promise<WorkerEntity[]> {
    var promise = new Promise<WorkerEntity[]>(function(resolve, reject) {
      // do a thing, possibly async, then…
      if (true) {
        resolve([]);
      } else {
        reject(Error('It broke'));
      }
    });
    return promise;
  }
}
