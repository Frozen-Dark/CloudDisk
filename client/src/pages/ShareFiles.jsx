import React, {useEffect, useState} from 'react';
import classes from '../styles/ShareFiles.module.css'
import Header from "../components/Header/Header";
import FileController from "../store/FileController";
import ControlFile from "../store/ControlFile";
import {useSearchParams} from "react-router-dom";
import {downloadGeneralFile, generalFiles} from "../actions/file";
import LoaderStore from "../store/Loader";
import Loader from "../components/Loader/Loader";
import FileList from "../components/FileList/FileList";
import notification from "../store/Notification";

const ShareFiles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [files, setFiles] = useState('')
    const [owner, setOwner] = useState('')
    const [parent, setParent] = useState('')

    async function getFiles() {
        if (searchParams.get("link")) {
            const response = await generalFiles(searchParams.get("link"))
            if (response.status === 200) {
                setFiles(response.data.files)
                setOwner(response.data.owner)
                setParent(response.data.parent.name)
            }
        }
    }

    useEffect(() => {
        getFiles()
    }, [searchParams.get('link')])

    function selectAndActive(file, e) {
        ControlFile.setActiveControl(true)
        FileController.setCurrentFile(file)
        ControlFile.setControlHeight(e.screenY - 125)
    }

    function openInfo(file) {
        if (file.type !== "dir") {
            FileController.setCurrentFile(file)
        }
    }

    async function downloadFileHandler(file) {
        const response = await downloadGeneralFile(file)
        if(response.status === 200) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = file.name + "." + file.type;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            notification.clientMessage("Ошибка при загрузке", "fail");
        }

    }

    function openDirHandler() {
        console.log("QWEqwEQW")
    }

    return (
        <div className={classes.shareFiles}>
            <Header/>

            <div className={classes.oneMain}>
                <section className={classes.list__files}>
                    <div className={classes.disk_path}>
                        <h2 className={classes.disk_path_name}>{parent}</h2>
                        <h2 style={{fontSize: "20px"}} className={classes.disk_path_name}>Владелец: {owner}</h2>
                    </div>
                    <div className={classes.list__header}>
                        <div className={classes.list__name}>Название</div>
                        <div className={classes.list__change}>Последнее изменение</div>
                        <div className={classes.list__type}>Тип</div>
                        <div className={classes.list__size}>Размер файла</div>
                    </div>

                    <div className={classes.filesContainer}>
                        <div className={classes.files}>
                            {
                                LoaderStore.loader === true ?
                                    <Loader/>
                                    :
                                    files.length === 0 ?
                                        <h2 className={classes.noneFile}>Файлы не найдены</h2>
                                        :
                                        <div className={classes.listContainer}>
                                            {files.map((file) => <FileList key={file.id} openDirHandler={openDirHandler}
                                                                           downloadFileHandler={downloadFileHandler}
                                                                           openInfo={openInfo} file={file}/>)}
                                        </div>
                            }
                        </div>
                    </div>


                </section>
            </div>
        </div>
    );
};

export default ShareFiles;