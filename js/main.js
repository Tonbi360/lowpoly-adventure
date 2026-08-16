import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.getElementById("game-canvas");
const loadingScreen = document.getElementById("loading-screen");

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 5, 10);

const clock = new THREE.Clock();


// ─────────────────────────────────────
// LIGHTING
// ─────────────────────────────────────

const ambientLight = new THREE.HemisphereLight(
    0xffffff,
    0x6b8e5a,
    2
);

scene.add(ambientLight);

const sun = new THREE.DirectionalLight(
    0xffffff,
    3
);

sun.position.set(10, 20, 10);

sun.castShadow = true;

sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;

scene.add(sun);


// ─────────────────────────────────────
// TEST WORLD
// ─────────────────────────────────────

const groundGeometry = new THREE.CylinderGeometry(
    12,
    14,
    2,
    8
);

const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x6fa34a,
    flatShading: true
});

const ground = new THREE.Mesh(
    groundGeometry,
    groundMaterial
);

ground.position.y = -1;

ground.receiveShadow = true;

scene.add(ground);


// ─────────────────────────────────────
// TEST PLAYER
// ─────────────────────────────────────

const playerGeometry = new THREE.CapsuleGeometry(
    0.45,
    1,
    4,
    8
);

const playerMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc88,
    flatShading: true
});

const player = new THREE.Mesh(
    playerGeometry,
    playerMaterial
);

player.position.y = 1;

player.castShadow = true;

scene.add(player);


// ─────────────────────────────────────
// CAMERA
// ─────────────────────────────────────

camera.lookAt(player.position);


// ─────────────────────────────────────
// RESIZE
// ─────────────────────────────────────

function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(width, height);
}

window.addEventListener("resize", resize);


// ─────────────────────────────────────
// GAME LOOP
// ─────────────────────────────────────

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    player.rotation.y += delta * 0.5;

    renderer.render(scene, camera);
}

animate();


// ─────────────────────────────────────
// BOOT
// ─────────────────────────────────────

setTimeout(() => {
    loadingScreen.style.display = "none";
}, 800);
