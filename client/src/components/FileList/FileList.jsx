import React from 'react';
import classes from "./FileList.module.css";
import dots from "../../assets/svg/dots.svg";
import download from "../../assets/svg/download.svg";
import {getDate, getImage, normalizeSize, selectAndActive} from "../../utils/consts";


const FileList = ({file, openInfo, downloadFileHandler, openDirHandler}) => {

    let icon = getImage(file.type)

    const updateTime = getDate(file.updatedAt)

    if(file.type === "dir") {
        return (
            <div onClick={() => openInfo(file)} className={classes.file}>
                <div className={classes.file__img}>
                    <img className={classes.file__image} src={icon} draggable="false" onClick={() => openDirHandler(file)} alt="Иконка"/>
                </div>
                <div className={classes.file__name}>{file.name}</div>
                <div className={classes.file__date}>{updateTime.day} в {updateTime.time}</div>
                <div className={classes.file__type}>Папка</div>
                <div className={classes.file__size}>
                    <div>

                    </div>

                    <div className={classes.file__settings}  onClick={(e) => selectAndActive(file, e)} >
                        <img className={classes.sideDots} draggable="false" src={dots} alt="Свойства"/>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div onClick={() => openInfo(file)} className={classes.file}>
            <div className={classes.file__img}>
                <img className={classes.file__image} src={icon} draggable="false" alt="Иконка"/>
            </div>
            <div className={classes.file__name}>
                <p className={classes.file__name__text}>{file.name}</p>
            </div>
            <div className={classes.file__date}>{(updateTime.day)} в {updateTime.time}</div>
            <div className={classes.file__type}>{file.type}</div>
            <div className={classes.file__size}>
            <div>{normalizeSize(file.size)}</div>
            <div className={classes.file__functional}>
                <div>
                    <img className={classes.file__download} draggable="false" onClick={() => downloadFileHandler(file)} src={download} alt="Скачать"/>
                </div>
                <div className={classes.file__settings} onClick={(e) => selectAndActive(file, e)} >
                    <img className={classes.sideDots} draggable="false" src={dots} alt="Свойства"/>
                </div>
            </div>
            </div>
        </div>
    );
};

export default FileList;