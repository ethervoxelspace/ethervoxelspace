// const express = require('express');
// const app = express();
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

//app.get('/', (req, res) => res.send('Hello World!'));

const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/km4Q8LLtFj8l2MUPJp2K"));

const ABI = require('./abi.js');
const contractAddress = '0x2Eab1392d6850722d19BEc5738912fbdb021277F';
const contract = new web3.eth.Contract(ABI, contractAddress);

// contract.methods.placeVoxel(10, 10, 10, 0).send({ from: account.address,value: web3.utils.toWei('0.0001', 'ether') },



const privateKey = new Buffer('3e97d8bff009922304b47078792009c57af30ed0ea40b0d9d12d79cdb3f9c9d0', 'hex')
const limit = 100000;
const gasPrice = 50;
const color = 11;

let data;
let i = 0;
let array = [];

for (let x = 0; x < 32; x++) {
  for (let y = 0; y < 32; y++) {
    for (let z = 0; z < 32; z++) {
      array.push([x,y,z]);
    }
  }
}

send(array[i][0],array[i][1],array[i][2]);

function send(x, y, z) {
  web3.eth.getTransactionCount('0x3EdddF14E23288fE0a4989456f533088C00e0865').then(transactionCount => {
    data = contract.methods.placeVoxel(x,y,z,color).encodeABI();
    const rawTx = {
      nonce: web3.utils.toHex(transactionCount),
      gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')), 
      gasLimit: '0x186a0',
      to: contractAddress,
      value: web3.utils.toHex(web3.utils.toWei('0.0001', 'ether')),
      data: data
    }
    
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    
    const serializedTx = tx.serialize();
    
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
    .on('receipt', (r) => {
      console.log(r);
      i++;
      send(array[i][0],array[i][1],array[i][2]);
    });
  });
}





// app.listen(3000, () => console.log('Example app listening on port 3000!'))
