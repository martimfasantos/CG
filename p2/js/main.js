/* global THREE */

var camera, scene, renderer;
var worldAxisHelper, rocketAxisHelper;
const clock = new THREE.Clock();

// Constants
const ROCKET = 1;
const ARROWUP = 38;
const ARROWDOWN = 40;
const ARROWRIGHT = 39;
const ARROWLEFT = 37;

// Translaction
var speed = 4;
const deltaAngle = 1/(3*Math.PI);

const maxSpeed = 8;
const minSpeed = 1;
const speedDelta = 1;

// Cameras
var defaultCamera, frontCamera, topCamera;
const cameraDist = 45;
const screenArea = screen.width * screen.height;

// Arrays
var materials = [];
var primitives = [];
var keyMap = [];
var junkSphCoords = []; // [junk1, junk2, ... , junkN]

// Objects
const R = 30;
const H = R/11;
const junks = 20;
const junkMaxSize = R/20;
const junkMinSize = R/24;
var objHitboxRadiuses = [] // [planet, rocket, junk1, junk2, ... , junkN];

var rocket;
var rocketSphCoords = {
    radius : null,
    phi : null,
    theta : null
}

function toCartesianCoords(radius, phi, theta) {

    const sinPhiRadius = Math.sin( phi ) * radius;

    const x = sinPhiRadius * Math.sin( theta );
    const y = Math.cos( phi ) * radius;
    const z = sinPhiRadius * Math.cos( theta );

    return new THREE.Vector3(x, y, z); /* format: (x, y, z) */
}

function toSphericalCoords(x, y, z) {

    const radius = Math.sqrt(x*x + y*y + z*z);
    var phi, theta;

    if (radius === 0) {
        phi = 0; 
        theta = 0;
    } else {
        phi = Math.acos( Math.max(-1, Math.min( 1, y / radius )));
        theta = (Math.atan2( x, z ) + (2*Math.PI)) % (2*Math.PI);
    }

    return new THREE.Vector3(radius, phi, theta); /* format: (x = radius, y = phi, z = theta) */

}

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

function createRandomPrimitive(sphericalCoords) {

    // Position
    const pos = new THREE.Vector3().setFromSpherical(sphericalCoords);

    // Settings
    const option = Math.random();
    const radius = 1/2 * (junkMinSize + Math.random()*(junkMaxSize - junkMinSize));
    const angle = Math.random()*360;

    var primitive;

    if (option < 0.25) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, 0, 0, 0x5A4D41,
            new THREE.SphereGeometry(radius, 5, 5), THREE.DoubleSide,
            new THREE.TextureLoader().load('../textures/rock2.jpg'));
    } else if ( 0.25 < option && option < 0.50) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, degreesToRadians(angle), 0, 0xFFFFF,
            new THREE.BoxGeometry(2*radius, 2*radius, 2*radius, 3, 3), THREE.DoubleSide,
            new THREE.TextureLoader().load('../textures/metal.jpg'));
    } else if ( 0.5 < option && option < 0.75) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, 0, 0x918E85,
            new THREE.IcosahedronGeometry(radius, 0), THREE.DoubleSide,
            new THREE.TextureLoader().load('../textures/rock.jpg'));
    } else {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, 0, 0xA9A9A9,
            new THREE.CylinderGeometry(0, radius, 2*radius, 3, 3), THREE.DoubleSide,
            new THREE.TextureLoader().load('../textures/comet.jpg'));
    }

    objHitboxRadiuses.push(radius);

    scene.add(primitive);
}

