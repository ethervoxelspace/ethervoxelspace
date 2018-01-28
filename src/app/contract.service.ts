import { Injectable } from '@angular/core';
import Web3 = require('web3');
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
    this.injectWeb3Provider();
  }


  injectWeb3Provider() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // web3/index.d.ts 'export' -> '='
      this.web3 = new Web3(Web3.givenProvider);
      this.contract = new this.web3.eth.Contract(ABI, this.contractAddress, {
        from: this.getUserAccount()
      });
      this.price = this.web3.utils.toWei('0.0001', 'ether');
    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }
  }


  public VoxelPlacedEvent() {
    return this.contract.events.VoxelPlaced();
  }
  public VoxelRepaintedEvent() {
    return this.contract.events.VoxelRepainted();
  }
  public VoxelDestroyedEvent() {
    return this.contract.events.VoxelDestroyed();
  }
  public VoxelTransferredEvent() {
    return this.contract.events.VoxelTransfered();
  }


  getUserAccount(): string {
    return this.web3.eth.accounts.wallet[0];
    // return '0x3EdddF14E23288fE0a4989456f533088C00e0865';
  }

  getWorldFromPastEvents(callback) {
    this.contract.getPastEvents('allEvents', {
      fromBlock: 0,
      toBlock: 'latest'
    }, (error, allPastEvents) => {
      callback(allPastEvents);
    });
  }

  placeVoxel(x, y, z, m, cb) {
    this.contract.methods.placeVoxel(x, y, z, m).send({value: this.price})
    .then(function (receipt) { cb(); })
    .catch((e) => { cb(e); });
  }
  destroyVoxel(x, y, z, cb) {
    this.contract.methods.destroyVoxel(x, y, z).send({value: this.price})
    .then(function (receipt) { cb(); })
    .catch((e) => { cb(e); });
  }
  repaintVoxel(x, y, z, newMatarial, cb) {
    this.contract.methods.repaintVoxel(x, y, z, newMatarial).send({value: this.price})
    .then(function (receipt) { cb(); })
    .catch((e) => { cb(e); });
  }
  transferVoxel(to, x, y, z, cb) {
    this.contract.methods.transferVoxel(to, x, y, z).send({value: this.price})
    .then(function (receipt) { cb(); })
    .catch((e) => { cb(e); });
  }

}
