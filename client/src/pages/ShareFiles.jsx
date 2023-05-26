import React, {useEffect, useState} from 'react';
import classes from '../styles/ShareFiles.module.css'
import Header from "../components/Header/Header";
import FileController from "../store/FileController";
import FilesPath from "../store/FilesPath";
import Files from "../components/Files/Files";
import ControlFile from "../store/ControlFile";
import {useSearchParams} from "react-router-dom";
import {generalFiles} from "../actions/file";

const ShareFiles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [files, setFiles] = useState('')

    async function getFiles() {
        if(searchParams.get("link")) {
            const response = await generalFiles(searchParams.get("link"))
            console.log(response)
            if(response.status === 200) {
                setFiles(response.data.files)
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
        if(file.type !== "dir") {
            FileController.setCurrentFile(file)
        }
    }


    return (
        <div className={classes.shareFiles}>
            <Header/>

            <div className={classes.oneMain}>
                <section className={classes.list__files}>
                    <div className={classes.disk_path}>
                        {/*<ul className={classes.disk_path_list}>*/}
                        {/*    {*/}
                        {/*        FilesPath.path.map((elem) => <li className={classes.disk_path_component}*/}
                        {/*                                         onClick={() => FilesPath.moveTo(elem.id)}*/}
                        {/*                                         key={elem.id}>{elem.name}</li>)*/}
                        {/*    }*/}
                        {/*</ul>*/}
                    </div>
                    <div className={classes.list__header}>
                        <div className={classes.list__name}>Название</div>
                        <div className={classes.list__change}>Последнее изменение</div>
                        <div className={classes.list__type}>Тип</div>
                        <div className={classes.list__size}>Размер файла</div>
                    </div>
                    <Files files={files} selectAndActive={selectAndActive} openInfo={openInfo}/>
                </section>
            </div>
        </div>
    );
};

export default ShareFiles;