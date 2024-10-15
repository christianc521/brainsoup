import * as THREE from 'three';

export function createCamera(window){

    const DEG_TO_RAD = Math.PI / 180;
    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    // mouse buttons
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;
    
    // camera movement bounds
    const CAMERA_RADIUS_MIN = 4;
    const CAMERA_RADIUS_MAX = 10;
    const CAMERA_ELEVATION_MIN = 30;
    const CAMERA_ELEVATION_MAX = 90;
    
    const camera = new THREE.PerspectiveCamera(75, window.offsetWidth / window.offsetHeight, 0.1, 1000);
    
    let cameraOrgin = new THREE.Vector3();
    let cameraRadius = (CAMERA_RADIUS_MIN + CAMERA_RADIUS_MAX) / 2;
    let cameraAzimuth = 0;
    let cameraElevation = 45;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let previousMouseX = 0;
    let previousMouseY = 0;

    // camera movement speed
    let cameraSpeed = 0.5;
    let elevationSpeed = 0.2;
    let zoomSpeed = 0.02;
    let panSpeed = -0.01;
    
    camera.lookAt(0, 0, 0);
    updateCameraPosition();

    function onMouseDown(event){
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true;
        } else if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = true;
        } else if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = true;
        }
    }

    function onMouseUp(event){
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        } else if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        } else if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = false;
        }
    }

    function onMouseMove(event){
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY; 
        if(isRightMouseDown){
            cameraAzimuth += -((deltaX) * cameraSpeed);
            cameraElevation += ((deltaY) * elevationSpeed);
            cameraElevation = Math.min(CAMERA_ELEVATION_MAX, Math.max(CAMERA_ELEVATION_MIN, cameraElevation));
            updateCameraPosition();
        }
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
        
    }

    function updateCameraPosition(){
        camera.position.x = cameraRadius * Math.sin((cameraAzimuth * DEG_TO_RAD) * Math.cos(cameraElevation * DEG_TO_RAD));
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG_TO_RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG_TO_RAD) * Math.cos(cameraElevation * DEG_TO_RAD);
        camera.position.add(cameraOrgin);
        camera.lookAt(cameraOrgin);
        camera.updateMatrixWorld();
        camera.updateProjectionMatrix();
    }


    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove,
    }
}
