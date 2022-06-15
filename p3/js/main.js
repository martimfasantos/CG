/* global THREE */

var camera, pauseCamera, scene, pauseScene, renderer;
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
const BASIC = 0;
const PHONG = 1;
const LAMBERT = 2;
const ON = 1;
const OFF = 0;

// Translaction
var speed = 14;
const deltaAngle = 1 / (3 * Math.PI);
const maxSpeed = 50;
const minSpeed = 2;
const speedDelta = 2;

// Cameras
var orthographicCamera, perspectiveCamera, pausedCamera;
const cameraDist = 35;
const cameraOffset = 10;
const viewSize = 90;

// Lights
const dirLightIntensity = 0.8;
const spotLightIntensity = 0.7;

// Arrays
var cameras = [];
var materials = [];
var primitives = [];
var lights = [];
var keyPressed = [];
var origamis = [];
var meshes = [];
var textures = [];

// Objects
var dirLight, spotLight1, spotLight2, spotLight3;
var bulb1, bulb2, bulb3;
var podium;
var origami1, origami2, origami3;
var pauseScreen;

// Variables
var chosenSpotlight, chosenBulb;
var isPaused = false;
var activeMaterial = PHONG;
var lastMaterial = undefined;


function createPrimitive(x, y, z, angleX, angleY, angleZ, color, geometry, side, texture, bump) {

    const primitive = new THREE.Object3D();

    const phongMaterial = new THREE.MeshPhongMaterial({ color: color, wireframe: false, side: side, map: texture, bumpMap: bump });
    const lambMaterial = new THREE.MeshLambertMaterial({ color: color, wireframe: false, side: side, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ color: color, wireframe: false, side: side, map: texture });

    const _geometry = geometry;
    const mesh = new THREE.Mesh(_geometry, phongMaterial);

    primitive.position.set(x, y, z);
    primitive.rotateX(angleX);
    primitive.rotateY(angleY);
    primitive.rotateZ(angleZ);
    primitive.add(mesh);

    // Sombra
    primitive.castShadow = true;
    primitive.receiveShadow = true;

    textures.push(texture);
    meshes.push(mesh);
    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);
    primitives.push(primitive);

    primitive.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(angleX, angleY, angleZ),
        initialText: texture
    }
    scene.add(primitive);

    return primitive;

}

function createPauseScreen() {

    const plane = new THREE.Object3D();

    const material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: new THREE.TextureLoader().load('../textures/paused.jpg'),
        // transparent: true,
        // opacity: 
    });

    const geometry = new THREE.PlaneGeometry(6, 5);
    const mesh = new THREE.Mesh(geometry, material);

    plane.position.set(0, 0, 0);
    plane.add(mesh);
    plane.rotation.y = Math.PI / 2;

    pauseScene.add(plane);

    return plane;
}

function whenPause() {

}

function whenResume() {

}

function resetInitialState() {
    'use strict';

    // Reset variables
    clock.start();
    speed = 14;
    isPaused = false;
    activeMaterial = PHONG;
    lastMaterial = undefined;

    // Reset initial parameters for every primitive / origami
    for (var i = 0; i < primitives.length; i++) {
        // Position
        primitives[i].position.x = primitives[i].userData.initialPos.x;
        primitives[i].position.y = primitives[i].userData.initialPos.y;
        primitives[i].position.z = primitives[i].userData.initialPos.z;

        // Rotation
        primitives[i].rotation.x = primitives[i].userData.initialRot.x;
        primitives[i].rotation.y = primitives[i].userData.initialRot.y;
        primitives[i].rotation.z = primitives[i].userData.initialRot.z;

        // Meshes
        meshes[i].material.dispose();
        meshes[i].material = materials[3 * i];
        meshes[i].material.map = primitives[i].userData.initialText;
        meshes[i].material.needsUpdate = true;
    }

    // Reset lights
    for (var i = 0; i < lights.length; i++) {
        if (lights[i].isDirectionalLight) {
            lights[i].intensity = dirLightIntensity;
        } else {
            lights[i].intensity = spotLightIntensity;
        }
    }

}

function toggleSpotLight(spotLight, bulb) {
    'use strict';
    if (spotLight.intensity) {
        spotLight.intensity = 0;
        bulb.children[0].material.map = new THREE.TextureLoader().load('../textures/bulbOFF.jpg');
    } else {
        spotLight.intensity = spotLightIntensity;
        bulb.children[0].material.map = new THREE.TextureLoader().load('../textures/bulbON.jpg');
    }
    bulb.children[0].material.needsUpdate = true;

}

