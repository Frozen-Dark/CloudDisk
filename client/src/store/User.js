import {makeAutoObservable} from "mobx";
import Auth from "./Auth";
import {logout} from "../actions/user";
import FilesPath from "./FilesPath";

class User {
    constructor() {
        makeAutoObservable(this)
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

    logout = () => {
        Auth.setIsAuth(false)
        localStorage.removeItem("token");
        localStorage.setItem("lastDir", "-1");
        localStorage.setItem("fileList", "true");
        FilesPath.clearPath();
        logout()
    }

    setCurrentUser = (user) => {
        this.currentUser = {...user}
    }

}

export default new User();