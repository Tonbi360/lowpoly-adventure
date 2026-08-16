import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { materials } from "./Materials.js";

function createTree(scale = 1, lightLeaves = false) {
    const tree = new THREE.Group();

    tree.scale.setScalar(scale);

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(
        0.25,
        0.4,
        2.6,
        6
    );

    const trunk = new THREE.Mesh(
        trunkGeometry,
        materials.trunk
    );

    trunk.position.y = 1.3;
    trunk.castShadow = true;

    tree.add(trunk);

    // Lower foliage
    const lowerGeometry = new THREE.ConeGeometry(
        1.9,
        2.8,
        7
    );

    const lower = new THREE.Mesh(
        lowerGeometry,
        lightLeaves
            ? materials.leavesLight
            : materials.leaves
    );

    lower.position.y = 3;
    lower.castShadow = true;

    tree.add(lower);

    // Middle foliage
    const middleGeometry = new THREE.ConeGeometry(
        1.45,
        2.5,
        7
    );

    const middle = new THREE.Mesh(
        middleGeometry,
        materials.leaves
    );

    middle.position.y = 4.4;
    middle.castShadow = true;

    tree.add(middle);

    // Top foliage
    const topGeometry = new THREE.ConeGeometry(
        0.9,
        2.1,
        7
    );

    const top = new THREE.Mesh(
        topGeometry,
        lightLeaves
            ? materials.leavesLight
            : materials.leaves
    );

    top.position.y = 5.7;
    top.castShadow = true;

    tree.add(top);

    return tree;
}

function addTree(group, x, y, z, scale = 1, lightLeaves = false) {
    const tree = createTree(scale, lightLeaves);

    tree.position.set(
        x,
        y,
        z
    );

    group.add(tree);

    return tree;
}

export function createVegetation() {
    const group = new THREE.Group();

    // Left forest
    addTree(group, -9, 0.8, 5, 1.0);
    addTree(group, -11, 0.6, 7, 0.8, true);
    addTree(group, -13, 0.35, 4, 1.2);

    addTree(group, -10, 0.55, -2, 1.1, true);
    addTree(group, -12, 0.4, -5, 0.9);
    addTree(group, -14, 0.2, -7, 1.3);

    // Right forest
    addTree(group, 9, 0.8, 5, 1.2);
    addTree(group, 11, 0.55, 7, 0.8, true);
    addTree(group, 13, 0.35, 4, 1.1);

    addTree(group, 9, 0.7, -3, 1.0, true);
    addTree(group, 12, 0.45, -5, 1.3);
    addTree(group, 14, 0.15, -3, 0.9);

    return group;
}
