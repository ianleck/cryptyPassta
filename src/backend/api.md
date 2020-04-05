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
- Provide JSON Body

## POST /passport/freezePassport?passportUUID=passportUUID

- Freeze Passport

## GET /passport/searchPassport?passportUUID=passportUUID

- Search Passport

## GET /passport/viewPassportContractEvents

- View passport contract events

## GET /passport/viewGlobalContractEvents

- View global contract events
