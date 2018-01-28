import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { ABI } from './ABI';

@Injectable()
export class ContractService {

  private contract;
  private provider;
  private web3;

  private price;
  private contractAddress = '0x202cF3B3a1dBAFafB342079aE19eF531907D7EAF';

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
      // this.web3 = new Web3(Web3.givenProvider);
      // this.contract = new this.web3.eth.Contract(ABI, this.contractAddress);
      // this.price = this.web3.utils.toWei(0.0001, 'ether');
    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }


  public VoxelPlacedEvent() {
    return this.contract.events.VoxelPlaced();
  }

  /*
  public VoxelRepaintedEvent() {
    return this.contract.VoxelRepainted();
  }
  public VoxelDestroyedEvent() {
    return this.contract.VoxelDestroyed();
  }
  public VoxelTransferredEvent() {
    return this.contract.VoxelTransfered();
  }
  */

  getUserAccount(): string {
    return this.web3.eth.accounts[0];
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
    this.contract.getPastEvents('allEvents', (error, allPastEvents) => {
      callback(allPastEvents);
    });
  }

  placeVoxel(x, y, z, m, cb) {
    /*
    this.contract.placeVoxel(x, y, z, m, {
      'from': this.getUserAccount(),
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
    */
    this.contract.methods.placeVoxel(x, y, z, m).send({
      from: this.getUserAccount(),
      value: this.price
    })
    .then(function (receipt) {
      cb();
    })
    .catch((e) => { cb(e); });
  }
  destroyVoxel(x, y, z, cb) {
    this.contract.destroyVoxel(x, y, z, {
      'from': this.getUserAccount(),
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }
  repaintVoxel(x, y, z, newMatarial, cb) {
    this.contract.repaintVoxel(x, y, z, newMatarial, {
      'from': this.getUserAccount(),
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }
  transferVoxel(to, x, y, z, cb) {
    this.contract.repaintVoxel(to, x, y, z, {
      'from': this.getUserAccount(),
      'value': this.price
    }, (error, result) => {
      cb(error);
    });
  }


}
