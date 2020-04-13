# `/auth`

## GET /auth/findAllWorkers

- Find all workers

## GET /auth/findWorker?username=username

- Find worker

## POST /auth/createWorker

- Create worker
- Provide JSON Body

## GET /auth/login?username=username&password=password

- Login Worker
- Return JWT

## GET /auth/validateUser

- to validate user
- maybe not used

## POST /auth/freezeWorker?username=username

- to freeze worker

## GET /auth/viewWorkerFreezeStatus

- to view worker freeze status

# `/passport`

### for passport, we need to validate = put jwt token in header

## POST /passport/createPassport

- Create Passport
- Provide JSON Body:

        {
          "passportUUID": "LEAVE BLANK",
          "name": "Shan Jing",
          "dateOfBirth": "1990-10-10",
          "ic": "S1234567D",
          "address": "SOME ADDRESS"
        }

## POST /passport/freezePassport?passportUUID=passportUUID

- Freeze Passport

## GET /passport/searchPassport?passportUUID=passportUUID

- Search Passport

## GET /passport/getCountryList

- Get list of country names + address, use country name for departure;

## POST /passport/travelerDeparture

- Set a passport to departure from the country
- Provide JSON body as such:

      {
          "passportUUID": "c79f5faf-bf98-4897-861d-42d4dc987e86",
          "countryList": [
              "SG",
              "MY"
          ]
      }

## POST /passport/acceptTraveler?passportUUID=passportUUID

- Accept a traveler that is travelling to your country

## POST /passport/rejectTraveler?passportUUID=passportUUID

- Reject a traveler that is travelling to your country

## GET /passport/viewPassportContractEvents

- View passport contract events

## GET /passport/viewGlobalContractEvents

- View global contract events
