import { PassportContract } from '../../server';

export { getPassport };

async function getPassport() {
  const g = await PassportContract.methods.abc().call();
  console.log(g);
  return g;
}
