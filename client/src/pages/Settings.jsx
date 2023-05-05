import React from 'react';
import classes from "../styles/Settings.module.css";
import Header from "../components/Header/Header";
import DataAccount from "../components/DataAccount/DataAccount";
import Personal from "../components/Personal/Personal";

const Settings = () => {
    return (
        <div className={classes.settings}>
            <Header/>
            <DataAccount/>
            <Personal/>
        </div>
    );
};

export default Settings;