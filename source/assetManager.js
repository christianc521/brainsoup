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
            if (asset.assetType === "part"){
                const bottomFaceGeometry = new THREE.CylinderGeometry(asset.thickness + .1, asset.thickness + .1, .1, 32);
                const bottomFaceMaterial = new THREE.MeshStandardMaterial({color:0xff0000});
                const bottomFace = new THREE.Mesh(bottomFaceGeometry, bottomFaceMaterial);
                // bottomFace.rotateX(-Math.PI / 2);
                bottomFace.position.x = asset.x;
                bottomFace.position.y = 0;
                bottomFace.position.z = asset.z;
                bottomFace.userData.isFace = true;

                const topFaceGeometry = new THREE.CylinderGeometry(asset.thickness + .1, asset.thickness + .1, .1, 32);
                const topFaceMaterial = new THREE.MeshStandardMaterial({color:0x00ff00});
                const topFace = new THREE.Mesh(topFaceGeometry, topFaceMaterial);
                topFace.position.x = asset.x;
                topFace.position.y = asset.length + .01;
                topFace.position.z = asset.z;
                topFace.userData.isFace = true;

                const geometry = new THREE.CylinderGeometry(asset.thickness, asset.thickness, asset.length, 32);
                const material = new THREE.MeshStandardMaterial({color:asset.color});
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = asset.x;
                mesh.position.y = asset.y;
                mesh.position.z = asset.z;
                mesh.userData.isFace = false;

                const group = new THREE.Object3D();
                group.add(bottomFace);
                group.add(topFace);
                group.add(mesh);
                instance.add(group);
            }
            else if (asset.assetType === "joint"){
                const geometry = new THREE.SphereGeometry(asset.radius, 32, 32);
                const material = new THREE.MeshStandardMaterial({color:asset.color});
                const mesh = new THREE.Mesh(geometry, material);
                instance.add(mesh);
            }
            instance.userData = asset;
            instance.userData.UID = this.UID;
            this.UID++;
            this.createdAssets.push(instance);
            console.log("created:", instance);
            return instance;    
        }
        else{
            console.error(`Asset ID ${assetID} not found`);
            return undefined;
        }
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