import { Injectable } from '@angular/core';
import * as Web3 from 'web3';
import { ABI } from './ABI';

@Injectable()
export class ContractService {

  private contract;
  private provider;
  private web3;

  private price = web3.toWei(0.0001, 'ether');
  private contractAddress = '0xEdC3C30b481ad5B349456Db16d469A960e9bCCB0';

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
      this.contract = this.web3.eth.contract(ABI).at(this.contractAddress);

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

  getUserAccount(): string {
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
        console.error(errorPlaced);
      } else {
        this.contract.VoxelRepainted({}, { fromBlock: 0, toBlock: 'latest' }).get((errorRepainted, eventResultRepainted) => {
          if (errorRepainted) {
            console.error(errorRepainted);
          } else {
            this.contract.VoxelDestroyed({}, { fromBlock: 0, toBlock: 'latest' }).get((errorDestroyed, eventResultDestroyed) => {
              if (errorDestroyed) {
                console.error(errorDestroyed);
              } else {
                this.contract.VoxelTransfered({}, { fromBlock: 0, toBlock: 'latest' }).get((errorTransfered, eventResultTransfered) => {
                  if (errorDestroyed) {
                    console.error(errorTransfered);
                  } else {
                    callback(eventResultPlaced.concat(eventResultRepainted).concat(eventResultDestroyed).concat(eventResultTransfered));
                  }
                });
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
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }
  destroyVoxel(x, y, z, cb) {
    this.contract.destroyVoxel(x, y, z, {
      'from': web3.eth.accounts[0],
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }
  repaintVoxel(x, y, z, newMatarial, cb) {
    this.contract.repaintVoxel(x, y, z, newMatarial, {
      'from': web3.eth.accounts[0],
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }
  transferVoxel(to, x, y, z, cb) {
    this.contract.repaintVoxel(to, x, y, z, {
      'from': web3.eth.accounts[0],
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }


}
