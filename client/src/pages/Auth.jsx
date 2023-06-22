import React, {useEffect} from 'react';
import {Navigate, NavLink, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import classes from "../styles/Auth.module.css"
import {login, registration} from "../actions/user";
import {useInput, useMessage} from "../hooks/hooks";
import User from "../store/User";
import notification from "../store/Notification";
import {getFiles} from "../actions/file";
import {observer} from "mobx-react";
import Notification from "../components/Notification/Notification";


const Auth = () => {
    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const email = useInput('', {minLength: 3, isEmail: true, isEmpty: true}, isLogin);
    const password = useInput('', {minLength: 5, maxLength: 15, isEmpty: true});
    const message = useMessage('');
    const refresh = () => {
        email.refresh();
        password.refresh();
        message.clearMessages();
    }
    async function loginHandler(e) {
        e.preventDefault();
        const response = await login(email.value, password.value);
        if(response.status === 200) {
            User.setAuth(true);
            localStorage.setItem('token', response.data.token)
            User.setCurrentUser(response.data.user)
            notification.clientMessage("Успешный вход","pass")

            const dir_id = Number(localStorage.getItem("lastDir")) || -1
            await getFiles(dir_id)
        } else {
            message.newMessage(response.data.message, "fail")
        }
    }
    async function registrationHandler(e) {
        e.preventDefault();
        const response = await registration(email.value, password.value);
        if(response.status === 200) {
            message.newMessage(`Пользователь ${response.data.user.email} зарегестрирован`, "pass")
        } else {
            message.newMessage(response.data.message, "fail")
        }
    }
    function borderHandler() {
        if(email.inputValid) {
            if(email.emailStatus) {
                return "0 0 0 0.25rem rgba(45, 200, 45, .7)";
            } else {
                return "0 0 0 0.25rem rgba(230, 70, 70, .7)";
            }
        }
    }



    return (
        <form className={classes.container}>
            {isLogin ?
                <div>
                    <h2 className={classes.form__title}>Вход</h2>

                    <input className={classes.authInput}
                           value={email.value}
                           onChange={e => email.onChange(e)}
                           onBlur={e => email.onBlur(e)}
                           onFocus={() => message.clearMessages()}
                           placeholder={"E-mail"} type={"text"}
                    />
                    {(email.isDirty && !email.inputValid) && <div className={classes.fail}>{email.errorMessage}</div>}

                    <input className={classes.authInput}
                           value={password.value}
                           onChange={e => password.onChange(e)}
                           onBlur={e => password.onBlur(e)}
                           onFocus={() => message.clearMessages()}
                           placeholder={"Пароль"} type={"password"}
                    />

                    {(password.isDirty && !password.inputValid) ?
                        <div className={classes.fail}>{password.errorMessage}</div>
                        :
                        message.state && <div className={message.status? classes.pass : classes.fail}>{message.message}</div>
                    }

                    <div className={classes.saveDiv}>
                        <input className={classes.checkbox} value={"Войти"} type={"checkbox"}/>
                        Запомнить меня
                    </div>
                    <button className={classes.myButton} onClick={(e) => loginHandler(e)}
                            disabled={!email.inputValid || !password.inputValid}>Войти
                    </button>
                </div>
                :
                <div className="form">
                    <h2 className={classes.form__title}>Регистрация</h2>
                    <input className={classes.authInput}
                           value={email.value}
                           onChange={e => email.onChange(e)}
                           onBlur={e => email.onBlur(e)}
                           onFocus={() => message.clearMessages()}
                           placeholder={"E-mail"} type={"text"}
                           style={{boxShadow: borderHandler()}}
                    />
                    {(email.isDirty && !email.inputValid) && <div className={classes.fail}>{email.errorMessage}</div>}

                    <input className={classes.authInput}
                           value={password.value} required
                           onChange={e => password.onChange(e)}
                           onBlur={e => password.onBlur(e)}
                           onFocus={() => message.clearMessages()}
                           placeholder={"Пароль"} type={"password"}
                    />

                    {(password.isDirty && !password.inputValid) ?
                        <div className={classes.fail}>{password.errorMessage}</div>
                    :
                        message.state && <div className={message.status? classes.pass : classes.fail}>{message.message}</div>
                    }


                    <button className={classes.myButton} onClick={(e) => registrationHandler(e) }
                            disabled={!email.inputValid || !password.inputValid}>Зарегистрироваться
                    </button>
                </div>
            }

            <div className={classes.setUser}>
                <span>{isLogin ? "Нет аккаунта? " : "Есть аккаунт? "}</span>
                <NavLink onClick={() => refresh()} to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE}>
                    {isLogin ? "Зарегистрируйся!" : "Войдите!"}</NavLink>
            </div>
            <Notification/>
            {User.auth && <Navigate to={"/disk"}/>}
        </form>
    );
};


export default observer(Auth);