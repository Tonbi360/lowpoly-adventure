import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ============================================================
// BASIC SETUP
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

renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x8bd8f0);

scene.fog = new THREE.Fog(
    0x8bd8f0,
    55,
    150
);


// ============================================================
// CAMERA
// ============================================================

const camera = new THREE.PerspectiveCamera(
    58,
    window.innerWidth / window.innerHeight,
    0.1,
    250
);

camera.position.set(
    0,
    8,
    14
);


// ============================================================
// LIGHTING
// ============================================================

const skyLight = new THREE.HemisphereLight(
    0xfff7df,
    0x668052,
    2.4
);

scene.add(skyLight);


const sun = new THREE.DirectionalLight(
    0xfff1c7,
    3.5
);

sun.position.set(
    -25,
    35,
    20
);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

sun.shadow.camera.left = -45;
sun.shadow.camera.right = 45;
sun.shadow.camera.top = 45;
sun.shadow.camera.bottom = -45;

sun.shadow.camera.near = 1;
sun.shadow.camera.far = 120;

scene.add(sun);


// ============================================================
// MATERIALS
// ============================================================

const grassMaterial = new THREE.MeshStandardMaterial({
    color: 0x79b94e,
    flatShading: true
});

const grassLightMaterial = new THREE.MeshStandardMaterial({
    color: 0x91cc5d,
    flatShading: true
});

const cliffMaterial = new THREE.MeshStandardMaterial({
    color: 0x7d745f,
    flatShading: true
});

const dirtMaterial = new THREE.MeshStandardMaterial({
    color: 0xc69a61,
    flatShading: true
});

const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x77786f,
    flatShading: true
});

const darkRockMaterial = new THREE.MeshStandardMaterial({
    color: 0x5d625b,
    flatShading: true
});

const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x765035,
    flatShading: true
});

const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x3e873d,
    flatShading: true
});

const leafLightMaterial = new THREE.MeshStandardMaterial({
    color: 0x65a847,
    flatShading: true
});


// ============================================================
// WORLD GROUP
// ============================================================

const world = new THREE.Group();

scene.add(world);


// ============================================================
// WATER
// ============================================================

const waterGeometry = new THREE.CircleGeometry(
    90,
    48
);

const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x55b9d2,
    roughness: 0.85,
    metalness: 0
});

const water = new THREE.Mesh(
    waterGeometry,
    waterMaterial
);

water.rotation.x = -Math.PI / 2;
water.position.y = -5.8;

world.add(water);


// ============================================================
// ISLAND TERRAIN
// ============================================================

function createIsland() {

    const segments = 16;
    const rings = 4;

    const vertices = [];
    const indices = [];

    const centerHeight = 1.0;

    // Center vertex
    vertices.push(
        0,
        centerHeight,
        0
    );

    // Terrain rings
    for (let ring = 1; ring <= rings; ring++) {

        const radius = ring * 5.3;

        for (let i = 0; i < segments; i++) {

            const angle =
                (i / segments) * Math.PI * 2;

            const variation =
                1 +
                Math.sin(angle * 3.0) * 0.06 +
                Math.sin(angle * 5.0) * 0.035;

            const x = Math.cos(angle) * radius * variation;
            const z = Math.sin(angle) * radius * variation;

            let y;

            if (ring === 1) {
                y = 0.8;
            } else if (ring === 2) {
                y = 0.5;
            } else if (ring === 3) {
                y = 0.1;
            } else {
                y = -0.6;
            }

            // A few natural height variations
            y += Math.sin(
                angle * 4 + ring
            ) * 0.12;

            vertices.push(
                x,
                y,
                z
            );
        }
    }

    // Center to first ring
    for (let i = 0; i < segments; i++) {

        const next = (i + 1) % segments;

        indices.push(
            0,
            1 + i,
            1 + next
        );
    }

    // Ring connections
    for (let ring = 1; ring < rings; ring++) {

        const currentStart =
            1 + (ring - 1) * segments;

        const nextStart =
            1 + ring * segments;

        for (let i = 0; i < segments; i++) {

            const next =
                (i + 1) % segments;

            const a = currentStart + i;
            const b = currentStart + next;
            const c = nextStart + i;
            const d = nextStart + next;

            indices.push(
                a, c, b,
                b, c, d
            );
        }
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );

    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    const island = new THREE.Mesh(
        geometry,
        grassMaterial
    );

    island.receiveShadow = true;

    world.add(island);

    return island;
}

