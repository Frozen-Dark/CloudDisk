import React, {useState} from 'react';
import classes from "../styles/MobileDisk.module.css"
import Query from "../components/UI/Query";
import MobileContainer from "../components/MobileContainer";
import SortBar from "../components/UI/SortBar";
import ModalFileSettings from "../components/ControlFile/ModalFileSettings";
import InfoModal from "../components/InfoModal/InfoModal";
import MyPopUp from "../components/popUp/MyPopUp";
import {observer} from "mobx-react";
import {uploadFile} from "../actions/file"
import UploadMenu from "../components/UploadMenu/UploadMenu";
import UploadStore from "../store/UploadStore";
import Notification from "../components/Notification/Notification";
import DropMenu from "../components/DropMenu/DropMenu";
import DevPanel from "../components/DevPanel/DevPanel";
import ControlFile from "../store/ControlFile";
import NewFolder from "../components/UI/newFolder/NewFolder";
import FileController from "../store/FileController";
import Header from "../components/Header/Header";

const MobileDisk = () => {

    const [dragEnter, setDragEnter] = useState(false)

    if(!localStorage.getItem("fileList")) {
        localStorage.setItem("fileList", "true")
    }

    function dragEnterHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(true)
    }
    function dragLeaveHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        setDragEnter(false)
    }

    async function dropHandler(e) {
        e.preventDefault()
        e.stopPropagation()
        let files = [...e.dataTransfer.files]
        UploadStore.setObjectNow(files.length)
        const dirId = FileController.currentDir
        const stack = [files.pop()]
        setDragEnter(false)

        while(stack.length > 0) {
            const file = stack.pop()
            await uploadFile(file, dirId)
            if(files.length > 0) {
                stack.push(files.pop())
            }
        }
    }




    return (
        <div className={classes.mobilePage}>

            <Header/>

            <SortBar />

            { dragEnter?
                <DropMenu dragLeaveHandler={dragLeaveHandler} dropHandler={dropHandler} dragEnterHandler={dragEnterHandler} onDragEntrer/>
                :
                <MobileContainer dragLeaveHandler={dragLeaveHandler} dragEnterHandler={dragEnterHandler} onDragEntrer/>
            }
            {/*<NewFolder/>*/}

            { ControlFile.activeControl &&
                <ModalFileSettings/>
            }
            { ControlFile.activeInfo &&
                <InfoModal/>
            }

            { UploadStore.active &&
                <UploadMenu/>
            }

            <MyPopUp/>

            <Notification/>

            <DevPanel/>

        </div>

);
};

export default observer(MobileDisk);
