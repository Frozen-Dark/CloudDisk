import React from 'react';
import classes from './MobileContainer.module.css'
import FileFrame from "./FileFrame";
import {observer} from "mobx-react";
import FileController from "../store/FileController";
import FilePath from "../store/FilePath";
import Files from "./Files/Files";
import {useSearchParams} from "react-router-dom";
import {getFiles} from "../actions/file";
import PathList from "./PathList/PathList";


const MobileDisk = ({ dragEnterHandler, dragLeaveHandler}) => {
    const files = FileController.files
    const [searchParams, setSearchParams] = useSearchParams();

    function setQueryPath(file) {
        let path = file.path.replace(/\\/g, '_');
        setSearchParams({path: path});
    }
    const openDirHandler = async (file) => {
        if (file.type === "dir") {
            const response = await getFiles(file.id);
            if(response.status === 200) {
                setQueryPath(file)
                FilePath.pushDiskPath({id: file.id, path: file.name})
            }
        }
    }

    return (
        <div className={classes.oneMain}>

            {
            FileController.fileList === "false" ?
                <section className={classes.files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <div className={classes.nav__mobile}>
                        <PathList/>
                    </div>

                    <div className={classes.container}>
                        {files.map((file) => <FileFrame openDirHandler={openDirHandler} key={file.id} file={file} />)}
                    </div>
                </section>
            :
                <section className={classes.list__files} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <PathList/>
                    <div className={classes.list__header}>
                        <div className={classes.list__name}>Название</div>
                        <div className={classes.list__change}>Последнее изменение</div>
                        <div className={classes.list__type}>Тип</div>
                        <div className={classes.list__size}>Размер файла</div>
                    </div>
                    <Files openDirHandler={openDirHandler} files={files}/>
                </section>
            }
        </div>


    );
};

export default observer(MobileDisk);