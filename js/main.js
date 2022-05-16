/* global THREE */

/* TODO 
    ERROS A CORRIGIR
    - render chamado multiplas vezes - evitar chamar tantas vezes o render
    (desenhar table, perna, perna, perna, perna then render)
*/

var camera, scene, renderer;
var geometry, material, mesh;
var clock = new THREE.Clock();
var delta = 0;
var speed = 1;
var cameras = [];
var objs = [];
var keyMap = [];
var tube = new THREE.Object3D();
var cylinder3 = new THREE.Object3D();
var cylinder5 = new THREE.Object3D();
var limitRotation = 0;

function createSphere1(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x40E0D0, wireframe: true });
    geometry = new THREE.SphereGeometry(6, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createSphere2(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB98D64, wireframe: true });
    geometry = new THREE.SphereGeometry(1.2, 5, 5);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createSphere3(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB98D64, wireframe: true });
    geometry = new THREE.SphereGeometry(3, 10, 10, 0, Math.PI);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createSphere4(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB98D64, wireframe: true });
    geometry = new THREE.SphereGeometry(3, 10, 10, Math.PI, Math.PI);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createSphere5(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xE77DA3, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 20, 16, 0, 2*Math.PI, -Math.PI/2);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createSphere6(x, y, z) {
    'use strict';

    var sphere = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xFAF6E3, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 16, 0, 2*Math.PI, 0, Math.PI-0.7);
    mesh = new THREE.Mesh(geometry, material);

    sphere.position.set(x, y, z);
    sphere.add(mesh);

    objs.push(sphere);
    scene.add(sphere);
}

function createBox(x, y, z, angle_x, angle_y, angle_z) {

    var box = new THREE.Object3D();
    
    // const texture = new THREE.TextureLoader().load('textures/rubiks_cube.jpg');

    material = new THREE.MeshPhongMaterial({ color: 0xff6600, wireframe: true /*, map: texture */ });
    geometry = new THREE.BoxGeometry(8, 8, 8, 2, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    box.add(mesh);

    objs.push(box);
    scene.add(box);
    
}

function createPanel1(x, y, z, angle_x, angle_y, angle_z) {

    var box = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x437f5b, wireframe: true });
    geometry = new THREE.BoxGeometry(1, 20, 25, 30, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    box.add(mesh);

    objs.push(box);
    scene.add(box);
    
}

function createPanel2(x, y, z, angle_x, angle_y, angle_z) {

    var panel = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x815438, wireframe: true });
    geometry = new THREE.BoxGeometry(12, 1, 12, 10, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    panel.add(mesh);

    objs.push(panel);
    scene.add(panel);
    
}

function createTorus1(x, y, z, angle_x, angle_y, angle_z){

    var torus = new THREE.Object3D();

    geometry = new THREE.TorusGeometry(5, 2, 16, 20);
    material = new THREE.MeshPhongMaterial({ color: 0x957DAD, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    torus.add(mesh);

    objs.push(torus);
    scene.add(torus);
}

function createTorus2(x, y, z, angle_x, angle_y, angle_z){

    var torus = new THREE.Object3D();

    geometry = new THREE.TorusGeometry(8, 0.8, 3, 20);
    material = new THREE.MeshPhongMaterial({ color: 0xAD3141, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    torus.add(mesh);
    
    objs.push(torus);
    scene.add(torus);
}

function createCylinder1(x, y, z, angle_x, angle_y, angle_z) {

    var cylinder = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB87333, wireframe: true });
    geometry = new THREE.CylinderGeometry(5, 5, 16, 35);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder.add(mesh);

    objs.push(cylinder);
    scene.add(cylinder);
    
}

function createCylinder2(x, y, z, angle_x, angle_y, angle_z) {

    var cylinder = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x8557CB, wireframe: true });
    geometry = new THREE.CylinderGeometry(2, 4, 40, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder.add(mesh);

    objs.push(cylinder);
    scene.add(cylinder);
    
}

function createCylinder3(x, y, z, angle_x, angle_y, angle_z) {

    material = new THREE.MeshPhongMaterial({ color: 0xA89F7B, wireframe: true });
    geometry = new THREE.CylinderGeometry(3.5, 4, 1, 18);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder3.add(mesh);

    objs.push(cylinder3);
    scene.add(cylinder3);
    
}

function createCylinder4(x, y, z, angle_x, angle_y, angle_z) {

    var cylinder = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x754C24, wireframe: true });
    geometry = new THREE.CylinderGeometry(1.3, 1.2, 20, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder.add(mesh);

    objs.push(cylinder);
    scene.add(cylinder);
    
}

function createCylinder5(x, y, z, angle_x, angle_y, angle_z) {

    material = new THREE.MeshPhongMaterial({ color: 0xF5F5F5, wireframe: true, side: THREE.DoubleSide });
    geometry = new THREE.CylinderGeometry(4.5, 1, 6, 20, 20, openEnded = true);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder5.add(mesh);

    objs.push(cylinder5);
    scene.add(cylinder5);
    
}

function createCone(x, y, z, angle_x, angle_y, angle_z) {

    var cone = new THREE.Object3D();

    // const texture = new THREE.TextureLoader().load('textures/ice_cream_cone.jpg')

    material = new THREE.MeshPhongMaterial({ color: 0xCDA26F, wireframe: true /*, map: texture*/ });
    geometry = new THREE.ConeGeometry(4, 18, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cone.add(mesh);

    objs.push(cone);
    scene.add(cone);
    
}

function createIcosahedron(x, y, z, angle_x, angle_y, angle_z) {

    var icosahedron = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x60646B, wireframe: true });
    geometry = new THREE.IcosahedronGeometry(2.2, 1);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    icosahedron.add(mesh);

    objs.push(icosahedron);
    scene.add(icosahedron);
    
}

