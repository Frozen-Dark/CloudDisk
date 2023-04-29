import React from 'react';
import classes from "./DropFile.module.css"

const DropMenu = ({dropHandler, dragEnterHandler, dragLeaveHandler}) => {
    return (
        <div onDrop={dropHandler}
             onDragEnter={dragEnterHandler}
             onDragLeave={dragLeaveHandler}
             onDragOver={dragEnterHandler}
             className={classes.dropMenu}>
            Перетащите файл сюда
        </div>
    );
};

export default DropMenu;