import React from 'react';
import classes from './Notification.module.css'
import pass from '../../assets/svg/completeV2.svg'
import fail from '../../assets/svg/error.svg'
import notification from '../../store/Notification'
import {observer} from "mobx-react";
const Notification = () => {


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