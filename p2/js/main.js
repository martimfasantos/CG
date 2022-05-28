/* global THREE */

var camera, scene, renderer;
var worldAxisHelper;
var clock = new THREE.Clock();

// Rotation
var speed = 35;
const distance = 1;
const angle = 0.05;

// Cameras
var defaultCamera, frontCamera, topCamera, lateralCamera;
const cameraDist = 45;
const screenArea = screen.width * screen.height;

// Arrays
var materials = [];
var primitives = [];
var keyMap = [];

// Objects
const R = 20;
const junks = 20;
const junkMaxSize = 3;
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

function createRandomPrimitive(pos) {

    const option = Math.random();
    const size = Math.random()*junkMaxSize;
    const angle = Math.random()*360;
    var primitive;

    if (option < 0.33) {
        primitive = createPrimitive(pos.x, -pos.y, pos.z, 0, 0, 0, 0xB98D64,
            new THREE.SphereGeometry(size, 10, 10, 0, Math.PI), THREE.DoubleSide, null);
    } else if ( 0.33 < option < 0.66) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, degreesToRadians(angle), 0x437f5b,
            new THREE.BoxGeometry(size, 1/2 * size, size, 30, 20), THREE.DoubleSide, null);
    } else {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(-20), 0, 0, 0x60646B,
            new THREE.IcosahedronGeometry(3 * size/junkMaxSize, 1), THREE.DoubleSide, null);
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
    spaceship.position.set(0, 1.2*R, -1.2*R);
    spaceship.rotateX(Math.PI/2);
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
    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);

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
    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);
    
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
    resizeCamera(lateralCamera);

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function createObjects() {


    // Planet
    createPrimitive(0, 0, 0, 0, 0, 0, 0xA17D54,
        new THREE.SphereGeometry(R, 20, 20), THREE.DoubleSide, null);

    // --------------------------------

    // Spaceship
    const radius = R/21;
    const length = R/7;
    const body = createPrimitive(0, 1.2*R, 0, 0, 0, 0, 0xC8BFBF,
        new THREE.CylinderGeometry(radius, radius, length, 30), THREE.DoubleSide, null);
    const front = createPrimitive(0, 1.2*R + length/2 + length/3, 0, 0, 0, 0, 0xF96262,
        new THREE.CylinderGeometry(radius/8, radius, length/1.5, 30), THREE.DoubleSide, null);
    const propeller1 = createPrimitive(radius, 1.2*R - length/2, 0, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    const propeller2 = createPrimitive(0, 1.2*R-length/2, radius, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    const propeller3 = createPrimitive(-radius, 1.2*R-length/2, 0, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);
    const propeller4 = createPrimitive(0, 1.2*R-length/2, -radius, 0, 0, 0, 0x8F8383,
        new THREE.CapsuleGeometry( radius/3, length/3, 4, 8 ), THREE.DoubleSide, null);

    createSpaceship(body, front, [propeller1, propeller2, propeller3, propeller4]);

    // --------------------------------

    // Space junk
    for (var i = 0; i < junks; i++) {
        var spherical_coord = new THREE.Spherical(1.2*R, Math.random() * (2*Math.PI), Math.random() * Math.PI);
        const pos = new THREE.Vector3().setFromSpherical(spherical_coord);

        createRandomPrimitive(pos);
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
        case 48: //0
            camera = defaultCamera;
            break;
        case 49: //1
            camera = frontCamera;
            break;
        case 50: //2
            camera = topCamera;
            break;
        case 51: //3
            camera = lateralCamera;
            break; 
        case 52: //4
            for (var i = 0; i < materials.length; i++) {
                materials[i].wireframe = !materials[i].wireframe;
            }
            break;
        case 69:  //E
        case 101: //e
            worldAxisHelper.visible = !worldAxisHelper.visible;
            break;
        case 77:  //M
        case 109: //m
            if (speed < 300) {
                speed += 10; 
                console.log(speed);
            }
            break;
        case 78:  //N
        case 110: //n
            if (speed > 10) {
                speed -= 10;
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
    defaultCamera = createCamera(cameraDist, cameraDist, cameraDist);
    frontCamera = createOrthographicCamera(0, 0, cameraDist);
    topCamera = createOrthographicCamera(0, cameraDist, 0);
    lateralCamera = createOrthographicCamera(cameraDist, 0, 0);

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function animate() {
    'use strict';
    
    var delta = clock.getDelta();
    const rotationStep = angle * speed * delta;
    const translationStep = distance * speed * delta;

    // Translation
    if (keyMap[38] == true) { //ArrowUp
        lamp.base.position.y += translationStep;
    }    
    if (keyMap[40] == true) { //ArrowDown
        lamp.base.position.y -= translationStep;
    } 
    if (keyMap[39] == true) { //ArrowRight
        lamp.base.position.x += translationStep;
    }
    if (keyMap[37] == true) { //ArrowLeft
        lamp.base.position.x -= translationStep;
    }
    if (keyMap[68] == true || keyMap[100] == true) { //D or d
        lamp.base.position.z += translationStep;
    }  
    if (keyMap[67] == true || keyMap[99] == true) { //C or c
        lamp.base.position.z -= translationStep;
    }

    // Rotation
    if (keyMap[81] == true || keyMap[113] == true) { //Q or q
        lamp.base.rotateX( rotationStep );
    }
    if (keyMap[87] == true || keyMap[119] == true) { //W or w
        lamp.base.rotateX( -rotationStep );
    }
    if (keyMap[65] == true || keyMap[97] == true) { //A or a
        lamp.neck.rotateY( rotationStep );
    }
    if (keyMap[83] == true || keyMap[115] == true) { //S or s
        lamp.neck.rotateY( -rotationStep );
    }
    if (keyMap[90] == true || keyMap[122] == true) { //Z or z
        lamp.lampshade.rotateY( rotationStep );
    }
    if (keyMap[88] == true || keyMap[120] == true) { //X or x
        lamp.lampshade.rotateY( -rotationStep );
    }

    render();

    requestAnimationFrame(animate);
}