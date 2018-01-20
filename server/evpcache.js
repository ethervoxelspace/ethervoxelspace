const express = require('express');
const app = express();
const Web3 = require('web3');

app.get('/', (req, res) => res.send('Hello World!'));

const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/km4Q8LLtFj8l2MUPJp2K"));

const ABI = require('./ABI.js');
const contract = web3.eth.contract(ABI).at('0x2CC25bDaBD264aB306d47938F3c701A6dF0e883A');

function getVoxel(x, y, z) {

}

contract.world(0, 0, 0, (error, result) => {
    console.log(result);
  if (result[1] !== '0x0000000000000000000000000000000000000000') {
    console.log('voxel 000:', true);
  } else {
    console.log('voxel 000:', false);
  }
});


app.listen(3000, () => console.log('Example app listening on port 3000!'))
