import React from 'react';
import classes from "./DropFile.module.css"
import cancel from "../../assets/svg/cancel.svg"

const DropMenu = ({dropHandler, dragEnterHandler, dragLeaveHandler}) => {
    return (
        <div onDrop={dropHandler}
             onDragEnter={dragEnterHandler}
             onDragLeave={dragLeaveHandler}
             onDragOver={dragEnterHandler}
             className={classes.dropMenu}>
            <img onClick={dragLeaveHandler} src={cancel} alt="cancel" className={classes.cancel}/>
            Перетащите файл сюда
        </div>
    );
};

export default DropMenu;