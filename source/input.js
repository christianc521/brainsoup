export class Input {
    mouse = {x: 0, y: 0};
    leftMouseButtonDown = false;
    rightMouseButtonDown = false;
    constructor(){
        window.addEventListener('mousemove', this.#onMouseMove.bind(this), false);
        window.addEventListener('mousedown', this.#onMouseDown.bind(this), false);
        window.addEventListener('mouseup', this.#onMouseUp.bind(this), false);
        window.addEventListener('contextmenu', (event) => event.preventDefault(), false);
    }

    #onMouseMove(event){
        // this.leftMouseButtonDown = event.buttons & 1;
        // this.rightMouseButtonDown = event.buttons & 2;
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    #onMouseDown(event){
        if (event.button === 0) {
            this.leftMouseButtonDown = true;
        } else if (event.button === 2) {
            this.rightMouseButtonDown = true;
        }
    }

    #onMouseUp(event){
        if (event.button === 0) {
            this.leftMouseButtonDown = false;
        } else if (event.button === 2) {
            this.rightMouseButtonDown = false;
        }
    }
}