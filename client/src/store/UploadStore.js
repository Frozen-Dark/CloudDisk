import {makeAutoObservable} from 'mobx'
import FileController from "./FileController";
class UploadStore {
    constructor() {
        makeAutoObservable(this)
    }
    state = []
    objectNow = 0
    files = []
    height = 65
    active = false;
    pushState (file) {
        this.state.unshift({
            id: this.state.length,
            name: file.name,
            progress: 0,
            folder: FileController.currentDir,
            abort: false,
            key: `${FileController.currentDir}__${file.name}`
        })
        return this.state[0]
    }
    setProgress (file, progressEvent) {
        file.progress = Math.round((progressEvent.loaded / progressEvent.total * 100))
    }
    setAbort(file) {
        file.abort = true
    }
    setActive (state){
        this.active = state
    }
    clearFiles () {
        this.files = []
    }

    setObjectNow (num) {
        this.objectNow = num
    }

    setHeight(number) {
        this.height += number
    }
    index() {
        this.setActive(true)
        this.setHeight(81)
    }

    complete = () => {
        this.setObjectNow(this.objectNow - 1)
        this.setHeight(-30)
    }
}



// eslint-disable-next-line import/no-anonymous-default-export
export default new UploadStore();
