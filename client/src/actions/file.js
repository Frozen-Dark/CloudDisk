import axios from "axios";
import UploadStore from "../store/UploadStore";
import Loader from "../store/Loader";
import notification from "../store/Notification";
import FileController from "../store/FileController";
import FilesPath from "../store/FilesPath";
import User from "../store/User";
import {filterName} from "../utils/consts";

const url = "http://localhost:5000"


function checkName(name, type) {
    if(name.length === 0) {
        notification.clientMessage("Имя не указано", "Fail")
        return false
    }
    for(let file of FileController.files) {
        if(file.name === name && file.type === type) {
            notification.clientMessage("Файл с таким именем уже существует", "Fail")
            return false
        }
    }
}

export const uploadAvatar = async (e) => {
    try {
        const avatar = e.target.files
        const formData = new FormData()
        formData.append("file", avatar[0])
        const response = await axios.post(`${url}/api/files/uploadAvatar`, formData)
        if(response.status === 200) {
            User.setCurrentUser(response.data)
        }
        return response;
    } catch (e) {
        console.log(e)
    }
}

export const getFiles = async (dirId) => {
    const token = localStorage.getItem('token')
    Loader.setLoader(true)
    if(token) {
        try {
            const response = await
                axios.get(`${url}/api/files${dirId ? '?parent='+dirId : '?parent=-1'}`)
            const {files, parentDir} = response.data
            console.log("getFiles_FILES: ", files)
            FileController.setFiles(files)
            FileController.setCurrentDir(dirId)

            FileController.setParentDir(parentDir.parent)
            localStorage.setItem("lastDir", dirId)
        } catch (e) {
            console.log(e)
        } finally {
            Loader.setLoader(false)
        }
    }
}

export const createFolder = async (currentDir, dirName) => {
    const name = filterName(dirName)
    if(checkName(name, "dir") === false) {
        return console.log("Create fail")
    }
    console.log(currentDir, dirName)
        try {
            const response = await axios.post(`${url}/api/files`,
                {
                    name,
                    type: 'dir',
                    parent: currentDir,
                })
            FileController.addFile(response.data)
        } catch (e) {
        console.log(e)
    }
}

export const uploadFile = async (file, dirId) => {
    UploadStore.index()
    const fileId = UploadStore.pushState(file)
    try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("parent", dirId)
        console.log(file)

        const response = await axios.post(`${url}/api/files/upload?name=${file.name}`, formData, {
            onUploadProgress: progressEvent => {
                UploadStore.setProgress(fileId, progressEvent)
            }
        })
        if(response.status === 200) {
            FileController.addFile(response.data) // Добовляем файл от res
        }
    } catch (e) {
        console.log(e)
        UploadStore.setAbort(fileId)
        notification.clientMessage(e.response.data.message,"fail")
    } finally {
        UploadStore.complete()
    }
}

export async function downloadFile(file) {
    try {
        return await fetch(`${url}/api/files/download?id=${file.id}`, {
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
        })
    } catch (e) {
        console.log(e)
    }
}

export async function deleteFile (file) {
    try {
        const response = await axios.delete(`${url}/api/files/delete?id=${file.id}`)
        if(response.status === 200) {
            notification.clientMessage("Файл удален","pass")
            console.log(file)
            FileController.cutFile(file.id)
        }
    } catch (e) {
        console.log(e)
        notification.clientMessage("Ошибка","fail")
    }
}
export async function renameFile (file, name) {
    if(checkName(name, file.type) === false) {
        return console.error("rename fail")
    }
    try {
        return await axios.put(`${url}/api/files/rename?id=${file.id}&name=${name}`, "")
    } catch (e) {
        console.log(e)
    }
}

export async function searchFile (name) {
    Loader.setLoader(true)
    try {
        const files = await axios.get(`${url}/api/files/search?name=${name}`)
        FileController.setFiles(files.data)
    } catch (e) {
        console.log(e)
    } finally {
        Loader.setLoader(false)
    }
}
export async function getFolderPath (id) {
    if(id !== -1 && id !== undefined) {
        try {
            const response = await axios.get(`${url}/api/files/folderPath?currentDirId=${id}`)
            FilesPath.getFirstPath(response.data)
        } catch (e) {
            console.log(e)
        }
    }
}