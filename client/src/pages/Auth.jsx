import React, {useState} from 'react';
import {Navigate, NavLink, useLocation} from "react-router-dom";
import {LOGIN_ROUTE, REGISTRATION_ROUTE} from "../utils/consts";
import classes from "../styles/Auth.module.css"
import {login, registration} from "../actions/user";
import {useInput} from "../hooks/hooks";


const Auth = () => {

    const location = useLocation();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [auth, setAuth] = useState(false)

    const email = useInput('', {minLength: 3, isEmail: true, isEmpty: true,})
    const password = useInput('', {minLength: 5, maxLength: 10, isEmpty: true,})

    const refresh = () => {
        email.refresh();
        password.refresh();
    }

    async function loginHandler(e) {
        e.preventDefault();
        const result = await login(email.value, password.value) || 401;
        if(result === 200) {
            setAuth(true);
        }
    }

    function registrationHandler(e) {
        e.preventDefault()
        console.log("reg")
    }

    return (
        <form className={classes.container}>
            {isLogin ?
                <div className="form">
                    <h2>Вход</h2>

                    <input className={classes.authInput}
                           value={email.value}
                           onChange={e => email.onChange(e)}
                           onBlur={e => email.onBlur(e)}
                           placeholder={"E-mail"} type={"text"}
                    />
                    {(email.isDirty && !email.inputValid) &&
                        <div className={classes.fail}>{email.errorMessage}</div>}

                    <input className={classes.authInput}
                           value={password.value}
                           onChange={e => password.onChange(e)}
                           onBlur={e => password.onBlur(e)}
                           placeholder={"Пароль"} type={"password"}
                    />
                    {(password.isDirty && !password.inputValid) &&
                        <div className={classes.fail}>{password.errorMessage}</div>}

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
                    <h2>Регистрация</h2>
                    <input className={classes.authInput}
                           value={email.value}
                           onChange={e => email.onChange(e)}
                           onBlur={e => email.onBlur(e)}
                           placeholder={"E-mail"} type={"text"}
                    />
                    <input className={classes.authInput}
                           value={password.value} required
                           onChange={e => password.onChange(e)}
                           onBlur={e => password.onBlur(e)}
                           placeholder={"Пароль"} type={"password"}
                    />

                    <button className={classes.myButton} onClick={(e) => registrationHandler(e) }
                            disabled={!email.inputValid || !password.inputValid}>Зарегистрироваться
                    </button>
                </div>
            }

            <div className={classes.setUser}>
                <span>{isLogin ? "Нет аккаунта?" : "Есть аккаунт? "}</span>
                <NavLink onClick={() => refresh()} to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE}>
                    {isLogin ? "Зарегистрируйся!" : "Войдите!"}</NavLink>
            </div>
            {auth && <Navigate to={"/disk"}/>}
        </form>
    );
};


export default Auth;