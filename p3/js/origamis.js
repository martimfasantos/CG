function createOrigami1(x, y, z, texture) {

    const orig1 = new THREE.Object3D();
    const scale = 0.85;

    const phongMaterial = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture });
    const lambMaterial = new THREE.MeshLambertMaterial({ side: THREE.FrontSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, map: texture });

    const backPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
    const backLambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
    const backBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.BackSide });

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

        0, 0, 9.45, 0, 0, 12.6,
        0, 0, 0, 12.6, 9.45, 0,

    ]).map(x => x / 21 );

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    orig1.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    const backMesh = new THREE.Mesh(geometry, backPhongMaterial);

    mesh.castShadow = true;
    backMesh.castShadow = true;

    orig1.add(mesh);
    orig1.add(backMesh);

    meshes.push(mesh);
    meshes.push(backMesh);

    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);

    materials.push(backPhongMaterial);
    materials.push(backLambMaterial);
    materials.push(backBasicMaterial);

    primitives.push(orig1);

    orig1.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0)
    }

    scene.add(orig1);

    return orig1;

}

function createOrigami2(x, y, z, texture) {

    const orig2 = new THREE.Object3D();
    const scale = 0.9;

    const phongMaterial = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture });
    const lambMaterial = new THREE.MeshLambertMaterial({ side: THREE.FrontSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, map: texture });

    const backPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
    const backLambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
    const backBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.BackSide });

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

        // CEB
        0, 0, 0,
        0.55, 15.7, -0.5,
        -0.8, 17.1, -3.9,

        // CDF
        0, 0, 0,
        -0.8, 17.1, 3.9,
        0.55, 15.7, 0.5,

        // CGE
        0, 0, 0,
        -0.8, 14.2, -3.6,
        0.6, 15.7, -0.5,

        // CFH
        0, 0, 0,
        0.6, 15.7, 0.5,
        -0.8, 14.2, 3.6,

        /* ------ BACK ------ */

        // CIG
        0, 0, 0,
        -0.4, 14.2, -0.4,
        -0.8, 14.2, -3.6,

        // CHJ
        0, 0, 0,
        -0.8, 14.2, 3.6,
        -0.4, 14.2, 0.4,


        /* ------ POINTS -------

        A = (-0.3, 21.4, 0)
        B = (-0.8, 17.1, -3.9)
        C = (0, 0, 0)
        D = (-0.8, 17.1, 3.9)
        E = (0.6, 15.7, -0.5)
        F = (0.6, 15.7, 0.5)
        G = (-0.8, 14.2, -3.6)
        H = (-0.8, 14.2, 3.6)
        I = (-0.4, 14.2, -0.4)
        J = (-0.4, 14.2, 0.4)
    
        */
    ]).map(x => x * scale);

    const uvs = new Float32Array([

        0, 0, 0, 7.35, 3.15, 8.4,
        6, 12, 12, 11, 12, 14,
        0, 0, 0, 7.35, 3.15, 8.4,
        0, 0, 7.35, 0, 8.4, 3.15,
        0, 0, 0, 7.35, 3.15, 8.4,
        0, 0, 10, 0, 11, 3.15, // Frente grande
        0, 0, 0, 7.35, 3.15, 8.4,
        0, 2, 7.35, 0, 8.4, 3.15,

    ]).map(x => x / 21 );

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    orig2.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    const backMesh = new THREE.Mesh(geometry, backPhongMaterial);

    mesh.castShadow = true;
    backMesh.castShadow = true;

    orig2.add(mesh);
    orig2.add(backMesh);

    meshes.push(mesh);
    meshes.push(backMesh);

    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);

    materials.push(backPhongMaterial);
    materials.push(backLambMaterial);
    materials.push(backBasicMaterial);

    primitives.push(orig2);

    orig2.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0)
    }

    scene.add(orig2);

    return orig2;

}

