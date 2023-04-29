import React from 'react';
import plus from "../../../assets/svg/plus.svg";
import classes from "./NewFolder.module.css"
import PopUp from "../../../store/PopUp";

const NewFolder = () => {
    return (
            <div onClick={() => PopUp.createFolder(true)} className={classes.addObject}>
                <img src={plus} alt=""/>
            </div>
    );
};

export default NewFolder;