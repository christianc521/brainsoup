import * as THREE from 'three';
import { createCamera } from './camera.js';

export function createScene() {
    
    const window = document.getElementById('render-target');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFA07A);

    const camera = createCamera(window);
    
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.offsetWidth, window.offsetHeight);
    window.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    let objectClicked = undefined;
    
    function initialize(workbench){
        scene.add(workbench);
    }


    function setupLighting(){   
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
        const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.3);

        directionalLight1.position.set(0, 10, 0);
        directionalLight2.position.set(10, 10, 0);
        directionalLight3.position.set(0, 10, 10);

        scene.add(ambientLight, directionalLight1, directionalLight2, directionalLight3);
    } 
    setupLighting();

    function draw(){
        renderer.render(scene, camera.camera);
    }

    function start(){
        renderer.setAnimationLoop(draw);
    }

    function stop(){
        renderer.setAnimationLoop(null);
    }

    function addObject(object){
        scene.add(object);
    }

    function removeObject(object) {
        scene.remove(object);
    }

    function onMouseDown(event){
        camera.onMouseDown(event);

        mouse.x = (event.clientX  / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera.camera);
        let intersections = raycaster.intersectObjects(scene.children, true)
        .filter(intersection => {
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

            // call the objectClicked function with the objectID and intersection point
            if (objectClicked) {
                objectClicked(objectID, intersection.point);
            }
            
            console.log(objectID, intersection.point);
        }
            
    }

    function onMouseUp(event){
        camera.onMouseUp(event);
    }

    function onMouseMove(event){
        camera.onMouseMove(event);
    }

    return { initialize, start, stop, onMouseDown, onMouseUp, onMouseMove, objectClicked, addObject, removeObject, camera: camera.camera, renderer, scene };
}