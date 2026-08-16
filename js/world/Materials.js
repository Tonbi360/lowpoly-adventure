import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

export const materials = {

    grass: new THREE.MeshStandardMaterial({
        color: 0x79b94e,
        flatShading: true
    }),

    grassLight: new THREE.MeshStandardMaterial({
        color: 0x91cc5d,
        flatShading: true
    }),

    cliff: new THREE.MeshStandardMaterial({
        color: 0x7d745f,
        flatShading: true
    }),

    dirt: new THREE.MeshStandardMaterial({
        color: 0xc69a61,
        flatShading: true
    }),

    rock: new THREE.MeshStandardMaterial({
        color: 0x77786f,
        flatShading: true
    }),

    darkRock: new THREE.MeshStandardMaterial({
        color: 0x5d625b,
        flatShading: true
    }),

    trunk: new THREE.MeshStandardMaterial({
        color: 0x765035,
        flatShading: true
    }),

    leaves: new THREE.MeshStandardMaterial({
        color: 0x3e873d,
        flatShading: true
    }),

    leavesLight: new THREE.MeshStandardMaterial({
        color: 0x65a847,
        flatShading: true
    })

};
