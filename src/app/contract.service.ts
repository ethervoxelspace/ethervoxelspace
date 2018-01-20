import { Injectable } from '@angular/core';
import *  as Web3 from 'web3';
import { ABI } from './abi';
declare var web3;

@Injectable()
export class ContractService {

  private contract;
  private provider;
  private web3;
  constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use the browser's ethereum provider
      this.provider = web3.currentProvider;
      this.web3 = new Web3(web3.currentProvider);
      this.contract = this.web3.eth.contract(ABI).at('0x2CC25bDaBD264aB306d47938F3c701A6dF0e883A');

      this.contract.VoxelPlaced().watch((error, response) => {
        console.log("EVENT - VOXEL PLACED: ", response);
      });

    } else {
      console.log('No web3? You should consider trying MetaMask!')
    }
  }

  getExistingVoxel(x, y, z, callback) {
    this.contract.world(x, y, z, (error, result) => {
      if (result[1] !== '0x0000000000000000000000000000000000000000') {
        callback(true);
      } else {
        callback(false);
      }
    });
  }

  placeVoxel(x, y, z, m) {
      this.contract.placeVoxel(x, y, z, m, {
        "from": web3.eth.accounts[0],
        "value": web3.toWei(0.0001, "ether")
      }, (error, result) => {
        console.log("voxel placed");
      });
  }

}
