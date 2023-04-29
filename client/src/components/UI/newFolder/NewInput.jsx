import React from 'react';
import classes from "./MyInput.module.css";

const NewInput = ({type, value, placeholder}) => {
    return (
        <input className={classes.myInput} type={type} value={value} placeholder={placeholder}/>
    );
};

export default NewInput;