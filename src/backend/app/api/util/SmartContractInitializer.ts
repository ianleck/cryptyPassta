import { readJSON } from '../util/FileReader';
import { AbiItem } from 'web3-utils';
import path = require('path');
import Web3 from 'web3';

export async function getPassportContract(
  web3: Web3,
  passportContractAddress: string | undefined
) {
  const smartContract: string = await readJSON(
    path.resolve(__dirname, '../../../smartcontractabi/Passport.json')
  );
  const passportAddress: string = passportContractAddress ?? '';
  if (smartContract !== '' && passportAddress !== '') {
    const PassportContract = new web3.eth.Contract(
      JSON.parse(smartContract).abi as AbiItem,
      passportAddress
    );
    // const g = await PassportContract.methods.abc().call({
    //   from: process.env.COUNTRY_BLOCKCHAIN_ADDRESS
    // });
    return PassportContract;
  } else {
    throw new Error('Cannot connect to passport smart contract');
  }
}

export async function getGlobalContract(
  web3: Web3,
  globalContractAddress: string | undefined
) {
  const smartContract: string = await readJSON(
    path.resolve(__dirname, '../../../smartcontractabi/Global.json')
  );
  const globalAddress: string = globalContractAddress ?? '';
  if (smartContract !== '' && globalAddress !== '') {
    const GlobalContract = new web3.eth.Contract(
      JSON.parse(smartContract).abi as AbiItem,
      globalAddress
    );
    // const g = await PassportContract.methods.abc().call({
    //   from: process.env.COUNTRY_BLOCKCHAIN_ADDRESS
    // });
    return GlobalContract;
  } else {
    throw new Error('Cannot connect to global smart contract');
  }
}
