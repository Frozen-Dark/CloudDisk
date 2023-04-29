import {makeAutoObservable} from "mobx";
import {deleteFile, downloadFile, getFiles, renameFile} from "../actions/file";
import notification from "./Notification";
import FilesPath from "./FilesPath";

class FileController {
    constructor() {
        makeAutoObservable(this)
    }
    files = []; // Files
    currentDir = -1 //Id
    parentDir = -1 //Id
    currentFile = {id: 0}; // File type


    fileList = localStorage.getItem("fileList") || "false"

    setFiles(files) {
        this.files = files.sort((a, b) => a.id - b.id);
    }
    setCurrentFile(file) {
        console.log("Set file: ", file.name)
        this.currentFile = file
    }
    setCurrentDir(id) {
        this.currentDir = id
    }
    setParentDir(id) {
        this.parentDir = id
    }
    addFile(file) {
        this.setFiles([...this.files, file].sort((a, b) => a.id - b.id))
    }
    cutFile(id) {
        this.setFiles(this.files.filter(file => file.id !== id))
    }

    setFileList() {
        if(this.fileList === "false") {
            this.fileList = "true"
            localStorage.setItem("fileList", "true")
        } else {
            this.fileList = "false"
            localStorage.setItem("fileList", "false")
        }
    }

    sortFiles(value) {
        if(value !== "id") {
            this.files.sort((a, b) => a[value].localeCompare(b[value]))
        } else {
            this.files.sort((a, b) => a.id - b.id)
        }
    }

    removeFiles() {
        this.files.map(file => file.type !== "dir"? deleteFile(file) : '')
    }

    async renameFile(file, name) {
        const response = await renameFile(file, name)
        if(response.status === 200) {
            notification.clientMessage(response.data.message, "pass")
            const index = this.files.indexOf(file)
            this.files[index].name = name
            this.sortFiles("id")
        } else {
            notification.clientMessage(response.data.message, "fail")
        }
    }

    async openParenDir() {
        const current = this.currentDir
        await getFiles(this.parentDir);
        FilesPath.cutPath(current)
    }

    async openDir(folder) {
        await getFiles(folder.id)
    }

    async downloadFile(file) {
        const response = await downloadFile(file)

        if(response.status === 200) {
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = file.name + "." + file.type
            document.body.appendChild(link)
            link.click()
            link.remove()
        } else {
            notification.clientMessage("Ошибка при загрузке", "fail")
        }
    }

}

export default new FileController();