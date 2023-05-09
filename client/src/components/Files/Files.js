import React from 'react';
import classes from "./Files.module.css"
import LoaderStore from "../../store/Loader";
import Loader from "../Loader/Loader";
import FileList from "../FileList/FileList";
import {observer} from "mobx-react";

const Files = ({files, openInfo, selectAndActive}) => {
    return (
        <div className={classes.files}>
            {
                console.log("Loader_STATUS: ", LoaderStore.loader)
            }
            {
                LoaderStore.loader === true ?
                    <Loader/>
                    :
                    files.length === 0?
                        <h2 className={classes.noneFile}>Файлы не найдены</h2>
                        :
                        <div className={classes.listContainer}>
                            {files.map((file) => <FileList key={file.id} selectAndActive={selectAndActive} openInfo={openInfo} file={file}/>)}
                        </div>
            }
        </div>
    );
};

export default observer(Files);