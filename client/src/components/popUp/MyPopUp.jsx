import React, {useState} from 'react';
import classes from './MyPopUp.module.css'
import PopUp from "../../store/PopUp"
import {observer} from "mobx-react";

const MyPopUp = () => {
    const [name, setName] = useState('')
    function close() {
        PopUp.setPopupData("", false, "")
        setName('')
    }
    function action(name){
        PopUp.popupFunction(name)
        close()
    }
    function PopupStyle() {
        if(PopUp.data.state) {
            return classes.blur
        }
        return classes.inactive
    }

    return (
        <div onClick={() => close()} className={PopupStyle()}>

            <div onClick={e => e.stopPropagation()} className={classes.container}>
                <p>{PopUp.data.title}</p>
                <input type="text"  placeholder="Имя" minLength="1" maxLength="24"
                       onChange={e => setName(e.target.value)} value={name}
                />
                <div className={classes.mButton}>
                    <button onClick={() => close()}>Отмена</button>
                    <button onClick={() => action(name)}>{PopUp.data.actionName}</button>
                </div>
            </div>
        </div>

    );
};

export default observer(MyPopUp);