import classes from "./Personal.module.css"
import React, {useState} from 'react';
import {STATIC_PATH} from "../../utils/consts";
import User from "../../store/User";

const Personal = () => {
    const [avatar, setAvatar] = useState(STATIC_PATH + User.currentUser.avatar)

    const [name, setName] = useState("Вася")
    const [surname, setSurname] = useState("Пупкин")
    const [nickname, setNickname] = useState("Nightmare")
    const [birthday_day, setBirthday_day] = useState(9)
    const [birthday_mouth, setBirthday_mouth] = useState("Мая")
    const [birthday_year, setBirthday_year] = useState(2001)

    return (
        <section className={classes.personal}>
            <div className={classes.header}>
                <img className={classes.avatar} src={avatar} alt="Аватар"/>
                <div className={classes.header__info}>
                    <h2 className={classes.header__mainText}>{name + " " + surname}</h2>
                    <p className={classes.header__secondText}>ID: 1</p>
                </div>
            </div>

            <div className={classes.main}>
                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Имя</h4>
                    <input className={classes.input__v2} placeholder={name} onChange={(e) => setName(e.target.value)} type="text"/>
                </div>
                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Фамилия</h4>
                    <input className={classes.input__v2} placeholder={surname} onChange={(e) => setSurname(e.target.value)} type="text"/>
                </div>
                <div className={classes.ui__input}>
                    <h4 className={classes.ui__input_text}>Никнейм</h4>
                    <input className={classes.input__v2} placeholder={nickname} onChange={(e) => setNickname(e.target.value)} type="text"/>
                </div>

                {/*<div className={classes.birthday}>*/}
                {/*    <h4 className={classes.ui__input_text}>Дата рождения</h4>*/}
                {/*    <div className={classes.input__v3}>*/}
                {/*        */}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </section>
    );
};

export default Personal;