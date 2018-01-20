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

  placeVoxel(x: number, y: number, z: number, m: number) {
    if (!(x < 64 && y < 64 && z < 64 && m < 16)) {
      return;
    }
    this.contractService.placeVoxel(x,y,z,m);
  }

}
