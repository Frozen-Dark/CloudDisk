import React from 'react';
import classes from "./InfoModal.module.css";
import ControlFile from "../../store/ControlFile";
import {CLIENT_URL, getDate, getImage, normalizeSize, SHARE_ROUTE, STATIC_PATH} from "../../utils/consts";
import FileController from "../../store/FileController";

const InfoModal = () => {
    const cancle = STATIC_PATH + "svg/cancel.svg";

    const file = FileController.currentFile;
    let icon = getImage(file.type);
    const createTime = getDate(file.createdAt);
    const updateTime = getDate(file.updatedAt);
    const close = () => {
        ControlFile.setActiveControl(false);
        ControlFile.setActiveInfo(false);
    }

    return (
        <div onClick={close} className={classes.blur__window}>
            <div onClick={(e) => e.stopPropagation()} className={classes.window}>
                <img onClick={(e) => close(e)} className={classes.chevron} src={cancle} alt=""/>

                <div className={classes.fileWindow}>
                    <img src={icon} alt="Выбранный файл"/>
                </div>

                <div className={classes.name}>
                    <h5 className={classes.file__title}>Имя файла</h5>
                    <h2 className={classes.file__name}>{file.name}</h2>
                </div>

                <div className={classes.type}>
                    <h5 className={classes.file__title}>Тип</h5>
                    <p className={classes.file__body}>{file.type}</p>
                </div>

                <div className={classes.size}>
                    <h5 className={classes.file__title}>Размер</h5>
                    <p className={classes.file__body}>{normalizeSize(file.size)}</p>
                </div>

                {file.access_link &&
                    <div className={classes.size}>
                        <h5 className={classes.file__title}>Ссылка</h5>
                        <p className={classes.file__body}>
                            <a className={classes.file_share}
                               href={`${CLIENT_URL}${SHARE_ROUTE}?link=${file.access_link}`}>
                                {file.access_link}
                            </a>
                        </p>
                    </div>
                }

                <div className={classes.create}>
                    <h5 className={classes.file__title}>Создано</h5>
                    <p className={classes.file__body}>{`${createTime.day} в ${createTime.time}`}</p>
                </div>

                <div className={classes.change}>
                    <h5 className={classes.file__title}>Изменено</h5>
                    <p className={classes.file__body}>{`${updateTime.day} в ${updateTime.time}`}</p>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;