import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';

@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  ngOnInit() {
  }

  placeMode = true;
  repaintMode = false;
  destroyMode = false;
  transferMode = false;

  m = 0;

  placeVoxel(x: number, y: number, z: number, material: number) {
    if (!(x < 64 && y < 64 && z < 64 && material < 16)) {
      return;
    }
    this.contractService.placeVoxel(x, y, z, material);
  }
  destroyVoxel(x: number, y: number, z: number) {
    if (!(x < 64 && y < 64 && z < 64)) {
      return;
    }
    this.contractService.destroyVoxel(x, y, z);
  }
  repaintVoxel(x: number, y: number, z: number, newMaterial:number ) {
    if (!(x < 64 && y < 64 && z < 64 && newMaterial < 16)) {
      return;
    }
    this.contractService.repaintVoxel(x, y, z, newMaterial);
  }
  transferVoxel(to: string, x: number, y: number, z: number) {
    if (!(x < 64 && y < 64 && z < 64 && to)) {
      return;
    }
    this.contractService.transferVoxel(to, x, y, z);
  }

  setMode(mode: string){
    this.placeMode = false;
    this.repaintMode = false;
    this.destroyMode = false;
    this.transferMode = false;
    this[mode] = true;
  }

}
