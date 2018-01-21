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

  ngOnInit() {
    this.init();
    this.animate();
  }

  camera;
  scene;
  renderer;
  geometry;
  controls;

  init() {

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
    .setPath( 'assets/skybox/')
    .load( [ 'xz.png', 'xz.png', 'posy.png', 'negy.png', 'xz.png', 'xz.png' ] );
    this.scene.background = environment_skybox;

    this.geometry = new THREE.BoxGeometry(1, 1, 1);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor (0xffffff, 1);
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    rendererElement.appendChild(this.renderer.domElement);

    window.setInterval(() => { this.animate() }, 20);

    //this.populateMockWorld();
    this.populateWorldUsingPastEvents();
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
    const mat = new THREE.MeshBasicMaterial({ color: this.contractService.colorArray[material] });
    const mesh = new THREE.Mesh(this.geometry, mat);
    this.scene.add(mesh);
    mesh.position.set(x, y, z);
  }

  populateWorldUsingPastEvents() {
    this.contractService.getWorldFromPastEvents((events) => {
      for (const event of events) {
        this.spawnVoxelInScene(event.args.x, event.args.y, event.args.z, 0);
      }
    });
  }

  animate() {
    this.renderer.render(this.scene, this.camera);
    //this.controls.update();
  }

}
