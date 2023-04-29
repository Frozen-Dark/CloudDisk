import React from 'react';
import classes from "./FileInfo.module.css"
import {observer} from "mobx-react";
import FileController from "../../store/FileController";
import {getDate, getImage, normalizeSize} from "../../utils/consts";
import fileIcon from "../../assets/svg/file.svg"
const FileInfo = ({infoState}) => {

    const data = {
        icon: fileIcon,
        createTime: {day: "", time: ""},
        name: 'null',
        type: 'file',
        size: '0',
    }

    let icon, createTime;
    if(FileController.currentFile) {
        icon = getImage(FileController.currentFile.type)
        createTime = getDate(FileController.currentFile.createdAt)
    }

    return (
        FileController.currentFile &&
        <div style={{display: "block"}} className={classes.info}>
            <img src={icon} alt="Выбранный файл"/>
            <h2>{FileController.currentFile.name}</h2>
            <p>{FileController.currentFile.type}</p>
            <p>{normalizeSize(FileController.currentFile.size)}</p>
            <p>{`${createTime.day} в ${createTime.time}`}</p>
        </div>

    );



};

export default observer(FileInfo);