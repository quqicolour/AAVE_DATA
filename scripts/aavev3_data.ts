const hre = require("hardhat");

import {
  UiPoolDataProvider,
  UiIncentiveDataProvider,
  ChainId,
} from '@aave/contract-helpers';
import * as markets from '@bgd-labs/aave-address-book';
import { ethers } from 'ethers';
import dayjs from 'dayjs';

async function main() {


  const currentTimestamp = dayjs().unix();
  console.log("currentTimestamp:", currentTimestamp);

  const provider = new ethers.providers.JsonRpcProvider(
    'https://eth-mainnet.public.blastapi.io',
  );
  
  // User address to fetch data for, insert address here
  const currentAccount = '0x464C71f6c2F760DdA6093dCB91C24c39e5d6e18c';
  
  // View contract used to fetch all reserves data (including market base currency data), and user reserves
  // Using Aave V3 Eth Mainnet address for demo
  const poolDataProviderContract = new UiPoolDataProvider({
    uiPoolDataProviderAddress: markets.AaveV3Ethereum.UI_POOL_DATA_PROVIDER,
    provider,
    chainId: ChainId.mainnet,
  });
  
  // View contract used to fetch all reserve incentives (APRs), and user incentives
  // Using Aave V3 Eth Mainnet address for demo
  const incentiveDataProviderContract = new UiIncentiveDataProvider({
    uiIncentiveDataProviderAddress:
      markets.AaveV3Ethereum.UI_INCENTIVE_DATA_PROVIDER,
    provider,
    chainId: ChainId.mainnet,
  });

  async function fetchAllReserveIncentives(){
    try{
      const getFullReservesIncentiveData=await incentiveDataProviderContract.getFullReservesIncentiveData(
        { 
          user: currentAccount,
          lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
        }
      );
      console.log("getFullReservesIncentiveData:",getFullReservesIncentiveData[0][0].aIncentiveData);
      return getFullReservesIncentiveData;
    }catch(e){
      console.log("fetchAllReserveIncentives:", fetchAllReserveIncentives);
    }
  }
  
  async function fetchContractData() {
    // Object containing array of pool reserves and market base currency data
    // { reservesArray, baseCurrencyData }
    try{
      const reserves = await poolDataProviderContract.getReservesHumanized({
        lendingPoolAddressProvider: markets.AaveV3Ethereum.POOL_ADDRESSES_PROVIDER,
      });

      const indexReserves = reserves.reservesData[3];
      console.log("indexReserves:",indexReserves);
      return indexReserves;
    }catch(e){
      console.log("fetchContractData error:",e);
    }
  }
  await fetchContractData();

  // await fetchAllReserveIncentives();

  //返回储备数据 getReservesData

  //获取pool暂停状态  getPaused(address asset) 

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});