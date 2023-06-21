import React from 'react';
import classes from './Notification.module.css'
import notification from '../../store/Notification'
import {observer} from "mobx-react";
import {STATIC_PATH} from "../../utils/consts";
const Notification = () => {

    const pass = STATIC_PATH + "svg/completeV2.svg"
    const fail = STATIC_PATH + "svg/error.svg"
        return (
            <div className={classes.position}
                 style={{visibility: `${notification.state? "visible" : "hidden"}`}}>

                {notification.state &&
                    <div style={{width:`${notification.message.length * 8 + 100}px`}}
                         className={notification.animation ? classes.showNotification : classes.hideNotification}>

                        {notification.status ?
                            <>
                                <img className={classes.image} src={pass} alt=""/>
                                <p className={classes.passText}>{notification.message}</p>
                            </>
                            :
                            <>
                                <img className={classes.image} src={fail} alt=""/>
                                <p className={classes.failText}>{notification.message}</p>
                            </>
                        }
                    </div>
                }
            </div>
        )
};

export default observer(Notification);