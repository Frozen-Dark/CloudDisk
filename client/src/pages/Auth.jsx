import React, {useState} from 'react';
import {Navigate, NavLink, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import classes from "../styles/Auth.module.css"
import {observer} from "mobx-react";
import MessAuth from "../store/Auth";
import {login, registration} from "../actions/user";

const Auth = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [secondPassword, setSecondPassword] = useState("")

    const [userName, setUserName] = useState("")
    const [surName, setSurName] = useState("")
    const [nickName, setNickName] = useState("")

    const location = useLocation()
    const isLogin = location.pathname === LOGIN_ROUTE; // True = login path
    const clear = () => {
        setPassword('')
        setEmail('')
        Auth.clear()
    }
    let inputClass = MessAuth.state ? classes.emailInput : classes.emailInput + " " + classes.active
    let messageClass = MessAuth.state ? classes.pass : classes.fail

    function checkPasswordHandler(inputValue) {
        setSecondPassword(inputValue)
        if(password === inputValue) {
            console.log("Okay")
        }
    }

    function loginButton(e) {
        e.preventDefault()

        isLogin ?
            login(email, password)
            :
            registration(email, password)
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

                    <button className={classes.myInput} onClick={(e) => loginButton(e)}>Войти</button>

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
                           placeholder={"E-mail"} type={"text"}
                           value={email} required
                           minLength="4" maxLength="30"
                           onChange={e => setEmail(e.target.value)}
                    />

                    <input className={inputClass}
                           placeholder={"Пароль"} type={"password"}
                           value={password} required
                           minLength="4" maxLength="20"
                           onChange={event => setPassword(event.target.value)}
                    />

                    <input placeholder={"Повторите пароль"}
                              type={"password"}
                              value={secondPassword}
                              minLength="4"
                              maxLength="20"
                              required
                              className={inputClass}
                              onChange={event => checkPasswordHandler(event.target.value)}
                    />

                    <span className={messageClass}>{MessAuth.message}</span>
                    <button className={classes.myInput} onClick={(e) => loginButton(e)}>Зарегистрироваться</button>
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