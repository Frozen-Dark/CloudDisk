import dirSvg from "../assets/svg/folder.svg";
import picture from "../assets/svg/picture.svg";
import video from "../assets/svg/video.svg";
import fileSvg from "../assets/svg/file.svg";
import excel from "../assets/svg/excel.svg";
import photoshop from "../assets/svg/photoshop.svg";
import text from "../assets/svg/txt.svg";

export const LOGIN_ROUTE = '/login'
export const REGISTRATION_ROUTE = '/registration'
export const DISK_ROUTE = '/disk'
export const SETTINGS_ROUTE = '/settings'
export const STATIC_PATH = 'http://localhost:5000/'

export const getImage = (type) => {
    let icon
    switch (type) {
        case "dir": icon = dirSvg
            break;
        case "jpg": icon = picture
            break;
        case "txt": icon = text
            break;
        case "png": icon = picture
            break;
        case "jpeg":  icon = picture
            break;
        case "mkv": icon = video
            break;
        case "mp4": icon = video
            break;
        case "xlsx": icon = excel
            break;
        case "psd": icon = photoshop
            break;
        default: icon = fileSvg
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
    const day = acc.pop().split("-").reverse().join(".")
    return {time, day}
}
