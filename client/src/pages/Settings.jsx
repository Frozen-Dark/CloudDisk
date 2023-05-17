import React from 'react';
import classes from "../styles/Settings.module.css";
import Header from "../components/Header/Header";
import DataAccount from "../components/DataAccount/DataAccount";
import Personal from "../components/Personal/Personal";
import Notification from "../components/Notification/Notification";

const Settings = () => {
    return (
        <div className={classes.settings}>
            <Header/>
            <DataAccount/>
            <Personal/>
            <Notification/>

        </div>
    );
};

export default Settings;