import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { ABI } from './ABI';

@Injectable()
export class ContractService {

  private contract;
  private provider;
  private web3;

  public colorArray = [
    0x000000,
    0x1D2B53,
    0x7E2553,
    0x008751,
    0xAB5236,
    0x5F574F,
    0xC2C3C7,
    0xFFF1E8,
    0xFF004D,
    0xFFA300,
    0xFFEC27,
    0x00E436,
    0x29ADFF,
    0x83769C,
    0xFF77A8,
    0xFFCCAA,
  ];

  constructor() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use the browser's ethereum provider
      this.provider = web3.currentProvider;
      this.web3 = new Web3(web3.currentProvider);
      this.contract = this.web3.eth.contract(ABI).at('0x2CC25bDaBD264aB306d47938F3c701A6dF0e883A');

    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }

  public VoxelPlacedEvent() {
    return this.contract.VoxelPlaced();
  }
  public VoxelRepaintedEvent() {
    return this.contract.VoxelRepainted();
  }
  public VoxelDestroyedEvent() {
    return this.contract.VoxelDestroyed();
  }
  public VoxelTransferredEvent() {
    return this.contract.VoxelTransfered();
  }

  getUserAccount() {
    return web3.eth.accounts[0];
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

  getWorldFromPastEvents(callback) {
    this.contract.VoxelPlaced({}, { fromBlock: 0, toBlock: 'latest' }).get((errorPlaced, eventResultPlaced) => {
      if (errorPlaced) {
        console.log(errorPlaced);
      } else {
        this.contract.VoxelRepainted({}, { fromBlock: 0, toBlock: 'latest' }).get((errorRepainted, eventResultRepainted) => {
          if (errorRepainted) {
            console.log(errorRepainted);
          } else {
            this.contract.VoxelDestroyed({}, { fromBlock: 0, toBlock: 'latest' }).get((errorDestroyed, eventResultDestroyed) => {
              if (errorDestroyed) {
                console.log(errorDestroyed);
              } else {
                callback(eventResultPlaced.concat(eventResultRepainted).concat(eventResultDestroyed));
              }
            });
          }
        });
      }
    });


  }

  placeVoxel(x, y, z, m, cb) {
    this.contract.placeVoxel(x, y, z, m, {
      'from': web3.eth.accounts[0],
      'value': web3.toWei(0.0001, 'ether')
    }, (error, result) => {
      console.log('voxel placed');
      cb(error);
    });
  }
  destroyVoxel(x, y, z, cb) {
    this.contract.destroyVoxel(x, y, z, {
      'from': web3.eth.accounts[0],
    }, (error, result) => {
      console.log('voxel destroyed');
      cb(error);
    });
  }
  repaintVoxel(x, y, z, newMatarial, cb) {
    this.contract.repaintVoxel(x, y, z, newMatarial, {
      'from': web3.eth.accounts[0],
    }, (error, result) => {
      console.log('voxel repainted');
      cb(error);
    });
  }
  transferVoxel(to, x, y, z, cb) {
    this.contract.repaintVoxel(to, x, y, z, {
      'from': web3.eth.accounts[0],
    }, (error, result) => {
      console.log('voxel transfered');
      cb(error);
    });
  }


}
