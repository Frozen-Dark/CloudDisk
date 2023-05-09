import {makeAutoObservable} from 'mobx'

class Loader {
    loader = false;
    constructor() {
        makeAutoObservable(this)
    }
    setLoader(state) {
        this.loader = state
    }
}



export default new Loader();
