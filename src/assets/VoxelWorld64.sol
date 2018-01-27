pragma solidity ^0.4.0;

contract VoxelWorld64 {
    
    struct Voxel {
        uint8 material;
        address owner;
    }
    
    event VoxelPlaced(address owner, uint8 x, uint8 y, uint8 z, uint8 material);
    event VoxelRepainted(uint8 x, uint8 y, uint8 z, uint8 oldMaterial, uint8 newMaterial);
    event VoxelDestroyed(uint8 x, uint8 y, uint8 z);
    event VoxelTransfered(address from, address to, uint8 x, uint8 y, uint8 z);
    
    address creator;
    uint constant PRICE = 1000000000000;
    Voxel[64][64][64] public world;
    
    function VoxelWorld64() public {
        creator = msg.sender;
    }
    
    function isAvailable(uint8 x, uint8 y, uint8 z) private view returns (bool) {
        if (x < 64 && y < 64 && z < 64 && world[x][y][z].owner == address(0)) {
            return true;
        } 
        return false;
    }
    
    function placeVoxel(uint8 x, uint8 y, uint8 z, uint8 material) payable public {
        require(isAvailable(x, y, z) && msg.value >= PRICE);
        world[x][y][z] = Voxel(material, msg.sender);
        VoxelPlaced(msg.sender, x, y, z, material);
    }
    
    function repaintVoxel(uint8 x, uint8 y, uint8 z, uint8 newMaterial) payable public {
        require(world[x][y][z].owner == msg.sender && msg.value >= PRICE);
        uint8 oldMaterial = world[x][y][z].material;
        world[x][y][z].material = newMaterial;
        VoxelRepainted(x, y, z, oldMaterial, newMaterial);
    }
    
    function destroyVoxel(uint8 x, uint8 y, uint8 z) payable public {
        require(world[x][y][z].owner == msg.sender && msg.value >= PRICE);
        world[x][y][z].owner = address(0);
        VoxelDestroyed(x, y, z);
    } 
    
    function transferVoxel(address to, uint8 x, uint8 y, uint8 z) payable public {
        require(world[x][y][z].owner == msg.sender && msg.value >= PRICE);
        world[x][y][z].owner = to;
        VoxelTransfered(msg.sender, to, x, y, z);
    }
    
    function withdraw() public {
        require(msg.sender == creator);
        creator.transfer(this.balance);
    }
}