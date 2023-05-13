import React, {useState} from 'react';
import classes from "./DataAccount.module.css"
import chevron from "../../assets/svg/chevron.svg"
import User from "../../store/User";
import {normalizeSize} from "../../utils/consts";
import {changePassword} from "../../actions/user";

const DataAccount = () => {
    const {id, email, diskSpace, usedSpace} = User.currentUser;

    const [changeModal, setChangeModal] = useState(false);
    const [enterPassword, setEnterPassword] = useState(false);

    const [newPassword, setNewPassword] = useState('');
    const [secondPassword, setSecondPassword] = useState('');

    function closeChangeModal() {
        setChangeModal(false);
        setEnterPassword(false);
    }
    function openEnterPassword() {
        setEnterPassword(true);
    }
    async function closeEnterPassword() {
        if(newPassword !== secondPassword && newPassword.length > 5) {
            return console.log("Пароли не совпадают");
        }
        await changePassword(newPassword);
        setChangeModal(false);
        setEnterPassword(false);
    }

    function changePasswordHandler() {
        setChangeModal(true);
    }
    return (
            <>
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

                <div onClick={() => changePasswordHandler()} className={classes.personal__item}>
                    <div className={classes.item__data}>
                        <h3 className={classes.data__header}>Пароль</h3>
                        <p className={classes.data__personal}>был изменён два дня назад</p>
                    </div>
                    <img className={classes.itemSvg} src={chevron} alt="Перейти к"/>
                </div>

                <div className={classes.personal__item}>
                    <div className={classes.item__data}>
                        <h3 className={classes.data__header}>Место</h3>
                        <p className={classes.data__personal}>Осталось {normalizeSize(diskSpace - usedSpace)} из {normalizeSize(diskSpace)}</p>
                    </div>
                    <img className={classes.itemSvg} src={chevron} alt="Перейти к"/>
                </div>

            </div>
            {changeModal &&
                <div className={classes.changePassword} onClick={(e) => closeChangeModal(e)}>
                    {
                        !enterPassword ?
                            <div onClick={(e) => e.stopPropagation()} className={classes.changePassword__container}>
                                <div className={classes.changePassword__header}>
                                    <h2 className={classes.changePassword__title}>Введите пароль</h2>
                                </div>
                                <div className={classes.changePassword__main}>
                                    <p className={classes.changePassword__notification}>Для продолжения необходимо подтверить, что вы являетесь владельцем аккаунта</p>
                                    <input className={classes.changePassword__password} type="password" placeholder={"Введите пароль"}/>
                                    <p style={{color: "#18A0FB", cursor: "pointer", marginBottom: "10px"}}>Забыли пароль?</p>
                                    <div className={classes.changePassword__btnMenu}>
                                        <div className={classes.changePassword__btn} style={{color: "#18A0FB"}} onClick={() => closeChangeModal()}>Отменть</div>
                                        <div className={classes.changePassword__btn} onClick={() => openEnterPassword()}>Продолжить</div>
                                    </div>
                                </div>
                            </div>
                            :

                            <div onClick={(e) => e.stopPropagation()} className={classes.changePassword__container}>
                                <div className={classes.changePassword__header}>
                                    <h2 className={classes.changePassword__title}>Введите пароль</h2>
                                </div>
                                <div className={classes.changePassword__main}>

                                    <input className={classes.changePassword__password}
                                           value={newPassword}
                                           onChange={event => setNewPassword(event.target.value)}
                                           type="password"
                                           placeholder={"Придумайте пароль"}/>

                                    <p className={classes.changePassword__notification__second}>Пароль должен состояить минимум из 6 символов</p>

                                    <input className={classes.changePassword__password}
                                           value={secondPassword}
                                           onChange={event => setSecondPassword(event.target.value)}
                                           type="password"
                                           placeholder={"Повторите пароль"}/>

                                    <div className={classes.changePassword__save}>
                                        <div className={classes.changePassword__btn} onClick={() => closeEnterPassword()}>Сохранить</div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            }
   </>
    );
};

export default DataAccount;