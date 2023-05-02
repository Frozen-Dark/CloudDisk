import React, {useState} from 'react';
import classes from "../../styles/MobileDisk.module.css";
import chevron from "../../assets/svg/chevron.svg";
import listSort from "../../assets/svg/listSort.svg";
import {observer} from "mobx-react";
import FileController from "../../store/FileController";
const SortBar = () => {
    const changeState = () => {
        setHiddenSort(!hiddenSort)
    }
    const sort = (e) => {
        FileController.sortFiles(e.target.value)
        e.target.blur()
    }
    const [hiddenSort, setHiddenSort] = useState(false)

    return (
        <div className={classes.selectFormat}>
            <div className={classes.selectWrapper}>
                <select className={classes.active} onClick={() => changeState()} onChange={(e) => sort(e)}>
                    <option value="id">По дате</option>
                    <option value="name">По имени</option>
                    <option value="type">По типу</option>
                    <option value="size">По размеру</option>
                </select>
                <img className={classes.activeImg} src={chevron} alt="Фильтр"/>
            </div>
            <div>
                <img onClick={() => FileController.setFileList()} src={listSort} alt="Фильтр"/>
            </div>
        </div>
    );
};

export default observer(SortBar);