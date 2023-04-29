import {makeAutoObservable} from "mobx";

class FileInfo {
    constructor() {
        makeAutoObservable(this)
    }


}

export default new FileInfo();