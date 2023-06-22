import React, {useEffect, useState} from 'react';
import classes from "./PathSelect.module.css"
import {useSearchParams} from "react-router-dom";
import FileController from "../../store/FileController";
import {STATIC_PATH} from "../../utils/consts";
import FilePath from "../../store/FilePath";
import Chose from "../../store/Chose";
import {observer} from "mobx-react";
import {useFilePath, useSelect} from "../../hooks/hooks";

const PathSelect = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectIsActive, setSelectIsActive] = useState(false);
    const dots = STATIC_PATH + "svg/dots.svg";
    const select = useSelect(FileController.parentDir.path);
    const filePath = useFilePath();

    function switchSelectClassHandler(state = true) {
        if(state === false) {
            return setSelectIsActive(false)
        }
        setSelectIsActive(!selectIsActive);
    }

    useEffect( () => {
        filePath.getPath(Number(searchParams.get('lastDir')) || -1)
    }, [])

    useEffect(() => {
        if(Chose.currentComponent.name !== "PathSelect") {
            switchSelectClassHandler(false);
        }
    }, [Chose.currentComponent.name]);

    function choseHandler(e) {
        e.stopPropagation();
        Chose.setCurrentComponent('PathSelect');
    }


    function setQuery() {
        const file = FileController.parentDir;
        select.setPath(FileController.parentDir.path)

        if(file && file.path) {
            let path = file.path.replace(/\\/g, '_');
            setSearchParams({path: path, lastDir: FileController.currentDir});
        } else {
            setSearchParams({});
        }
    }

    function moveToHandler(id) {
        filePath.moveTo(id)
        setSelectIsActive(false)
    }

    useEffect(() => {
        setQuery()
    }, [FileController.parentDir.path])

    return (
        <div onClick={(e) => choseHandler(e)} className={selectIsActive? classes.select + " " + classes.is_active : classes.select}>
            <div onClick={switchSelectClassHandler} className={classes.select__header}>
                <span className={classes.select__current}>
                    <img draggable={false} src={dots} alt="..."/>
                </span>
            </div>

            <div className={classes.select__body}>
                {
                    selectIsActive && filePath.diskPath.map((elem) =>
                        <div
                            className={classes.select__item}
                            onClick={() => moveToHandler(elem.id)}
                            key={elem.id}>
                            {elem.path}
                        </div>)
                }
            </div>
        </div>

        // <div className={classes.query}>
        //     <div className={classes.folders__list}>
        //         <ul className={classes.list}>
        //             <li className={classes.list__item} onClick={() => FilePath.moveTo(-1)}>Мой диск</li>
        //
        //             {
        //                 FilePath.diskPath.map((elem) => <li className={classes.list__item} onClick={() => FilePath.moveTo(elem.id)} key={elem.id}>{elem.path}</li>
        //                 )
        //             }
        //         </ul>
        //     </div>
        // </div>
    );
};

export default observer(PathSelect);