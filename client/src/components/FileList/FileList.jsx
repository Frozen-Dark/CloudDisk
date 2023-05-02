import React from 'react';
import classes from "./FileList.module.css";


import dots from "../../assets/svg/dots.svg";
import download from "../../assets/svg/download.svg";
import {getDate, getImage, normalizeSize} from "../../utils/consts";
import FileController from "../../store/FileController";
import FilesPath from "../../store/FilesPath";

const FileList = ({file, selectAndActive, openInfo}) => {

    let icon = getImage(file.type)

    const updateTime = getDate(file.updatedAt)

    function openDirHandler(file) {
        FileController.openDir(file)
        FilesPath.setCurrentDir(file)
    }

    function downloadFileHandler(file) {
        FileController.downloadFile(file)
    }
    if(file.type === "dir") {
        return (
            <div onClick={() => openInfo(file)} className={classes.file}>
                <img className={classes.file__img} src={icon} draggable="false" onClick={() => openDirHandler(file)} alt="Иконка"/>
                <div className={classes.file__name}>{file.name}</div>
                <div className={classes.file__date}>{updateTime.day} - {updateTime.time}</div>
                <div className={classes.file__type}>Папка</div>
                <div className={classes.file__size}>
                    <div> </div>
                    <div className={classes.sideWall} onClick={(e) => selectAndActive(file, e)} >
                        <img src={dots} alt="Свойства"/>
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div onClick={() => openInfo(file)} className={classes.file}>
            <img className={classes.file__img} src={icon} draggable="false" alt="Иконка"/>
            <div className={classes.file__name}>{file.name}</div>
            <div className={classes.file__date}>{updateTime.day} - {updateTime.time}</div>
            <div className={classes.file__type}>{file.type}</div>
            <div className={classes.file__size}>
            <div>{normalizeSize(file.size)}</div>
            <div className={classes.file__more__image}>
                <img className={classes.file__download} onClick={() => downloadFileHandler(file)} src={download} alt="Скачать"/>
                <div className={classes.sideWall} onClick={(e) => selectAndActive(file, e)} >
                    <img src={dots} alt="Свойства"/>
                </div>
            </div>
            </div>
        </div>
    );
};

export default FileList;