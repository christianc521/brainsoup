import * as THREE from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { Camera } from './camera.js';
import { Input } from './input.js';
import { createWorkbench } from './workbench.js';
import { AssetManager } from './assetManager.js';

export class Builder {

    selectedObject = null;
    activeToolID = 'select';
    transformControls = null;
    

    constructor() {
        console.log('Builder constructor called');
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.ui.builderWindow.clientWidth, window.ui.builderWindow.clientHeight);
        this.camera = new Camera();
        this.input = new Input();
        this.workbench = createWorkbench(10, 10);
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

        // window.addEventListener('resize', this.onResize.bind(this), false);
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
            const result = this.#raycast();
            if (result !== null) {
                if (this.activeToolID === 'add-dowel-connector'){
                    if (result.isFace){
                        console.log('clicked on face');
                        this.placePosition.setFromMatrixPosition(result.intersectedObject.matrixWorld);
                        this.addDowelConnector();
                        this.useTool('select');
                        window.ui.resetToolbars();
                    }
                }
                else if (this.activeToolID === 'select'){
                    window.ui.updateLeftPanel(result.object);
                    if (result.object.userData.assetID === 'dowel'){
                        if (this.selectedObject !== result.intersectedObject.parent) {
                            this.selectedObject = result.intersectedObject.parent;
                            this.useTool('select-transform');
                            this.editPosition(result.intersectedObject.parent);
                        }
                    }
                }
                // set position of dowel if not dragging and clicked off
                else if (this.activeToolID === 'add-dowel'){
                    if (!this.transformControls.dragging){
                        if (result == null || result.object.userData.UID == 123443564){
                            console.log('clicked off dowel');
                            this.useTool('select');
                            this.setPosition();
                            window.ui.resetToolbars();
                        }
                    }
                }
            }
        } else {
            this.selectedObject = null; // Reset selected object when mouse button is released
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
                break;
            case 'set-position':
                this.setPosition();
                break;
        }
    }

    addDowel(){
        const dowel = this.assetManager.createAssetInstance('dowel');
        this.scene.add(dowel);
        this.editPosition(dowel);
    }

    addDowelConnector(){
        console.log("called addDowelConnector");
        const dowelConnector = this.assetManager.createAssetInstance('dowel-joint');
        dowelConnector.position.x = this.placePosition.x;
        dowelConnector.position.y = this.placePosition.y;
        dowelConnector.position.z = this.placePosition.z;
        this.scene.add(dowelConnector);
    }
    editPosition(object){
        //set active tool to add-dowel
        if (this.transformControls) {
            this.transformControls.detach();
            this.scene.remove(this.transformControls);
        }
        this.transformControls = new TransformControls(this.camera.camera, this.renderer.domElement);
        this.transformControls.size = 5;
        this.transformControls.showY = false;
        
        
        if (object instanceof THREE.Object3D) {
            this.transformControls.attach(object);
            this.scene.add(this.transformControls);
            this.scene.add(this.transformControls.getHelper());
            this.activeToolID = "add-dowel";
        } else {
            console.error('Attempted to attach TransformControls to a non-Object3D:', object);
        }
    }
    setPosition(){
        this.transformControls.detach();
    }


    // create function returning the 

    #raycast(){
        var rect = this.renderer.domElement.getBoundingClientRect();
        var mouse = {
            x: ((this.input.mouse.x - rect.left) / rect.width) * 2 - 1,
            y: -((this.input.mouse.y - rect.top) / rect.height) * 2 + 1,
        }
        this.raycaster.setFromCamera(mouse, this.camera.camera); 
        
        // Filter out TransformControls from the raycasting
        const objectsToIntersect = this.scene.children.filter(child => child.userData.assetName);

        let intersections = this.raycaster.intersectObjects(objectsToIntersect, true);

        if (intersections.length > 0) {
            let intersectedObject = intersections[0].object;
            let parentAsset = intersectedObject;
            console.log('intersectedObject: ', intersectedObject);
            // Find the parent asset
            while (parentAsset && !parentAsset.userData.assetName) {
                parentAsset = parentAsset.parent;
            }

            if (parentAsset) {
                console.log('parentAsset: ', parentAsset, ' is face: ', intersectedObject.userData.isFace);
                return {
                    object: parentAsset,
                    isFace: intersectedObject.userData.isFace || false,
                    intersectedObject: intersectedObject
                };
            }
        }
        
        return null;
    }

}

window.onload = () => {
    window.builder = new Builder();
}



