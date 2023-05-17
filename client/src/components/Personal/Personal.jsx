import classes from "./Personal.module.css"
import React, {useEffect, useState} from 'react';
import {filterName, STATIC_PATH} from "../../utils/consts";
import User from "../../store/User";
import {rename} from "../../actions/user";
import {observer} from "mobx-react";
import notification from "../../store/Notification";

const Personal = () => {
    const [avatar, setAvatar] = useState(STATIC_PATH + User.currentUser.avatar)
    const {id, email, diskSpace, usedSpace} = User.currentUser
    const [name, setName] = useState(User.currentUser.userName)
    const [surname, setSurname] = useState(User.currentUser.surName)
    const [nickname, setNickname] = useState(User.currentUser.nickName)

    useEffect(() => {
        setAvatar(STATIC_PATH + User.currentUser.avatar)
    }, [User.currentUser.avatar])

    async function renameHandler() {
        if(name.length > 2 && surname.length > 2 && nickname.length > 2) {
            const status = await rename(filterName(name), filterName(surname), filterName(nickname));
            if(status === 200) {
                notification.clientMessage("Изменения сохранены", "pass")
                setName('')
                voidInputHandler('', setName, User.currentUser.userName)
            } else {
                notification.clientMessage("Ошибка при переименовании", "fail")

            }
        } else {
            console.log("Длинна должна быть больше 2-х символов");
        }
    }
    function voidInputHandler(value, setValue, userValue) {
        if(value.length < 1) {
            setValue(userValue)
        } else {
            setValue(value)
        }
    }


    return (
        <section className={classes.personal}>
            <div className={classes.header}>
                <img className={classes.avatar} src={avatar} alt="Аватар"/>
                <div className={classes.header__info}>
                    <h2 className={classes.header__mainText}>{name + " " + surname}</h2>
                    <p className={classes.header__secondText}>ID: {id}</p>
                </div>

            </div>

            <div className={classes.main}>
                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Имя</h4>
                    <input className={classes.input__v2} placeholder={name} onChange={(e) => voidInputHandler(e.target.value, setName, User.currentUser.userName)} type="text"/>
                </div>

                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Фамилия</h4>
                    <input className={classes.input__v2} placeholder={surname} onChange={(e) => voidInputHandler(e.target.value, setSurname, User.currentUser.surName)} type="text"/>
                </div>

                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Никнейм</h4>
                    <input className={classes.input__v2} placeholder={nickname} onChange={(e) => voidInputHandler(e.target.value, setNickname, User.currentUser.nickName)} type="text"/>
                </div>

                {/*<div className={classes.birthday}>*/}
                {/*    <h4 className={classes.ui__input_text}>Дата рождения</h4>*/}
                {/*    <div className={classes.input__v3}>*/}
                {/*        */}
                {/*    </div>*/}
                {/*</div>*/}
                <div> </div>
                <button onClick={() => renameHandler()} className={classes.ui__button}>Сохранить</button>
            </div>
        </section>
    );
};

export default observer(Personal);