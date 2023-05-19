import {makeAutoObservable} from "mobx";
import {logout, refresh} from "../actions/user";
import FilesPath from "./FilesPath";
import FileController from "./FileController";
import UploadStore from "./UploadStore";
import ControlFile from "./ControlFile";
import Notification from "./Notification";

class User {
    constructor() {
        makeAutoObservable(this)
    }
    auth = false;

    setAuth(state){
        this.auth = state
    }

    currentUser = {
        id: 0,
        avatar: "defaultAvatar.svg",
        email: "test@test.test",
        diskSpace: 0,
        usedSpace: 0,
        userName: "User",
        surName: "1",
        nickName: "",
    };

    refresh() {
        this.auth = false;
        this.currentUser = {
            id: 0,
            avatar: "defaultAvatar.svg",
            email: "test@test.test",
            diskSpace: 0,
            usedSpace: 0,
            userName: "User",
            surName: "1",
            nickName: "",
        };
    }

     logout = async () => {
        localStorage.removeItem("token");
        localStorage.setItem("lastDir", "-1");
        localStorage.setItem("fileList", "true");

        FilesPath.clearPath();
        FileController.refresh();
        UploadStore.refresh();
        ControlFile.refresh();
        FilesPath.refresh();
        this.refresh()

        const response = await logout();
        if(response.status === 200) {
            Notification.clientMessage("Вы вышли из учетной записи", "pass");
        } else {
            Notification.clientMessage("Ошибка при выходе", "fail");
        }
    }

    setCurrentUser = (user) => {
        this.currentUser = {...user}
    }

}

export default new User();