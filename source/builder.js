import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { createScene } from './scene.js';
import { createWorkbench } from './workbench.js';
import { createAssetInstance } from './assets.js';

export function createBuilder(){
    let activeToolID = '';
    let transformControls = null;

    const scene = createScene();
    const workbench = createWorkbench(6, 6);

    scene.initialize(workbench);

    // const controls = new OrbitControls(scene.camera, scene.renderer.domElement);

    // Create TransformControls
    transformControls = new TransformControls(scene.camera, scene.renderer.domElement);
    // give transform controls an id
    transformControls.id = 'transform-controls';
    


    document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
    document.addEventListener('mouseup', scene.onMouseUp.bind(scene), false);
    document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
    document.addEventListener('contextmenu', (event) => event.preventDefault(), false);

    const builder = {
        setActiveTool: (toolID) => {
            activeToolID = toolID;
            console.log(activeToolID);
            if (activeToolID === 'add-dowel') {
                builder.dowelTool();
            } else if (activeToolID === 'empty') {
                // Detach transform controls when switching to empty tool
                transformControls.detach();
                scene.removeObject(transformControls.getHelper());
            } else {
                // Detach transform controls when switching to other tools
                transformControls.detach();
            }
        },
        dowelTool: () => {
            const dowelLength = 1;
            const dowelThickness = .5;
            const dowel = createAssetInstance('dowel', 0, 0, 0, dowelLength, dowelThickness);
            scene.addObject(dowel);
            transformControls.size = 0.5;
            transformControls.showY = false;
            transformControls.attach(dowel);
            scene.addObject(transformControls.getHelper());
            
        },
    };

    scene.start();

    return builder;
}



