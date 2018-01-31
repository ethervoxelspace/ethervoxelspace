import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
import { Engine } from '../engine';
import { setInterval } from 'timers';

@Component({
  selector: 'app-place-explorer',
  templateUrl: './place-explorer.component.html',
  styleUrls: ['./place-explorer.component.css']
})
export class PlaceExplorerComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  ngOnInit() {
    Engine.initialize();

    // TODO FIXME
    // contract loaded promise
    setTimeout(()=>{
      this.populateWorldUsingPastEvents();

      this.setUpWatchers();
    }, 1000);

  }

  setUpWatchers() {
    this.contractService.VoxelPlacedEvent()
    .on('data', function(event) {
        const args = event.returnValues;
        this.spawnVoxelInScene(args.owner, args.x, args.y, args.z, args.material);
    }).on('error', console.error);

    this.contractService.VoxelRepaintedEvent()
    .on('data', function(event) {
      const args = event.returnValues;
      this.repaintVoxelInScene(args.x, args.y, args.z, args.newMaterial);
    }).on('error', console.error);

    this.contractService.VoxelDestroyedEvent()
    .on('data', function(event) {
      const args = event.returnValues;
      this.destroyVoxelInScene(args.x, args.y, args.z);
    }).on('error', console.error);

    this.contractService.VoxelTransferredEvent()
    .on('data', function(event) {
      const args = event.returnValues;
      this.transferVoxelInScene(args.to, args.x, args.y, args.z);
    }).on('error', console.error);

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
    Engine.world[Engine.getVoxelKey(x, y, z)]
    .material.color.setHex(this.contractService.colorArray[newMaterial]);
  }

  transferVoxelInScene(to, x, y, z) {
    Engine.world[Engine.getVoxelKey(x, y, z)].owner = to;
  }

  populateWorldUsingPastEvents() {
    this.contractService.getWorldFromPastEvents((events) => {
      for (const event of events) {
        const args = event.returnValues;
        if (event.event === 'VoxelPlaced') {
          this.spawnVoxelInScene(args.owner, args.x, args.y, args.z, args.material);
        }
        if (event.event === 'VoxelRepainted') {
          this.repaintVoxelInScene(args.x, args.y, args.z, args.newMaterial);
        }
        if (event.event === 'VoxelDestroyed') {
          this.destroyVoxelInScene(args.x, args.y, args.z);
        }
        if (event.event === 'VoxelTransfered') {
          this.transferVoxelInScene(args.to, args.x, args.y, args.z);
        }
      }
    });
  }
}
