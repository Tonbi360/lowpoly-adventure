import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ============================================================
// GAME SETUP
// ============================================================

const canvas = document.getElementById("game-canvas");
const loadingScreen = document.getElementById("loading-screen");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
    0x87ceeb,
    45,
    130
);


const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    300
);

camera.position.set(0, 7, 12);


// ============================================================
// LIGHTING
// ============================================================

const skyLight = new THREE.HemisphereLight(
    0xffffff,
    0x6d8d52,
    2.2
);

scene.add(skyLight);


const sun = new THREE.DirectionalLight(
    0xfff4d6,
    3.2
);

sun.position.set(
    25,
    35,
    15
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.left = -50;
sun.shadow.camera.right = 50;
sun.shadow.camera.top = 50;
sun.shadow.camera.bottom = -50;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 120;

scene.add(sun);


// ============================================================
// MATERIALS
// ============================================================

const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x76b852,
    flatShading: true
});

const dirtMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c6745,
    flatShading: true
});

const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x7d8279,
    flatShading: true
});

const darkRockMaterial = new THREE.MeshStandardMaterial({
    color: 0x555b54,
    flatShading: true
});

const treeTrunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x735033,
    flatShading: true
});

const treeLeafMaterial = new THREE.MeshStandardMaterial({
    color: 0x3f813b,
    flatShading: true
});


// ============================================================
// MAIN ISLAND
// ============================================================

const islandGroup = new THREE.Group();

scene.add(islandGroup);


// Top of island

const islandTopGeometry = new THREE.CylinderGeometry(
    24,
    27,
    2.5,
    12
);

const islandTop = new THREE.Mesh(
    islandTopGeometry,
    grassMaterial
);

islandTop.position.y = -1.25;

islandTop.receiveShadow = true;

islandGroup.add(islandTop);


// Dirt/rock underside

const islandBaseGeometry = new THREE.CylinderGeometry(
    27,
    20,
    9,
    12
);

const islandBase = new THREE.Mesh(
    islandBaseGeometry,
    dirtMaterial
);

islandBase.position.y = -6.5;

islandBase.castShadow = true;
islandBase.receiveShadow = true;

islandGroup.add(islandBase);


// ============================================================
// ROCKS
// ============================================================

