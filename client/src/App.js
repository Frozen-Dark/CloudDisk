import './styles/App.css'
import './assets/font/font.css'
import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import NotFoundPage from "./pages/NotFoundPage";
import {authRoutes, publicRoutes} from "./routes";
import {observer} from "mobx-react";
import {auth} from "./actions/user";
import {getFiles, getFolderPath} from "./actions/file";
import FileController from "./store/FileController";
import User from "./store/User";



function App() {

     useEffect(() => {
         async function firstInsert() {
             const dir_id = Number(localStorage.getItem("lastDir")) || -1
             const auth_STATUS = await auth()
             if(auth_STATUS === 200) {
                 await getFiles(dir_id)
                 await getFolderPath(FileController.currentDir)
             }
         }
         firstInsert()
    }, [])


    return (
        <Routes>
          {User.auth && authRoutes.map(({path, Component}) =>
              <Route key={path} path={path} element={<Component />}/>
          )}
          {publicRoutes.map(({path, Component}) =>
              <Route key={path} path={path} element={<Component />}/>
          )}
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>
  );
}

export default observer(App);