createIsland();


// ============================================================
// CLIFF SIDES
// ============================================================

function createCliffRing() {

    const segments = 16;
    const topRadius = 21.2;
    const bottomRadius = 19.2;

    const vertices = [];
    const indices = [];

    for (let i = 0; i < segments; i++) {

        const angle =
            (i / segments) * Math.PI * 2;

        const variation =
            1 +
            Math.sin(angle * 3) * 0.06;

        const xTop =
            Math.cos(angle) *
            topRadius *
            variation;

        const zTop =
            Math.sin(angle) *
            topRadius *
            variation;

        const xBottom =
            Math.cos(angle) *
            bottomRadius *
            variation;

        const zBottom =
            Math.sin(angle) *
            bottomRadius *
            variation;

        vertices.push(
            xTop,
            -0.65,
            zTop
        );

        vertices.push(
            xBottom,
            -5.7,
            zBottom
        );
    }

    for (let i = 0; i < segments; i++) {

        const next =
            (i + 1) % segments;

        const topA = i * 2;
        const bottomA = i * 2 + 1;

        const topB = next * 2;
        const bottomB = next * 2 + 1;

        indices.push(
            topA,
            bottomA,
            topB,

            topB,
            bottomA,
            bottomB
        );
    }

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
            vertices,
            3
        )
    );

    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const cliff = new THREE.Mesh(
        geometry,
        cliffMaterial
    );

    cliff.receiveShadow = true;
    cliff.castShadow = true;

    world.add(cliff);
}

createCliffRing();


// ============================================================
// PATH
// ============================================================

function createPath() {

    const points = [
        new THREE.Vector3(0, 0.87, 10),
        new THREE.Vector3(0, 0.89, 7),
        new THREE.Vector3(-0.3, 0.9, 4),
        new THREE.Vector3(-0.8, 0.9, 1),
        new THREE.Vector3(-1.1, 0.8, -2),
        new THREE.Vector3(-0.5, 0.65, -5),
        new THREE.Vector3(1.2, 0.45, -8),
        new THREE.Vector3(2.5, 0.2, -11)
    ];

    const pathGroup = new THREE.Group();

    world.add(pathGroup);

    for (let i = 0; i < points.length - 1; i++) {

        const a = points[i];
        const b = points[i + 1];

        const midpoint =
            new THREE.Vector3()
                .addVectors(a, b)
                .multiplyScalar(0.5);

        const distance =
            a.distanceTo(b);

        const geometry =
            new THREE.BoxGeometry(
                3.2,
                0.08,
                distance
            );

        const piece = new THREE.Mesh(
            geometry,
            dirtMaterial
        );

        piece.position.copy(midpoint);

        piece.lookAt(b.x, midpoint.y, b.z);

        piece.receiveShadow = true;

        pathGroup.add(piece);
    }
}

createPath();


// ============================================================
// ROCK
// ============================================================

function createRock(
    x,
    y,
    z,
    scale = 1,
    material = rockMaterial
) {

    const geometry =
        new THREE.DodecahedronGeometry(
            1,
            0
        );

    const rock = new THREE.Mesh(
        geometry,
        material
    );

    rock.position.set(
        x,
        y,
        z
    );

    rock.scale.set(
        scale * 1.4,
        scale,
        scale * 1.1
    );

    rock.rotation.set(
        Math.random() * 0.5,
        Math.random() * Math.PI,
        Math.random() * 0.5
    );

    rock.castShadow = true;
    rock.receiveShadow = true;

    world.add(rock);

    return rock;
}


// Foreground rocks

createRock(-6, 0.95, 7, 0.7);
createRock(6, 0.9, 8, 0.9);
createRock(-8, 0.65, 1, 0.8);
createRock(8, 0.65, 0, 1.0);

createRock(-5, 0.5, -8, 1.2);
createRock(7, 0.35, -9, 0.9);

createRock(-15, -0.1, -3, 1.5);
createRock(14, -0.1, 5, 1.4);

createRock(
    -17,
    -1,
    10,
    1.8,
    darkRockMaterial
);