function createRock(
    x,
    y,
    z,
    scale = 1,
    material = rockMaterial
) {
    const geometry = new THREE.DodecahedronGeometry(
        1,
        0
    );

    const rock = new THREE.Mesh(
        geometry,
        material
    );

    rock.position.set(x, y, z);

    rock.scale.set(
        scale * 1.4,
        scale,
        scale * 1.1
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    rock.castShadow = true;
    rock.receiveShadow = true;

    islandGroup.add(rock);

    return rock;
}


// Rocks around the island

createRock(-13, 0.1, -7, 1.3);
createRock(-16, 0.1, -2, 0.8);
createRock(-11, 0.1, 7, 1.1);

createRock(14, 0.1, -8, 1.5);
createRock(17, 0.1, 0, 0.9);
createRock(13, 0.1, 8, 1.3);

createRock(-4, 0.1, -12, 0.7);
createRock(5, 0.1, -13, 1.2);

createRock(-19, -1, 9, 1.8, darkRockMaterial);
createRock(19, -1, 9, 1.6, darkRockMaterial);


// ============================================================
// TREES
// ============================================================

function createTree(x, y, z, scale = 1) {

    const tree = new THREE.Group();

    tree.position.set(x, y, z);
    tree.scale.setScalar(scale);


    // Trunk

    const trunkGeometry = new THREE.CylinderGeometry(
        0.28,
        0.42,
        2.5,
        6
    );

    const trunk = new THREE.Mesh(
        trunkGeometry,
        treeTrunkMaterial
    );

    trunk.position.y = 1.25;

    trunk.castShadow = true;

    tree.add(trunk);


    // Bottom foliage

    const bottomGeometry = new THREE.ConeGeometry(
        1.8,
        2.8,
        7
    );

    const bottomLeaves = new THREE.Mesh(
        bottomGeometry,
        treeLeafMaterial
    );

    bottomLeaves.position.y = 3;

    bottomLeaves.castShadow = true;

    tree.add(bottomLeaves);


    // Middle foliage

    const middleGeometry = new THREE.ConeGeometry(
        1.4,
        2.4,
        7
    );

    const middleLeaves = new THREE.Mesh(
        middleGeometry,
        treeLeafMaterial
    );

    middleLeaves.position.y = 4.4;

    middleLeaves.castShadow = true;

    tree.add(middleLeaves);


    // Top foliage

    const topGeometry = new THREE.ConeGeometry(
        0.9,
        2,
        7
    );

    const topLeaves = new THREE.Mesh(
        topGeometry,
        treeLeafMaterial
    );

    topLeaves.position.y = 5.5;

    topLeaves.castShadow = true;

    tree.add(topLeaves);


    islandGroup.add(tree);

    return tree;
}


// Forest areas

createTree(-8, 0, -5, 1.1);
createTree(-11, 0, -3, 0.9);
createTree(-14, 0, -6, 1.3);

createTree(-9, 0, 7, 1.2);
createTree(-13, 0, 8, 0.8);
createTree(-16, 0, 6, 1.1);

createTree(9, 0, -5, 1.2);
createTree(12, 0, -7, 0.9);
createTree(15, 0, -4, 1.3);

createTree(10, 0, 7, 1);
createTree(14, 0, 6, 1.2);
createTree(17, 0, 7, 0.8);


// ============================================================
// DISTANT MOUNTAINS
// ============================================================

function createMountain(
    x,
    z,
    height,
    width,
    color
) {

    const geometry = new THREE.ConeGeometry(
        width,
        height,
        6
    );

    const material = new THREE.MeshStandardMaterial({
        color,
        flatShading: true
    });

    const mountain = new THREE.Mesh(
        geometry,
        material
    );

    mountain.position.set(
        x,
        height / 2 - 1,
        z
    );

    mountain.rotation.y = Math.random();

    mountain.castShadow = true;

    scene.add(mountain);

    return mountain;
}


createMountain(
    -45,
    -35,
    30,
    15,
    0x607866
);

createMountain(
    40,
    -45,
    38,
    18,
    0x536b5b
);

createMountain(
    -5,
    -55,
    45,
    22,
    0x4d6657
);


// ============================================================
// PLAYER
// ============================================================

const player = new THREE.Group();

player.position.set(
    0,
    0,
    5
);

scene.add(player);


// Body

const bodyGeometry = new THREE.CapsuleGeometry(
    0.45,
    0.9,
    4,
    8
);

const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x315b86,
    flatShading: true
});

const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
);

body.position.y = 1.1;

body.castShadow = true;

player.add(body);


// Head

const headGeometry = new THREE.IcosahedronGeometry(
    0.55,
    1
);

const headMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0a46f,
    flatShading: true
});

const head = new THREE.Mesh(
    headGeometry,
    headMaterial
);

head.position.y = 2;

head.castShadow = true;

player.add(head);


// Backpack

const backpackGeometry = new THREE.BoxGeometry(
    0.7,
    0.8,
    0.3
);

const backpackMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a5138,
    flatShading: true
});

const backpack = new THREE.Mesh(
    backpackGeometry,
    backpackMaterial
);

backpack.position.set(
    0,
    1.15,
    0.45
);

backpack.castShadow = true;

player.add(backpack);


// ============================================================
// CAMERA TARGET
// ============================================================

const cameraOffset = new THREE.Vector3(
    0,
    6,
    11
);


// ============================================================
// CAMERA FOLLOW
// ============================================================

function updateCamera() {

    const targetPosition = player.position
        .clone()
        .add(cameraOffset);

    camera.position.lerp(
        targetPosition,
        0.08
    );

    const lookTarget = player.position
        .clone();

    lookTarget.y += 1;

    camera.lookAt(lookTarget);
}


// ============================================================
// RESIZE
// ============================================================

function resize() {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5)
    );

    renderer.setSize(
        width,
        height
    );
}

window.addEventListener(
    "resize",
    resize
);


// ============================================================
// GAME LOOP
// ============================================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // Tiny idle animation.
    // We'll replace this with proper animation later.

    player.position.y =
        Math.sin(performance.now() * 0.002) * 0.03;

    updateCamera();

    renderer.render(
        scene,
        camera
    );
}

animate();


// ============================================================
// BOOT
// ============================================================

setTimeout(() => {

    loadingScreen.style.display = "none";

}, 900);
