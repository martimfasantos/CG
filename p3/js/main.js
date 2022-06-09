/* global THREE */

var camera, scene, renderer;
var worldAxisHelper, rocketAxisHelper;
const clock = new THREE.Clock();

// Constants
const ARROWUP = 38;
const ARROWDOWN = 40;
const ARROWRIGHT = 39;
const ARROWLEFT = 37;
const HEIGHT = 12;
const WIDTH = 20;
const LENGTH = 100;

// Translaction
var speed = 5;
const deltaAngle = 1/(3*Math.PI);
const maxSpeed = 20;
const minSpeed = 1;
const speedDelta = 1;

// Cameras
var orthographicCamera, perspectiveCamera, rocketCamera;
const cameraDist = 42;
const cameraOffset = 10;
const screenArea = screen.width * screen.height;
const viewSize = 90;

// Arrays
var cameras = [];
var materials = [];
var primitives = [];
var keyPressed = [];
var lights = [];

// Objects
var origami1, origami2, origami3;


function createPrimitive(x, y, z, angleX, angleY, angleZ, color, geometry, side, texture){

    const primitive = new THREE.Object3D();
    
    const material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, side: side, map: texture});
    const _geometry = geometry;
    const mesh = new THREE.Mesh(_geometry, material);

    primitive.position.set(x, y, z);
    primitive.rotateX(angleX);
    primitive.rotateY(angleY);
    primitive.rotateZ(angleZ);
    primitive.add(mesh);

    materials.push(material);
    primitives.push(primitive);
    scene.add(primitive);

    return primitive;

}

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}

function createCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera( 70,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );
    // Position
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;

    camera.lookAt(0, 0, 0);

    cameras.push(camera);

    return camera;
    
}

function createOrthographicCamera(x, y, z) {
    'use strict';
    const aspectRatio = window.innerWidth / window.innerHeight;
    var orthoCamera = new THREE.OrthographicCamera( aspectRatio * viewSize / - 2,
                                                       aspectRatio * viewSize / 2,
                                                       viewSize / 2, 
                                                       viewSize / - 2, 
                                                       -100, 
                                                       1000 );
    // Position
    orthoCamera.position.x = x;
    orthoCamera.position.y = y;
    orthoCamera.position.z = z;
    
    orthoCamera.lookAt(scene.position);

    cameras.push(orthoCamera);

    return orthoCamera;
    
}

function resizeCameras(){

    cameras.forEach((camera) => {
        
        const aspectRatio = window.innerWidth / window.innerHeight;

        if (camera.isPerspectiveCamera){
            camera.aspect = aspectRatio;
        
        } else if (camera.isOrthographicCamera){
            
            camera.left = viewSize * aspectRatio / - 2;
            camera.right = viewSize * aspectRatio / 2;
            camera.top = viewSize / 2;
            camera.bottom = viewSize  / - 2;

        }

        camera.updateProjectionMatrix();

    });

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onWindowResize() {
    'use strict';
    resizeCameras();

}

function createObjects() {

    const textureLoader = new THREE.TextureLoader();

    // Displayer
    createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(1.5*WIDTH, HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'));
    
    createPrimitive(-1.25*WIDTH, HEIGHT, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(WIDTH, 3*HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'));

    // --------------------------------

    // Origamis
    
    

    // --------------------------------


    // --------------------------------

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(10);
    worldAxisHelper.visible = false;
    scene.add(worldAxisHelper);

    createObjects();

}

function onKeyDown(e) {
    'use strict';

    keyPressed[e.keyCode] = true;

    switch (e.keyCode) {
        case 49: //1
            camera = orthographicCamera;
            break;
        case 50: //2
            camera = perspectiveCamera;
            break;
        case 51: //3
            // camera = rocketCamera;
            break; 
        case 52: //4
            for (var i = 0; i < materials.length; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;
        case 66: //B
        case 98: //b
            for (var i = 0; i < boundingBoxes.length; i++) {
                boundingBoxes[i].visible = !boundingBoxes[i].visible;
            }
            break;
        case 69:  //E
        case 101: //e
            worldAxisHelper.visible = !worldAxisHelper.visible;
            break;
        case 77:  //M
        case 109: //m
            if (speed + speedDelta < maxSpeed) {
                speed += speedDelta; 
            }
            break;
        case 78:  //N
        case 110: //n
            if (speed - speedDelta > minSpeed) {
                speed -= speedDelta;
            }
            break;
        default:
            break;
    }
}

function onKeyUp(e) {
    'use strict';
    keyPressed[e.keyCode] = false;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function setupLights() {

    // Directional Light
    const dirLight = new THREE.DirectionalLight(0x404040, 0.4);
    dirLight.position.set(5, HEIGHT, 0);
    lights.push(dirLight);
    scene.add(dirLight);

    // Spotlights
    const spotLight1 = new THREE.SpotLight(0xFFFFFF, 0.7);
    spotLight1.position.set(0, 1.5*HEIGHT, -LENGTH/2 + LENGTH/8);
    spotLight1.angle = Math.PI/8;
    /* spotLight2.target(origami1); */
    lights.push(spotLight1);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xFFFFFF, 0.7);
    spotLight2.position.set(0, 1.5*HEIGHT, 0);
    spotLight2.angle = Math.PI/8;
    /* spotLight2.target(origami2); */
    lights.push(spotLight2);
    scene.add(spotLight2);

    const spotLight3 = new THREE.SpotLight(0xFFFFFF, 0.7);
    spotLight3.position.set(0, 1.5*HEIGHT, LENGTH/2 - LENGTH/8);
    spotLight3.angle = Math.PI/8;
    /* spotLight2.target(origami3); */
    lights.push(spotLight3);
    scene.add(spotLight3);

}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);
    
    createScene();
    
    setupLights();

    const ambLight = new THREE.AmbientLight(0xF7F7F7, 0.8);
    scene.add(ambLight);

    // Cameras
    orthographicCamera = createOrthographicCamera(0, 0, cameraDist);
    scene.add(orthographicCamera);

    perspectiveCamera = createCamera(2*cameraDist, cameraDist/2, 0);
    scene.add(perspectiveCamera);

    camera = perspectiveCamera;

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function animate() {
    'use strict';
    
    var clockDelta = clock.getDelta();
    // const translationDelta = deltaAngle * speed * clockDelta;
 
    render();

    requestAnimationFrame(animate);

}