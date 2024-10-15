import * as THREE from 'three';

const assets = {
    'dowel': (x, y, z, length, thickness) => {
        const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 32);
        const material = new THREE.MeshStandardMaterial({color:0x000000});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { id: 'dowel' };
        mesh.position.set(x, y + length/2, z);
        return mesh;
    },
    'ghost-dowel': (x, y, z, length, thickness) => {
        const geometry = new THREE.CylinderGeometry(thickness, thickness, length, 32);
        const material = new THREE.MeshStandardMaterial({color:0x000000});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.userData = { id: 'ghost-dowel' };
        mesh.position.set(x, y + length/2, z);
        return mesh;
    }
}

export function createAssetInstance(assetID, x, y, z, length, thickness){
    if  (assetID in assets){
        return assets[assetID](x, y, z, length, thickness);
    }
    else{
        console.error(`Asset ID ${assetID} not found`);
        return undefined;
    }
}

