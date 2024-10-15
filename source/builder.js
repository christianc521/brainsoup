import * as THREE from 'three';
// import { createScene } from './scene.js';
import { createWorkbench } from './workbench.js';
import { createAssetInstance } from './assets.js';
import { InputManager } from './input.js';
import { CameraManager } from './camera.js';

export function createBuilder(){
    let activeToolID = '';
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const inputManager = new InputManager();
    const cameraManager = new CameraManager(window);

    const workbench = createWorkbench(6, 6);
    
    scene.initialize(workbench);
    scene.objectClicked = (selectedObject, point) => {
        console.log(selectedObject, point);
        if (activeToolID === 'add-dowel' && selectedObject === 'workbench') {
            const dowelLength = 1;
            const dowelThickness = .5;
            const dowel = createAssetInstance('dowel', point.x, point.y, point.z, dowelLength, dowelThickness);
            scene.addObject(dowel);
        }
    }

    const builder = {
        setActiveTool: (toolID) => {
            activeToolID = toolID;
            console.log(activeToolID);
            if (activeToolID === 'add-dowel') {
                console.log(checkMouseHovering());
            }
        },
        getActiveTool: () => {
            return activeToolID;
        }
    }

    // add raycast to check what object mouse is hovering over
    function checkMouseHovering(){
        const raycaster = new THREE.Raycaster();
        mouse.x = (scene.mouse.x / window.innerWidth) * 2 - 1;
        mouse.y = -(scene.mouse.y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, scene.camera.camera);
        const intersections = raycaster.intersectObjects(scene.objects, true);
        return intersections.length > 0;
    }

    scene.start();

    return builder;
}