function createOrigami3(x, y, z, texture) {

    const orig3 = new THREE.Object3D();
    const scale = 1.2;

    const phongMaterial = new THREE.MeshPhongMaterial({ side: THREE.FrontSide, map: texture, shininess: 10 });
    const lambMaterial = new THREE.MeshLambertMaterial({ side: THREE.FrontSide, map: texture });
    const basicMaterial = new THREE.MeshBasicMaterial({ side: THREE.FrontSide, map: texture });

    const backPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, side: THREE.BackSide, shininess: 10 });
    const backLambMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, side: THREE.BackSide });
    const backBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.BackSide });

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

        // DBC
        -0.05, 11.5, 4.85,
        -0.05, 12.8, 4.45,
        0.75, 12, 3.55,

        // EFD
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        0, 11.5, 4.9,

        // EDF Front
        -0.05, 2.8, 5.75,
        -0.05, 11.5, 4.85,
        1.55, 0, 3.15,

        // DFC
        0, 11.5, 4.9,
        1.6, 0, 3.2,
        0.8, 12, 3.6,

        // DCF
        -0.05, 11.5, 4.85,
        0.75, 12, 3.55,
        1.55, 0, 3.15,

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

        // FJH
        1.6, 0, 3.2,
        1.6, 4.6, -2.4,
        3, 0, -4.7,

        // FGP
        1.6, 0, 3.2,
        2.4, -0.2, -0.9,
        0.3, 2.7, -0.3,

        // EFP
        0, 2.8, 5.8,
        1.6, 0, 3.2,
        0.3, 2.7, -0.3,

        /* -------------- MIRRORED -------------- */

        /* ------ HEAD ------ */
        // BOA
        0, 12.8, 4.5,
        - 0.8, 12, 3.6,
        0, 10.4, 8.6,

        /* ------ NECK ------ */
        // BOD
        0, 12.8, 4.5,
        - 0.8, 12, 3.6,
        0, 11.5, 4.9,

        // DNE
        0, 11.5, 4.9,
        - 1.6, 0, 3.2,
        0, 2.8, 5.8,

        // CND
        - 0.8, 12, 3.6,
        - 1.6, 0, 3.2,
        0, 11.5, 4.9,

        // BDO
        0.05, 12.8, 4.45,
        0.05, 11.5, 4.85,
        - 0.75, 12, 3.55,

        // DEN
        0.05, 11.5, 4.85,
        0.05, 2.8, 5.75,
        - 1.55, 0, 3.15,

        // CDN
        - 0.75, 12, 3.55,
        0.05, 11.5, 4.85,
        - 1.55, 0, 3.15,


        /* ------ BODY ------ */
        // QNE
        - 1.6, 4.6, -2.4,
        - 1.6, 0, 3.2,
        0, 2.8, 5.8,

        // QMN
        - 1.6, 4.6, -2.4,
        - 2.4, -0.2, -0.9,
        - 1.6, 0, 3.2,

        // QME
        - 1.6, 4.6, -2.4,
        - 2.4, -0.2, -0.9,
        0, 2.8, 5.8,

        // INE
        0, 6, -8.7,
        - 1.6, 0, 3.2,
        0, 2.8, 5.8,

        // ILN
        0, 6, -8.7,
        - 3, 0, -4.7,
        - 1.6, 0, 3.2,

        // QNL
        - 1.6, 4.6, -2.4,
        - 1.6, 0, 3.2,
        - 3, 0, -4.7,

        // PMN
        - 0.3, 2.7, -0.3,
        - 2.4, -0.2, -0.9,
        - 1.6, 0, 3.2,

        // PNE
        - 0.3, 2.7, -0.3,
        - 1.6, 0, 3.2,
        0, 2.8, 5.8,

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
        Q = (-1.6, 4.6, -2.4)
        
        */

    ]).map(x => x * scale);


    const uvs = new Float32Array([
        //HEAD
        0, 0, 5.2, 1, 3.5, 3.5, // ACB

        //NECK
        4.2, 4.2, 5.2, 1, 3.5, 3.5, // DCB
        4.2, 4.2, 3.5, 3.5, 5.2, 1, // DBC 
        10.4, 10.4, 17.1, 5, 4.2, 4.2, // EFD
        10.4, 10.4, 4.2, 4.2, 17.1, 5, // EDF
        4.2, 4.2, 17.1, 5, 5.2, 1, // DFC
        4.2, 4.2, 5.2, 1, 17.1, 5, // DCF

        //BODY
        10.4, 10.4, 17.1, 5, 21, 8.7, // EFJ
        17.1, 5, 21, 4.2, 21, 8.7, // FGJ
        10.4, 10.4, 21, 4.2, 21, 8.7, // EGJ
        10.4, 10.4, 17.1, 3.3, 21, 21, // EFI
        12, 3.3, 21, 10, 21, 21, // FHI
        17.1, 3.3, 21, 8.7, 21, 13.9, // FJH
        17.1, 3.3, 21, 4.2, 16.2, 16.2, // FGP
        10.4, 10.4, 17.1, 3.3, 16.2, 16.2, // EFP

        /* -------------- MIRRORED -------------- */

        //HEAD
        3.5, 3.5, 1, 5.2, 0, 0, // BOA

        //NECK
        3.5, 3.5, 1, 5.2, 4.2, 4.2, // BOD
        4.2, 4.2, 8, 17.1, 10.4, 10.4, // DNE (Front)
        1, 5.2, 3.3, 17.1, 4.2, 4.2, // CND
        3.5, 3.5, 4.2, 4.2, 1, 5.2, // BDO Front
        4.2, 4.2, 10.4, 10.4, 8, 17.1, // DEN
        1, 5.2, 4.2, 4.2, 3.3, 17.1, // CDN

        //BODY
        8.7, 21, 3.3, 17.1, 10.4, 10.4, // QNE
        8.7, 21, 4.2, 21, 3.3, 17.1, // QMN
        8.7, 21, 4.2, 21, 10.4, 10.4, // QME
        21, 21, 3.3, 12, 10.4, 10.4, // INE
        21, 21, 10, 21, 3.3, 12, // ILN
        8.7, 21, 3.3, 17.1, 13.9, 21, // QNL
        16.2, 16.2, 4.2, 21, 10.4, 10.4, // PMN
        16.2, 16.2, 3.3, 17.1, 10.4, 10.4, // PNE

    ]).map(x => x / 21);

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();

    orig3.position.set(x, y, z);

    const mesh = new THREE.Mesh(geometry, phongMaterial);
    const backMesh = new THREE.Mesh(geometry, backPhongMaterial);

    mesh.castShadow = true;
    backMesh.castShadow = true;

    orig3.add(mesh);
    orig3.add(backMesh);

    meshes.push(mesh);
    meshes.push(backMesh);

    materials.push(phongMaterial);
    materials.push(lambMaterial);
    materials.push(basicMaterial);

    materials.push(backPhongMaterial);
    materials.push(backLambMaterial);
    materials.push(backBasicMaterial);

    primitives.push(orig3);

    orig3.userData = {
        initialPos: new THREE.Vector3(x, y, z),
        initialRot: new THREE.Vector3(0, 0, 0)
    }

    scene.add(orig3);

    return orig3;

}