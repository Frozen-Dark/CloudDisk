import {makeAutoObservable} from "mobx";

class ControlFile {
    constructor() {
        makeAutoObservable(this)
    }
    activeControl = false;
    activeInfo = false;
    controlHeight = 160;
    setControlHeight(value) {
        if(value >= 750) {
            return this.controlHeight = 750;
        }
        if(value < 15) {
            return this.controlHeight = 15;
        }
        this.controlHeight = value;
    }
    setActiveControl(state) {
        this.activeControl = state;
    }
    setActiveInfo(state) {
        this.activeInfo = state;
    }
    refresh() {
        this.activeControl = false;
        this.activeInfo = false;
        this.controlHeight = 160;
    }


}

export default new ControlFile()