import React from 'react';
import classes from "./DevPanel.module.css";
import {uploadFile} from "../../actions/file";
import {NavLink} from "react-router-dom";
import Auth from "../../store/Auth";
import FileController from "../../store/FileController";
import * as User from "../../actions/user";

const DevPanel = () => {

    async function fileUploadHandler (event) {
        const files = [...event.target.files]
        const dirId = FileController.currentDir
        const stack = [files.pop()]
        while(stack.length > 0) {
            const file = stack.pop()
            await uploadFile(file, dirId)
            if(files.length > 0) {
                stack.push(files.pop())
            }
        }
    }

    const exit = () => {
        localStorage.removeItem('token')
        Auth.setIsAuth(false)
        User.logout()
    }

    return (
        <div className={classes.devPanel}>
            <button className={classes.buttonLink} onClick={() => FileController.openParenDir()}>Назад</button>
            {/*<button className={classes.buttonLink} onClick={() => UploadStore.setActive(true)}>Открыть</button>*/}
            <button className={classes.buttonLink} onClick={() => FileController.removeFiles()}>Удалить все</button>
            {/*<label htmlFor="uploadInput" className={classes.uploadLabel}>Загрузить файлы</label>*/}
            <input multiple={true} onChange={(e) => fileUploadHandler(e)} type="file" id="uploadInput" className={classes.uploadInput}/>
            <NavLink className={classes.navLink} onClick={exit} to={"/login"}>Exit</NavLink>
        </div>
    );
};

export default DevPanel;