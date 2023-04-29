import React, {useState} from 'react';
import classes from "./Query.module.css";
import sideSettings from "../../assets/svg/sideSettings.svg"
import {getFiles, searchFile} from "../../actions/file";
import {observer} from "mobx-react";

const Query = () => {
    const [search, setSearch] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)
    const [focus, setFocus] = useState(false)

    function searchChangeHandler(e) {
        setSearch(e.target.value)
        if (searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        if (e.target.value !== '') {
            setSearchTimeout(setTimeout((value) => {
                searchFile(value)
            },500, e.target.value))
        } else {
            getFiles(-1)
        }
    }

    return (
        <div className={focus? classes.query + " " + classes.query_focus : classes.query }>
            <img className={classes.sideSettings} src={sideSettings} alt="sideSettings"/>
            <input
                className={classes.query_input}
                type="text"
                value={search}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(e) => searchChangeHandler(e)}
                placeholder="Поиск по диску"
            />
        </div>
    );
};

export default observer(Query);