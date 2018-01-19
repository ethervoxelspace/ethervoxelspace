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

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.x = 100;
    this.camera.position.y = 100;
    this.camera.position.z = 100;
    this.controls = new THREE.TrackballControls( this.camera );

    this.scene = new THREE.Scene();

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshNormalMaterial();

    this.contractService.getExistingVoxel(500,500,500,(exists) => {
      if (exists) {
        console.log('voxel exists');
        const mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(mesh);
        mesh.position.x = 50;
        mesh.position.y = 50;
        mesh.position.z = 50;
      }

    });

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    window.setInterval(()=>{this.animate()},20);
  }

  animate() {
    

    //this.mesh.rotation.x += 0.01;
    //this.mesh.rotation.y += 0.02;

    this.renderer.render(this.scene, this.camera);
    this.controls.update();

  }

}
