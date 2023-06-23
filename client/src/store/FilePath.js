import {makeAutoObservable} from "mobx";
import {getFiles, getFolderPath} from "../actions/file";
import FileController from "./FileController";
import notification from "./Notification";

class FilePath {
    constructor() {
        makeAutoObservable(this)
    }

    diskPath = [{id: -1, path: "Мой диск"}];

    currentDir = {id: -1, path: "Мой диск"};

    pushDiskPath(obj) {
        if(obj.id && obj.path) {
            this.diskPath.push(obj);
            this.currentDir = obj;
        }
    }

    setDiskPath(array) {
        this.diskPath = [{id: -1, path: "Мой диск"}, ...array]
    }

    async getPath(id) {
        const {data, status} = await getFolderPath(id);
        if(status === 200) {
            this.setDiskPath(data);
        }
    }

    setCurrentDir(obj){
        if(obj.id && obj.path) {
            this.currentDir = obj;
        }
    }

    async openFolder(id) {
        console.log(id, this.currentDir)
        if(id === -1) {
            const {status} = await getFiles(-1)
            if(status === 200) {
                this.setCurrentDir({id: -1, path: "Мой диск"});
                this.diskPath = [{id: -1, path: "Мой диск"}];
            }
            return;
        }
        if(this.currentDir.id === id) {
            return;
        }
        const index = this.diskPath.findIndex((obj) => obj.id === id) + 1;
        const {status} = await getFiles(id);
        if(status === 200) {
            this.diskPath.splice(index, this.diskPath.length);
        }
    }


}

export default new FilePath();