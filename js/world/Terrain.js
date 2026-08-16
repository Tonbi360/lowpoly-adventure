import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { materials } from "./Materials.js";

export function createTerrain() {
    const group = new THREE.Group();

    const segments = 16;
    const rings = 4;

    const vertices = [];
    const indices = [];

    // Center
    vertices.push(0, 1, 0);

    // Terrain rings
    for (let ring = 1; ring <= rings; ring++) {
        const radius = ring * 5.3;

        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;

            const variation =
                1 +
                Math.sin(angle * 3) * 0.06 +
                Math.sin(angle * 5) * 0.035;

            const x =
                Math.cos(angle) *
                radius *
                variation;

            const z =
                Math.sin(angle) *
                radius *
                variation;

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

            y += Math.sin(
                angle * 4 + ring
            ) * 0.12;

            vertices.push(x, y, z);
        }
    }

    // Center → first ring
    for (let i = 0; i < segments; i++) {
        const next = (i + 1) % segments;

        indices.push(
            0,
            1 + i,
            1 + next
        );
    }

    // Ring → ring
    for (let ring = 1; ring < rings; ring++) {
        const currentStart =
            1 + (ring - 1) * segments;

        const nextStart =
            1 + ring * segments;

        for (let i = 0; i < segments; i++) {
            const next = (i + 1) % segments;

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

    const terrain = new THREE.Mesh(
        geometry,
        materials.grass
    );

    terrain.receiveShadow = true;

    group.add(terrain);

    return group;
          }
