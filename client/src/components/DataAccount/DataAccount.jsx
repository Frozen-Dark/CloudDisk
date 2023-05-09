import React from 'react';
import classes from "./DataAccount.module.css"
import chevron from "../../assets/svg/chevron.svg"
import User from "../../store/User";
import {normalizeSize} from "../../utils/consts";

const DataAccount = () => {
    const {id, email, diskSpace, usedSpace} = User.currentUser

    return (
        <div className={classes.dataAccount}>
            <div className={classes.header}>
                <h2 className={classes.header__text}>Данные аккаунта</h2>
                <p className={classes.header__underText}>Видны только вам</p>
            </div>

            <div className={classes.personal__item}>
                <div className={classes.item__data}>
                    <h3 className={classes.data__header}>Почта</h3>
                    <p className={classes.data__personal}>{email}</p>
                </div>
                <img className={classes.itemSvg} src={chevron} alt="Перейти к"/>
            </div>

            {/*<div className={classes.personal__item}>*/}
            {/*    <div className={classes.item__data}>*/}
            {/*        <h3 className={classes.data__header}>Пароль</h3>*/}
            {/*        <p className={classes.data__personal}>был изменён два дня назад</p>*/}
            {/*    </div>*/}
            {/*    <img className={classes.itemSvg} src={chevron} alt="Перейти к"/>*/}
            {/*</div>*/}

            <div className={classes.personal__item}>
                <div className={classes.item__data}>
                    <h3 className={classes.data__header}>Место</h3>
                    <p className={classes.data__personal}>Осталось {normalizeSize(diskSpace - usedSpace)} из {normalizeSize(diskSpace)}</p>
                </div>
                <img className={classes.itemSvg} src={chevron} alt="Перейти к"/>
            </div>
        </div>
    );
};

export default DataAccount;