export const ABI = [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "world",
      "outputs": [
        {
          "name": "material",
          "type": "uint8"
        },
        {
          "name": "owner",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint16"
        },
        {
          "name": "y",
          "type": "uint16"
        },
        {
          "name": "z",
          "type": "uint16"
        }
      ],
      "name": "destroyBox",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "x",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "z",
          "type": "uint16"
        }
      ],
      "name": "BoxDestroyed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "x",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "z",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "material",
          "type": "uint8"
        }
      ],
      "name": "BoxPlaced",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "x",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "z",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "oldMaterial",
          "type": "uint8"
        },
        {
          "indexed": false,
          "name": "newMaterial",
          "type": "uint8"
        }
      ],
      "name": "BoxRepainted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "x",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "y",
          "type": "uint16"
        },
        {
          "indexed": false,
          "name": "z",
          "type": "uint16"
        }
      ],
      "name": "BoxTransfered",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "withdraw",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint16"
        },
        {
          "name": "y",
          "type": "uint16"
        },
        {
          "name": "z",
          "type": "uint16"
        },
        {
          "name": "material",
          "type": "uint8"
        }
      ],
      "name": "placeBox",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "x",
          "type": "uint16"
        },
        {
          "name": "y",
          "type": "uint16"
        },
        {
          "name": "z",
          "type": "uint16"
        },
        {
          "name": "newMaterial",
          "type": "uint8"
        }
      ],
      "name": "repaintBox",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "x",
          "type": "uint16"
        },
        {
          "name": "y",
          "type": "uint16"
        },
        {
          "name": "z",
          "type": "uint16"
        }
      ],
      "name": "transferBox",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];