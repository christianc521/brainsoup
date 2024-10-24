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

    onToolSelected(event, programmatic = false) {
        let target = programmatic ? event.target : event.currentTarget;
        
        if (target) {
            if (this.selectedControl) {
                this.selectedControl.classList.remove('selected');
            }
            this.selectedControl = target;
            this.selectedControl.classList.add('selected');
            console.log("selected css class added to: ", this.selectedControl);
            this.activeToolID = this.selectedControl.getAttribute('data-tool-id');
            console.log(this.activeToolID);

            Object.keys(this.toolbars).forEach(id => {
                this.hideToolbar(id);
            });

            switch(this.activeToolID){
                case 'add-dowel':
                    this.showToolbar('ui-tool-dowel');
                    break;
                case 'select-transform':
                    this.showToolbar('ui-tool-dowel');
                    break;
                default:
                    this.showToolbar('ui-tool-select');
                    break;
            }

            if (window.builder) {
                window.builder.useTool(this.activeToolID);
            }
        } else {
            console.warn('Invalid target for tool selection');
        }
    }

    updateLeftPanel(object){
        if (object.userData.assetName) {
            document.getElementById('ui-left-panel-header-text').innerHTML = object.userData.assetName;
        }
    }

    resetToolbars() {
        // Hide all toolbars except select
        Object.keys(this.toolbars).forEach(id => {
            if (id !== 'ui-tool-select') {
                this.hideToolbar(id);
            }
        });
        this.showToolbar('ui-tool-select');

        // Find the select button and update the UI state
        const selectButton = document.getElementById('select');
        if (selectButton) {
            this.onToolSelected({ target: selectButton }, true);
        } else {
            console.warn('Select button not found');
        }
    }
}
    

window.ui = new UI();
