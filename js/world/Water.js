import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export function createWater() {
    const geometry = new THREE.CircleGeometry(
        90,
        48
    );

    const material = new THREE.MeshStandardMaterial({
        color: 0x55b9d2,
        roughness: 0.85,
        metalness: 0
    });

    const water = new THREE.Mesh(
        geometry,
        material
    );

    water.rotation.x = -Math.PI / 2;
    water.position.y = -5.8;

    water.receiveShadow = true;

    return water;
}
