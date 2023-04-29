import React, {useState} from 'react';
import classes from "./Menu.module.css";
import cancel from "../../assets/svg/cancel.svg"
import chevron from "../../assets/svg/chevron.svg"
import UploadFile from "./UploadFile";
import UploadStore from "../../store/UploadStore";
import {observer} from "mobx-react";



const UploadMenu = () => {


    function minimizeHandler() {
        setHidden(!hidden)
    }

    const [hidden, setHidden] = useState(false)

    function handlerClose() {
        UploadStore.setActive(false)
    }

    function stopUpload() {

    }

    function titleHeader() {
        if(UploadStore.objectNow === 0) {
            return "Загрузка завершена"
        }
        if(UploadStore.objectNow === 1) {
            return "Загрузка 1 объекта..."
        } else {
            return `Загрузка ${UploadStore.objectNow} объектов...`
        }

    }
    function UploadContainerStyle() {
        if(hidden) {
            return classes.container + " " + classes.minimized
        }
        return classes.container
    }

    return (
        <section className={UploadContainerStyle()} style={{height: `${UploadStore.height}px`, maxHeight: "371px"}}>
            <header className={classes.header}>
                <span>{titleHeader()}
                </span>
                <div className={classes.control}>
                    <img onClick={() => minimizeHandler()} className={!hidden? classes.chevron : classes.hiddenChevron} src={chevron} alt=""/>
                    <img onClick={() => handlerClose()}  className={classes.cancel} src={cancel} alt=""/>
                </div>
            </header>
            { UploadStore.objectNow > 0 && (
                <div className={classes.stopUpload}>
                    <span>Загрузка...</span>
                    <button className={classes.abortButton} onClick={() => stopUpload()}>Отменить</button>
                </div>)
            }
            <main>
                {UploadStore.state.map((file) => <UploadFile key={file.key} file={file}/>)}
            </main>

        </section>
    );
};

export default observer(UploadMenu);