function createExtrude(x, y, z, angle_x, angle_y, angle_z) {

    extrude = new THREE.Object3D();

    const length = 5, width = 3;

    shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, width);
    shape.lineTo(length, width);
    shape.lineTo(length, 0);
    shape.lineTo(0, 0);

    const extrudeSettings = {
        amount: 15,
        steps: 5,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 2.5,
        bevelSize: 2,
        bevelOffset: 4,
        bevelSegments: 2

    };

    material = new THREE.MeshPhongMaterial({ color: 0x43464B, wireframe: true });
    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;
    
    mesh.position.set(x, y, z);
    extrude.add(mesh);

    objs.push(extrude);
    scene.add(extrude);
    
}

function createTube(x, y, z){

    const curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( 0, 18, 4.5 ),
        new THREE.Vector3( 0, 20, 0 ),
        new THREE.Vector3( 0, 0.5, 0 )]);
    geometry = new THREE.TubeGeometry(curve, 20, 1, 8, closed = false );
    material = new THREE.MeshPhongMaterial({ color: 0xA8A8A8, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);  
    tube.add(mesh);

    scene.add(tube);
}

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}


function createArticulatedObject(x, y, z, angle_x, angle_y, angle_z){
    createCylinder3(x, y, z, angle_x, angle_y, angle_z);
    createTube(x, y, z);
    createCylinder5( x, y + 16.9 , z + 7, angle_x + degreesToRadians(115), angle_y, angle_z);

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
    createSphere1(14, 26, 0);
    createTorus2(14, 26, 0, degreesToRadians(90), degreesToRadians(-15), 0);
    createSphere2(23, 28, 3);

    // Roller
    createCylinder1(5, -5, 18, degreesToRadians(90), 0, 0);
    createSphere3(5, -5, 26);
    createSphere4(5, -5, 10);
    
    // Hammer
    createExtrude(15, 7, -18, degreesToRadians(80), degreesToRadians(-10), 0)
    createCylinder4(16.2, 2.5, -2, degreesToRadians(80), degreesToRadians(-10), 0);
    createIcosahedron(16.2, 4.7, 9.7, degreesToRadians(-20), degreesToRadians(30), 0);
    
    // Ice Cream
    createCone(-11, -3, 17, 0, 0, degreesToRadians(180));
    createSphere5(-11, 6, 17);
    createSphere6(-11, 12, 17);
    
    // Random mambo
    createCylinder2(-20, 23, 8, degreesToRadians(70), 0, 0);
    createTorus1(-20, 23, 8, degreesToRadians(-20), 0, 0);
    
    // Random Box
    createBox(-8, 33, -10, degreesToRadians(45), degreesToRadians(45), degreesToRadians(45));

    // Panel
    createPanel1(13, 25, -15, degreesToRadians(45), degreesToRadians(90), degreesToRadians(-30));

    createArticulatedObject(0, 0, 0, degreesToRadians(0), degreesToRadians(0), degreesToRadians(0));
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

    //rotation
    if (keyMap[81] == true || keyMap[113] == true) { //Q or q
        cylinder3.rotation.y += 0.05 * speed;
        cylinder5.rotation.y += 0.05 * speed;
        tube.rotation.y += 0.05 * speed;
    }
    if (keyMap[87] == true || keyMap[119] == true) { //W or w
        cylinder3.rotation.y -= 0.05 * speed;
        cylinder5.rotation.y -= 0.05 * speed;
        tube.rotation.y -= 0.05 * speed;
    }
    if (keyMap[65] == true || keyMap[97] == true) { //A or a
        cylinder5.rotation.y += 0.05 * speed;
        tube.rotation.y += 0.05 * speed;
    }
    if (keyMap[83] == true || keyMap[115] == true) { //S or s
        cylinder5.rotation.y -= 0.05 * speed;
        tube.rotation.y -= 0.05 * speed;
    }
    if (keyMap[90] == true || keyMap[122] == true) { //Z or z
        if (limitRotation <= 0.15) {
            cylinder5.rotation.y += 0.05 * speed;
            limitRotation += 0.05 * speed;
        }
    }
    if (keyMap[88] == true || keyMap[120] == true) { //X or x
        if (limitRotation >= -0.15) {
            cylinder5.rotation.y -= 0.05 * speed;
            limitRotation -= 0.05 * speed;
        }
    }

    //translation
    if (keyMap[37] == true) { //ArrowLeft
        cylinder3.position.x -= 1;
        cylinder5.position.x -= 1;
        tube.position.x -= 1;
    }
    if (keyMap[38] == true) { //ArrowUp
        cylinder3.position.y += 1;
        cylinder5.position.y += 1;
        tube.position.y += 1;
    }    
    if (keyMap[39] == true) { //ArrowRight
        cylinder3.position.x += 1;
        cylinder5.position.x += 1;
        tube.position.x += 1;
    }
    if (keyMap[40] == true) { //ArrowDown
        cylinder3.position.y -= 1;
        cylinder5.position.y -= 1;
        tube.position.y -= 1;
    } 
    if (keyMap[68] == true || keyMap[100] == true) { //D or d
        cylinder3.position.z += 1;
        cylinder5.position.z += 1;
        tube.position.z += 1;
    }  
    if (keyMap[67] == true || keyMap[99] == true) { //C or c
        cylinder3.position.z -= 1;
        cylinder5.position.z -= 1;
        tube.position.z -= 1;
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
    
    // spotlights for the shadows
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


    // cameras
    cameras.push(createCamera());
    cameras.push(createOrthographicCamera(0, 0, 50));
    cameras.push(createOrthographicCamera(0, 50, 0));
    cameras.push(createOrthographicCamera(50, 0, 0));
    camera = cameras[0];


    // events
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