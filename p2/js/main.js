/* global THREE */

var camera, scene, renderer;
var worldAxisHelper, spaceshipAxisHelper;
const clock = new THREE.Clock();

// Translaction
var speed = 8;
const deltaAngle = 1/(2*Math.PI);

const maxSpeed = 20;
const minSpeed = 2;
const speedDelta = 2;

// Cameras
var defaultCamera, frontCamera, topCamera;
const cameraDist = 45;
const screenArea = screen.width * screen.height;

// Arrays
var materials = [];
var primitives = [];
var keyMap = [];
var primitivesRadius = [];

// Objects
const R = 40;
const junks = 20;
const junkMaxSize = R/20;
const junkMinSize = R/24;
const spaceshipHitboxRadius = R/10+R/7.5;
var objSphCoords = []; // [spaceship, junk1, junk2, ... , junkN]
var spaceship;


function createPrimitive(x, y, z, angle_x, angle_y, angle_z, color, geometry, side, texture){

    const primitive = new THREE.Object3D();
    
    const material = new THREE.MeshPhongMaterial({ color: color, wireframe: true, side: side, map: texture});
    const _geometry = geometry;
    const mesh = new THREE.Mesh(_geometry, material);

    primitive.position.set(x, y, z);
    primitive.rotateX(angle_x);
    primitive.rotateY(angle_y);
    primitive.rotateZ(angle_z);
    primitive.add(mesh);

    materials.push(material);
    primitives.push(primitive);
    scene.add(primitive);

    return primitive;

}

function createRandomPrimitive(sphericalCoords) {

    // Position
    const pos = new THREE.Vector3().setFromSpherical(sphericalCoords);

    // Settings
    const option = Math.random();
    const size = junkMinSize + Math.random()*(junkMaxSize - junkMinSize);
    const angle = Math.random()*360;
    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    var primitive;

    if (option < 0.33) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, 0, 0, randomColor,
            new THREE.SphereGeometry(size, 10, 10), THREE.DoubleSide, null);
        primitivesRadius.push(size);
    } else if ( 0.33 < option && option < 0.66) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, degreesToRadians(angle), 0, randomColor,
            new THREE.BoxGeometry(size, size, size, 10, 10), THREE.DoubleSide, null);
        primitivesRadius.push(size);
    } else {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, 0, randomColor,
            new THREE.IcosahedronGeometry(size, 0), THREE.DoubleSide, null);
        primitivesRadius.push(size);
    }

    scene.add(primitive);
}

function createSpaceship(body, front, propellers) {

    spaceship = new THREE.Object3D();
    spaceship.add(body);
    spaceship.add(front);
    spaceship.add(propellers[0]);
    spaceship.add(propellers[1]);
    spaceship.add(propellers[2]);
    spaceship.add(propellers[3]);

    // Spaceship random start position
    const sphericalCoords = new THREE.Spherical(1.2 * R, Math.random() * Math.PI, Math.random() * (2*Math.PI));
    spaceship.position.setFromSpherical(sphericalCoords);
    spaceship.lookAt(0, 0, 0);
    
    scene.add(spaceship);

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

    // Point Light
    // const light = new THREE.PointLight(0xffffff, 1);
    // camera.add(light);

    camera.lookAt(scene.position);

    return camera;
}

function createOrthographicCamera(x, y, z) {
    'use strict';

    var orthographicCamera = new THREE.OrthographicCamera( window.innerWidth / - 20,
                                                       window.innerWidth / 20,
                                                       window.innerHeight / 20, 
                                                       window.innerHeight / -20, 
                                                       1, 
                                                       1000 );
    // Position
    orthographicCamera.position.x = x;
    orthographicCamera.position.y = y;
    orthographicCamera.position.z = z;

    // Point Light
    //const light = new THREE.PointLight(0xffffff, 1);
    //camera.add(light);
    
    orthographicCamera.lookAt(scene.position);

    return orthographicCamera;
    
}

