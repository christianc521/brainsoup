import { createScene } from './scene.js';
import { createWorkbench } from './workbench.js';
import { createAssetInstance } from './assets.js';

export function createBuilder(){
    let activeToolID = '';
    let ghostDowel = null;

    const scene = createScene();
    const workbench = createWorkbench(6, 6);

    scene.initialize(workbench);

    function createGhostDowel(point) {
        const dowelLength = 1;
        const dowelThickness = 0.5;
        const ghostDowel = createAssetInstance('ghost-dowel', point.x, point.y, point.z, dowelLength, dowelThickness);
        ghostDowel.material.opacity = 0.5;
        ghostDowel.material.transparent = true;
        ghostDowel.userData.isGhost = true;
        return ghostDowel;
    }

    function updateGhostDowel(point) {
        if (point) {
            if (!ghostDowel) {
                ghostDowel = createGhostDowel(point);
                scene.addObject(ghostDowel);
            } else {
                ghostDowel.position.set(point.x, point.y + 0.5, point.z); // 0.5 is half of the dowel length
            }
        } else if (ghostDowel) {
            scene.removeObject(ghostDowel);
            ghostDowel = null;
        }
    }

    scene.objectClicked = (selectedObject, point) => {
        console.log("Clicked object:", selectedObject, "at point:", point);
        if (activeToolID === 'add-dowel' && selectedObject === 'workbench') {
            const dowel = createAssetInstance('dowel', point.x, point.y, point.z, 1, 0.5);
            scene.addObject(dowel);
        }
    }

    scene.objectHovered = (hoveredObject, point) => {
        if (activeToolID === 'add-dowel' && hoveredObject === 'workbench') {
            updateGhostDowel(point);
        } else if (hoveredObject !== 'ghost-dowel') {
            updateGhostDowel(null);
        }
    }

    document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
    document.addEventListener('mouseup', scene.onMouseUp.bind(scene), false);
    document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
    document.addEventListener('contextmenu', event => {
        event.preventDefault();
    });

    const builder = {
        setActiveTool: (toolID) => {
            activeToolID = toolID;
            console.log("Active tool set to:", activeToolID);
            if (activeToolID !== 'add-dowel') {
                updateGhostDowel(null);
            }
        }
    }

    scene.start();

    return builder;
}