createRock(
    17,
    -1,
    -7,
    1.7,
    darkRockMaterial
);


// ============================================================
// TREE
// ============================================================

function createTree(
    x,
    y,
    z,
    scale = 1,
    lightLeaves = false
) {

    const tree = new THREE.Group();

    tree.position.set(
        x,
        y,
        z
    );

    tree.scale.setScalar(scale);

    // Trunk

    const trunkGeometry =
        new THREE.CylinderGeometry(
            0.25,
            0.4,
            2.6,
            6
        );

    const trunk = new THREE.Mesh(
        trunkGeometry,
        trunkMaterial
    );

    trunk.position.y = 1.3;

    trunk.castShadow = true;

    tree.add(trunk);


    // Lower leaves

    const lowerGeometry =
        new THREE.ConeGeometry(
            1.9,
            2.8,
            7
        );

    const lower = new THREE.Mesh(
        lowerGeometry,
        lightLeaves
            ? leafLightMaterial
            : leafMaterial
    );

    lower.position.y = 3;

    lower.castShadow = true;

    tree.add(lower);


    // Middle leaves

    const middleGeometry =
        new THREE.ConeGeometry(
            1.45,
            2.5,
            7
        );

    const middle = new THREE.Mesh(
        middleGeometry,
        leafMaterial
    );

    middle.position.y = 4.4;

    middle.castShadow = true;

    tree.add(middle);


    // Top

    const topGeometry =
        new THREE.ConeGeometry(
            0.9,
            2.1,
            7
        );

    const top = new THREE.Mesh(
        topGeometry,
        lightLeaves
            ? leafLightMaterial
            : leafMaterial
    );

    top.position.y = 5.7;

    top.castShadow = true;

    tree.add(top);


    world.add(tree);

    return tree;
}


// Forest clusters

createTree(-9, 0.8, 5, 1.0);
createTree(-11, 0.6, 7, 0.8, true);
createTree(-13, 0.35, 4, 1.2);

createTree(-10, 0.55, -2, 1.1, true);
createTree(-12, 0.4, -5, 0.9);
createTree(-14, 0.2, -7, 1.3);

createTree(9, 0.8, 5, 1.2);
createTree(11, 0.55, 7, 0.8, true);
createTree(13, 0.35, 4, 1.1);

createTree(9, 0.7, -3, 1.0, true);
createTree(12, 0.45, -5, 1.3);
createTree(14, 0.15, -3, 0.9);


// ============================================================
// VILLAGE HOUSE
// ============================================================

function createHouse() {

    const house = new THREE.Group();

    house.position.set(
        -1.5,
        0.75,
        -7
    );

    // Main building

    const wallGeometry =
        new THREE.BoxGeometry(
            5,
            3,
            4
        );

    const wallMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xe2c795,
            flatShading: true
        });

    const walls = new THREE.Mesh(
        wallGeometry,
        wallMaterial
    );

    walls.position.y = 1.5;

    walls.castShadow = true;
    walls.receiveShadow = true;

    house.add(walls);


    // Roof

    const roofGeometry =
        new THREE.ConeGeometry(
            3.8,
            2.8,
            4
        );

    const roofMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc86f45,
            flatShading: true
        });

    const roof = new THREE.Mesh(
        roofGeometry,
        roofMaterial
    );

    roof.position.y = 4.4;

    roof.rotation.y =
        Math.PI / 4;

    roof.castShadow = true;

    house.add(roof);


    // Door

    const doorGeometry =
        new THREE.BoxGeometry(
            1.05,
            1.9,
            0.15
        );

    const doorMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x704832,
            flatShading: true
        });

    const door = new THREE.Mesh(
        doorGeometry,
        doorMaterial
    );

    door.position.set(
        0,
        0.95,
        2.08
    );

    door.castShadow = true;

    house.add(door);


    // Window

    const windowGeometry =
        new THREE.BoxGeometry(
            1.1,
            1,
            0.12
        );

    const windowMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x7ed0df,
            flatShading: true,
            emissive: 0x204b52,
            emissiveIntensity: 0.3
        });

    const window = new THREE.Mesh(
        windowGeometry,
        windowMaterial
    );

    window.position.set(
        -1.5,
        1.8,
        2.08
    );

    house.add(window);


    world.add(house);
}

createHouse();


