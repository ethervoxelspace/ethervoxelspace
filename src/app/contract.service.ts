import { Injectable } from '@angular/core';
import *  as Eth from 'ethjs';
import { ABI } from './abi';
declare var web3;

@Injectable()
export class ContractService {

  private contract;
  constructor() { 
              // Checking if Web3 has been injected by the browser (Mist/MetaMask)
              if (typeof web3 !== 'undefined') {
    
                // Use the browser's ethereum provider
                var provider = web3.currentProvider;
                const eth = new Eth(web3.currentProvider);
    
                
                
                this.contract = eth.contract(ABI).at('0xEdC3C30b481ad5B349456Db16d469A960e9bCCB0');
            
              } else {
                console.log('No web3? You should consider trying MetaMask!')
              }
  }

  getExistingVoxel(x, y, z, callback) {
    //let existingVoxelArray = [];
    /*
    for (let x = 499; x < 502; x++) {
      for (let y = 499; y < 502; y++) {
        for (let z = 499; z < 502; z++) {
        }
      }
    }
    */
    this.contract.world(x,y,x).then((result) => {
      if (result.owner !== '0x0000000000000000000000000000000000000000') {
        //existingVoxelArray.push([x,y,z, result.material.words[0]]);

          callback(true);
        
      }
    });
  }

}
