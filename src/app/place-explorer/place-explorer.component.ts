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

  currentChunk: vec3 = { x: 0, y: 0, z: 0 };
  totalTimeStart = Date.now();
  chunkNum = 0;
  chunkArray = [[0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,1,0],[0,1,1],[0,1,2],[0,1,3],[0,2,0],[0,2,1],[0,2,2],[0,2,3],
  [0,3,0],[0,3,1],[0,3,2],[0,3,3],[1,0,0],[1,0,1],[1,0,2],[1,0,3],[1,1,0],[1,1,1],[1,1,2],[1,1,3],[1,2,0],[1,2,1],
  [1,2,2],[1,2,3],[1,3,0],[1,3,1],[1,3,2],[1,3,3],[2,0,0],[2,0,1],[2,0,2],[2,0,3],[2,1,0],[2,1,1],[2,1,2],[2,1,3],
  [2,2,0],[2,2,1],[2,2,2],[2,2,3],[2,3,0],[2,3,1],[2,3,2],[2,3,3],[3,0,0],[3,0,1],[3,0,2],[3,0,3],
  [3,1,0],[3,1,1],[3,1,2],[3,1,3],[3,2,0],[3,2,1],[3,2,2],[3,2,3],[3,3,0],[3,3,1],[3,3,2],[3,3,3]];


  ngOnInit() {
    this.init();
    this.animate();
  }

  camera;
  scene;
  renderer;
  geometry;
  material;
  controls;

  init() {

    const rendererElement = document.getElementById('world-viewer');

    this.camera = new THREE.PerspectiveCamera(45, this.rendererWidth / this.rendererHeight, 1, 10000);
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    //this.controls = new THREE.TrackballControls( this.camera );
    this.controls = new THREE.OrbitControls(this.camera, rendererElement);

    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshNormalMaterial();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    rendererElement.appendChild(this.renderer.domElement);
    window.setInterval(() => { this.animate() }, 20);

    this.populateWorld(this.currentChunk);
  }

  populateMockWorld() {
    for (let x = 0 ; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          const mesh = new THREE.Mesh(this.geometry, this.material);
          this.scene.add(mesh);
          mesh.position.set(x, y, z);
        }
      }
    }
  }

  populateWorld(chunk: vec3) {
    let vCount = 0;
    let start = Date.now();

    for (let x = 0 + chunk.x * 16; x < 16 + chunk.x * 16; x++) {
      for (let y = 0 + chunk.y * 16; y < 16 + chunk.y * 16; y++) {
        for (let z = 0 + chunk.z * 16; z < 16 + chunk.z * 16; z++) {
          this.contractService.getExistingVoxel(x, y, z, (exists) => {
            if (exists) {
              const mesh = new THREE.Mesh(this.geometry, this.material);
              this.scene.add(mesh);
              mesh.position.set(x, y, z);
            }

            if (vCount === 0) {
              console.log('chunk: ', chunk.x, chunk.y, chunk.z, Date.now() - start);
            }

            vCount++;

            if (vCount === 4096) {
              this.chunkNum++;

              if (this.chunkNum === 64) {
                console.log('total time: ', Date.now() - this.totalTimeStart);
                return;
              }

              this.currentChunk.x = this.chunkArray[this.chunkNum][0];
              this.currentChunk.y = this.chunkArray[this.chunkNum][1];
              this.currentChunk.z = this.chunkArray[this.chunkNum][2];

              this.populateWorld(this.currentChunk);
            }
          });
        }
      }
    }
  }

  animate() {


    //this.mesh.rotation.x += 0.01;
    //this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
    this.controls.update();

  }

}
