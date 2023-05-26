import React from 'react';
import classes from "./ModalFileSettings.module.css";
import PopUp from "../../store/PopUp";
import {deleteFile, removeAccessLink, setAccessLink} from "../../actions/file";
import {getImage, STATIC_PATH} from "../../utils/consts";
import {observer} from "mobx-react";
import ControlFile from "../../store/ControlFile";
import FileController from "../../store/FileController";

const ModalFileSettings = () => {
    const rename = STATIC_PATH + "svg/rename.svg"
    const info = STATIC_PATH + "svg/info.svg"
    const basket = STATIC_PATH + "svg/basket.svg"
    const link = STATIC_PATH + "svg/link.svg"
    const file = FileController.currentFile
    let icon = getImage(file.type)

    const closeSettings = () => {
        ControlFile.setActiveControl(false);
    }
    const deleteClickHandler = () => {
        deleteFile(file);
        closeSettings();
    }

    const renameFile = () => {
        PopUp.renameFolder();
        closeSettings();
    }

    function openInfoHandler() {
        ControlFile.setActiveInfo(true);
        ControlFile.setActiveControl(false);
    }

    async function shareClickHandler() {
        const fileId = FileController.currentFile.id;
        const response = await setAccessLink(fileId);
        console.log(response)
    }
    async function unshareClickHandler() {
        const fileId = FileController.currentFile.id;
        const response = await removeAccessLink(fileId);
        console.log(response)

    }

    function FileSettingsStyle() {
        if(ControlFile.activeControl) {
            return classes.modalBlur;
        }
        return classes.modalBlur + " " + classes.inactive;
    }

    return (
        <div className={FileSettingsStyle()} onClick={() => closeSettings()}>
            <div style={{top: `${ControlFile.controlHeight}px`}} className={classes.modalFileSettings}>
                <div className={classes.header}>
                    <div className={classes.example}>
                        <img className={classes.example__icon} src={icon}
                             alt="Выбранный файл"/>
                        {file.name}
                    </div>
                </div>

                <div className={classes.fileName}>
                    <div onClick={() => renameFile()} className={classes.example}>
                        <img className={classes.example__img} src={rename} alt="Перименовать"/>
                        Перименовать
                    </div>

                    <div onClick={() => openInfoHandler()} className={classes.example}>
                        <img className={classes.example__img} src={info} alt="Свойства"/>
                        Свойства
                    </div>

                    <div onClick={() => deleteClickHandler()} className={classes.example}>
                        <img className={classes.example__img} src={basket} alt="Удалить"/>
                        Удалить
                    </div>

                    <div onClick={() => shareClickHandler()} className={classes.example}>
                        <img className={classes.example__img} src={link} alt="Удалить"/>
                        Открыть доступ
                    </div>
                    <div onClick={() => unshareClickHandler()} className={classes.example}>
                        <img className={classes.example__img} src={link} alt="Удалить"/>
                        Убрать доступ
                    </div>
                </div>
            </div>
       </div>
    );
};

export default observer(ModalFileSettings);


// return (
//     <div
//         className={ControlFile.activeControl ? classes.modalBlur + " " + classes.active : classes.modalBlur + " " + classes.inactive}
//         onClick={() => ControlFile.setActiveControl(!ControlFile.activeControl)}
//     >
//         <div className={classes.modalFileSettings} onClick={e => e.stopPropagation()}>
//             <div className={classes.header}>
//                 <div className={classes.example}>
//                     <img src={icon}
//                          alt="Выбранный файл"/>
//                     {file.name}
//                 </div>
//             </div>
//
//             <div className={classes.fileName}>
//                 <div className={classes.example}><img src={access} alt=""/>
//                     Открыть доступ
//                 </div>
//                 <div className={classes.example}><img src={setUpAccess} alt=""/>
//                     Настроить доступ
//                 </div>
//                 <div className={classes.example}><img src={favorites} alt=""/>
//                     Добавить в помеченные
//                 </div>
//             </div>
//
//             <div className={classes.fileName}>
//                 <div onClick={downloadClickHandler} className={classes.example}><img src={link} alt=""/>
//                     Скачать
//                 </div>
//             </div>
//
//             <div className={classes.fileName}>
//                 <div onClick={setRenameFile} className={classes.example}><img src={rename} alt=""/>
//                     Перименовать
//                 </div>
//                 <div className={classes.example}> <img src={move} alt=""/>
//                     Переместить
//                 </div>
//                 <div onClick={() => openInfoHandler()} className={classes.example}><img src={info} alt=""/>
//                     Свойства
//                 </div>
//                 <div onClick={deleteClickHandler}  className={classes.example}><img src={basket} alt=""/>
//                     Удалить
//                 </div>
//             </div>
//         </div>
//     </div>
//
// );
