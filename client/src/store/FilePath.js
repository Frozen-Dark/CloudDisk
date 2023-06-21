import {makeAutoObservable} from "mobx";
import {getFiles} from "../actions/file";
import FileController from "./FileController";

class FilePath {
    constructor() {
        makeAutoObservable(this)
    }
    currentDir = {};

    diskPath = [];

    pushDiskPath(object) {
        if(!object.path || !object.id) {
            return;
        }
        this.diskPath.push(object);
    }

    setCurrentDir(dir) {
        this.currentDir = dir;
    }

    setPath(folders) {
        folders.map((folder) => {
            this.pushDiskPath({id: folder.id, path: folder.name})
        })
    }

    moveTo(id) {
        if(id === -1) {
            this.diskPath = [];
            return getFiles(id);
        }
        const nowFolderId = FileController.currentDir;
        if(id === nowFolderId) {
            return;
        }
        const index = this.diskPath.findIndex((obj) => obj.id === id);
        if(index !== -1) {
            this.diskPath.splice(index  + 1, Infinity);
            return getFiles(id);
        }
    }
}

export default new FilePath();