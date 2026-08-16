import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.getElementById("game-canvas");
const loadingScreen = document.getElementById("loading-screen");

try {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 5, 10);

    const light = new THREE.HemisphereLight(
        0xffffff,
        0x668052,
        2
    );

    scene.add(light);

    const geometry = new THREE.BoxGeometry(
        2,
        2,
        2
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x76b852,
        flatShading: true
    });

    const cube = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(cube);

    camera.lookAt(cube.position);

    renderer.render(scene, camera);

    loadingScreen.innerHTML = `
        <div class="loading-title">ENGINE OK</div>
        <div class="loading-text">Three.js is running correctly.</div>
    `;

} catch (error) {

    loadingScreen.innerHTML = `
        <div class="loading-title">GAME ERROR</div>
        <div class="loading-text">${error.message}</div>
    `;

    console.error(error);
}
