import React, {useEffect} from 'react';
import FileController from "../../store/FileController";
import {useSearchParams} from "react-router-dom";
import classes from "./PathList.module.css";
import FilePath from "../../store/FilePath";
import {observer} from "mobx-react";
import {STATIC_PATH} from "../../utils/consts";

const PathList = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const chevron = STATIC_PATH + "svg/chevron.svg";


    function setQuery() {
        const file = FileController.parentDir;
        if(file && file.path) {
            let path = file.path.replace(/\\/g, '_');
            setSearchParams({path: path, lastDir: FileController.currentDir});
        } else {
            setSearchParams({});
        }
    }

    useEffect(() => {
        setQuery()
    }, [FileController.parentDir.path])

    return (
        <div className={classes.pathList}>
            <ul className={classes.disk_path_list}>
                {
                    FilePath.diskPath.map((elem) => <li
                        className={classes.disk_path_component}
                        onClick={() => FilePath.moveTo(elem.id)} key={elem.id}>
                        {elem.path}</li>
                    )
                }
            </ul>
        </div>
    );
};

export default observer(PathList);