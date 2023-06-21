import {makeAutoObservable} from "mobx";
import {deleteFile, downloadFile, getFiles, renameFile} from "../actions/file";
import notification from "./Notification";
import FilesPath from "./FilesPathOld";

class FileController {
    constructor() {
        makeAutoObservable(this)
    }
    files = []; // Files
    currentDir = -1 // Id
    parentDir = {path: ''} // parent File
    currentFile = {id: 0}; // File type

    fileList = localStorage.getItem("fileList") || "true";

    sortValue = 'name';

    setSortValue(value, reverse = false) {
        this.sortValue = value;
        this.setFiles(this.files)
    }

    setFiles(files) {
        switch (this.sortValue) {
            case "date" :
                this.files = files.sort((a, b) => this.dateSort(a, b));
                break;
            case "type" :
                this.files = files.sort((a, b) => this.typeSort(a, b));
                break;
            case "size" :
                this.files = files.sort((a,b ) => this.sizeSort(a, b));
                break;
            case "name" :
                this.files = files.sort((a, b) => this.nameSort(a, b))
        }
    }

    dateSort(a, b) {
        if(a.type === "dir" && b.type === "dir") {
            return a["name"].localeCompare(b["name"])
        }
        if(a.type === "dir") {
            return -1;
        }
        if(b.type === "dir") {
            return 1;
        }
        return a.id - b.id;
    }
    typeSort(a, b) {
        if(a.type === "dir" && b.type === "dir") {
            return a["name"].localeCompare(b["name"])
        }
        if(a.type === "dir") {
            return -1;
        }
        if(b.type === "dir") {
            return 1;
        }
        if (a["type"][0].toLowerCase() < b["type"][0].toLowerCase()) {
            return -1;
        }
        if (a["type"][0].toLowerCase() > b["type"][0].toLowerCase()) {
            return 1;
        }
        return 0;
    }
    sizeSort(a, b) {
        if(a.type === "dir" && b.type === "dir") {
            return a["name"].localeCompare(b["name"])
        }
        if(a.type === "dir") {
            return -1;
        }
        if(b.type === "dir") {
            return 1;
        }
        return b["size"] - a["size"]
    }
    nameSort(a, b) {
        if(a.type === "dir" && b.type === "dir") {
            return a["name"].localeCompare(b["name"])
        }
        if(a.type === "dir") {
            return -1;
        }
        if(b.type === "dir") {
            return 1;
        }
        return a["name"].localeCompare(b["name"])
    }
    sortFiles(files) {
        let sortedFiles;
        sortedFiles = files;
        return sortedFiles;
    }
    setCurrentFile(file) {
        this.currentFile = file;
    }
    setCurrentDir(id) {
        this.currentDir = id;
    }
    setParentDir(parent) {
        this.parentDir = parent;
    }
    addFile(file) {
        this.setFiles([...this.files, file].sort((a, b) => a.id - b.id));
    }
    cutFile(id) {
        this.setFiles(this.files.filter(file => file.id !== id));
    }

    setFileList() {
        if(this.fileList === "false") {
            this.fileList = "true";
            localStorage.setItem("fileList", "true");
        } else {
            this.fileList = "false";
            localStorage.setItem("fileList", "false");
        }
    }

    // sortFiles(value) {
    //     if(value !== "id") {
    //         this.files.sort((a, b) => a[value].localeCompare(b[value]));
    //     } else {
    //         this.files.sort((a, b) => a.id - b.id);
    //     }
    // }

    removeFiles() {
        this.files.map(file => file.type !== "dir"? deleteFile(file) : '');
    }

    refresh() {
        this.files = [];
        this.currentDir = -1;
        this.parentDir = -1;
        this.currentFile = {id: 0};
    }

    async renameFile(file, name) {
        if(file.type === "dir") {
            return notification.clientMessage("Папку нельзя переименовать", "fail");
        }
        const response = await renameFile(file, name)
        if(response.status === 200) {
            notification.clientMessage(response.data.message, "pass");
            const index = this.files.indexOf(file);
            this.files[index].name = name;
            this.sortFiles("type");
        } else {
            notification.clientMessage(response.data.message, "fail");
        }
    }

    async downloadFile(file) {
        const response = await downloadFile(file);

        if(response.status === 200) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name + "." + file.type;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            notification.clientMessage("Ошибка при загрузке", "fail");
        }
    }

}

export default new FileController();