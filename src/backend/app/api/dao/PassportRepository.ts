import { database } from "../../server";

function findPassport(passportUUID: string): Promise<object> {
  return new Promise<object>(function (resolve, reject) {
    database
      .ref("passport/" + passportUUID)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) resolve(snapshot.val());
        else reject(Error("Unable to find passport"));
      });
  });
}

function findPassportByNationalIC(passportIC: string): Promise<object> {
  return new Promise<object>(function (resolve, reject) {
    database
      .ref("passport")
      .orderByChild("ic")
      .equalTo(passportIC)
      .once("value")
      .then(function (snapshot) {
        if (snapshot.val()) {
          //get first child key
          let key = Object.keys(snapshot.val());
          resolve(snapshot.child(key[0]).val());
        } else reject(Error("Unable to find passport"));
      });
  });
}

function createPassport(
  pasport: object,
  passportUUID: string
): Promise<boolean> {
  return new Promise<boolean>(function (resolve, reject) {
    //check passport exists
    database
      .ref("passport/" + passportUUID)
      .once("value")
      .then((snapshot) => {
        if (snapshot.val()) reject(Error("Passport has already been created"));
        else {
          return database
            .ref("passport/" + passportUUID)
            .set(pasport)
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              reject(Error("Synchronization failed " + error));
            });
        }
      })
      .catch((error) => {
        reject(Error("Unable to contact server: " + error));
      });
  });
}

export { findPassport, createPassport, findPassportByNationalIC };
