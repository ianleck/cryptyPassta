import database = require('firebase');
import { WorkerEntity } from '../model/WorkerEntity';

class PassportRepository {
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
