function createOrigami1(x, y, z, texture) {

    const orig1 = new THREE.Object3D();
    const scale = 0.85;

    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const lambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([

        // CBA
        0, 0, 0,
        -1.1, 10.7, -10.7,
        -0.3, 21.4, 0,

        // CAD
        0, 0, 0,
        -0.3, 21.4, 0,
        -1.1, 10.7, 10.7,

        /* ------ POINTS -------

        A = (-0.3, 21.4, 0)
        B = (-1.1, 10.7, -10.7)
        C = (0, 0, 0)
        D = (-1.1, 10.7, 10.7)
        
        */

    ]).map(x => x * scale);

    const uvs = new Float32Array([

        0, 0, 0.5, 0, 0, 0.5,
        0, 0.5, 0.5, 0, 0.5, 0.5,

    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    orig1.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    mesh.castShadow = true;

    orig1.add(mesh);

    meshes.push(mesh);
    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);
    primitives.push(orig1);

    orig1.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0),
        initialText: texture
    }

    scene.add(orig1);

    return orig1;

}

function createOrigami2(x, y, z, texture) {

    const orig2 = new THREE.Object3D();
    const scale = 0.9;

    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const lambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });

    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([

        /* ------ FRONT ------ */
        // CBA
        0, 0, 0,
        -0.8, 17.1, -3.9,
        -0.3, 21.4, 0,

        // CAD
        0, 0, 0,
        -0.3, 21.4, 0,
        -0.8, 17.1, 3.9,

        // CBE
        0, 0, 0,
        -0.8, 17.1, -3.9,
        0.6, 15.7, -0.5,

        // CFD
        0, 0, 0,
        0.6, 15.7, 0.5,
        -0.8, 17.1, 3.9,

        // CGE
        0, 0, 0,
        -0.8, 14.2, -3.5,
        0.6, 15.7, -0.5,

        // CFH
        0, 0, 0,
        0.6, 15.7, 0.5,
        -0.8, 14.2, 3.5,

        /* ------ BACK ------ */

        // CGI
        0, 0, 0,
        -0.8, 14.2, -3.5,
        -0.4, 14.2, -0.4,

        // CHJ
        0, 0, 0,
        -0.8, 14.2, 3.5,
        -0.4, 14.2, 0.4,


        /* ------ POINTS -------

        A = (-0.3, 21.4, 0)
        B = (-0.8, 17.1, -3.9)
        C = (0, 0, 0)
        D = (-0.8, 17.1, 3.9)
        E = (0.6, 15.7, -0.5)
        F = (0.6, 15.7, 0.5)
        G = (-0.8, 14.2, -3.5)
        H = (-0.8, 14.2, 3.5)
        I = (-0.4, 14.2, -0.4)
        J = (-0.4, 14.2, 0.4)
    
        */
    ]).map(x => x * scale);

    const uvs = new Float32Array([

        0.75, 0.75, 0, 0.25, 0, 0,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,
        0, 0, 0.25, 0, 0.75, 0.75,

    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    orig2.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    mesh.castShadow = true;

    meshes.push(mesh);

    orig2.add(mesh);
    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);
    primitives.push(orig2);

    orig2.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0),
        initialText: texture
    }

    scene.add(orig2);

    return orig2;

}

function createOrigami3(x, y, z, texture) {

    const orig3 = new THREE.Object3D();
    const scale = 1.2;

    const phongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const lambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, map: texture });

    var geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([

        /* ------ HEAD ------ */
        // ACB
        0, 10.4, 8.6,
        0.8, 12, 3.6,
        0, 12.8, 4.5,

        /* ------ NECK ------ */
        // DCB
        0, 11.5, 4.9,
        0.8, 12, 3.6,
        0, 12.8, 4.5,

        // EFD
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        0, 11.5, 4.9,

        //DFC
        0, 11.5, 4.9,
        1.6, 0, 3.2,
        0.8, 12, 3.6,

        /* ------ BODY ------ */
        // EFJ
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        1.6, 4.6, -2.4,

        // FGJ
        1.6, 0, 3.2,
        2.4, -0.2, -0.9,
        1.6, 4.6, -2.4,

        //EGJ
        0, 2.8, 5.8,
        2.4, -0.2, -0.9,
        1.6, 4.6, -2.4,

        // EFI
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        0, 6, -8.7,

        // FHI
        1.6, 0, 3.2,
        3, 0, -4.7,
        0, 6, -8.7,

        //FHJ
        1.6, 0, 3.2,
        3, 0, -4.7,
        1.6, 4.6, -2.4,

        //FGP
        1.6, 0, 3.2,
        2.4, -0.2, -0.9,
        0.3, 2.7, -0.3,

        //EFP
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        0.3, 2.7, -0.3,

        /* ------ POINTS -------

        A = (0, 10.4, 8.6)
        B = (0, 12.8, 4.5)
        C = (0.8, 12, 3.6)
        D = (0, 11.5, 4.9)
        E = (0, 2.8, 5.8)
        F = (1.6, 0, 3.2)
        G = (2.4, -0.2, -0.9)
        H = (3, 0, -4.7)
        I = (0, 6, -8.7)
        J = (1.6, 4.6, -2.4)
        K = (0, 3.8, 3.2)
        L = (-2.8, 0, -4.7)
        M = (-2.4, -0.2, -0.9)
        N = (-1,6, 0, 3.2)
        O = (-0.5, 12, 3.6)
        P = (0.3, 3.5, -0.3)
        
        */

    ]).map(x => x * scale);


    const uvs = new Float32Array([
        //HEAD
        0, 0, 0, 0.5, 0.5, 0,

        //NECK
        0, 0, 0.5, 0.5, 0.5, 0,
        0, 0, 0.5, 0, 0, 0.5,
        1, 0, 0, 1, 0, 0,

        //BODY
        0, 0, 0.5, 0.5, 0.5, 0,
        0, 0, 0.5, 0, 0, 0.5,
        1, 0, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1,
        0, 0, 0.5, 0.5, 0.5, 0,
        0, 0, 0.5, 0, 0, 0.5,
        1, 0, 0, 1, 0, 0,
        0, 0, 1, 1, 0, 1,

    ]);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const mirror = geometry.clone().applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
    geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([geometry, mirror]);

    geometry.computeVertexNormals();

    orig3.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    mesh.castShadow = true;

    orig3.add(mesh);
    meshes.push(mesh);
    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);
    primitives.push(orig3);

    orig3.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0),
        initialText: texture
    }

    scene.add(orig3);

    return orig3;

}