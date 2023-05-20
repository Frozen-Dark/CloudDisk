import React, {useState} from 'react';
import classes from "./Header.module.css"
import Query from "../UI/Query";
import User from "../../store/User";
import {NavLink, useLocation} from "react-router-dom";
import {uploadAvatar} from "../../actions/file";
import {DISK_ROUTE, STATIC_PATH} from "../../utils/consts";



const Header = () => {
    const logo = STATIC_PATH + "svg/logo.svg";
    const faqSvg = STATIC_PATH + "svg/faq.svg";
    const logoutSvg = STATIC_PATH + "svg/logout.svg";
    const settingsSvg = STATIC_PATH + "svg/settings.svg";
    const themeSvg = STATIC_PATH + "svg/theme.svg";

    const location = useLocation();
    const isDisk = location.pathname  === DISK_ROUTE;


    const [profile, setProfile] = useState(false);
    const [avatar, setAvatar] = useState(STATIC_PATH + User.currentUser.avatar);

    async function  uploadAvatarHandler(e) {
        const result = await uploadAvatar(e);
        setAvatar(STATIC_PATH + result.data.avatar);
    }

    function ClickAvatarHandler() {
        setProfile(!profile);
    }

    return (
        <header className={classes.header} >
            <div className={classes.logo}>
                <NavLink to={"/disk"}>
                    <img src={logo} alt=""/>
                </NavLink>
            </div>
            <div className={classes.search}>
                {isDisk &&
                    <Query />
                }
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
                                <span>{User.currentUser.nickName}</span>
                                <p>
                                    <span style={{color: "#B1B1B1", fontSize: "14px"} }>{User.currentUser.email}</span>
                                </p>
                            </div>
                        </div>
                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={themeSvg} alt="theme"/>
                            <span className={classes.ui__elem__name}>Тема:</span>
                            <div className={classes.ui__elem__action}>Тёмная</div>
                        </div>

                        <NavLink style={{textDecoration: "none"}} to={"/settings"}>
                            <div className={classes.ui__elem}>
                                <img className={classes.ui__elem__img} src={settingsSvg} alt="theme"/>
                                <span className={classes.ui__elem__name}>Настройки</span>
                            </div>
                        </NavLink>
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
                <input onChangeCapture={(e) => uploadAvatarHandler(e)} type="file" id="uploadInput" className={classes.uploadInput}/>
            </div>
        </header>
    );
};

export default Header;