import React from 'react';
import classes from "./InfoModal.module.css"
import arrow from "../../assets/svg/arrow.svg";
import ControlFile from "../../store/ControlFile";
import {getDate, getImage, normalizeSize} from "../../utils/consts";
import FileController from "../../store/FileController";

const InfoModal = () => {

    const file = FileController.currentFile
    let icon = getImage(file.type)
    const createTime = getDate(file.createdAt)
    const updateTime = getDate(file.updatedAt)
    const close = (e) => {
        e.preventDefault()
        ControlFile.setActiveControl(false)
        ControlFile.setActiveInfo(false)
    }

    return (
        <div className={classes.window}>
            <img onClick={(e) => close(e)}
                 className={classes.chevron} src={arrow} alt=""/>

            <div className={classes.fileWindow}>
                <img src={icon}
                     alt="Выбранный файл"/>
            </div>

            <span className={classes.name}>
                Имя файла
                <h2>{file.name}</h2>

            </span>

            <span className={classes.type}>
                Тип
                <p>{file.type}</p>
            </span>


                <span className={classes.size}>
                    Размер
                    <p>{normalizeSize(file.size)}</p>
                </span>

            <span className={classes.create}>
                Создано
                <p>{`${createTime.day} в ${createTime.time}`}</p>
            </span>
            <span className={classes.change}>
                Изменено
                <p>{`${updateTime.day} в ${updateTime.time}`}</p>
            </span>

        </div>
    );
};

export default InfoModal;