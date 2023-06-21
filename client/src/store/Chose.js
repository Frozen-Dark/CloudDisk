import {makeAutoObservable} from "mobx";

class Chose {
    constructor() {
        makeAutoObservable(this)
    }
    currentComponent = {
        name: '',
        data: {},
    }

    setCurrentComponent(name = '', data = {}) {
        this.currentComponent = {
            name: name,
            data: data
        }
    }
}

export default new Chose();