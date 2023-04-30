import React from 'react';
import classes from "./Header.module.css"
import logo from "../../assets/svg/logo.svg"
import Query from "../UI/Query";
import cogwheel from "../../assets/svg/cogwheel.svg"
import User from "../../store/User";
const Header = () => {
    return (
        <header className={classes.header} >
            <div className={classes.logo}>
                <img src={logo} alt=""/>
            </div>

            <div className={classes.search}>
                <Query />
            </div>

            <div className={classes.settings}>
                <button className={classes.settings__support}>Support</button>
                <div className={classes.cogwheel}>
                    <img src={cogwheel} alt=""/>
                </div>

                <div className={classes.profile}>
                    <div className={classes.avatar}>
                        {
                            User.currentUser.avatar && <img style={{height: "40px"}} src={"http://localhost:5000/" + User.currentUser.avatar} alt=""/>
                        }
                    </div>
                    {/*{User.currentUser.avatar}*/}
                </div>
            </div>
        </header>
    );
};

export default Header;