import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { Engine } from '../engine';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  placeMode = true;
  repaintMode = false;
  destroyMode = false;
  transferMode = false;

  errorMsg: string;
  successMsg: string;
  showError = false;
  showSuccess = false;

  /*
  x = 0;
  y = 0;
  z = 0;
  */
  m = 0;

  get x() {
    return +(Engine.selectedVoxel.position.x);
  }
  get y() {
    return +(Engine.selectedVoxel.position.y);
  }
  get z() {
    return +(Engine.selectedVoxel.position.z);
  }

  set x(v) {
    Engine.selectedVoxel.position.x = v;
  }
  set y(v) {
    Engine.selectedVoxel.position.y = v;
  }
  set z(v) {
    Engine.selectedVoxel.position.z = v;
  }


  toolboxVoxel: any;

  ngOnInit() {
    this.spawnToolboxVoxel();
    this.checkWeb3();
  }

  checkWeb3() {
    if (typeof web3 === 'undefined') {
      this.error('Error. Make sure you have a MetaMask plugin installed.');
    }
    // TODO FIXME WITH PROMISE/EVENT
    setTimeout(()=>{
      if (!this.contractService.userAddress) {
        console.log(this.contractService.userAddress);
        this.error('Error. Unlock your MetaMask wallet.');
      }
    },1000);

  }

  validUint8(numbers: number[]) {
    for (const n of numbers) {
      if (!(n > -1 && Number.isInteger(n) && n < 256)) {
        console.log(n, Number.isInteger(n), typeof n);
        return false;
      }
    }
    return true;
  }

  error(msg: string) {
    this.errorMsg = msg;
    this.showSuccess = false;
    this.showError = true;
  }

  success(msg: string) {
    this.successMsg = msg;
    this.showSuccess = true;
    this.showError = false;
  }

  spawnToolboxVoxel() {
    const mat = new THREE.MeshLambertMaterial({ color: 0xFFFFF });
    mat.transparent = true;
    mat.opacity = 0;
    this.toolboxVoxel = new THREE.Mesh(Engine.geometry, mat);
    Engine.scene.add(this.toolboxVoxel);
    this.toolboxVoxel.position.set(0, 0, 0);
    Engine.selectedVoxel = this.toolboxVoxel;
  }

  hideToolboxVoxel() {
    this.toolboxVoxel.material.opacity = 0;
  }

  updateToolboxVoxel(x: number, y: number, z: number, material: number) {
    if (this.checkVoxelExists(x, y, z)) {
      return;
    }
    this.toolboxVoxel.position.set(x, y, z);
    this.toolboxVoxel.material.color.setHex(this.contractService.colorArray[material]);
    this.toolboxVoxel.material.opacity = 0.9;
    Engine.controls.reset();
    Engine.camera.position.set(x + 3, y + 3, z + 3);
  }

  checkOwnership(owner: string): boolean {
    return this.contractService.userAddress === owner;
  }

  checkVoxelExists(x, y, z) {
    if (Engine.world[Engine.getVoxelKey(x, y, z)]) {
      this.error('There is already a voxel there.');
      return true;
    }
    return false;
  }

  placeVoxel(x: number, y: number, z: number, material: number) {
    if (this.checkVoxelExists(x, y, z)) {
      return;
    }
    if (!(x < 64 && y < 64 && z < 64 && material < 16) || !this.validUint8([x, y, z, material])) {
      this.error('Wrong parameters.');
      return;
    }
    this.contractService.placeVoxel(x, y, z, material, (e) => {
      this.hideToolboxVoxel();
      if (e) {
        this.error('Error. Voxel has not been placed on the blockchain. Error: ' + e);
      } else {
        this.success('Voxel has been successfuly placed on the blockchain.');
      }
    });
  }

  destroyVoxel(x: number, y: number, z: number) {
    if (!(x < 64 && y < 64 && z < 64) || !this.validUint8([x, y, z])) {
      this.error('Wrong parameters.');
      return;
    }
    if (!this.checkOwnership(Engine.world[Engine.getVoxelKey(x, y, z)].ownerAddress)) {
      this.error('You don\'t own that voxel.');
      return;
    }
    this.contractService.destroyVoxel(x, y, z, (e) => {
      if (e) {
        this.error('Error. Voxel has not been removed from the blockchain. Error: ' + e);
      } else {
        this.success('Voxel has been successfuly removed from the blockchain.');
      }
    });
  }

  repaintVoxel(x: number, y: number, z: number, newMaterial: number) {
    if (!(x < 64 && y < 64 && z < 64 && newMaterial < 16) || !this.validUint8([x, y, z, newMaterial])) {
      this.error('Wrong parameters.');
      return;
    }
    if (!this.checkOwnership(Engine.world[Engine.getVoxelKey(x, y, z)].ownerAddress)) {
      this.error('You don\'t own that voxel.');
      return;
    }
    this.contractService.repaintVoxel(x, y, z, newMaterial, (e) => {
      if (e) {
        this.error('Error. Voxel has not been repainted on the blockchain. Error: ' + e);
      } else {
        this.success('Voxel has been successfuly repainted on the blockchain.');
      }
    });
  }

  transferVoxel(to: string, x: number, y: number, z: number) {
    if (!(x < 64 && y < 64 && z < 64 && to) || !this.validUint8([x, y, z])) {
      this.error('Wrong parameters.');
      return;
    }
    if (!this.checkOwnership(Engine.world[Engine.getVoxelKey(x, y, z)].ownerAddress)) {
      this.error('You don\'t own that voxel.');
      return;
    }
    this.contractService.transferVoxel(to, x, y, z, (e) => {
      if (e) {
        this.error('Error. Voxel has not been transferred on the blockchain. Error: ' + e);
      } else {
        this.success('Voxel has been successfuly transferred on the blockchain.');
      }
    });
  }

  setMode(mode: string) {
    this.placeMode = false;
    this.repaintMode = false;
    this.destroyMode = false;
    this.transferMode = false;
    this[mode] = true;
  }

}
