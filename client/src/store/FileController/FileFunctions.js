import {makeAutoObservable} from "mobx";

class FileFunctions {

    constructor() {
        makeAutoObservable(this)
    }

}

export default new FileFunctions();