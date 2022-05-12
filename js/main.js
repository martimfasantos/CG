/* global THREE */

/* TODO 
    ERROS A CORRIGIR
    - render chamado multiplas vezes - evitar chamar tantas vezes o render
    (desenhar table, perna, perna, perna, perna then render)
*/

var camera, scene, renderer;
var geometry, material, mesh;
var ball;
var clock = new THREE.Clock();
var delta = 0;
var cameras = [];
var objs = [];

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x40E0D0, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.position.set(x, y, z);
    ball.add(mesh);

    scene.add(ball);
}

function createBox(x, y, z, angle_x, angle_y, angle_z) {

    box = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xff6600, wireframe: true });
    geometry = new THREE.BoxGeometry(8, 8, 8, 2, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    box.add(mesh);

    scene.add(box);
    
}

function createPanel(x, y, z, angle_x, angle_y, angle_z) {

    box = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x437f5b, wireframe: true });
    geometry = new THREE.BoxGeometry(1, 20, 25, 30, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    box.add(mesh);

    scene.add(box);
    
}

function createLathe(x, y, z, angle_x, angle_y, angle_z){

    lathe = new THREE.Object3D();

    const points = [];
    for (let i = 0; i < 10; i ++) {
        points.push( new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
    }
    geometry = new THREE.LatheGeometry(points);
    material = new THREE.MeshPhongMaterial({ color: 0xffff00 });
    lathe = new THREE.Mesh(geometry, material);
    scene.add(lathe);
}

function createLine(x, y, z, angle_x, angle_y, angle_z) {

    box = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0x437f5b, wireframe: true });
    geometry = new THREE.BoxGeometry(1, 20, 25, 30, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    box.add(mesh);

    scene.add(box);
    
}

function createCylinder(x, y, z, angle_x, angle_y, angle_z) {

    cylinder = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB87333, wireframe: true });
    geometry = new THREE.CylinderGeometry(5, 5, 20, 35);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;

    mesh.position.set(x, y, z);
    cylinder.add(mesh);

    scene.add(cylinder);
    
}

function createIcosahedron(x, y, z) {

    icosahedron = new THREE.Object3D();

    material = new THREE.MeshPhongMaterial({ color: 0xB1023D, wireframe: true });
    geometry = new THREE.IcosahedronGeometry(5, 0);
    mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    icosahedron.add(mesh);

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
        amount: 20,
        steps: 5,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelOffset: 4,
        bevelSegments: 2

    };

    material = new THREE.MeshPhongMaterial({ color: 0xB123E2, wireframe: true });
    geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = angle_x;
    mesh.rotation.y = angle_y;
    mesh.rotation.z = angle_z;
    
    mesh.position.set(x, y, z);
    extrude.add(mesh);

    scene.add(extrude);
    
}

function degreesToRadians(degrees){
  return degrees * (Math.PI/180);
}


function createArticulatedObject(x, y, z){
    // var geometry1 = new THREE.Object3D();
    
    // createBox(geometry1, 0, 0, 0);
    // createCylinder(geometry1, 0, 0, 15, 0);
    // createIcosahedron(geometry1, 0, 0, 28);
    
    // scene.add(geometry1);
    
    // geometry1.position.x = x;
    // geometry1.position.y = y;
    // geometry1.position.z = z;
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

    createBall(0, 20, 0);
    createBox(0, 10, 0, degreesToRadians(45), degreesToRadians(45), degreesToRadians(45));
    createPanel(5, 20, -10, degreesToRadians(-45), degreesToRadians(-45), degreesToRadians(-45));
    createCylinder(0, 0, 15, degreesToRadians(90), 0, 0);
    createIcosahedron(10, -5, 14);
    createExtrude(20, 5, -20, degreesToRadians(60), degreesToRadians(-30), 0)

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
        case 37:
            camera.position.x += 5;
            break;
        case 38:
            camera.position.z += 5;
            break;
        case 39:
            camera.position.x -= 5;
            break;
        case 40:
            camera.position.z -= 5;
            break;
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
    spotLight1.intensity = 0.8;
    scene.add(spotLight1);

    var spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(10, -25, 0);
    spotLight2.castShadow = true;
    spotLight2.intensity = 1;
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

}

function animate() {
    'use strict';
    
    delta = clock.getDelta();
    if (ball.userData.jumping) {
        ball.userData.step += 3 * delta;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }

    render();

    requestAnimationFrame(animate);
}