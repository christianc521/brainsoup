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

// camera movement speed
const CAMERA_SPEED = 0.5;
const ELEVATION_SPEED = 0.2;
const ZOOM_SPEED = 0.02;
const PAN_SPEED = -0.01;    


export class CameraManager {

    constructor(){
        const aspectRatio = window.offsetWidth / window.offsetHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.cameraOrgin = new THREE.Vector3();
        this.cameraRadius = (CAMERA_RADIUS_MIN + CAMERA_RADIUS_MAX) / 2;
        this.cameraAzimuth = 0;
        this.cameraElevation = 45;

        this.updateCameraPosition();

        window.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    updateCameraPosition(){
        this.camera.zoom = this.cameraRadius;

        this.camera.position.x = this.cameraRadius * Math.sin((this.cameraAzimuth * DEG_TO_RAD) * Math.cos(this.cameraElevation * DEG_TO_RAD));
        this.camera.position.y = this.cameraRadius * Math.sin(this.cameraElevation * DEG_TO_RAD);
        this.camera.position.z = this.cameraRadius * Math.cos(this.cameraAzimuth * DEG_TO_RAD) * Math.cos(this.cameraElevation * DEG_TO_RAD);
        this.camera.position.add(this.cameraOrgin);
        this.camera.lookAt(this.cameraOrgin);
        this.camera.updateMatrixWorld();
        this.camera.updateProjectionMatrix();
    }

    onMouseMove(event){
        if (event.buttons && RIGHT_MOUSE_BUTTON){
            this.cameraAzimuth += -((event.movementX) * PAN_SPEED);
            this.cameraElevation += ((event.movementY) * PAN_SPEED);
            this.cameraElevation = Math.min(CAMERA_ELEVATION_MAX, Math.max(CAMERA_ELEVATION_MIN, this.cameraElevation));
            this.updateCameraPosition();
        }

        this.updateCameraPosition();
    }

    onMouseScroll(event) {
        this.cameraRadius *= 1 - (event.deltaY * ZOOM_SPEED);
        this.cameraRadius = Math.min(CAMERA_RADIUS_MAX, Math.max(CAMERA_RADIUS_MIN, this.cameraRadius));
    
        this.updateCameraPosition();
    }

}
