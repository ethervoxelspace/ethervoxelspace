import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
declare var THREE: any;
interface vec3 {
  x: number;
  y: number;
  z: number;
}
@Component({
  selector: 'app-place-explorer',
  templateUrl: './place-explorer.component.html',
  styleUrls: ['./place-explorer.component.css']
})
export class PlaceExplorerComponent implements OnInit {

  constructor(private contractService: ContractService) { }

  rendererWidth = 960;
  rendererHeight = 640;

  camera;
  scene;
  renderer;
  geometry;
  controls;

  world = {};

  ngOnInit() {


    const rendererElement = document.getElementById('world-viewer');

    this.camera = new THREE.PerspectiveCamera(45, this.rendererWidth / this.rendererHeight, 1, 10000);
    //this.camera = new THREE.OrthographicCamera( this.rendererWidth / - 2, this.rendererWidth / 2, this.rendererHeight / 2, this.rendererHeight / - 2, 1, 10000 );
    this.camera.position.x = 32;
    this.camera.position.y = 32;
    this.camera.position.z = 32;

    //this.controls = new THREE.TrackballControls( this.camera );
    this.controls = new THREE.OrbitControls(this.camera, rendererElement);
    this.controls.zoomSpeed = 2.0;

    this.scene = new THREE.Scene();
    const environment_skybox = new THREE.CubeTextureLoader()
      .setPath('assets/skybox/')
      .load(['xz.png', 'xz.png', 'posy.png', 'negy.png', 'xz.png', 'xz.png']);
    this.scene.background = environment_skybox;

    this.geometry = new THREE.BoxGeometry(1, 1, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xffffff, 1);
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    rendererElement.appendChild(this.renderer.domElement);

    window.setInterval(() => { this.animate() }, 20);

    //this.populateMockWorld();
    this.populateWorldUsingPastEvents();

    this.setUpWatchers();


  }

  getVoxelKey(x, y, z): string {
    return x + ',' + y + ',' + z;
  }

  setUpWatchers() {
    this.contractService.VoxelPlacedEvent().watch((error, response) => {
      if (error) {
        console.log('EVENT ERROR');
      }
      console.log("EVENT - VOXEL PLACED: ", response);
      this.spawnVoxelInScene(response.args.x, response.args.y, response.args.z, response.args.material);
    });
    this.contractService.VoxelRepaintedEvent().watch((error, response) => {
      if (error) {
        console.log('EVENT ERROR');
      }
      console.log("EVENT - VOXEL REPAINTED: ", response);
      this.repaintVoxelInScene(response.args.x, response.args.y, response.args.z, response.args.oldMaterial, response.args.newMaterial);
    });
    this.contractService.VoxelDestroyedEvent().watch((error, response) => {
      if (error) {
        console.log('EVENT ERROR');
      }
      console.log("EVENT - VOXEL DESTROYED: ", response);
      this.destroyVoxelInScene(response.args.x, response.args.y, response.args.z);
    });
    this.contractService.VoxelTransferredEvent().watch((error, response) => {
      if (error) {
        console.log('EVENT ERROR');
      }
      console.log("EVENT - VOXEL TRANSFERRED: ", response);
    });
  }

  populateMockWorld() {
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          this.spawnVoxelInScene(x, y, z, 0);
        }
      }
    }
  }

  spawnVoxelInScene(x, y, z, material) {
    if(material > 15){
      material = 0;
    }
    const mat = new THREE.MeshBasicMaterial({ color: this.contractService.colorArray[material] });
    const voxel = new THREE.Mesh(this.geometry, mat);
    this.scene.add(voxel);
    voxel.position.set(x, y, z);
    this.world[this.getVoxelKey(x, y, z)] = voxel;
  }

  destroyVoxelInScene(x, y, z) {
    this.scene.remove(this.world[this.getVoxelKey(x, y, z)]);
    delete this.world[this.getVoxelKey(x, y, z)];
  }

  repaintVoxelInScene(x, y, z, oldMaterial, newMaterial) {
    this.destroyVoxelInScene(x, y, z);
    this.spawnVoxelInScene(x, y, z, newMaterial);
  }

  populateWorldUsingPastEvents() {
    this.contractService.getWorldFromPastEvents((events) => {
      for (const event of events) {
        if (event.event === "VoxelPlaced") {
          this.spawnVoxelInScene(event.args.x, event.args.y, event.args.z, event.args.material);
        }
        if (event.event === "VoxelRepainted") {
          this.repaintVoxelInScene(event.args.x, event.args.y, event.args.z, event.args.oldMaterial, event.args.newMaterial);
        }
        if (event.event === "VoxelDestroyed") {
          this.destroyVoxelInScene(event.args.x, event.args.y, event.args.z);
        }
      }
    });
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    //this.controls.update();
  }

}
