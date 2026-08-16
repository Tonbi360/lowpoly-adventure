import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { materials } from "./Materials.js";

export function createCliffs() {
    const group = new THREE.Group();

    const segments = 16;
    const topRadius = 21.2;
    const bottomRadius = 19.2;

    const vertices = [];
    const indices = [];

    for (let i = 0; i < segments; i++) {
        const angle =
            (i / segments) * Math.PI * 2;

        const variation =
            1 + Math.sin(angle * 3) * 0.06;

        const topX =
            Math.cos(angle) *
            topRadius *
            variation;

        const topZ =
            Math.sin(angle) *
            topRadius *
            variation;

        const bottomX =
            Math.cos(angle) *
            bottomRadius *
            variation;

        const bottomZ =
            Math.sin(angle) *
            bottomRadius *
            variation;

        vertices.push(
            topX,
            -0.65,
            topZ
        );

        vertices.push(
            bottomX,
            -5.7,
            bottomZ
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

    const cliffs = new THREE.Mesh(
        geometry,
        materials.cliff
    );

    cliffs.castShadow = true;
    cliffs.receiveShadow = true;

    group.add(cliffs);

    return group;
}