function toggleLightCalculation() {
    'use strict';
    // Light calculation ON
    if (activeMaterial == BASIC) {
        if (lastMaterial == PHONG) {
            replaceMeshes(PHONG);
        } else if (lastMaterial == LAMBERT) {
            replaceMeshes(LAMBERT);
        }
        activeMaterial = lastMaterial;
        lastMaterial = BASIC;
    } else { // Light calculation OFF
        replaceMeshes(BASIC);
        lastMaterial = activeMaterial;
        activeMaterial = BASIC;
        console.log("changed to basic\n");
    }
}

function createCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
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
    orthoCamera.zoom = 1.7;
    orthoCamera.updateProjectionMatrix();

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

    origamiPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    origamiLambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    origamiBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

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

    // Duvida

    // const pointU = new THREE.Vector3(x, y + 5, z);
    // const pointR = new THREE.Vector3(x, y, z - 5);
    // const pointorigami3D = new THREE.Vector3(x, y - 5, z);
    // const pointL = new THREE.Vector3(x, y, z + 5);

    // const face1 = new THREE.Face(pointD, pointR, pointU);
    // origami1.add(face1);
    // const face2 = new THREE.Face(pointD, pointL, pointU);
    // origami1.add(face2);

    const mesh = new THREE.Mesh(geometry, origamiPhongMaterial);

    meshes.push(mesh);

    orig1.add(mesh);
    materials.push(origamiPhongMaterial);
    materials.push(origamiLambMaterial);
    primitives.push(orig1);
    scene.add(orig1);

    return orig1;

}

