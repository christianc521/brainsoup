import * as THREE from 'three';

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

const CAMERA_AZIMUTH_SENSITIVITY = 0.2;
const CAMERA_ELEVATION_SENSITIVITY = 0.2;

export class Camera {

    constructor() {
        const aspectRatio = window.ui.builderWindow.clientWidth / window.ui.builderWindow.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, .1, 1000);
        this.camera.layers.enable(1);
        this.cameraOrigin = new THREE.Vector3(0, 0, 0);
        this.cameraRadius = (CAMERA_RADIUS_MIN + CAMERA_RADIUS_MAX) / 2;
        this.cameraElevation = (CAMERA_ELEVATION_MIN + CAMERA_ELEVATION_MAX) / 2;
        this.cameraAzimuth = 0;

        this.updateCameraPosition();

        window.ui.builderWindow.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.ui.builderWindow.addEventListener('mousedown', this.onMouseMove.bind(this), false);
        
    }

    updateCameraPosition() {
        this.camera.zoom = this.cameraRadius;
        this.camera.position.x = 10 * Math.sin(this.cameraAzimuth * DEG_TO_RAD) * Math.cos(this.cameraElevation * DEG_TO_RAD);
        this.camera.position.y = 10 * Math.sin(this.cameraElevation * DEG_TO_RAD);
        this.camera.position.z = 10 * Math.cos(this.cameraAzimuth * DEG_TO_RAD) * Math.cos(this.cameraElevation * DEG_TO_RAD);
        this.camera.position.add(this.cameraOrigin);
        this.camera.lookAt(this.cameraOrigin);
        this.camera.updateMatrix();
        this.camera.updateMatrixWorld();
    }

    onMouseMove(event) {
        if (event.buttons & 2) {
            this.cameraAzimuth += -(event.movementX * CAMERA_AZIMUTH_SENSITIVITY);
            this.cameraElevation += (event.movementY * CAMERA_ELEVATION_SENSITIVITY);
            this.cameraElevation = Math.max(CAMERA_ELEVATION_MIN, Math.min(CAMERA_ELEVATION_MAX, this.cameraElevation));
            this.updateCameraPosition();
        }
    }

    
    
    
}
