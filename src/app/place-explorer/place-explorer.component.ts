import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { Engine } from '../engine';

@Component({
  selector: 'app-place-explorer',
  templateUrl: './place-explorer.component.html',
  styleUrls: ['./place-explorer.component.css']
})
export class PlaceExplorerComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    Engine.initialize();

    // this.populateMockWorld();
    this.populateWorldUsingPastEvents();

    this.setUpWatchers();
  }

  setUpWatchers() {
    this.contractService.VoxelPlacedEvent().watch((error, response) => {
      if (error) {
        console.error('EVENT ERROR');
        return;
      }
      this.spawnVoxelInScene(response.args.owner, response.args.x, response.args.y, response.args.z, response.args.material);
    });
    this.contractService.VoxelRepaintedEvent().watch((error, response) => {
      if (error) {
        console.error('EVENT ERROR');
        return;
      }
      this.repaintVoxelInScene(response.args.x, response.args.y, response.args.z, response.args.newMaterial);
    });
    this.contractService.VoxelDestroyedEvent().watch((error, response) => {
      if (error) {
        console.error('EVENT ERROR');
        return;
      }
      this.destroyVoxelInScene(response.args.x, response.args.y, response.args.z);
    });
    this.contractService.VoxelTransferredEvent().watch((error, response) => {
      if (error) {
        console.error('EVENT ERROR');
        return;
      }
      this.transferVoxelInScene(response.args.to, response.args.x, response.args.y, response.args.z);
    });
  }

  populateMockWorld() {
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          this.spawnVoxelInScene('', x, y, z, 0);
        }
      }
    }
  }

  spawnVoxelInScene(owner, x, y, z, material) {
    if (material > 15) {
      material = 0;
    }
    const mat = new THREE.MeshLambertMaterial({ color: this.contractService.colorArray[material] });
    const voxel = new THREE.Mesh(Engine.geometry, mat);
    Engine.scene.add(voxel);
    voxel.position.set(x, y, z);
    voxel.ownerAddress = owner;
    Engine.world[Engine.getVoxelKey(x, y, z)] = voxel;
  }

  destroyVoxelInScene(x, y, z) {
    Engine.scene.remove(Engine.world[Engine.getVoxelKey(x, y, z)]);
    delete Engine.world[Engine.getVoxelKey(x, y, z)];
  }

  repaintVoxelInScene(x, y, z, newMaterial) {
    this.destroyVoxelInScene(x, y, z);
    this.spawnVoxelInScene(Engine.world[Engine.getVoxelKey(x, y, z)].owner, x, y, z, newMaterial);
  }

  transferVoxelInScene(to, x, y, z) {
    Engine.world[Engine.getVoxelKey(x, y, z)].owner = to;
  }

  populateWorldUsingPastEvents() {
    this.contractService.getWorldFromPastEvents((events) => {
      for (const event of events) {
        if (event.event === 'VoxelPlaced') {
          this.spawnVoxelInScene(event.args.owner, event.args.x, event.args.y, event.args.z, event.args.material);
        }
        if (event.event === 'VoxelRepainted') {
          this.repaintVoxelInScene(event.args.x, event.args.y, event.args.z, event.args.newMaterial);
        }
        if (event.event === 'VoxelDestroyed') {
          this.destroyVoxelInScene(event.args.x, event.args.y, event.args.z);
        }
      }
    });
  }
}
