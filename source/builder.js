import * as THREE from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { Camera } from './camera.js';
import { Input } from './input.js';
import { createWorkbench } from './workbench.js';
import { createAssetInstance } from './assets.js';

export class Builder {

    selectedObject = null;
    activeToolID = 'select';
    transformControls = null;

    constructor() {
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.input = new Input();
        this.workbench = createWorkbench(10, 10);

        this.renderer.setSize(window.ui.builderWindow.clientWidth, window.ui.builderWindow.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        window.ui.builderWindow.appendChild(this.renderer.domElement);
        window.ui.showToolbar('ui-tool-select');
        window.ui.activeToolbarID = 'ui-tool-select';
        window.ui.hideToolbar('ui-tool-dowel');

        this.raycaster = new THREE.Raycaster();

        // this.transformControls = new TransformControls(this.camera.camera, this.renderer.domElement);
        // this.transformControls.id = 'transform-controls';
    }

    initialize(){
        // this.scene.clear();
        this.scene.background = new THREE.Color(0xFFA07A);
        this.scene.add(this.workbench);
        // this.scene.add(this.transformControls);
        this.#addLights(); 

    }

    #addLights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
    }

    start(){
        this.renderer.setAnimationLoop(this.draw.bind(this));
        console.log('start');
    }

    stop(){
        this.renderer.setAnimationLoop(null);
    }

    draw(){
        this.renderer.render(this.scene, this.camera.camera);
    }

    useTool(toolID) {
        this.activeToolID = toolID;
        switch(this.activeToolID){
            case 'select':
                console.log('select tool active');
                break;
            case 'add-dowel':
                console.log('add-dowel tool active');
                this.addDowel();
                break;
            case 'set-position':
                console.log('set-position tool active');
                this.setPosition();
                break;
        }
    }

    addDowel(){
        const dowelLength = 1;
        const dowelThickness = .5;
        const dowel = createAssetInstance('dowel', 0, 0, 0, dowelLength, dowelThickness);
        this.scene.add(dowel);
        this.transformControls = new TransformControls(this.camera.camera, this.renderer.domElement);
        this.transformControls.size = 5;
        this.transformControls.showY = false;
        this.transformControls.attach(dowel);
        this.scene.add(this.transformControls.getHelper());
    }

    setPosition(){
        this.transformControls.detach();
        console.log('setPosition');
        // this.activeToolID = 'select';
    }

    #raycast(){
        var pos = {
            x: (this.input.mouse.x / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(this.input.mouse.y / this.renderer.domElement.clientHeight) * 2 + 1,
        }
        this.raycaster.setFromCamera(pos, this.camera.camera);

        let intersections = this.raycaster.intersectObjects(this.scene.children, true).filter(intersection => {
            let obj = intersection.object;
            let objectID = obj.userData ? obj.userData.id : undefined;
            while (obj && !objectID) {
                obj = obj.parent;
                objectID = obj && obj.userData ? obj.userData.id : undefined;
            }
            if (objectID) {
                return true;
            }
            return false;
        });

        if (intersections.length > 0){
            const intersection = intersections[0];
            let object = intersection.object;
            
            // traverse up the object hierarchy to find userData
            let objectID = object.userData ? object.userData.id : undefined;
            while (object && !objectID) {
                object = object.parent;
                objectID = object && object.userData ? object.userData.id : undefined;
            }
            return objectID;
        } else {
            return null;
        }
    }
}

window.onload = () => {
    window.builder = new Builder();
    window.builder.initialize();
    window.builder.start();
}


