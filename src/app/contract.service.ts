import { Injectable } from '@angular/core';
import Web3 = require('web3');
import { ABI } from './ABI';

@Injectable()
export class ContractService {

  private contract;
  private provider;
  private web3;

  private price;
  private contractAddress = '0x6462656c80aE0F79b5A84bfC290C058DcfE7f4E0';

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
    // this.injectWeb3Provider();
  }


  injectWeb3Provider(): Promise<boolean> {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    return new Promise<boolean>((resolve, reject) => {
      if (typeof web3 !== 'undefined') {
        // web3/index.d.ts 'export' -> '='
        this.web3 = new Web3(Web3.givenProvider);

        this.price = this.web3.utils.toWei('0.0001', 'ether');

        this.web3.eth.getAccounts().then(accounts => {
          this.web3.eth.defaultAccount = accounts[0];
          this.contract = new this.web3.eth.Contract(ABI, this.contractAddress, { from: accounts[0] });
          resolve(true);
        });

      } else {
        console.log('No web3? You should consider trying MetaMask!');
        reject(false);
      }
    });

  }

  get userAddress(): string {
    return this.web3.eth.defaultAccount;
  }

  getNetwork(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.web3.eth.net.getId().then(resolve).catch(reject);
    });
  }

  getCurrentBlock(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.web3.eth.getBlockNumber()
      .then(resolve)
      .catch(reject);
    });
  }

  getPastEvents(fromBlock: number, callback: (events: any[]) => void) {
    this.contract.getPastEvents('allEvents', {
      fromBlock: fromBlock,
      toBlock: 'latest'
    }, (error, allPastEvents) => {
      callback(allPastEvents);
    });
  }

  placeVoxel(x, y, z, m, cb) {
    this.contract.methods.placeVoxel(x, y, z, m).send({ value: this.price })
      .then(function (receipt) { cb(); })
      .catch((e) => { cb(e); });
  }
  destroyVoxel(x, y, z, cb) {
    this.contract.methods.destroyVoxel(x, y, z).send({ value: this.price })
      .then(function (receipt) { cb(); })
      .catch((e) => { cb(e); });
  }
  repaintVoxel(x, y, z, newMatarial, cb) {
    this.contract.methods.repaintVoxel(x, y, z, newMatarial).send({ value: this.price })
      .then(function (receipt) { cb(); })
      .catch((e) => { cb(e); });
  }
  transferVoxel(to, x, y, z, cb) {
    this.contract.methods.transferVoxel(to, x, y, z).send({ value: this.price })
      .then(function (receipt) { cb(); })
      .catch((e) => { cb(e); });
  }

}
