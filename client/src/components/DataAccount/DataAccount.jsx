import React, {useEffect, useState} from 'react';
import classes from "./DataAccount.module.css"
import chevron from "../../assets/svg/chevron.svg"
import User from "../../store/User";
import {normalizeSize} from "../../utils/consts";
import {changePassword, verifyPassword} from "../../actions/user";
import notification from "../../store/Notification";
import {useInput, useInspector, useValidation} from "../../hooks/hooks";

const DataAccount = () => {
    const {id, email, diskSpace, usedSpace} = User.currentUser;

    const [changeModal, setChangeModal] = useState(false);
    const [enterPassword, setEnterPassword] = useState(false);

    const oldPassword = useInput('', {minLength: 5, maxLength: 15, isEmpty: true})
    const newPassword = useInput('', {minLength: 5, maxLength: 15, isEmpty: true});

    const secondPassword = useInspector('');

    function closeChangeModal() {
        setChangeModal(false);
        setEnterPassword(false);
        oldPassword.refresh();
    }
    async function openEnterPassword() {
        const response = await verifyPassword(oldPassword.value)
        if(response.status === 200) {
            notification.clientMessage("Пароль подтвержден", "pass")
            setEnterPassword(true);
        } else {
            notification.clientMessage(response.data.message, "fail")
        }
        oldPassword.refresh();
    }
    async function closeChangePassword() {
        if(newPassword.value !== secondPassword.value && newPassword.value.length > 5) {
            return notification.clientMessage("Пароли не совпадают", "fail")
        }
        const response = await changePassword(newPassword.value);
        if(response.status === 200) {
            notification.clientMessage("Пароль изменен", "pass")
        } else {
            notification.clientMessage(response.data.message, "fail")
        }
        newPassword.refresh();
        secondPassword.refresh();
        setChangeModal(false);
        setEnterPassword(false);
    }

    function changePasswordHandler() {
        setChangeModal(true);
    }

    function borderHandler() {
        if(newPassword.value.length !== 0) {
            if(newPassword.inputValid) {
                return "#4bb34b";
            } else {
                return "#e64646";
            }
        }
    }

    useEffect(() => {
        secondPassword.eventCheck(newPassword.value)
    }, [newPassword])



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
                                    <input className={classes.changePassword__password}
                                           type="password"
                                           placeholder={"Введите пароль"}
                                           value={oldPassword.value}
                                           onChange={e => oldPassword.onChange(e)}
                                           onBlur={() => oldPassword.onBlur()}
                                    />
                                    {(oldPassword.isDirty && !oldPassword.inputValid) && <div className={classes.fail}>{oldPassword.errorMessage}</div>}

                                    <div>
                                        <p className={classes.forgotPassword}>Забыли пароль?</p>
                                    </div>
                                    <div className={classes.changePassword__btnMenu}>
                                        <div className={classes.changePassword__btn} style={{color: "#18A0FB"}} onClick={() => closeChangeModal()}>Отменть</div>
                                        <button disabled={!oldPassword.inputValid} className={classes.changePassword__btn} onClick={() => openEnterPassword()}>Продолжить</button>
                                    </div>
                                </div>
                            </div>
                            :

                            <div onClick={(e) => e.stopPropagation()} className={classes.changePassword__container}>
                                <div className={classes.changePassword__header}>
                                    <h2 className={classes.changePassword__title}>Введите пароль</h2>
                                </div>
                                <div className={classes.changePassword__main}>

                                    <p className={classes.changePassword__notification__second}>Пароль должен состояить минимум из 6 символов</p>

                                    <input className={classes.changePassword__password}
                                           value={newPassword.value}
                                           onChange={e => newPassword.onChange(e)}
                                           onBlur={() => newPassword.onBlur()}
                                           type="password"
                                           placeholder={"Придумайте пароль"}
                                           style={{borderWidth:"2px", borderStyle:"solid", borderColor: borderHandler()}}
                                    />


                                    <input className={classes.changePassword__password}
                                           value={secondPassword.value}
                                           onChange={e => secondPassword.onChange(e)}
                                           type="password"
                                           placeholder={"Повторите пароль"}
                                           style={{marginTop: "10px", borderWidth:"2px", borderStyle:"solid", borderColor: secondPassword.border}}

                                    />

                                    {(newPassword.isDirty && !newPassword.inputValid) && <div className={classes.fail}>{newPassword.errorMessage}</div>}

                                    <div className={classes.changePassword__save}>
                                        <button disabled={!secondPassword.inspectorValid || !newPassword.inputValid} className={classes.changePassword__btn} onClick={() => closeChangePassword()}>Сохранить</button>
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