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
var speed = 4;
const deltaAngle = 1/(3*Math.PI);

const maxSpeed = 8;
const minSpeed = 1;
const speedDelta = 1;

// Cameras
var orthographicCamera, perspectiveCamera, rocketCamera;
const cameraDist = 35;
const cameraOffset = 10;
const screenArea = screen.width * screen.height;
const viewSize = 900;

// Arrays
var cameras = [];
var materials = [];
var primitives = []; // [earth, clouds, rocket1, ... , rocket6, junk1, junk2, ... , junkN];
var keyPressed = [];
var junkSphCoords = []; // [junk1, junk2, ... , junkN]
var junkPrimitivesPerQuadrant = [[], [], [], []]; // junk primitives divided by quadrants

// Objects
const R = 30;
const H = R/11;
const junks = 20;
const junkMaxSize = R/20;
const junkMinSize = R/24;

var rocket;
var rocketSphCoords = {
    radius : null,
    phi : null,
    theta : null
}

// Hitboxes
var rocketHitboxRadius;
var junkHitboxRadiuses = [[], [], [], []];

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

function chooseQuadrant(theta) {

    if (theta >= 0 && theta < Math.PI/2) return 0; // 1st quadrant
    else if (theta >= Math.PI/2 && theta < Math.PI) return 1; // 2nd quadrant
    else if (theta >= Math.PI && theta < 3*Math.PI/2) return 2; // 3rd quadrant
    else return 3; // 4th quadrant

}

function createPlanet(x, y, z){

    const textureLoader = new THREE.TextureLoader();
    
    // Earth
    const earth = new THREE.Object3D();

    const earthGeometry = new THREE.SphereGeometry(R, 50, 50);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/earth.jpg'),
        specularMap: textureLoader.load('../textures/earth_specular_map.tif')
    });

    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(x, y, z);
    earth.add(earthMesh);

    materials.push(earthMaterial);
    primitives.push(earth);
    
    scene.add(earthMesh);

    // Clouds
    const clouds = new THREE.Object3D();

    const cloudGeometry = new THREE.SphereGeometry(1.02*R, 32, 32);
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/earth_clouds.png'),
        transparent: true
    });

    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.position.set(x, y, z);
    clouds.add(cloudMesh);

    materials.push(cloudMaterial);
    primitives.push(clouds);
    
    scene.add(cloudMesh);

    return earth;

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

function chooseQuadrant(theta) {

    if (theta >= 0 && theta < Math.PI/2){
        return 0;
    }
    else if (theta >= Math.PI/2 && theta < Math.PI){
        return 1;
    }
    else if (theta >= Math.PI && theta < 3*Math.PI/2){
        return 2;
    }
    else {
        return 3;
    }

}

function createRandomPrimitive(sphericalCoords) {

    // Position
    const pos = toCartesianCoords(sphericalCoords.x, sphericalCoords.y, sphericalCoords.z);

    // Settings
    const option = Math.random();
    const radius = 1/2 * (junkMinSize + Math.random()*(junkMaxSize - junkMinSize));
    const angle = Math.random()*360;

    var primitive;
    const textureLoader = new THREE.TextureLoader();

    if (option < 0.25) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, 0, 0, 0x5A4D41,
            new THREE.SphereGeometry(radius, 5, 5), THREE.DoubleSide,
            textureLoader.load('../textures/rock2.jpg'));
    } else if ( 0.25 < option && option < 0.50) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, 0, degreesToRadians(angle), 0, 0xFFFFFF,
            new THREE.BoxGeometry(2*radius, 2*radius, 2*radius, 3, 3), THREE.DoubleSide,
            textureLoader.load('../textures/metal.jpg'));
    } else if ( 0.5 < option && option < 0.75) {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, 0, 0x918E85,
            new THREE.IcosahedronGeometry(radius, 0), THREE.DoubleSide,
            textureLoader.load('../textures/rock.jpg'));
    } else {
        primitive = createPrimitive(pos.x, pos.y, pos.z, degreesToRadians(angle), 0, 0, 0xA9A9A9,
            new THREE.CylinderGeometry(0, radius, 2*radius, 3, 3), THREE.DoubleSide,
            textureLoader.load('../textures/comet.jpg'));
    }

    const theta = sphericalCoords.z;
    const quadrant = chooseQuadrant(theta);

    junkPrimitivesPerQuadrant[quadrant].push(primitive);
    junkHitboxRadiuses[quadrant].push(radius);

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
    rocketSphCoords.radius = 1.2*R;
    rocketSphCoords.phi = Math.random() * Math.PI;
    rocketSphCoords.theta = Math.random() * (2*Math.PI);

    const initialPos = toCartesianCoords(rocketSphCoords.radius, rocketSphCoords.phi, rocketSphCoords.theta);
    rocket.position.x = initialPos.x;
    rocket.position.y = initialPos.y;
    rocket.position.z = initialPos.z;
    rocket.lookAt(0, 0, 0);

    // Rocket axis helper
    rocketAxisHelper = new THREE.AxesHelper(10);
    rocketAxisHelper.visible = false;
    rocket.add(rocketAxisHelper);
    
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

    camera.lookAt(scene.position);

    cameras.push(camera);

    return camera;
}

