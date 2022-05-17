/* global THREE */

/* TODO 
    ERROS A CORRIGIR
    - render chamado multiplas vezes - evitar chamar tantas vezes o render
    (desenhar table, perna, perna, perna, perna then render)
*/

var camera, scene, renderer;
var clock = new THREE.Clock();

var speed = 1;
const delta = 0;
const distance = 1;
const angle = 0.05
var rotationLimit = 0;

var cameras = [];
var objs = [];
var keyMap = [];

var lamp;

class ArticulatedObject {

    constructor(base, middle, top){
        this._base = base;
        this._middle = middle;
        this._top = top;
    }

    move_x(distance) {
        this._base.position.x += distance;
        this._middle.position.x += distance;
        this._top.position.x += distance;
    }

    move_y(distance) {
        this._base.position.y += distance;
        this._middle.position.y += distance;
        this._top.position.y += distance;
    }

    move_z(distance) {
        this._base.position.z += distance;
        this._middle.position.z += distance;
        this._top.position.z += distance;
    }

    rotate_base_y(angle) { 
        this._base.rotation.y += angle;
        this._middle.rotation.y += angle;
        this._top.rotation.y += angle;
    }

    rotate_middle_y(angle) {
        this._middle.rotation.y += angle;
        this._top.rotation.y += angle;
    }

    rotate_top_y(angle) {
        this._top.rotation.y += angle;
    }

}

function createPrimitive(x, y, z, angle_x, angle_y, angle_z, color, geometry, side, texture){

    const primitive = new THREE.Object3D();
    
    // const texture = new THREE.TextureLoader().load('textures/rubiks_cube.jpg');

    const material = new THREE.MeshPhongMaterial({ color: color, wireframe: true, side: side/*, map: texture */ });
    const _geometry = geometry
    const mesh = new THREE.Mesh(_geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    primitive.add(mesh);

    objs.push(primitive);
    scene.add(primitive);

    return primitive;

}

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}

function createLamp(x, y, z, angle_x, angle_y, angle_z){

    const base = createPrimitive(x, y, z, angle_x, angle_y, angle_z, 0xA89F7B,
        new THREE.CylinderGeometry(3.5, 4, 1, 18), THREE.DoubleSide, null);
    
    var curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( 0, 18, 4.5 ),
        new THREE.Vector3( 0, 20, 0 ),
        new THREE.Vector3( 0, 0.5, 0 )]);

    const neck = createPrimitive(x, y, z, 0, 0, 0, 0xA8A8A8,
        new THREE.TubeGeometry(curve, 20, 1, 8, closed = false), THREE.DoubleSide, null);
    const lampshade = createPrimitive( x, y + 16.9 , z + 7, angle_x + degreesToRadians(115), angle_y, angle_z, 0xF5F5F5,
        new THREE.CylinderGeometry(4.5, 1, 6, 20, 20, openEnded = true), THREE.DoubleSide, null);

    lamp = new ArticulatedObject(base, neck, lampshade);

}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera( 70,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );
    // Position
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;

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
                                                       window.innerHeight / - 20, 
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

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera( 70,
                                          window.innerWidth / window.innerHeight,
                                          1,
                                          1000 );
    // Position
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;

    // point light
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
                                                       window.innerHeight / - 20, 
                                                       1, 
                                                       1000 );
    // Position
    orthographicCamera.position.x = x;
    orthographicCamera.position.y = y;
    orthographicCamera.position.z = z;

    // point light
    const light = new THREE.PointLight(0xffffff, 1);
    camera.add(light);
    
    orthographicCamera.lookAt(scene.position);

    return orthographicCamera;
}


function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

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

    // Random mambo
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
    
    scene.add(new THREE.AxisHelper(10));

    const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
    scene.add( light );

    createObjects();

}

function onKeyDown(e) {
    'use strict';

    keyMap[e.keyCode] = true;

    switch (e.keyCode) {
        case 48: //0
            camera = cameras[0]
            break;
        case 49: //1
            camera = cameras[1]
            break;
        case 50: //2
            camera = cameras[2]
            break;
        case 51: //3
            camera = cameras[3]
            break; 
        case 52: //4
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;
        case 69:  //E
        case 101: //e
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper) {
                    node.visible = !node.visible;
                }
            });
            break;
        case 171: //+
        case 107: //Numpad+
            if (speed < 2) {
                speed += 0.05; 
                console.log(speed);
            }
            break;
        case 173: //-
        case 109: //Numpad-
            if (speed > 0.05) {
                speed -= 0.05;
                console.log(speed);
            }
            break;
        default:
            movement();
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    keyMap[e.keyCode] = false;
}

function movement() {
    'use strict';

    const step = angle * speed;

    // Translation
    if (keyMap[38] == true) { //ArrowUp
        lamp.move_y( distance );
    }    
    if (keyMap[40] == true) { //ArrowDown
        lamp.move_y( -distance );
    } 
    if (keyMap[39] == true) { //ArrowRight
        lamp.move_x( distance );
    }
    if (keyMap[37] == true) { //ArrowLeft
        lamp.move_x( -distance );
    }
    if (keyMap[68] == true || keyMap[100] == true) { //D or d
        lamp.move_z( distance );
    }  
    if (keyMap[67] == true || keyMap[99] == true) { //C or c
        lamp.move_z( -distance );
    }

    // Rotation
    if (keyMap[81] == true || keyMap[113] == true) { //Q or q
        lamp.rotate_base_y( step );
    }
    if (keyMap[87] == true || keyMap[119] == true) { //W or w
        lamp.rotate_base_y( -step );
    }
    if (keyMap[65] == true || keyMap[97] == true) { //A or a
        lamp.rotate_middle_y( step );
    }
    if (keyMap[83] == true || keyMap[115] == true) { //S or s
        lamp.rotate_middle_y( -step );
    }
    if (keyMap[90] == true || keyMap[122] == true) { //Z or z
        if (rotationLimit <= 3*step) {
            lamp.rotate_top_y( step );
            rotationLimit += step;
        }
    }
    if (keyMap[88] == true || keyMap[120] == true) { //X or x
        if (rotationLimit >= -3*step) {
            lamp.rotate_top_y( -step );
            rotationLimit -= step
        }
    }

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
    cameras.push(createCamera());
    cameras.push(createOrthographicCamera(0, 0, 50));
    cameras.push(createOrthographicCamera(0, 50, 0));
    cameras.push(createOrthographicCamera(50, 0, 0));
    camera = cameras[0];


    // Events
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyUp);

}

function animate() {
    'use strict';
    
    // delta = clock.getDelta();
    // if (ball.userData.jumping) {
    //     ball.userData.step += 3 * delta * speed;
    //     ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
    //     ball.position.z = 15 * (Math.cos(ball.userData.step));
    // }

    render();

    requestAnimationFrame(animate);
}