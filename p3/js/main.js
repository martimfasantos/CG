/* global THREE */

var camera, scene, renderer;
var worldAxisHelper;
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
var speed = 14;
const deltaAngle = 1 / (3 * Math.PI);
const maxSpeed = 50;
const minSpeed = 2;
const speedDelta = 2;

// Cameras
var orthographicCamera, perspectiveCamera, rocketCamera;
const cameraDist = 35;
const cameraOffset = 10;
const screenArea = screen.width * screen.height;
const viewSize = 90;

// Arrays
var cameras = [];
var materials = [];
var primitives = [];
var lights = [];
var keyPressed = [];
var lights = [];

// Objects
var dirLight, spotLight1, spotLight2, spotLight3;
var origami1, origami2, origami3;


function createPrimitive(x, y, z, angleX, angleY, angleZ, color, geometry, side, texture, bump) {

    const primitive = new THREE.Object3D();

    const material = new THREE.MeshPhongMaterial({ color: color, wireframe: false, side: side, map: texture, bumpMap: bump });
    const _geometry = geometry;
    const mesh = new THREE.Mesh(_geometry, material);

    primitive.position.set(x, y, z);
    primitive.rotateX(angleX);
    primitive.rotateY(angleY);
    primitive.rotateZ(angleZ);
    primitive.add(mesh);
    primitive.castShadow = true;

    materials.push(material);
    primitives.push(primitive);
    scene.add(primitive);

    return primitive;

}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function createCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    // Position
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;

    camera.lookAt(0, 1.5 * HEIGHT, 0);

    cameras.push(camera);

    return camera;

}

function createOrthographicCamera(x, y, z) {
    'use strict';
    const aspectRatio = window.innerWidth / window.innerHeight;
    var orthoCamera = new THREE.OrthographicCamera(aspectRatio * viewSize / - 2,
        aspectRatio * viewSize / 2,
        viewSize / 2,
        viewSize / - 2,
        -100,
        1000);
    // Position
    orthoCamera.position.x = x;
    orthoCamera.position.y = y;
    orthoCamera.position.z = z;

    orthoCamera.lookAt(scene.position);

    cameras.push(orthoCamera);

    return orthoCamera;

}