function createOrthographicCamera(x, y, z) {
    'use strict';
    const aspectRatio = window.innerWidth / window.innerHeight;
    var orthoCamera = new THREE.OrthographicCamera( aspectRatio * viewSize / - 20,
                                                       aspectRatio * viewSize / 20,
                                                       viewSize / 20, 
                                                       viewSize / -20, 
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
            
            camera.left = viewSize * aspectRatio / - 20;
            camera.right = viewSize * aspectRatio / 20;
            camera.top = viewSize / 20;
            camera.bottom = viewSize  / - 20;

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

    // Planet
    createPlanet(0, 0, 0);

    // --------------------------------

    // Rocket
    const bodyLength = 5*H/8;
    const frontLength = H/4;
    const propellerLength = H/4; 
    const bodyRadius = H/5;
    const propellerRadius = bodyRadius/3.5;
    
    const body = createPrimitive(0, 0, 0, 0, 0, 0, null,
        new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyLength, 25), THREE.DoubleSide,
        textureLoader.load('../textures/body.jpg'));
    const front = createPrimitive(0, bodyLength/2 + frontLength/2, 0, 0, 0, 0, null,
        new THREE.CylinderGeometry(bodyRadius/7, bodyRadius, frontLength, 25), THREE.DoubleSide,
        textureLoader.load('../textures/front.jpg'));
    const propeller1 = createPrimitive(bodyRadius, -bodyLength/2, 0, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        textureLoader.load('../textures/propeller.jpg'));
    const propeller2 = createPrimitive(0, -bodyLength/2, bodyRadius, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        textureLoader.load('../textures/propeller.jpg'));
    const propeller3 = createPrimitive(-bodyRadius, -bodyLength/2, 0, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        textureLoader.load('../textures/propeller.jpg'));
    const propeller4 = createPrimitive(0, -bodyLength/2, -bodyRadius, 0, 0, 0, null,
        new THREE.CapsuleGeometry( propellerRadius, propellerLength, 4, 8 ), THREE.DoubleSide,
        textureLoader.load('../textures/propeller.jpg'));

    /* Add hitboxes */
    rocketHitboxRadius = Math.max(H/2, bodyRadius + 2*propellerRadius);

    createRocket(body, front, [propeller1, propeller2, propeller3, propeller4]);

    // --------------------------------


    // Space junk
    for (var i = 0; i < junks; i++) {
        // Spaceship random start position
        var phi = Math.random() * Math.PI;
        var theta = Math.random() * (2*Math.PI);
        var sphericalCoords = new THREE.Vector3(1.2 * R, phi, theta);

        while (junkSphCoords.includes(sphericalCoords)){
            var phi = Math.random() * Math.PI;
            var theta = Math.random() * (2*Math.PI);
            var sphericalCoords = new THREE.Vector3(1.2 * R, phi, theta);
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
            camera = rocketCamera;
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
    
    // Spotlights for the shadows
    const light1 = new THREE.DirectionalLight(0x404040, 6);
    scene.add(light1);

    const light2 = new THREE.AmbientLight(0xF7F7F7, 1);
    scene.add(light2);

    // Cameras
    orthographicCamera = createOrthographicCamera(0, 0, cameraDist);
    scene.add(orthographicCamera);

    perspectiveCamera = createCamera(cameraDist, cameraDist, cameraDist);
    scene.add(perspectiveCamera);

    rocketCamera = createCamera(0, -cameraOffset, -cameraOffset/3);
    rocket.add(rocketCamera);

    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keyup", onKeyUp);

}

function checkCollision() {

    const quadrant = chooseQuadrant(rocketSphCoords.theta);
    const junkList = junkPrimitivesPerQuadrant[quadrant];
    var junkPos = new THREE.Vector3();

    for (var junk = 0; junk < junkList.length; junk++) {
        // Get junk position
        junkList[junk].getWorldPosition(junkPos);

        // Get rocket's position and compare to junk
        const distance = rocket.position.distanceTo(junkPos);

        if (distance <= rocketHitboxRadius + junkHitboxRadiuses[quadrant][junk]) {
            scene.remove(junkList[junk]);
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
    if (keyPressed[ARROWUP]) { //ArrowUp
        if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2) { 
            phiDelta += translationDelta;
        } else { 
            phiDelta -= translationDelta;
        }
    }   

    if (keyPressed[ARROWDOWN]) { //ArrowDown
        if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2) { 
            phiDelta -= translationDelta;
        } else { 
            phiDelta += translationDelta;
        }
    } 

    if (keyPressed[ARROWRIGHT]) { //ArrowRight
        thetaDelta += translationDelta;
    }

    if (keyPressed[ARROWLEFT]) { //ArrowLeft
        thetaDelta -= translationDelta;
        
    }

    /* Detects if there is movement */
    if ( phiDelta != 0 || thetaDelta != 0 ){

        // Normalize movement
        const normalized = new THREE.Vector2(phiDelta, thetaDelta).normalize();
        phiDelta = normalized.x * translationDelta;
        thetaDelta = normalized.y * translationDelta;

        // Move rocket
        const newRocketPos = toCartesianCoords(rocketSphCoords.radius, rocketSphCoords.phi + phiDelta, 
                                                                rocketSphCoords.theta + thetaDelta);                                                  
        moveRocket(newRocketPos);

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
        if (keyPressed[ARROWUP] && keyPressed[ARROWRIGHT] 
        && !keyPressed[ARROWDOWN] && !keyPressed[ARROWLEFT] ) {     //ArrowUp + ArrowRight

            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2){
                rocket.rotateZ(Math.PI);
                rocket.rotateZ(-Math.PI/4)
            } else {
                rocket.rotateZ(Math.PI/4);
            }
            
        } else if (keyPressed[ARROWUP] && keyPressed[ARROWLEFT] 
        && !keyPressed[ARROWDOWN] && !keyPressed[ARROWRIGHT] ) {   //ArrowUp + ArrowLeft

            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2){
                rocket.rotateZ(Math.PI);
                rocket.rotateZ(Math.PI/4);
            } else {
                rocket.rotateZ(-Math.PI/4);
            }

        } else if (keyPressed[ARROWDOWN] && keyPressed[ARROWRIGHT] 
        && !keyPressed[ARROWUP] && !keyPressed[ARROWLEFT] ) {       //ArrowDown + ArrowRight

            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2){
                rocket.rotateZ(Math.PI);
                rocket.rotateZ(-Math.PI/4);
            } else {
                rocket.rotateZ(Math.PI/4);
            }

        } else if (keyPressed[ARROWDOWN] && keyPressed[ARROWLEFT] 
        && !keyPressed[ARROWUP] && !keyPressed[ARROWRIGHT] ) {     //ArrowDown + ArrowLeft
            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2){
                rocket.rotateZ(Math.PI);
                rocket.rotateZ(Math.PI/4);
            } else {
                rocket.rotateZ(-Math.PI/4);
            }
        
        } else if (keyPressed[ARROWUP]) { //ArrowUp
            if (rocketSphCoords.theta > Math.PI/2 && rocketSphCoords.theta < 3*Math.PI/2)
                rocket.rotateZ(Math.PI);           

        } else if (keyPressed[ARROWDOWN]) { //ArrowDown
            if (rocketSphCoords.theta < Math.PI/2 || rocketSphCoords.theta > 3*Math.PI/2)
                rocket.rotateZ(Math.PI);

        } else if (keyPressed[ARROWRIGHT]) { //ArrowRight
            rocket.rotateZ(Math.PI/2);

        } else if (keyPressed[ARROWLEFT]) { //ArrowLeft
            rocket.rotateZ(-Math.PI/2);
        }

    }
}