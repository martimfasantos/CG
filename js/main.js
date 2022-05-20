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
const viewSize = 100;

// Arrays
var materials = [];
var primitives = [];
var keyMap = [];

// Articulated Object
var lamp = { base : null,
             neck : null,
             lampshade : null
            };


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

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}

function createLamp(x, y, z, angle_x, angle_y, angle_z){

    const lampshade = createPrimitive( x, y + 16.9 , z + 7, angle_x + degreesToRadians(115), angle_y, angle_z, 0xF5F5F5,
        new THREE.CylinderGeometry(4.5, 1, 6, 20, 20, openEnded = true), THREE.DoubleSide, null);
    
    const curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( 0, 18, 4.5 ),
        new THREE.Vector3( 0, 20, 0 ),
        new THREE.Vector3( 0, 0.5, 0 )] );

    const neck = createPrimitive(x, y, z, 0, 0, 0, 0xA8A8A8,
        new THREE.TubeGeometry(curve, 20, 1, 8, closed = false), THREE.DoubleSide, null);
    neck.add(lampshade);

    const base = createPrimitive(x, y, z, angle_x, angle_y, angle_z, 0xA89F7B,
        new THREE.CylinderGeometry(3.5, 4.2, 1, 18), THREE.DoubleSide, null);
    base.add(neck);    

    // Create object Lamp
    lamp.base = base;
    lamp.neck = neck;
    lamp.lampshade = lampshade;

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
    createPrimitive(14, 26, 0, 0, 0, 0, 0x40E0D0,
        new THREE.SphereGeometry(6, 10, 10), THREE.DoubleSide, null);
    createPrimitive(14, 26, 0, degreesToRadians(90), degreesToRadians(-15), 0, 0xAD3141,
        new THREE.TorusGeometry(8, 0.8, 3, 20), THREE.DoubleSide, null);
    createPrimitive(23, 28, 3, 0, 0, 0, 0xB98D64,
        new THREE.SphereGeometry(1.2, 5, 5), THREE.DoubleSide, null);

    // --------------------------------

    // Roller
    createPrimitive(5, -5, 18, degreesToRadians(90), 0, 0, 0xB87333,
        new THREE.CylinderGeometry(5, 5, 16, 35), THREE.DoubleSide, null);
    createPrimitive(5, -5, 26, 0, 0, 0, 0xB98D64,
        new THREE.SphereGeometry(3, 10, 10, 0, Math.PI), THREE.DoubleSide, null);
    createPrimitive(5, -5, 10, 0, 0, 0, 0xB98D64,
        new THREE.SphereGeometry(3, 10, 10, Math.PI, Math.PI), THREE.DoubleSide, null);

    // --------------------------------
    
    // Hammer
    var length = 5, width = 3;

    shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    var extrudeSettings = {
        amount: 15,
        steps: 5,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 2.5,
        bevelSize: 2,
        bevelOffset: 4,
        bevelSegments: 2
    };

    createPrimitive(15, 7, -18, degreesToRadians(80), degreesToRadians(-10), 0, 0x43464B,
        new THREE.ExtrudeGeometry(shape, extrudeSettings), THREE.DoubleSide, null);
    createPrimitive(16.2, 2.5, -2, degreesToRadians(80), degreesToRadians(-10), 0, 0x754C24,
        new THREE.CylinderGeometry(1.3, 1.2, 20, 10), THREE.DoubleSide, null);
    createPrimitive(16.2, 4.7, 9.7, degreesToRadians(-20), degreesToRadians(30), 0, 0x60646B,
        new THREE.IcosahedronGeometry(2.2, 1), THREE.DoubleSide, null);
    
    // --------------------------------
    
    // Ice Cream
    createPrimitive(-11, -3, 17, 0, 0, degreesToRadians(180), 0xCDA26F,
        new THREE.ConeGeometry(4, 18, 20), THREE.DoubleSide, null);
    createPrimitive(-11, 6, 17, 0, 0, 0, 0xE77DA3,
        new THREE.SphereGeometry(4, 20, 16, 0, 2*Math.PI, -Math.PI/2), THREE.DoubleSide, null);
    createPrimitive(-11, 12, 17, 0, 0, 0, 0xFAF6E3,
        new THREE.SphereGeometry(4, 10, 16, 0, 2*Math.PI, 0, Math.PI-0.7), THREE.DoubleSide, null);
    
    // --------------------------------

    // Cylinder with donut
    createPrimitive(-20, 23, 8, degreesToRadians(70), 0, 0, 0x8557CB,
        new THREE.CylinderGeometry(2, 4, 40, 18), THREE.DoubleSide, null);
    createPrimitive(-20, 23, 8, degreesToRadians(-20), 0, 0, 0x957DAD,
        new THREE.TorusGeometry(5, 2, 16, 20), THREE.DoubleSide, null);

    // --------------------------------
    
    // Random Box
    createPrimitive(-8, 33, -10, degreesToRadians(45), degreesToRadians(45), degreesToRadians(45), 0xff6600,
        new THREE.BoxGeometry(8, 8, 8, 2, 2), THREE.DoubleSide, null);

    // --------------------------------

    // Panel
    createPrimitive(13, 25, -15, degreesToRadians(45), degreesToRadians(90), degreesToRadians(-30), 0x437f5b,
        new THREE.BoxGeometry(1, 20, 25, 30, 20), THREE.DoubleSide, null);
        
    // --------------------------------


    // Articulated Object
    createLamp(0, 0, 0, degreesToRadians(0), degreesToRadians(0), degreesToRadians(0));

}

function createScene() {
    'use strict';

    scene = new THREE.Scene();

    worldAxisHelper = new THREE.AxisHelper(10);
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