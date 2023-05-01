import React, {createRef, useState} from 'react';
import classes from "./Header.module.css"
import logo from "../../assets/svg/logo.svg"
import Query from "../UI/Query";
import faqSvg from "../../assets/headerSvg/faq.svg"
import logout from "../../assets/headerSvg/logout.svg"
import settings from "../../assets/headerSvg/settings.svg"
import theme from "../../assets/headerSvg/theme.svg"
import User from "../../store/User";
const Header = () => {
    const [profile, setProfile] = useState(false);
    let uiProfile = React.createRef();

    function ClickAvatarHandler() {
        if(profile === false) {
            setProfile(true)
        }
       // uiProfile.current.focus();
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
                {/*<button className={classes.settings__support}>Support</button>*/}
                {/*<div className={classes.cogwheel}>*/}
                {/*    <img src={cogwheel} alt=""/>*/}
                {/*</div>*/}

                <div onClick={() => ClickAvatarHandler()} className={classes.profile}>
                    <div className={classes.avatar}>
                        {
                            User.currentUser.avatar && <img style={{height: "40px"}} src={"http://localhost:5000/" + User.currentUser.avatar} alt=""/>
                        }
                    </div>
                    {/*{User.currentUser.avatar}*/}
                </div>
                {profile &&

                    <button autoFocus={true} className={classes.profile__ui} ref={uiProfile} onBlur={() => setTimeout(() => {setProfile(false)}, 100)} onFocus={() => console.log("focus") } >
                        <div className={classes.ui__userData}>
                            <div onBlur={() => console.log("blur")} onFocus={() => console.log("focus")} onClick={() => console.log("click")} className={classes.userData__avatar}>
                                {
                                    User.currentUser.avatar && <img className={classes.ui__avatar} src={"http://localhost:5000/" + User.currentUser.avatar} alt=""/>
                                }
                            </div>
                            <div  className={classes.userData__info}>
                                <span onBlur={() => console.log("blur")} onFocus={() => console.log("focus")}>{User.currentUser.userName}</span>
                                <p onBlur={() => console.log("blur")} onFocus={() => console.log("focus")} style={{marginTop: "5px"}}>
                                    <span style={{color: "#B1B1B1", fontSize: "14px"} }>{User.currentUser.email}</span>
                                </p>
                            </div>
                        </div>

                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={theme} alt="theme"/>
                            <span style={{color: "#E3E3E3"}}>Тема:</span>
                            <div className={classes.ui__elem__action}>Тёмная</div>
                        </div>

                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={settings} alt="theme"/>
                            <span style={{color: "#E3E3E3"}}>Настройки</span>
                        </div>

                        <div className={classes.ui__elem}>
                            <img className={classes.ui__elem__img} src={faqSvg} alt="theme"/>
                            <span style={{color: "#E3E3E3"}}>Тема:</span>
                        </div>

                        <div className={classes.ui__elem}>
                            <img style={{height: "24px", width: "24px", marginLeft: "39px"}} className={classes.ui__elem__img} src={logout} alt="theme"/>
                            <span style={{color: "#E3E3E3"}}>Выйти</span>
                        </div>

                    </button>
                }

            </div>
        </header>
    );
};

export default Header;