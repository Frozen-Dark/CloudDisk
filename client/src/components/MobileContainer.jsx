import React, {useEffect, useState} from 'react';
import classes from './MobileContainer.module.css'
import FileFrame from "./FileFrame";
import {observer} from "mobx-react";
import LoaderStore from "../store/Loader";
import FileList from "./FileList/FileList";
import ControlFile from "../store/ControlFile";
import FileController from "../store/FileController";
import FilesPath from "../store/FilesPath";
import FileInfo from "./FileInfo/FileInfo";
import Files from "./Files/Files";
import {useSearchParams} from "react-router-dom";


const MobileDisk = ({ dragEnterHandler, dragLeaveHandler}) => {

    const files = FileController.files


    function selectAndActive(file, e) {
        ControlFile.setActiveControl(true)
        FileController.setCurrentFile(file)
        ControlFile.setControlHeight(e.screenY - 125)
    }

    function openInfo(file) {
        if(file.type !== "dir") {
            FileController.setCurrentFile(file)
        }
    }

    return (
        <div className={classes.oneMain}>

            {
            FileController.fileList === "false" ?
                <section className={classes.files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <div className={classes.container}>
                        {files.map((file) => <FileFrame key={file.id} selectAndActive={selectAndActive} file={file} />)}
                    </div>
                </section>
            :
                <section className={classes.list__files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <div className={classes.disk_path}>
                        <ul className={classes.disk_path_list}>
                            {
                                FilesPath.path.map((elem) => <li className={classes.disk_path_component} onClick={() => FilesPath.moveTo(elem.id)} key={elem.id}>{elem.name}</li>)
                            }
                        </ul>
                    </div>
                    <div className={classes.list__header}>
                        <div className={classes.list__name}>Название</div>
                        <div className={classes.list__change}>Последнее изменение</div>
                        <div className={classes.list__type}>Тип</div>
                        <div className={classes.list__size}>Размер файла</div>
                    </div>
                    <Files files={files} selectAndActive={selectAndActive} openInfo={openInfo}/>
                </section>
            }
        </div>


    );
};

export default observer(MobileDisk);