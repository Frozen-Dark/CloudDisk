import React from 'react';
import dots from '../assets/svg/dots.svg'
import classes from "./FolderFrame.module.css";
import {observer} from "mobx-react";
import {getImage, selectAndActive} from "../utils/consts";
import FileController from "../store/FileController";
import FilesPath from "../store/FilesPathOld";

const FileFrame = ({file, openDirHandler}) => {
    let icon = getImage(file.type)



    return (
        <div onClick={() => FileController.setCurrentFile(file)} className={classes.container}>
            <div className={classes.imageBox}>
                <img className={classes.icon} onClick={() => openDirHandler(file)} src={icon} draggable="false" alt="icon"/>
            </div>

            <div className={classes.file_footer}>
                <div className={classes.text}>
                    {file.name}
                </div>
                <div onClick={() => selectAndActive(file)} className={classes.sideWall}>
                    <img src={dots} alt="Свойства"/>
                </div>
            </div>
        </div>
    );
};

export default observer(FileFrame);