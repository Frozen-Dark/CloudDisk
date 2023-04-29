import {makeAutoObservable} from 'mobx'
import {createFolder} from "../actions/file";
import FileController from "./FileController";
class PopUp {
    constructor() {
        makeAutoObservable(this)
    }

    data = {
        title: "",
        state: false,
        actionName: "",
    }

    popupFunction(name) {
        switch (this.data.title) {
            case "Переименовать": FileController.renameFile(FileController.currentFile, name);
                break;
            case "Создать": createFolder(FileController.currentDir, name);
                break;
            default: console.error("setPopup Error!")
        }
    }

    setPopupData(title, state, actionName) {
        this.data = {title: title, state: state, actionName: actionName}
    }
    createFolder() {
        this.setPopupData("Создать",true ,"Создать")
    }

    renameFolder() {
        this.setPopupData("Переименовать",true ,"Переименовать")
    }


}
// eslint-disable-next-line import/no-anonymous-default-export
export default new PopUp();

