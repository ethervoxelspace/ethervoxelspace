export class Engine {

    static scene;
    static geometry;
    static renderer;
    static camera;
    static world;
    static selectedVoxel;
    static controls;

    constructor() {}

    static getVoxelKey(x, y, z): string {
        return x + ',' + y + ',' + z;
    }

    static initialize() {
        Engine.scene = new THREE.Scene();
        Engine.geometry = new THREE.BoxGeometry(1, 1, 1);
        Engine.world = {};
        Engine.selectedVoxel = {};

        const rendererWidth = 960;
        const rendererHeight = 640;

        const rendererElement = document.getElementById('world-viewer');
        rendererElement.addEventListener('mousedown', Engine.onRendererClicked, false);

        Engine.camera = new THREE.PerspectiveCamera(45, rendererWidth / rendererHeight, 1, 10000);
        Engine.camera.position.set(127, 127, 127);

        Engine.controls = new THREE.EditorControls(Engine.camera, rendererElement);

        const environment_skybox = new THREE.CubeTextureLoader()
            .setPath('assets/skybox/')
            .load(['xz.png', 'xz.png', 'posy.png', 'negy.png', 'xz.png', 'xz.png']);
        Engine.scene.background = environment_skybox;

        const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbbb, 1.0 );
        Engine.scene.add( light );

        Engine.renderer = new THREE.WebGLRenderer({ antialias: true });
        Engine.renderer.setClearColor(0xffffff, 1);
        Engine.renderer.setSize(rendererWidth, rendererHeight);
        rendererElement.appendChild(Engine.renderer.domElement);

        window.setInterval(() => { Engine.animate(); }, 20);
    }

    static onRendererClicked(event) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        event.preventDefault();

        const rect = Engine.renderer.domElement.getBoundingClientRect();
        mouse.x = ( ( event.clientX - rect.left ) / ( rect.right - rect.left ) ) * 2 - 1;
        mouse.y = - ( ( event.clientY - rect.top ) / ( rect.bottom - rect.top) ) * 2 + 1;

        raycaster.setFromCamera( mouse, Engine.camera );

        const intersects = raycaster.intersectObjects( Engine.scene.children );

        if ( intersects.length > 0 ) {
            // intersects[0].object.callback();
            const clickedObject = intersects[0].object;
            Engine.setSelectedVoxel(clickedObject.position.x, clickedObject.position.y, clickedObject.position.z);
        }
    }

    static setSelectedVoxel(x, y, z) {
        if(Engine.world[Engine.getVoxelKey(x, y, z)]) {
            Engine.selectedVoxel = Engine.world[Engine.getVoxelKey(x, y, z)].clone();
        }
    }

    static animate() {
        Engine.renderer.render(Engine.scene, Engine.camera);
        // this.controls.update();
    }
}