function resizeCamera(camera){
    'use strict';

    if (camera instanceof THREE.OrthographicCamera){

        const windowArea = window.innerWidth * window.innerHeight;
        camera.left = window.innerWidth / - 20;
        camera.right = window.innerWidth / 20;
        camera.top = window.innerHeight / 20;
        camera.bottom = window.innerHeight  / - 20;

        camera.zoom = windowArea / screenArea;

    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
    } 
            
    camera.updateProjectionMatrix();

}

function onWindowResize() {
    'use strict';
    
    resizeCamera(defaultCamera);
    resizeCamera(frontCamera);
    resizeCamera(topCamera);

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function createObjects() {


    // Planet
    createPrimitive(0, 0, 0, 0, 0, 0, 0xA17D54,
        new THREE.SphereGeometry(R, 20, 20), THREE.DoubleSide, null);
    primitivesRadius.push(R);

    // --------------------------------

    // Spaceship
    const radius = R/17;
    const length = R/5;
    const body = createPrimitive(0, 0, 0, 0, 0, 0, 0xC8BFBF,
        new THREE.CylinderGeometry(radius, radius, length, 25), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/2);
    const front = createPrimitive(0, length/2 + length/3, 0, 0, 0, 0, 0xF96262,
        new THREE.CylinderGeometry(radius/7, radius, length/1.5, 25), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/3);
    const propeller1 = createPrimitive(radius, -length/2, 0, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/6); 
    const propeller2 = createPrimitive(0, -length/2, radius, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/6);
    const propeller3 = createPrimitive(-radius, -length/2, 0, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/6);
    const propeller4 = createPrimitive(0, -length/2, -radius, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    primitivesRadius.push(1.1*length/6);

    createSpaceship(body, front, [propeller1, propeller2, propeller3, propeller4]);

    // --------------------------------

    // Space junk
    for (var i = 0; i < junks; i++) {
        var sphericalCoords = new THREE.Spherical(1.2 * R, Math.random() * Math.PI, Math.random() * (2*Math.PI));

        while (objSphCoords.includes(sphericalCoords)){
            sphericalCoords = new THREE.Spherical(1.2 * R, Math.random() * Math.PI, Math.random() * (2*Math.PI));
        }
        
        createRandomPrimitive(sphericalCoords);
    }

    // --------------------------------

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(10);
    scene.add(worldAxisHelper);

    const light = new THREE.AmbientLight(0xFFFFFF);
    scene.add(light);

    createObjects();

}

function onKeyDown(e) {
    'use strict';

    keyMap[e.keyCode] = true;

    switch (e.keyCode) {
        case 49: //1
            camera = frontCamera;
            break;
        case 50: //2
            camera = defaultCamera;
            break;
        case 51: //3
            camera = topCamera;
            break; 
        case 52: //4
            for (var i = 0; i < materials.length; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;
        case 69:  //E
        case 101: //e
            worldAxisHelper.visible = !worldAxisHelper.visible;
            spaceshipAxisHelper.visible = !spaceshipAxisHelper.visible;
            break;
        case 77:  //M
        case 109: //m
            if (speed + speedDelta < maxSpeed) {
                speed += speedDelta; 
                console.log(speed);
            }
            break;
        case 78:  //N
        case 110: //n
            if (speed - speedDelta > minSpeed) {
                speed -= speedDelta;
                console.log(speed);
            }
            break;
        default:
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    keyMap[e.keyCode] = false;
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    createScene();
    
    // Spotlights for the shadows
    var spotLight1 = new THREE.SpotLight(0xffffff);
    spotLight1.position.set(0, 30, 60);
    spotLight1.castShadow = true;
    spotLight1.intensity = 0.5;
    scene.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(30, -60, 0);
    spotLight2.castShadow = true;
    spotLight2.intensity = 0.5;
    scene.add(spotLight2);

    // Cameras
    frontCamera = createOrthographicCamera(0, 0, cameraDist);
    defaultCamera = createCamera(cameraDist, cameraDist, cameraDist);
    topCamera = createCamera(spaceship.position.x, spaceship.position.y, spaceship.position.z - cameraDist);
    

    spaceship.add(topCamera);
    
    spaceshipAxisHelper = new THREE.AxesHelper(10);
    spaceship.add(spaceshipAxisHelper);

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function checkcollision() {

    var worldPosition1 = new THREE.Vector3();
    var worldPosition2 = new THREE.Vector3();

    primitives[1].getWorldPosition(worldPosition1);
    for (var i = 7; i<primitives.length; i++) {
        primitives[i].getWorldPosition(worldPosition2);
        var distance = worldPosition1.distanceTo(worldPosition2);
        if (distance <= spaceshipHitboxRadius + primitivesRadius[i]) {
            primitives[i].visible = false;
        }
    }

}

function animate() {
    'use strict';
    
    var clockDelta = clock.getDelta();
    const translationDelta = deltaAngle * speed * clockDelta;

    checkcollision();

    // Translation
    if (keyMap[38] == true) { //ArrowUp
        const oldPos = new THREE.Spherical().setFromVector3(spaceship.position);
        var newPos;
        if (oldPos.theta < 0) {
            newPos = new THREE.Spherical(oldPos.radius, oldPos.phi + translationDelta, oldPos.theta);
        } else { 
            newPos = new THREE.Spherical(oldPos.radius, oldPos.phi - translationDelta, oldPos.theta);
        }
        directSpacheship(newPos);
        spaceship.position.setFromSpherical(newPos);
    }   

    if (keyMap[40] == true) { //ArrowDown
        const oldPos = new THREE.Spherical().setFromVector3(spaceship.position);
        var newPos;
        if (oldPos.theta < 0) { 
            newPos = new THREE.Spherical(oldPos.radius, oldPos.phi - translationDelta, oldPos.theta);
        } else { 
            newPos = new THREE.Spherical(oldPos.radius, oldPos.phi + translationDelta, oldPos.theta);
        }
        directSpacheship(newPos);
        spaceship.position.setFromSpherical(newPos);
    } 

    if (keyMap[39] == true) { //ArrowRight
        const oldPos = new THREE.Spherical().setFromVector3(spaceship.position);
        const newPos = new THREE.Spherical(oldPos.radius, oldPos.phi, oldPos.theta + translationDelta);
        directSpacheship(newPos);
        spaceship.position.setFromSpherical(newPos);
    }

    if (keyMap[37] == true) { //ArrowLeft
        const oldPos = new THREE.Spherical().setFromVector3(spaceship.position);
        const newPos = new THREE.Spherical(oldPos.radius, oldPos.phi, oldPos.theta - translationDelta);
        directSpacheship(newPos);
        spaceship.position.setFromSpherical(newPos);
    }

    // Aux function
    function directSpacheship(newPos) {

        spaceship.lookAt(0, 0, 0);
        topCamera.lookAt(spaceship.position.x, spaceship.position.y, spaceship.position.z);

        // Combinations 
        if (keyMap[38] == true && keyMap[39] == true) { //ArrowUp + ArrowRight
            if (newPos.theta < 0)
               spaceship.rotateZ(Math.PI);
            spaceship.rotateZ(Math.PI/4);

        } else if (keyMap[38] == true && keyMap[37] == true) { //ArrowUp + ArrowLeft
            if (newPos.theta < 0)
                spaceship.rotateZ(Math.PI);
            spaceship.rotateZ(-Math.PI/4);

        } else if (keyMap[40] == true && keyMap[39] == true) { //ArrowDown + ArrowRight
            if (newPos.theta > 0)
                spaceship.rotateX(-Math.PI);
            spaceship.rotateZ(Math.PI/4);

        } else if (keyMap[40] == true && keyMap[37] == true) { //ArrowDown + ArrowLeft
            if (newPos.theta > 0)
                spaceship.rotateX(-Math.PI);
            spaceship.rotateZ(-Math.PI/4);
        }

        else if (keyMap[38] == true) { //ArrowUp
            if (newPos.theta < 0)
                spaceship.rotateZ(Math.PI);           

        } else if (keyMap[40] == true) { //ArrowDown
            if (newPos.theta > 0)
                spaceship.rotateZ(Math.PI);

        } else if (keyMap[39] == true) { //ArrowRight
            spaceship.rotateZ(Math.PI/2);

        } else if (keyMap[37] == true) { //ArrowLeft
            spaceship.rotateZ(-Math.PI/2);
        }

    }

    render();

    requestAnimationFrame(animate);
}