import React from 'react';
import classes from "./Files.module.css"
import LoaderStore from "../../store/Loader";
import Loader from "../Loader/Loader";
import FileList from "../FileList/FileList";
import {observer} from "mobx-react";
import FileController from "../../store/FileController";
import FilesPath from "../../store/FilesPathOld";
import ControlFile from "../../store/ControlFile";

const Files = ({files, openDirHandler}) => {

    function downloadFileHandler(file) {
        FileController.downloadFile(file)
    }

    function openInfo(file) {
        if(file.type !== "dir") {
            FileController.setCurrentFile(file)
        }
    }


    return (
        <div className={classes.files}>
            {
                LoaderStore.loader === true ?
                    <Loader/>
                    :
                    files.length === 0?
                        <h2 className={classes.noneFile}>Файлы не найдены</h2>
                        :
                        <div className={classes.listContainer}>
                            {files.map((file) => <FileList key={file.id} openDirHandler={openDirHandler} downloadFileHandler={downloadFileHandler} openInfo={openInfo} file={file}/>)}
                        </div>
            }
        </div>
    );
};

export default observer(Files);