function createRocket(body, front, propellers) {

    rocket = new THREE.Object3D();
    rocket.add(body);
    rocket.add(front);
    rocket.add(propellers[0]);
    rocket.add(propellers[1]);
    rocket.add(propellers[2]);
    rocket.add(propellers[3]);

    // Rocket random start position
    rocketSphCoords.radius = 1.2 * R;
    rocketSphCoords.phi = Math.random() * Math.PI;
    rocketSphCoords.theta = Math.random() * (2*Math.PI);

    const initialPos = toCartesianCoords(rocketSphCoords.radius, rocketSphCoords.phi, rocketSphCoords.theta);
    rocket.position.x = initialPos.x;
    rocket.position.y = initialPos.y;
    rocket.position.z = initialPos.z;
    rocket.lookAt(0, 0, 0);
    
    scene.add(rocket);

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

function createRocketCamera(x, y, z) {
    'use strict';
    camera = new THREE.PerspectiveCamera( 70,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );

    rocket.add(camera);
    camera.position.z = 50;
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
    createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.SphereGeometry(R, 50, 50), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/planet.jpg'));

    /* hitbox */
    objHitboxRadiuses.push(R);

    // --------------------------------

    // rocket
    const bodyLength = 5*H/8;
    const frontLength = H/4;
    const propellerLength = H/4; 
    const bodyRadius = H/5;
    const propellerRadius = bodyRadius/3.5;
    
    const body = createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 25), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/body.jpg'));
    const front = createPrimitive(0, bodyLength/2 + frontLength/2, 0, 0, 0, 0, null,
        new THREE.CylinderGeometry(bodyRadius/7, bodyRadius, frontLength, 25), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/front.jpg'));
    const propeller1 = createPrimitive(bodyRadius, -bodyLength/2, 0, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/propeller.jpg'));
    const propeller2 = createPrimitive(0, -bodyLength/2, bodyRadius, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/propeller.jpg'));
    const propeller3 = createPrimitive(-bodyRadius, -bodyLength/2, 0, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/propeller.jpg'));
    const propeller4 = createPrimitive(0, -bodyLength/2, -bodyRadius, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        new THREE.TextureLoader().load('../textures/propeller.jpg'));

    /* Add hitboxes */
    objHitboxRadiuses.push(Math.max(H/2, bodyRadius + 2*propellerRadius))

    createRocket(body, front, [propeller1, propeller2, propeller3, propeller4]);

    // --------------------------------


    // Space junk
    for (var i = 0; i < junks; i++) {
        var sphericalCoords = new THREE.Spherical(1.2 * R, Math.random() * Math.PI, Math.random() * (2*Math.PI));

        while (junkSphCoords.includes(sphericalCoords)){
            sphericalCoords = new THREE.Spherical(1.2 * R, Math.random() * Math.PI, Math.random() * (2*Math.PI));
        }
        
        junkSphCoords.push(sphericalCoords);
        createRandomPrimitive(sphericalCoords);
    }

    // --------------------------------

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxesHelper(10);
    worldAxisHelper.visible = false;
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
            rocketAxisHelper.visible = !rocketAxisHelper.visible;
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
    renderer.setPixelRatio(window.devicePixelRatio);

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
    topCamera = createRocketCamera(rocket.position.x, rocket.position.y, rocket.position.z - 50);
    
    rocketAxisHelper = new THREE.AxesHelper(10);
    rocketAxisHelper.visible = false;
    rocket.add(rocketAxisHelper);

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function checkCollision() {

    const junkList = primitives.slice(7, primitives.length);
    var junkPos = new THREE.Vector3();

    // TODO VER APENAS NO SEMI HEMISFERIO -> VER COORDENADAS!
    for (var junk = 0; junk < junkList.length; junk++) {
        // Get junk position
        junkList[junk].getWorldPosition(junkPos);

        // Get rocket's position and compare to junk
        const distance = rocket.position.distanceTo(junkPos);

        if (distance <= objHitboxRadiuses[ROCKET] + objHitboxRadiuses[junk+2]) {
            junkList[junk].visible = false;
        }
    }

}

function animate() {
    'use strict';
    
    var clockDelta = clock.getDelta();
    const translationDelta = deltaAngle * speed * clockDelta;
    var phiDelta = 0, thetaDelta = 0;

    checkCollision();

    // Translation
    if (keyMap[ARROWUP] == true) { //ArrowUp
        if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2) { 
            phiDelta += translationDelta;
        } else { 
            phiDelta -= translationDelta;
        }
    }   

    if (keyMap[ARROWDOWN] == true) { //ArrowDown
        if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2) { 
            phiDelta -= translationDelta;
        } else { 
            phiDelta += translationDelta;
        }
    } 

    if (keyMap[ARROWRIGHT] == true) { //ArrowRight
        thetaDelta += translationDelta;
    }

    if (keyMap[ARROWLEFT] == true) { //ArrowLeft
        thetaDelta -= translationDelta;
        
    }

    /* Detects if there is movement */
    if ( phiDelta != 0 || thetaDelta != 0 ){
        // Normalize movement
        const normalized = new THREE.Vector2(phiDelta, thetaDelta).normalize();
        phiDelta = normalized.x * translationDelta;
        thetaDelta = normalized.y * translationDelta;

        // Move rocket
        const newPos = toCartesianCoords(rocketSphCoords.radius, rocketSphCoords.phi + phiDelta, 
                                                                rocketSphCoords.theta + thetaDelta);
        moveRocket(newPos);

    }

    render();

    requestAnimationFrame(animate);

    // Auxiliar functions
    function moveRocket(newPos) {

        rocket.position.x = newPos.x;
        rocket.position.y = newPos.y;
        rocket.position.z = newPos.z;

        // New rocketSphCoords
        const newCoords = toSphericalCoords(newPos.x, newPos.y, newPos.z);
        rocketSphCoords.phi = newCoords.y;
        rocketSphCoords.theta = newCoords.z;

        directRocket();

    }

    // Aux function
    function directRocket() {

        rocket.lookAt(0, 0, 0);

        // Combinations 
        if (keyMap[ARROWUP] == true && keyMap[ARROWRIGHT] == true 
        && keyMap[ARROWDOWN] == false && keyMap[ARROWLEFT] == false ) {     //ArrowUp + ArrowRight
            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2)
                rocket.rotateZ(Math.PI);
            rocket.rotateZ(Math.PI/4);

        } else if (keyMap[ARROWUP] == true && keyMap[ARROWLEFT] == true 
        && keyMap[ARROWDOWN] == false && keyMap[ARROWRIGHT] == false ) {   //ArrowUp + ArrowLeft
            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2)
                rocket.rotateZ(Math.PI);
            rocket.rotateZ(-Math.PI/4);

        } else if (keyMap[ARROWDOWN] == true && keyMap[ARROWRIGHT] == true 
        && keyMap[ARROWUP] == false && keyMap[ARROWLEFT] == false ) {       //ArrowDown + ArrowRight
            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2)
                rocket.rotateZ(Math.PI);
            rocket.rotateZ(-Math.PI/4);

        } else if (keyMap[ARROWDOWN] == true && keyMap[ARROWLEFT] == true 
        && keyMap[ARROWUP] == false && keyMap[ARROWRIGHT] == false ) {     //ArrowDown + ArrowLeft
            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2)
                rocket.rotateZ(Math.PI);
            rocket.rotateZ(Math.PI/4);
        
        } else if (keyMap[ARROWUP] == true) { //ArrowUp
            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2)
                rocket.rotateZ(Math.PI);           

        } else if (keyMap[ARROWDOWN] == true) { //ArrowDown
            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2)
                rocket.rotateZ(Math.PI);

        } else if (keyMap[ARROWRIGHT] == true) { //ArrowRight
            rocket.rotateZ(Math.PI/2);

        } else if (keyMap[ARROWLEFT] == true) { //ArrowLeft
            rocket.rotateZ(-Math.PI/2);
        }

    }
}