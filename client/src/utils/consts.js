import ControlFile from "../store/ControlFile";
import FileController from "../store/FileController";

export const LOGIN_ROUTE = '/login'
export const REGISTRATION_ROUTE = '/registration'
export const DISK_ROUTE = '/disk';
export const HOME_ROUTE = '/home';
export const SETTINGS_ROUTE = '/settings';
export const SHARE_ROUTE = '/share';
export const STATIC_PATH = 'http://192.168.0.12:5000/';
export const API_URL = 'http://192.168.0.12:5000';
export const CLIENT_URL = 'http://192.168.0.12:3000';

export const getImage = (type) => {
    let icon
    switch (type) {
        case "dir": icon = STATIC_PATH + "svg/folder.svg"
            break;
        case "txt": icon = STATIC_PATH + "svg/txt.svg"
            break;
        case "jpg": icon = STATIC_PATH + "svg/picture.svg"
            break;
        case "png": icon = STATIC_PATH + "svg/picture.svg"
            break;
        case "jpeg": icon = STATIC_PATH + "svg/picture.svg"
            break;
        case "mkv": icon = STATIC_PATH + "svg/video.svg"
            break;
        case "mp4": icon = STATIC_PATH + "svg/video.svg"
            break;
        case "xlsx": icon = STATIC_PATH + "svg/excel.svg"
            break;
        case "psd": icon = STATIC_PATH + "svg/photoshop.svg"
            break;
        default: icon = STATIC_PATH + "svg/file.svg"
    }
    return icon
}

export const normalizeSize = (size) =>{
    if (size > 1048576) {
        return `${(size/1048576).toFixed(2)} Гб`
    }
    if(size > 1024) {
        return `${(size/1024).toFixed(2)} Мб`
    }
    return `${size} Кб`
}
export function filterName(str) {
    return str.replace(/[^A-Za-zА-Яа-яЁё,0-9. _-]/g, "");
}
function MoscowTime(time) {
    if(time + 3 >= 24) {
        return `0${(time + 3) % 24}`
    } else {
        return time + 3
    }
}
export const getDate = (date) =>{
    const acc = date.split("T")
    let time = acc.pop().slice(0, 5).split(":")

    time[0] = MoscowTime(Number(time[0]))
    time = time.join(":")
    const day = acc.pop().split("-").reverse().join(".");
    return {time, day}
}

export const selectAndActive = (file, e) => {
    ControlFile.setActiveControl(true)
    FileController.setCurrentFile(file)
    ControlFile.setControlHeight(e.screenY - 125)
}

