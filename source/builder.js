import * as THREE from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { Camera } from './camera.js';
import { Input } from './input.js';
import { createWorkbench } from './workbench.js';
import { AssetManager } from './AssetManager.js';

export class Builder {

    selectedObject = null;
    activeToolID = 'select';
    transformControls = null;
    

    constructor() {
        console.log('Builder constructor called');
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.camera = new Camera();
        this.input = new Input();
        this.workbench = createWorkbench(10, 10);
        this.renderer.setSize(window.ui.builderWindow.clientWidth, window.ui.builderWindow.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.placePosition = new THREE.Vector3();

        window.ui.builderWindow.appendChild(this.renderer.domElement);
        window.ui.showToolbar('ui-tool-select');
        window.ui.activeToolbarID = 'ui-tool-select';
        window.ui.hideToolbar('ui-tool-dowel');

        this.raycaster = new THREE.Raycaster();

        this.assetManager = new AssetManager(() => {
            this.initialize();
            this.start();
        });
    }

    initialize(){
        this.scene.background = new THREE.Color(0xFFA07A);
        this.scene.add(this.workbench);
        this.#addLights(); 
        this.scene.add(this.camera.camera);
        console.log('Scene initialized');
    }

    #addLights(){
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 10);
    }

    start(){
        this.renderer.setAnimationLoop(this.draw.bind(this));
        console.log('Animation loop started');
    }

    stop(){
        this.renderer.setAnimationLoop(null);
    }

    draw(){
        this.renderer.render(this.scene, this.camera.camera);

        if (this.input.leftMouseButtonDown){
            const object = this.#raycast();
            if (this.activeToolID === 'add-dowel-connector'){
                if (object !== null && object.userData.isFace){
                    //check if clicked on face
                    console.log(object.parent.position);
                    //object parent is dowel
                    // this.placePosition.x = object.parent.position.x;
                    // //object is face
                    // this.placePosition.y = object.position.y;
                    // this.placePosition.z = object.parent.position.z;
                    this.placePosition.setFromMatrixPosition(object.matrixWorld);
                    this.addDowelConnector();
                }
            }
            else if (this.activeToolID === 'select'){
                if (object !== null && object.userData.isFace){
                    console.log(object.position);
                    
                }
            }
            // set position of dowel if not dragging and clicked off
            if (this.activeToolID === 'add-dowel'){
                if (!this.transformControls.dragging){
                    if (object == null || object.userData.UID == 123443564){
                        this.useTool('select');
                        this.setPosition();
                        window.ui.hideToolbar('ui-tool-dowel');
                        window.ui.showToolbar('ui-tool-select');
                    }
                }
            }
            

        }
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
            case 'add-dowel-connector':
                console.log('add-dowel-connector tool active');
                // this.addDowelConnector();
                break;
            case 'set-position':
                console.log('set-position tool active');
                this.setPosition();
                break;
        }
    }

    addDowel(){
        const dowel = this.assetManager.createAssetInstance('dowel');
        this.scene.add(dowel);
        this.transformControls = new TransformControls(this.camera.camera, this.renderer.domElement);
        this.transformControls.size = 5;
        this.transformControls.showY = false;
        this.transformControls.attach(dowel);
        this.scene.add(this.transformControls.getHelper());
    }

    addDowelConnector(){
        console.log(this.placePosition);
        const dowelConnector = this.assetManager.createAssetInstance('dowel-connector');
        dowelConnector.position.x = this.placePosition.x;
        dowelConnector.position.y = this.placePosition.y;
        dowelConnector.position.z = this.placePosition.z;
        this.scene.add(dowelConnector);
    }

    setPosition(){
        console.log("parent:", this.transformControls.object.parent);
        console.log("child:", this.transformControls.object);
        this.transformControls.detach();
    }

    // create function returning the 

    #raycast(){
        var pos = {
            x: (this.input.mouse.x / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(this.input.mouse.y / this.renderer.domElement.clientHeight) * 2 + 1,
        }
        this.raycaster.setFromCamera(pos, this.camera.camera);

        // Get all intersections without filtering
        let intersections = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersections.length > 0) {
            
            // Find the first intersection that has a valid UID
            for (let intersection of intersections) {
                let object = intersection.object;
                // Traverse up the object hierarchy to find userData
                while (object) {
                    if (object.userData.isFace){
                        console.log(object.userData.isFace);
                        console.log(object.position);
                        console.log("object:", object);
                        return object;
                    }
                    if (object.userData && object.userData.UID) {
                        object.userData.isFace = false;
                        console.log(object.userData.isFace);
                        return object;
                    }
                    object = object.parent;
                }
            }
        }
        
        return null;
    }
}

window.onload = () => {
    window.builder = new Builder();
}



