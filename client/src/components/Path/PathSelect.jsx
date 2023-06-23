import React, {useEffect, useState} from 'react';
import classes from "./PathSelect.module.css"
import {useSearchParams} from "react-router-dom";
import FileController from "../../store/FileController";
import {STATIC_PATH} from "../../utils/consts";
import FilePath from "../../store/FilePath";
import Chose from "../../store/Chose";
import {observer} from "mobx-react";
import {useSelect} from "../../hooks/hooks";

const PathSelect = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectIsActive, setSelectIsActive] = useState(false);

    const dots = STATIC_PATH + "svg/dots.svg";

    const select = useSelect(FileController.parentDir.path);

    function switchSelectClassHandler(state = true) {
        if(state === false) {
            return setSelectIsActive(false)
        }
        setSelectIsActive(!selectIsActive);
    }
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
        FilePath.openFolder(id)
        setSelectIsActive(false)
    }

    useEffect(() => {
        if(Chose.currentComponent.name !== "PathSelect") {
            switchSelectClassHandler(false);
        }
    }, [Chose.currentComponent.name]);

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
                    selectIsActive && FilePath.diskPath.map((elem) =>
                        <div
                            className={classes.select__item}
                            onClick={() => moveToHandler(elem.id)}
                            key={elem.id}>
                            {elem.path}
                        </div>)
                }
            </div>
        </div>
    );
};

export default observer(PathSelect);