function createObjects() {

    const textureLoader = new THREE.TextureLoader();

    // Floor
    createPrimitive(0, 0, 0, Math.PI / 2, 0, 0, null,
        new THREE.PlaneGeometry(200, 200, 100, 100), THREE.DoubleSide,
        textureLoader.load('../textures/cobblestone.jpg'),
        textureLoader.load('../textures/cobblestone_bump.jpg'));

    // --------------------------------

    // Podium

    podium = new THREE.Object3D()
        .add(createPrimitive(0, 0, 0, 0, 0, 0, null,
            new THREE.BoxGeometry(1.5 * WIDTH, HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
            textureLoader.load('../textures/wood.jpg'), null))
        .add(createPrimitive(-1.25 * WIDTH, HEIGHT, 0, 0, 0, 0, null,
            new THREE.BoxGeometry(WIDTH, 3 * HEIGHT, LENGTH, 25, 25), THREE.DoubleSide,
            textureLoader.load('../textures/wood.jpg'), null))
    scene.add(podium);

    // Duvida: VER SHADOWS DOS OBJECTOS
    podium.castShadow = false;
    podium.receiveShadow = true;

    // add bump map and displacement map

    // --------------------------------

    // Spotlights

    /* --- Support --- */
    createPrimitive(0, 4 * HEIGHT + 2, 0, Math.PI / 2, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, LENGTH), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, (4 * HEIGHT + 2) / 2, LENGTH / 2 + 0.3, 0, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, 4 * HEIGHT + 2), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    createPrimitive(0, (4 * HEIGHT + 2) / 2, -LENGTH / 2 - 0.3, 0, 0, 0, null,
        new THREE.CylinderGeometry(0.3, 0.3, 4 * HEIGHT + 2), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);

    /* --- Right (Z) --- */
    createPrimitive(0, 4 * HEIGHT, LENGTH / 2 - LENGTH / 8, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 9, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    bulb1 = createPrimitive(0, 4 * HEIGHT - 5, LENGTH / 2 - LENGTH / 8, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/bulbON.jpg'), null);

    /* --- Center (X) --- */
    createPrimitive(0, 4 * HEIGHT, 0, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 9, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    bulb2 = createPrimitive(0, 4 * HEIGHT - 5, 0, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/bulbON.jpg'), null);

    /* --- Left (C) --- */
    createPrimitive(0, 4 * HEIGHT, -LENGTH / 2 + LENGTH / 8, 0, 0, 0, null,
        new THREE.ConeGeometry(6, 9, 32), THREE.DoubleSide,
        textureLoader.load('../textures/metal.jpg'), null);
    bulb3 = createPrimitive(0, 4 * HEIGHT - 5, -LENGTH / 2 + LENGTH / 8, 0, 0, 0, null,
        new THREE.SphereGeometry(3, 32, 16, 0, 2 * Math.PI, Math.PI / 2, Math.PI / 2), THREE.DoubleSide,
        textureLoader.load('../textures/bulbON.jpg'), null);



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

}

function replaceMeshes(material) {

    for (var i = 0; i < meshes.length; i++) {
        meshes[i].material.dispose();
        if (material == LAMBERT) {
            meshes[i].material = materials[3 * i];
        } else if (material == PHONG) {
            meshes[i].material = materials[3 * i + 1];
        } else if (material == BASIC) {
            meshes[i].material = materials[3 * i + 2];
        }
        meshes[i].material.needsUpdate = true;
    }
}

function createScenes() {
    'use strict';

    scene = new THREE.Scene();
    pauseScene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(25);
    worldAxisHelper.visible = false;
    scene.add(worldAxisHelper);

    createObjects();

}

function onKeyDown(e) {
    'use strict';

    keyPressed[e.keyCode] = true;

    switch (e.keyCode) {

        /* ----- Cameras ----- */

        case 49: //1
            camera = perspectiveCamera;
            break;
        case 50: //2
            camera = orthographicCamera;
            break;
        case 52: //4
            for (var i = 0; i < materials.length; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;

        case 65: //A
        case 97: //a
            const newMaterial = (activeMaterial == PHONG) ? LAMBERT : PHONG;
            replaceMeshes(newMaterial);
            activeMaterial = newMaterial;
            break;

        /* ----- Lights ----- */

        case 68: //D
        case 100://d
            dirLight.intensity = (dirLight.intensity == dirLightIntensity) ? 0 : dirLightIntensity;
            break;
        case 90: //Z
        case 122:
            toggleSpotLight(spotLight1, bulb1);
            break;
        case 88: //X
        case 120://x
            toggleSpotLight(spotLight2, bulb2);
            break;
        case 67: //C
        case 99: //c
            toggleSpotLight(spotLight3, bulb3);
            break;
        case 83: //S
        case 115: //s
            toggleLightCalculation();
            break;
        case 79: //O
        case 111://o
            if (isPaused) resetInitialState();
            break;

        /* ----- Pause / Resume / Reset ----- */

        case 32:  //Space
            isPaused = (!isPaused) ? true : false;
            break;
        case 51:  //3
            if (isPaused) resetInitialState();
            break;

        /* ----- Others ----- */

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
    renderer.autoClear = false;
    renderer.clear();
    renderer.render(scene, camera);
    if (isPaused) {
        renderer.clearDepth();
        renderer.render(pauseScene, pauseCamera);
    }
}

function setupLights() {
    'use strict';
    const ambLight = new THREE.AmbientLight(0xF7F7F7, 0.3);
    scene.add(ambLight);

    const ambLightPause = new THREE.AmbientLight(0xF7F7F7, 0.3);
    pauseScene.add(ambLightPause);

    // Directional Light
    dirLight = new THREE.DirectionalLight(0xFFFFFF, dirLightIntensity);
    dirLight.position.set(LENGTH, 4 * HEIGHT, 0);
    lights.push(dirLight);
    scene.add(dirLight);

    // Spotlights
    spotLight1 = createSpotLight(0, 4 * HEIGHT - 5, LENGTH / 2 - LENGTH / 8, origami1);
    spotLight2 = createSpotLight(0, 4 * HEIGHT - 5, 0, origami2);
    spotLight3 = createSpotLight(0, 4 * HEIGHT - 5, -LENGTH / 2 + LENGTH / 8, origami3);

}

function createSpotLight(x, y, z, target) {

    const spotLight = new THREE.SpotLight(0xFFFFFF, spotLightIntensity);
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

    renderer.xr.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(renderer.domElement);

    document.body.appendChild( VRButton.createButton( renderer ) );

    createScenes();
    setupLights();

    // Cameras
    perspectiveCamera = createCamera(2 * cameraDist, 3 * cameraDist / 4, 0);
    scene.add(perspectiveCamera);
    orthographicCamera = createOrthographicCamera(3 * cameraDist, cameraDist, 0);
    orthographicCamera.lookAt(podium.position.x, podium.position.y + cameraDist / 2.1, podium.position.z)
    scene.add(orthographicCamera);

    camera = perspectiveCamera;

    pauseCamera = createOrthographicCamera(0, 0, 4 * cameraDist);
    pauseCamera.lookAt(pauseScene);
    pauseScene.add(pauseCamera);
    createPauseScreen();

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function fluctuatingAnimation() {

    const time = clock.getElapsedTime();

    origami1.position.y += Math.sin(time + 0.8) * 0.02;
    origami2.position.y += Math.sin(time) * 0.02;
    origami3.position.y += Math.sin(time + 1.6) * 0.02;

}

function animate() {
    'use strict';

    if (!isPaused) {

        var clockDelta = clock.getDelta();
        const rotationStep = deltaAngle * speed * clockDelta;

        fluctuatingAnimation();

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

    }

    render();

    renderer.setAnimationLoop(animate);

}