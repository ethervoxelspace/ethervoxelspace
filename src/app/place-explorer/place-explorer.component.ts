import { Component, OnInit } from '@angular/core';
import { ContractService } from '../contract.service';
declare var THREE;
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
  material;
  controls;

  init() {

    const rendererElement = document.getElementById('world-viewer');

    this.camera = new THREE.PerspectiveCamera( 45, this.rendererWidth / this.rendererHeight, 1, 10000 );
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    //this.controls = new THREE.TrackballControls( this.camera );
    this.controls = new THREE.OrbitControls( this.camera, rendererElement );

    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshNormalMaterial();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.rendererWidth, this.rendererHeight);
    rendererElement.appendChild(this.renderer.domElement);
    window.setInterval(()=>{this.animate()},20);

    this.populateWorld();
  }

  populateWorld() {
    let vCount = 0;
    let start = Date.now();
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        for (let z = 0; z < 16; z++) {
          this.contractService.getExistingVoxel(x,y,z,(exists) => {
            if (exists) {
              const mesh = new THREE.Mesh(this.geometry, this.material);
              this.scene.add(mesh);
              mesh.position.set(x,y,z);
            }
            vCount++;
            console.log(vCount);
            if (vCount === 4096) {console.log(start - Date.now())}
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
