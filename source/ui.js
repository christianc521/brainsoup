import { Builder } from './builder.js';

export class UI {
    activeToolID = '';
    activeToolbarID = 'ui-tool-select';
    selectedControl = null;
    toolbars = {};

    constructor(){
        this.selectedControl = document.getElementById('select');
        this.toolbars = {
            'ui-tool-select': document.getElementById('ui-tool-select'),
            'ui-tool-dowel': document.getElementById('ui-tool-dowel'),
        }
    }
    


    get builderWindow(){
        return document.getElementById('render-target');
    }

    showToolbar(toolbarID){
        if (this.toolbars[toolbarID]){
            this.toolbars[toolbarID].style.display = 'block';
        } else {
            console.warn(`Toolbar ${toolbarID} not found`);
        }
    }

    hideToolbar(toolbarID){
        if (this.toolbars[toolbarID]){
            this.toolbars[toolbarID].style.display = 'none';
        } else {
            console.warn(`Toolbar ${toolbarID} not found`);
        }
    }

    onToolSelected(event){
        if (this.selectedControl) {
            this.selectedControl.classList.remove('selected');
        }
        this.selectedControl = event.target;
        this.selectedControl.classList.add('selected');
        
        this.activeToolID = this.selectedControl.getAttribute('data-tool-id');

        Object.keys(this.toolbars).forEach(id => {
            this.hideToolbar(id);
        });

        switch(this.activeToolID){
            case 'add-dowel':
                this.showToolbar('ui-tool-dowel');
                break;
            default:
                this.showToolbar('ui-tool-select');
                break;
        }

        if (window.builder) {
            window.builder.useTool(this.activeToolID);
        }
    }
}
    

window.ui = new UI();