// ============================================================
// DISTANT MOUNTAINS
// ============================================================

function createMountain(
    x,
    y,
    z,
    height,
    radius,
    color
) {

    const geometry =
        new THREE.ConeGeometry(
            radius,
            height,
            6
        );

    const material =
        new THREE.MeshStandardMaterial({
            color,
            flatShading: true
        });

    const mountain = new THREE.Mesh(
        geometry,
        material
    );

    mountain.position.set(
        x,
        y + height / 2,
        z
    );

    mountain.rotation.y =
        Math.random();

    mountain.castShadow = true;

    world.add(mountain);
}


createMountain(
    -42,
    -5,
    -45,
    32,
    17,
    0x66836c
);

createMountain(
    -15,
    -5,
    -58,
    43,
    21,
    0x587761
);

createMountain(
    22,
    -5,
    -55,
    35,
    18,
    0x5f7d67
);

createMountain(
    48,
    -5,
    -35,
    28,
    15,
    0x6b886e
);


// ============================================================
// PLAYER
// ============================================================

const player = new THREE.Group();

player.position.set(
    0,
    0.9,
    8
);

world.add(player);


// Legs

const legMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x35445a,
        flatShading: true
    });

function createLeg(x) {

    const geometry =
        new THREE.CylinderGeometry(
            0.18,
            0.23,
            0.9,
            6
        );

    const leg = new THREE.Mesh(
        geometry,
        legMaterial
    );

    leg.position.set(
        x,
        0.45,
        0
    );

    leg.castShadow = true;

    player.add(leg);

    return leg;
}

createLeg(-0.25);
createLeg(0.25);


// Boots

const bootMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x49372d,
        flatShading: true
    });

function createBoot(x) {

    const geometry =
        new THREE.BoxGeometry(
            0.4,
            0.28,
            0.65
        );

    const boot = new THREE.Mesh(
        geometry,
        bootMaterial
    );

    boot.position.set(
        x,
        0.08,
        -0.12
    );

    boot.castShadow = true;

    player.add(boot);
}

createBoot(-0.25);
createBoot(0.25);


// Body

const bodyGeometry =
    new THREE.BoxGeometry(
        0.9,
        1.15,
        0.6
    );

const bodyMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x3d6686,
        flatShading: true
    });

const body = new THREE.Mesh(
    bodyGeometry,
    bodyMaterial
);

body.position.y = 1.35;

body.castShadow = true;

player.add(body);


// Head

const headGeometry =
    new THREE.IcosahedronGeometry(
        0.58,
        1
    );

const skinMaterial =
    new THREE.MeshStandardMaterial({
        color: 0xe0a46f,
        flatShading: true
    });

const head = new THREE.Mesh(
    headGeometry,
    skinMaterial
);

head.position.y = 2.3;

head.castShadow = true;

player.add(head);


// Hair

const hairGeometry =
    new THREE.ConeGeometry(
        0.58,
        0.7,
        6
    );

const hairMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x294a63,
        flatShading: true
    });

const hair = new THREE.Mesh(
    hairGeometry,
    hairMaterial
);

hair.position.y = 2.75;

hair.rotation.y =
    Math.PI / 6;

hair.castShadow = true;

player.add(hair);


// Backpack

const backpackGeometry =
    new THREE.BoxGeometry(
        0.75,
        0.9,
        0.35
    );

const backpackMaterial =
    new THREE.MeshStandardMaterial({
        color: 0x8c5338,
        flatShading: true
    });

const backpack = new THREE.Mesh(
    backpackGeometry,
    backpackMaterial
);

backpack.position.set(
    0,
    1.4,
    -0.45
);

backpack.castShadow = true;

player.add(backpack);


// ============================================================
// CAMERA FOLLOW
// ============================================================

const cameraOffset =
    new THREE.Vector3(
        0,
        7,
        12
    );

function updateCamera() {

    const target =
        player.position
            .clone()
            .add(cameraOffset);

    camera.position.lerp(
        target,
        0.08
    );

    const lookTarget =
        player.position
            .clone();

    lookTarget.y += 1.3;

    camera.lookAt(
        lookTarget
    );
}


// ============================================================
// RESIZE
// ============================================================

function resize() {

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            1.5
        )
    );

    renderer.setSize(
        width,
        height
   
