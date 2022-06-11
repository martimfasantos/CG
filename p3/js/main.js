/* global THREE */

var camera, scene, renderer;
var worldAxisHelper, rocketAxisHelper;
const clock = new THREE.Clock();

// Constants
const ARROWUP = 38;
const ARROWDOWN = 40;
const ARROWRIGHT = 39;
const ARROWLEFT = 37;

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

    camera.lookAt(scene.position);

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
    const width = 12;
    const length = 70;
    const height = 10;
    createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(2*width, height, length, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'));
    
    createPrimitive(-width, height/2, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(width, 2*height, length, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'));


    // --------------------------------

    // Origamis
    
    origami1 = createPrimitive(width+3, height+5, 2.7*width, 0, 0, 0, 0xFFFFFF,
        new THREE.BoxGeometry(3, 3, 3, 25), THREE.DoubleSide,
        null);

    origami2 = createPrimitive(width+3, height+5, 1.25*width, 0, 0, 0, 0xFFFFFF,
        new THREE.BoxGeometry(3, 3, 3, 25), THREE.DoubleSide,
        null);

    origami3 = createPrimitive(width+3, height+5, -0.5*width, 0, 0, 0, 0xFFFFFF,
        new THREE.BoxGeometry(3, 3, 3, 25), THREE.DoubleSide,
        null);

    // --------------------------------


    // --------------------------------

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(100);
    worldAxisHelper.visible = false;
    scene.add(worldAxisHelper);

    createObjects();

}

function onKeyDown(e) {
    'use strict';

    keyPressed[e.keyCode] = true;

    switch (e.keyCode) {
        case 49: //1
            camera = perspectiveCamera;
            break;
        case 50: //2
            camera = orthographicCamera;
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

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    document.body.appendChild(renderer.domElement);
    
    createScene();
    
    // Lights
    const light1 = new THREE.DirectionalLight(0x404040, 5);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0xF7F7F7, 1);
    scene.add(light2);

    // Cameras
    orthographicCamera = createOrthographicCamera(0, 0, cameraDist);
    scene.add(orthographicCamera);

    perspectiveCamera = createCamera(cameraDist, cameraDist/1.2, cameraDist);
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
    const rotationStep = deltaAngle * speed * clockDelta;

    // Rotation
    if (keyPressed[81] == true || keyPressed[113] == true) { //Q or q
        origami1.rotateY( rotationStep );
    }
    if (keyPressed[87] == true || keyPressed[119] == true) { //W or w
        origami1.rotateY( -rotationStep );
    }
    if (keyPressed[69] == true || keyPressed[101] == true) { //E or e
        origami2.rotateY( rotationStep );
    }
    if (keyPressed[82] == true || keyPressed[114] == true) { //R or r
        origami2.rotateY( -rotationStep );
    }
    if (keyPressed[84] == true || keyPressed[116] == true) { //T or t
        origami3.rotateY( rotationStep );
    }
    if (keyPressed[89] == true || keyPressed[121] == true) { //Y or y
        origami3.rotateY( -rotationStep );
    }
 
    render();

    requestAnimationFrame(animate);

}