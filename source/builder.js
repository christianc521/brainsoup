import { createScene } from './scene.js';
import { createWorkbench } from './workbench.js';
import { createAssetInstance } from './assets.js';

export function createBuilder(){
    let activeToolID = '';

    const scene = createScene();
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

    document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
    document.addEventListener('mouseup', scene.onMouseUp.bind(scene), false);
    document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);

    const builder = {
        setActiveTool: (toolID) => {
            activeToolID = toolID;
            console.log(activeToolID);
        }
    }
    
    scene.start();

    return builder;
}



