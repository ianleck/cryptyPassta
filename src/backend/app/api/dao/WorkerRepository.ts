import { database } from '../../server';

function findAllWorkers(): Promise<object[]> {
	return new Promise<object[]>(function (resolve, reject) {
		database.ref('workers/').once('value').then(function (snapshot) {
			if (snapshot.val())
				resolve(snapshot.val());
			else
				reject(Error("Database error"));
		});
	});
}

function findWorker(username: string): Promise<object> {
	return new Promise<object>(function (resolve, reject) {

		database.ref('workers/' + username).once('value').then(function (snapshot) {
			if (snapshot.val())
				resolve(snapshot.val());
			else
				reject(Error("Unable to find worker"));
		});
	});
}


function createWorker(worker: object, workerUsername: string): Promise<boolean> {
	return new Promise<boolean>(function (resolve, reject) {

		//check worker exists
		database.ref('workers/' + workerUsername).once('value')
			.then((snapshot) => {
				if (snapshot.val())
					reject(Error("User has already been created"));
				else {
					return database.ref('workers/' + workerUsername).set(worker)
						.then(() => {
							resolve(true);
						}).catch((error) => {
							reject(Error("Synchronization failed " + error));
						});
				}
			})
			.catch((error) => {
				reject(Error("Unable to contact server: " + error));
			});
	});
}

export { findAllWorkers, findWorker, createWorker };