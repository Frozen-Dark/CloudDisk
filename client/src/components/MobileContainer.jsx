import React from 'react';
import classes from './MobileContainer.module.css'
import FileFrame from "./FileFrame";
import {observer} from "mobx-react";
import FileController from "../store/FileController";
import FilePath from "../store/FilePath";
import Files from "./Files/Files";
import {useSearchParams} from "react-router-dom";
import {getFiles} from "../actions/file";
import PathList from "./Path/PathList";
import PathSelect from "./Path/PathSelect";
import Chose from "../store/Chose";


const MobileDisk = ({ dragEnterHandler, dragLeaveHandler}) => {
    const files = FileController.files
    const [searchParams, setSearchParams] = useSearchParams();

    function setQueryPath(file) {
        let path = file.path.replace(/\\/g, '_');
        setSearchParams({path: path});
    }
    function choseHandler() {
        console.log("MobileContainer")
        Chose.setCurrentComponent('MobileContainer')
    }
    async function openDirHandler(file) {
        if (file.type === "dir") {
            const response = await getFiles(file.id);
            if(response.status === 200) {
                setQueryPath(file)
                FilePath.pushDiskPath({id: file.id, path: file.name})
            }
        }
    }
    function sortValueHandler(value) {
        FileController.setSortValue(value);
    }

    return (
        <div onClick={choseHandler} className={classes.oneMain}>
        {
            FileController.fileList === "false" ?
                <section className={classes.files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>

                    <div className={classes.container}>
                        {files.map((file) => <FileFrame openDirHandler={openDirHandler} key={file.id} file={file} />)}
                    </div>
                </section>
            :
                <section className={classes.list__files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <div className={classes.container__header}>
                        <PathList/>
                        <PathSelect/>
                        <div className={classes.list__header}>
                            <div onClick={() => sortValueHandler("name")} className={classes.list__name}>Название</div>
                            <div onClick={() => sortValueHandler("date")} className={classes.list__change}>Последнее изменение</div>
                            <div onClick={() => sortValueHandler("type")} className={classes.list__type}>Тип</div>
                            <div onClick={() => sortValueHandler("size")} className={classes.list__size}>Размер файла</div>
                        </div>
                    </div>
                    <div className={classes.file__container}>
                        <Files openDirHandler={openDirHandler} files={files}/>
                    </div>
                </section>
        }
        </div>
    );
};

export default observer(MobileDisk);