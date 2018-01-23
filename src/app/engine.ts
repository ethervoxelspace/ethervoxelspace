export class Engine {

    static scene;
    static geometry;
    static renderer;
    static camera;
    static world;

    constructor() {}

    static initialize() {
        Engine.scene = new THREE.Scene();
        Engine.geometry = new THREE.BoxGeometry(1, 1, 1);
        Engine.world = {};

        const rendererWidth = 960;
        const rendererHeight = 640;

        const rendererElement = document.getElementById('world-viewer');

        Engine.camera = new THREE.PerspectiveCamera(45, rendererWidth / rendererHeight, 1, 10000);
        //this.camera = new THREE.OrthographicCamera( this.rendererWidth / - 2, this.rendererWidth / 2, this.rendererHeight / 2, this.rendererHeight / - 2, 1, 10000 );
        Engine.camera.position.set(32,32,32);

        const controls = new THREE.OrbitControls(Engine.camera, rendererElement);
        controls.zoomSpeed = 2.0;

        const environment_skybox = new THREE.CubeTextureLoader()
            .setPath('assets/skybox/')
            .load(['xz.png', 'xz.png', 'posy.png', 'negy.png', 'xz.png', 'xz.png']);
            Engine.scene.background = environment_skybox;

        Engine.renderer = new THREE.WebGLRenderer({ antialias: true });
        Engine.renderer.setClearColor(0xffffff, 1);
        Engine.renderer.setSize(rendererWidth, rendererHeight);
        rendererElement.appendChild(Engine.renderer.domElement);

        window.setInterval(() => { Engine.animate() }, 20);
    }

    static animate() {
        Engine.renderer.render(Engine.scene, Engine.camera);
        //this.controls.update();
    }
}
