import React, {useState} from 'react';
import {Navigate, NavLink, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import classes from "../styles/Auth.module.css"
import {observer} from "mobx-react";
import MessAuth from "../store/Auth";
import {login, registration} from "../actions/user";

const Auth = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [secondPassword, setSecondPassword] = useState("");
    const [correctPassword, setCorrectPassword] = useState(false);
    const [buttonActive, setButtonActive] = useState(false);

    const [userName, setUserName] = useState("");
    const [surName, setSurName] = useState("");
    const [nickName, setNickName] = useState("");

    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE; // True = login path

    const clear = () => {
        setPassword('');
        setEmail('');
        Auth.clear();
    }

    let inputClass = MessAuth.state ? classes.emailInput : classes.emailInput + " " + classes.active;
    let messageClass = MessAuth.state ? classes.pass : classes.fail;

    function checkPasswordHandler(inputValue) {
        setSecondPassword(inputValue);
        if(password === inputValue) {
            return setCorrectPassword(true);
        }
        setCorrectPassword(false);
    }

    const correctInputClass = () => {
        if(password.length === secondPassword.length && correctPassword === true) {
            return classes.correctInput + " " + classes.emailInput
        }
        return classes.emailInput
    }

    function registrationHandler(e) {
        e.preventDefault();
        if(password !== secondPassword) {
            return console.log();
        }
        registration(email, password);
    }
    function loginHandler(e) {
        e.preventDefault()
        login(email, password)
    }

    if(isLogin){
        return (
            <form className={classes.container}>
                <div className="form">
                    <h2>Вход</h2>

                    <input placeholder={"E-mail"}
                           type={"text"}
                           value={email}
                           minLength="4"
                           maxLength="30"
                           required
                           className={inputClass}
                           onChange={e => setEmail(e.target.value)}
                    />

                    <input placeholder={"Пароль"}
                           type={"password"}
                           value={password}
                           minLength="4"
                           maxLength="20"
                           required
                           className={inputClass}
                           onChange={event => setPassword(event.target.value)}
                    />

                    <span className={messageClass}>{MessAuth.message}</span>

                    <div className={classes.saveDiv}>
                        <input className={classes.checkbox} value={"Войти"} type={"checkbox"} />
                        Запомнить меня
                    </div>

                    <button className={classes.myInput} onClick={(e) => loginHandler(e)}>Войти</button>

                </div>
                <div className={classes.setUser}>
                    <span>Нет аккаунта? </span>
                    <NavLink onClick={() => clear()} to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                </div>

                {
                    MessAuth.auth && <Navigate to={"/disk"} />
                }
            </form>
        );
    } else {
        return (
            <form className={classes.container}>
                <div className="form">
                    <h2>Регистрация</h2>

                    <input className={inputClass}
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           required minLength="4" maxLength="30"
                           placeholder={"E-mail"} type={"text"}
                    />

                    <input className={correctInputClass()}
                           value={password} required
                           onChange={event => setPassword(event.target.value)}
                           placeholder={"Пароль"} type={"password"}
                           minLength="4" maxLength="20"
                    />

                    <input className={correctInputClass()}
                           value={secondPassword}
                           onChange={event => checkPasswordHandler(event.target.value)}
                           placeholder={"Повторите пароль"} type={"password"}
                           minLength="4" maxLength="20" required
                    />

                    <span className={messageClass}>{MessAuth.message}</span>
                    <button className={classes.myInput} onClick={(e) => registrationHandler(e)}>Зарегистрироваться</button>
                </div>

                <div className={classes.setUser}>
                    <span>Есть аккаунт? </span>
                    <NavLink onClick={() => clear()} to={LOGIN_ROUTE}>Войдите!</NavLink>
                </div>

                {
                    MessAuth.auth && <Navigate to={"/disk"} />
                }
            </form>
        );
    }
};

export default observer(Auth);