function resizeCameras() {

    cameras.forEach((camera) => {

        const aspectRatio = window.innerWidth / window.innerHeight;

        if (camera.isPerspectiveCamera) {
            camera.aspect = aspectRatio;

        } else if (camera.isOrthographicCamera) {

            camera.left = viewSize * aspectRatio / - 2;
            camera.right = viewSize * aspectRatio / 2;
            camera.top = viewSize / 2;
            camera.bottom = viewSize / - 2;

        }

        camera.updateProjectionMatrix();

    });

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onWindowResize() {
    'use strict';
    resizeCameras();

}

function createOrigami1(x, y, z) {

    const orig1 = new THREE.Object3D();
    const size = 5;

    const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        x, y - size, z,
        x, y, z - size,
        x, y + size, z,

        x, y - size, z,
        x, y, z + size,
        x, y + size, z,
    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // const pointU = new THREE.Vector3(x, y + 5, z);
    // const pointR = new THREE.Vector3(x, y, z - 5);
    // const pointorigami3D = new THREE.Vector3(x, y - 5, z);
    // const pointL = new THREE.Vector3(x, y, z + 5);

    // const face1 = new THREE.Face(pointD, pointR, pointU);
    // origami1.add(face1);
    // const face2 = new THREE.Face(pointD, pointL, pointU);
    // origami1.add(face2);

    const mesh = new THREE.Mesh(geometry, material);

    orig1.add(mesh);
    materials.push(material);
    primitives.push(orig1);
    scene.add(orig1);

    return orig1;

}

function createObjects() {

    const textureLoader = new THREE.TextureLoader();

    // Floor
    const floor = createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.PlaneGeometry(200, 200, 100, 100), THREE.DoubleSide,
        textureLoader.load('../textures/cobblestone.jpg'),
        textureLoader.load('../textures/cobblestone_bump.jpg'));
    floor.rotation.x = Math.PI / 2;


    // --------------------------------

    // Podium
    const bottom = createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(1.5 * WIDTH, HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'), null);

    // TODO: VER SHADOWS DOS OBJECTOS
    bottom.castShadow = false;
    bottom.receiveShadow = true;

    createPrimitive(-1.25 * WIDTH, HEIGHT, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(WIDTH, 3 * HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'), null);

    // add bump map and displacement map

    // --------------------------------

    // Spotlights

    /* --- Support --- */
    const support = createPrimitive(0, 4 * HEIGHT + 3, 0, 0, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, LENGTH), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    support.rotation.x = Math.PI / 2;
    createPrimitive(0, (4 * HEIGHT + 3) / 2, LENGTH / 2, 0, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, 4 * HEIGHT + 3), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, (4 * HEIGHT + 3) / 2, -LENGTH / 2, 0, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, 4 * HEIGHT + 3), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);

    /* --- Z --- */
    createPrimitive(0, 4 * HEIGHT, -LENGTH / 2 + LENGTH / 8, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 10, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, 4 * HEIGHT - 5, -LENGTH / 2 + LENGTH / 8, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/glass.jpg'), null);

    /* --- X --- */
    createPrimitive(0, 4 * HEIGHT, 0, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 10, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, 4 * HEIGHT - 5, 0, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/glass.jpg'), null);

    /* --- C --- */
    createPrimitive(0, 4 * HEIGHT, LENGTH / 2 - LENGTH / 8, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 10, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, 4 * HEIGHT - 5, LENGTH / 2 - LENGTH / 8, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/glass.jpg'), null);

    // --------------------------------

    // Origamis

    // origami1 = createOrigami1(0, 1.1 * HEIGHT, LENGTH / 2 - LENGTH / 8);

    origami1 = createPrimitive(0, 1.1 * HEIGHT, LENGTH / 2 - LENGTH / 8, 0, 0, 0, null,
        new THREE.BoxGeometry(10, 10, 10, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'), null);
    origami2 = createPrimitive(0, 1.1 * HEIGHT, 0, 0, 0, 0, null,
        new THREE.BoxGeometry(10, 10, 10, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'), null);
    origami3 = createPrimitive(0, 1.1 * HEIGHT, -LENGTH / 2 + LENGTH / 8, 0, 0, 0, null,
        new THREE.BoxGeometry(10, 10, 10, 25, 25), THREE.DoubleSide,
        textureLoader.load('../textures/wood.jpg'), null);

    // --------------------------------


    // --------------------------------

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(25);
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
        case 68: //D
        case 100: //d
            dirLight.intensity = (dirLight.intensity == 0.8) ? 0 : 0.8;
            break;
        case 90: //Z
        case 122:
            spotLight1.intensity = (spotLight1.intensity == 0.7) ? 0 : 0.7;
            break;
        case 88: //X
        case 120:
            spotLight2.intensity = (spotLight2.intensity == 0.7) ? 0 : 0.7;
            break;
        case 67: //C
        case 99: //c
            spotLight3.intensity = (spotLight3.intensity == 0.7) ? 0 : 0.7;
            break;
        case 72:  //H
        case 104: //h
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
    'use strict';
    const ambLight = new THREE.AmbientLight(0xF7F7F7, 0.3);
    scene.add(ambLight);

    // Directional Light
    dirLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    dirLight.position.set(LENGTH, 4 * HEIGHT, 0);
    lights.push(dirLight);
    scene.add(dirLight);

    // Spotlights
    spotLight1 = createSpotLight(0, 4 * HEIGHT - 5, LENGTH / 2 - LENGTH / 8, origami1);
    spotLight2 = createSpotLight(0, 4 * HEIGHT - 5, 0, origami2);
    spotLight3 = createSpotLight(0, 4 * HEIGHT - 5, -LENGTH / 2 + LENGTH / 8, origami3);

}

function createSpotLight(x, y, z, target) {

    const spotLight = new THREE.SpotLight(0xFFFFFF, 0.7);
    spotLight.position.set(x, y, z);
    spotLight.angle = Math.PI / 10;
    spotLight.target = target;
    spotLight.castShadow = true;
    lights.push(spotLight);
    scene.add(spotLight);

    return spotLight;

}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    createScene();

    setupLights();

    // Cameras
    orthographicCamera = createOrthographicCamera(0, 0, cameraDist);
    scene.add(orthographicCamera);

    perspectiveCamera = createCamera(2 * cameraDist, cameraDist / 2, 0);
    scene.add(perspectiveCamera);

    camera = perspectiveCamera;

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function flutatingAnimation() {

    const time = clock.getElapsedTime();

    origami1.position.y += Math.sin(time + 0.8) * 0.02;
    origami2.position.y += Math.sin(time) * 0.02;
    origami3.position.y += Math.sin(time + 1.6) * 0.02;

}

function animate() {
    'use strict';

    var clockDelta = clock.getDelta();
    const rotationStep = deltaAngle * speed * clockDelta;

    flutatingAnimation();

    // Rotation
    if (keyPressed[81] == true || keyPressed[113] == true) { //Q or q
        origami1.rotateY(-rotationStep);
    }
    if (keyPressed[87] == true || keyPressed[119] == true) { //W or w
        origami1.rotateY(rotationStep);
    }
    if (keyPressed[69] == true || keyPressed[101] == true) { //E or e
        origami2.rotateY(-rotationStep);
    }
    if (keyPressed[82] == true || keyPressed[114] == true) { //R or r
        origami2.rotateY(rotationStep);
    }
    if (keyPressed[84] == true || keyPressed[116] == true) { //T or t
        origami3.rotateY(-rotationStep);
    }
    if (keyPressed[89] == true || keyPressed[121] == true) { //Y or y
        origami3.rotateY(rotationStep);
    }

    render();

    requestAnimationFrame(animate);

}