
export class InputManager {
    mouse = {x: 0, y: 0};
    leftMouseButton = false;
    rightMouseButton = false;

    constructor(){
        window.addEventListener('mousemove', this.#onMouseMove.bind(this));
        window.addEventListener('mousedown', this.#onMouseDown.bind(this));
        window.addEventListener('mouseup', this.#onMouseUp.bind(this));
        window.addEventListener('contextmenu', event => {
            event.preventDefault();
        });
    }

    #onMouseMove(event){
        this.mouse.x = event.clientX;
        this.mouse.y = event.clientY;
    }

    #onMouseDown(event){
        if (event.button === 0) {
            this.isLeftMouseDown = true;
          }
          if (event.button === 1) {
            this.isMiddleMouseDown = true;
          }
          if (event.button === 2) {
            this.isRightMouseDown = true;
        }
    }

    #onMouseUp(event){
        if (event.button === 0) {
            this.isLeftMouseDown = false;
        }
        if (event.button === 1) {
        this.isMiddleMouseDown = false;
        }
        if (event.button === 2) {
        this.isRightMouseDown = false;
        }
    }
}
