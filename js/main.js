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
var speed = 3; //units a second
var delta = 0;
var orthographicCamera;
var cameras = [];

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };

    material = new THREE.MeshBasicMaterial({ color: 0x40E0D0, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.add(mesh);
    ball.position.set(x, y, z);

    scene.add(ball);
}

function createBox(obj, x, y, z) {

    material = new THREE.MeshBasicMaterial({ color: 0xB87333, wireframe: true });
    box = new THREE.BoxGeometry(8, 8, 8);
    mesh = new THREE.Mesh(box, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
    
}

function createCylinder(obj, x, y, z) {

    material = new THREE.MeshBasicMaterial({ color: 0xB87333, wireframe: true });
    cylinder = new THREE.CylinderGeometry( 5, 5, 20, 32 );
    mesh = new THREE.Mesh(box, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
    
}

function createIcosahedron(obj, x, y, z) {

    material = new THREE.MeshBasicMaterial({ color: 0xB87333, wireframe: true });
    icosahedron = new THREE.IcosahedronGeometry(5, 0);
    mesh = new THREE.Mesh(icosahedron, material);

    mesh.position.set(x, y, z);

    obj.add(mesh);
    
}

function createGeometry1(x, y, z){
    var geometry1 = new THREE.Object3D();
    
    createBox(geometry1, 0, 0, 0);
    createCylinder(geometry1, 0, 0, 8);
    createIcosahedron(geometry1, 0, 0, 28);
    
    scene.add(geometry1);
    
    geometry1.position.x = x;
    geometry1.position.y = y;
    geometry1.position.z = z;
}

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(70,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    return camera;
}

function createOrthographicCamera(x, y, z) {
    'use strict';

    orthographicCamera = new THREE.OrthographicCamera(window.innerWidth / - 20,
                                                     window.innerWidth / 20,
                                                     window.innerHeight / 20, 
                                                     window.innerHeight / - 20, 
                                                     1, 
                                                     1000);
    orthographicCamera.position.x = x;
    orthographicCamera.position.y = y;
    orthographicCamera.position.z = z;
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

function createScene() {
    'use strict';

    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));

    createGeometry1(0, 8, 0);
    createBall(0, 0, 15)

}

function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
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
    case 83:  //S
    case 115: //stabler
        ball.userData.jumping = !ball.userData.jumping;
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

    cameras.push(createCamera());
    cameras.push(createOrthographicCamera(0, 0, 50));
    cameras.push(createOrthographicCamera(0, 50, 0));
    cameras.push(createOrthographicCamera(50, 0, 0));
    camera = cameras[0];

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

}

function animate() {
    'use strict';
    
    delta = clock.getDelta();
    if (ball.userData.jumping) {
        ball.userData.step += 4 * delta;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }

    // object.position.y += speed * delta;
    // object.position.z += speed * delta;

    render();

    requestAnimationFrame(animate);
}