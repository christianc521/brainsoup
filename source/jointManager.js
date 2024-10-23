// handle creation of joints
// called from Builder class
// 
import * as THREE from 'three';
import assets from './assets.js';

export class JointManager {
    
    

    // joints must have at least 1 parent
    // child of surfaces or dowel

    constructor(){
        this.joints = {};
    }

    createJoint(jointID, parentUIDs = []){
        this.joints[jointID] = {
            "parents" : parentUIDs,
            "children" : [],
            "assetID" : "dowel-joint",
            "UID" : 0,
            "assetType" : "joint",
            "assetVolume" : 0,
            "assetPrice" : .1,
        };
    }

    // check if parent dowels have an intersecting normal
    // if so, create point of intersection
    intersectionPoint(parentObjects) {
        // parent object is array of topFace/bottomFace objects
        for (const parent of parentObjects){
            faceNormal = parent.getWorldPosition(new THREE.Vector3()).normalize();
            faceCenter = parent.getWorldPosition(new THREE.Vector3()).add(parent.getWorldPosition(new THREE.Vector3()).multiplyScalar(.5));
        }
    }


    addParent(jointID, parentUID){
        this.joints[jointID].parents.push(parentUID);
    }

    addChild(jointID, childUID){
        this.joints[jointID].children.push(childUID);
    }

    
}