import React, {useEffect} from 'react';
import classes from "./PathSelect.module.css"
import {useSearchParams} from "react-router-dom";
import FileController from "../../store/FileController";
import {STATIC_PATH} from "../../utils/consts";
import FilePath from "../../store/FilePath";

const PathSelect = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const cancel = STATIC_PATH + "svg/cancel.svg"

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
        <div className={classes.select}>
            <div className={classes.select__header}>
                <span className={classes.select__current}>Value 1</span>
                <div className={classes.select__icon}>
                    <img src={cancel} alt="X"/>
                </div>
            </div>

            <div className={classes.select__body}>
                <div className={classes.select__item}>Value 1</div>
                <div className={classes.select__item}>Value 2</div>
                <div className={classes.select__item}>Value 3</div>
                <div className={classes.select__item}>Value 4</div>
                <div className={classes.select__item}>Value 5</div>
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

export default PathSelect;