import React from 'react';
import classes from "./Menu.module.css";
import complete from "../../assets/svg/complete.svg";
import {observer} from "mobx-react";
import fail from '../../assets/svg/error.svg'
import {getImage} from "../../utils/consts";


const UploadFile = ({file}) => {

    const type = file.name.split('.').pop()
    let icon = getImage(type)

    return (
        <>
            <div className={classes.file}>
                <div className={classes.fileData}>
                    <img src={icon} alt="Иконка"/>
                    <span>{file.name}</span>
                </div>
                <div className={classes.uploadStatus}>
                    {
                        file.abort?
                            <>
                                <span>Ошибка</span>
                                <img src={fail} alt="Ошибка"/>
                            </>
                        :
                            <>
                                <span>{file.progress}%</span>
                                {file.progress === 100 && <img src={complete} alt=""/>}
                            </>
                    }
                </div>
            </div>
            <div className={classes.hr}></div>
        </>
    );
};

export default observer(UploadFile);