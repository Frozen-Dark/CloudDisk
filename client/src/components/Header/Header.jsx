import React, {createRef, useEffect, useState} from 'react';
import classes from "./Header.module.css"
import logo from "../../assets/svg/logo.svg"
import Query from "../UI/Query";
import faqSvg from "../../assets/headerSvg/faq.svg"
import logoutSvg from "../../assets/headerSvg/logout.svg"
import settings from "../../assets/headerSvg/settings.svg"
import theme from "../../assets/headerSvg/theme.svg"
import User from "../../store/User";
import {NavLink} from "react-router-dom";
import {uploadAvatar} from "../../actions/file";
const Header = () => {
    const [profile, setProfile] = useState(false);
    const [avatar, setAvatar] = useState("http://localhost:5000/" + User.currentUser.avatar)

    useEffect(() => {
        setAvatar("http://localhost:5000/" + User.currentUser.avatar)
    }, [])

    function ClickAvatarHandler() {
        setProfile(!profile);
    }
    return (

        <header className={classes.header} >
            <div className={classes.logo}>
                <img src={logo} alt=""/>
            </div>
            <div className={classes.search}>
                <Query />
            </div>
            <div className={classes.settings}>
                <div onClick={() => ClickAvatarHandler()} className={classes.profile}>
                    <div className={classes.avatar}>
                        {User.currentUser.avatar && <img style={{height: "40px"}} src={avatar} alt=""/>}
                    </div>
                </div>
                {profile &&
                    <button className={classes.profile__ui}>
                        <div className={classes.ui__userData}>
                            <div className={classes.userData__avatar}>
                                <label htmlFor="uploadInput">
                                    {User.currentUser.avatar && <img className={classes.ui__avatar} src={avatar} alt=""/>}
                                </label>
                            </div>
                            <div  className={classes.userData__info}>
                                <span>{User.currentUser.userName}</span>
                                <p>
                                    <span style={{color: "#B1B1B1", fontSize: "14px"} }>{User.currentUser.email}</span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={theme} alt="theme"/>
                            <span className={classes.ui__elem__name}>Тема:</span>
                            <div className={classes.ui__elem__action}>Тёмная</div>
                        </div>
                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={settings} alt="theme"/>
                            <span className={classes.ui__elem__name}>Настройки</span>
                        </div>
                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={faqSvg} alt="theme"/>
                            <span className={classes.ui__elem__name}>Помощь</span>
                        </div>
                        <NavLink style={{color: "#E3E3E3", textDecoration: "none"}} onClick={() => User.logout()} to={"/login"}>
                            <div className={classes.ui__elem}>
                                <img style={{height: "24px", width: "24px", marginLeft: "39px"}} className={classes.ui__elem__img} src={logoutSvg} alt="theme"/>
                                Выйти
                            </div>
                        </NavLink>
                    </button>
                }
                <input onChangeCapture={(e) => uploadAvatar(...e.target.files)} type="file" id="uploadInput" className={classes.uploadInput}/>
            </div>
        </header>
    );
};

export default Header;