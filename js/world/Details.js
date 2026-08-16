import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { materials } from "./Materials.js";

function createRock(scale = 1, dark = false) {
    const geometry = new THREE.DodecahedronGeometry(1, 0);

    const rock = new THREE.Mesh(
        geometry,
        dark ? materials.darkRock : materials.rock
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

    return rock;
}

function addRock(group, x, y, z, scale = 1, dark = false) {
    const rock = createRock(scale, dark);

    rock.position.set(x, y, z);

    group.add(rock);

    return rock;
}

function createGrassPatch() {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
        color: 0x6fae43,
        flatShading: true,
        side: THREE.DoubleSide
    });

    for (let i = 0; i < 7; i++) {
        const height = 0.25 + Math.random() * 0.3;

        const geometry = new THREE.ConeGeometry(
            0.08,
            height,
            4
        );

        const blade = new THREE.Mesh(
            geometry,
            material
        );

        blade.position.set(
            (Math.random() - 0.5) * 1.2,
            height / 2,
            (Math.random() - 0.5) * 1.2
        );

        blade.rotation.y =
            Math.random() * Math.PI;

        group.add(blade);
    }

    return group;
}

function addGrass(group, x, y, z, scale = 1) {
    const grass = createGrassPatch();

    grass.position.set(x, y, z);
    grass.scale.setScalar(scale);

    group.add(grass);
}

export function createDetails() {
    const group = new THREE.Group();

    // Large foreground rocks
    addRock(group, -6, 0.95, 7, 0.7);
    addRock(group, 6, 0.9, 8, 0.9);
    addRock(group, -8, 0.65, 1, 0.8);
    addRock(group, 8, 0.65, 0, 1.0);

    addRock(group, -5, 0.5, -8, 1.2);
    addRock(group, 7, 0.35, -9, 0.9);

    // Edge rocks
    addRock(group, -15, -0.1, -3, 1.5);
    addRock(group, 14, -0.1, 5, 1.4);

    addRock(
        group,
        -17,
        -1,
        10,
        1.8,
        true
    );

    addRock(
        group,
        17,
        -1,
        -7,
        1.7,
        true
    );

    // Small grass clusters
    addGrass(group, -4, 0.9, 6, 1);
    addGrass(group, 4, 0.9, 6, 1.2);
    addGrass(group, -6, 0.7, 2, 0.8);
    addGrass(group, 6, 0.7, 2, 1);
    addGrass(group, -4, 0.45, -5, 1.1);
    addGrass(group, 5, 0.4, -6, 0.9);

    return group;
}
