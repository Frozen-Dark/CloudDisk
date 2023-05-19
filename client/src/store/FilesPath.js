import {makeAutoObservable} from "mobx";
import FileController from "./FileController";
import {getFiles} from "../actions/file";

class FilesPath {
    constructor() {
        makeAutoObservable(this)
    }

    currentDir = {};
    path = [{id: -1, parent: -1, name: "Мой диск"}]
    addPath(id, name) {
        const folder = {
            id,
            name
        }
        this.path.push(folder);
    }
    clearPath() {
        this.path = [{id: -1, parent: -1, name: "Мой диск"}]
    }
    cutPath(id) {
        const index = this.path.findIndex((obj) => obj.id === id);
        if(index !== -1 && id !== -1) {
            this.path.splice(index, 1);
        }
    }
    moveTo(id) {
        if(id === -1) {
            this.path = [{id: -1, parent: -1, name: "Мой диск"}];
            return getFiles(id)
        }
        const nowFolderId = FileController.currentDir;
        if(id === nowFolderId) {
            return;
        }
        const index = this.path.findIndex((obj) => obj.id === id);
        if(index !== -1) {
            this.path.splice(index  + 1, Infinity);
            return getFiles(id)
        }
    }
    setCurrentDir(dir) {
        this.addPath(dir.id, dir.name)
        this.currentDir = dir
    }
    getFirstPath(path) {
        console.log("PATH: ", path)
        this.path = [...this.path,  ...path]
    }

    refresh() {
        this.currentDir = {};
        this.path = [{id: -1, parent: -1, name: "Мой диск"}]
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new FilesPath()