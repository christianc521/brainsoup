import * as THREE from 'three';
import assets from './assets.js';

//AssetManager
// - loads assets
// - creates asset instances
// - updates asset instances
// - destroys asset instances
// - stores asset instances
// - provides asset instances



export class AssetManager {

    assets = {};
    createdAssets = [];
    UID = 100;

    constructor(onLoad){
        this.assetCount = 0;
        this.onLoad = onLoad;
        this.loadAssets();
    }

    loadAssets(){
        for (const assetID in assets){
            this.assets[assetID] = assets[assetID];
        }   
        if (this.onLoad){
            this.onLoad();
        }
    }   

    createAssetInstance(assetID){
        if (assetID in this.assets){
            const asset = this.assets[assetID];
            const instance = new THREE.Object3D();
            instance.userData = {...asset};
            instance.userData.UID = this.UID++;

            if (asset.assetType === "part"){
                // Create bottom face
                const bottomFace = this.createFace(asset, 0xff0000, -asset.length/2);
                
                // Create top face
                const topFace = this.createFace(asset, 0x00ff00, asset.length/2);
                
                // Create main cylinder
                const geometry = new THREE.CylinderGeometry(asset.thickness, asset.thickness, asset.length, 32);
                const material = new THREE.MeshStandardMaterial({color: asset.color});
                const mesh = new THREE.Mesh(geometry, material);
                
                // Apply asset data to all parts and set parent reference
                // [bottomFace, topFace, mesh].forEach(part => {
                //     part.userData = {...instance.userData};
                //     part.userData.parentAsset = instance;
                // });
                instance.add(bottomFace, topFace, mesh);
            }
            else if (asset.assetType === "joint"){
                const geometry = new THREE.SphereGeometry(asset.radius, 32, 32);
                const material = new THREE.MeshStandardMaterial({color:asset.color});
                const mesh = new THREE.Mesh(geometry, material);
                mesh.userData = {...instance.userData};
                mesh.userData.parentAsset = instance;
                instance.add(mesh);
            }

            instance.position.set(asset.x, asset.y, asset.z);
            this.createdAssets.push(instance);
            return instance;    
        }
        else{
            console.error(`Asset ID ${assetID} not found`);
            return undefined;
        }
    }

    createFace(asset, color, yOffset) {
        const faceGeometry = new THREE.CylinderGeometry(asset.thickness + 0.1, asset.thickness + 0.1, 0.1, 32);
        const faceMaterial = new THREE.MeshStandardMaterial({color: color});
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.position.y = yOffset;
        face.userData.isFace = true;
        return face;
    }

    getAssetByUID(UID){
        for (const asset of this.createdAssets){
            if (asset.userData.UID === UID){
                return asset;
            }
        }
        return undefined;
    }
}
