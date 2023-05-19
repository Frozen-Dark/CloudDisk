import {makeAutoObservable} from "mobx";
class Search {
    constructor() {
        makeAutoObservable(this)
    }


    searchFile = []

    setSearchFile(files) {
        this.searchFile = files
    }

}

export default new Search()