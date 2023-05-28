import {makeAutoObservable} from "mobx";
import {getFiles} from "../actions/file";
import FileController from "./FileController";

class FilePath {
    constructor() {
        makeAutoObservable(this)
    }
    currentDir = {};
    parentDir = {path: ''}; // parent File
    queryPath = {path: ''};

    diskPath = [{id: -1, path: 'Мой диск'},];

    pushDiskPath(object) {
        if(!object.path || !object.id) {
            return;
        }
        this.diskPath.push(object);
    }

    setCurrentDir(dir) {
        this.currentDir = dir;
    }

    setParentDir(parent) {
        if(!parent.path) {
            return;
        }
        this.parentDir = parent;
    }

    setQueryPath(parent) {
        if(!parent.path) {
            return;
        }
        this.queryPath = parent.path;
    }

    setPath(folders) {
        folders.map((folder) => {
            this.pushDiskPath({id: folder.id, path: folder.name})
        })
    }

    moveTo(id) {
        if(id === -1 && this.diskPath.length > 1) {
            this.diskPath = [{id: -1, path: "Мой диск"}];
            return getFiles(id);
        }
        const nowFolderId = FileController.currentDir;
        console.log(id, nowFolderId)
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