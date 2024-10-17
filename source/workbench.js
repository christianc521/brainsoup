import * as THREE from 'three';


export function createWorkbench(sizeX, sizeY) {
    const thickness = 0.1;
    const workbench = new THREE.Object3D();
    const geometry = new THREE.BoxGeometry(sizeX, thickness, sizeY);
    const material = new THREE.MeshStandardMaterial({color:0xF8DFA1});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.y = -thickness / 2;
    workbench.add(cube);
    workbench.userData = { id: 'workbench', UID: 123443564 };
    return workbench;
}
