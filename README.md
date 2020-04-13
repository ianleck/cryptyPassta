# cryptyPassta

Crypto passport

## About

A digital passport that runs on the blockchain which allows travelers to access their passport on a web application without the need for a physical passport. For every traveler, their information and travel records will be digitized. By leveraging on blockchain's technology, we are making passports more secure and more portable than ever before, solving problems for both the government and travelers.

## Usage

A proof-of-concept for digital passports. The idea is to show that it is possible to have a global smart contract and a passport smart contract that will allow countries to converse and take advantage of the blockchain technology while ensuring that key personal information is secure on off-chain database. This repo will allow you to simulate travel between countries, as managed by customs staff, and to view a basic digital passport on your mobile device.

## Deployment

Navigate to cryptyPassta root folder.

1. Run `npm install` to ensure that you have the dependencies required.
2. Run `npm run start:blockchain`
3. Run `npm run replace:mac` if you're on Mac, or `npm run replace:linux` if you're using Linux
   (If you are using Windows, you will have to manually copy the Smart Contract addresses from root folder's `global_address` and `passport_address` to `src/backend/.env`'s `GLOBAL_CONTRACT_ADDRESS` and `PASSPORT_CONTRACT_ADDRESS` respectively)
4. Run `npm run start:main-app`
   Ensure that `COUNTRY_BLOCKCHAIN_APP=0x9f6682cA19e2D3adbCD5B680f5a24aEc3372Db87` on `.env` before you proceed
5. Go to http://remix.ethereum.org, import the Passport.abi from root folder.
6. Open Passport.abi, and change Environment to Web3 Provider and use `localhost:9418`.
7. Use your passport address to deploy. You can obtain your passport address from `.env` in `src/backend` folder under `PASSPORT_CONTRACT_ADDRESS`.
8. Click on `setGlobalAddress`, and provide global contract address from `.env` in `src/backend` folder under `GLOBAL_CONTRACT_ADDRESS`.
9. Register country with `registerCountry`. You can get country address from `COUNTRY_BLOCKCHAIN_ADDRESS` in `.env` and register it with a countryCode; `SG` for example.
10. Download Postman at https://www.postman.com/downloads/ if you do not already have it.
11. Go to Postman and POST `localhost:4000/auth/createWorker` with the body
    ```{ "username": "admin", 
         "password": "password", 
         "blockchainAddress" : "0x86be593351645555ece62d4298BD53CacA4Ca58a" 
         }``` 
to create admin account on frontend. This account will allow you to login on `localhost:3000` in order to add worker, passport and perform passport travel control.
You will now be able to start using and testing our application.

If you wish to test travelling to another "Country", you will need to duplicate the backend and frontend folders.
You will then need to make several changes to the code to ensure that they do not hit the same ports/databases.

1. Change Firebase Credentials (You can use your own Firebase Credentials), `COUNTRY_BLOCKCHAIN_ACCOUNT_ADDRESS` in `.env`. Please take note NOT to use the first 2 addresses (Owner of global smart contract and SG)
2. Go to `src/backend/app/api/server.ts` and change your port on line 18 to 4001.
3. Go to `src/frontend/my-app/package.json` and change your port proxy on line 46 to 4001
4. You can now run through steps 8 and 9. Take note to change the ports on Postman when creating admin account on new database, and to visit the right port for your second country.

To initialise our mobile application, you will need to have the appropriate app launcher for your OS: Android Studio for Linux and Windows, and Xcode or Android Studio for Mac.

1. Once you have the mobile application launcher set-up, launch an instance of the mobile launcher.
2. Navigate to `src/mobile` and run `flutter run`. This will launch the app on your mobile launcher.
