import {makeAutoObservable} from 'mobx'

class Loader {
    constructor() {
        makeAutoObservable(this)
    }
    loader = false
    setLoader(state) {
        this.loader = state
    }
}



export default new Loader();
