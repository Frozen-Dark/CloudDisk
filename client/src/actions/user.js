import axios from "axios";
import MessAuth from "../store/Auth"
import notification from '../store/Notification'
import User from "../store/User";
import {getFiles, getFolderPath} from "./file";
import FileController from "../store/FileController";

const url = "http://localhost:5000"


axios.defaults.withCredentials = true;


axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
        return config
    }
    return config
})

axios.interceptors.response.use((config) => {
    return config;
},  async (error) => {
    const originalRequest = error.config;
        if(error.response.status === 401 && error.config && !error.config._idRetry) {
            originalRequest._idRetry = true;
            try {
                const response = await axios.get(`http://localhost:5000/api/user/refresh`, {withCredentials: true} )
                localStorage.setItem("token", response.data.accessToken);
                return axios.request((originalRequest))
            } catch (e) {
                console.log(e)
            }
        }
    })

export const refresh = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/user/refresh`, {withCredentials: true} )
        console.log(response)
    } catch (e) {

    }
}
export const registration = async (email, password) => {
    try {
        const response = await axios.post(`${url}/api/user/registration`, {
            email,
            password
        })
        MessAuth.setMessage(`Пользователь ${response.data.user.email} зарегестрирован.`, "pass")
    } catch (e) {
        MessAuth.setMessage(e.response.data.message)
        console.log(e)
    }
}

export const login = async (email, password) => {
        try {
            const response = await axios.post(`${url}/api/user/login`, {
                email,
                password
            })
            if(response.status === 200) {
                localStorage.setItem('token', response.data.token)
                MessAuth.setIsAuth(true)
                console.log("User_DATA: ",response.data.user)
                User.setCurrentUser(response.data.user)
                notification.clientMessage("Успешный вход","pass")

                const dir_id = Number(localStorage.getItem("lastDir")) || -1
                await getFiles(dir_id)
                await getFolderPath(FileController.currentDir)
            }
        } catch (e) {
            MessAuth.setMessage(`${e.response.data.message}`, "fail")
            console.log(e)
        }
}
function checkToken() {
    const token = localStorage.getItem("token");
    return !!token;
} // Костыль

export const auth = async () => {
        try {
            if(checkToken() === false) {
                let response = {status: 401};
                return response
            } // Костыль

            const response = await axios.get(`${url}/api/user/authorization`);
            if(response.status === 200) {
                MessAuth.setIsAuth(true);
                User.setCurrentUser(response.data.user);
                localStorage.setItem('token', response.data.token);
                notification.clientMessage("Успешный вход","pass");
            }
            return response.status;
        } catch (e) {
            console.log(e)
        }
}
export const logout = async () => {
        try {
            const response = await axios.post(`${url}/api/user/logout`);
            console.log(response.data.message);
        } catch (e) {
            console.log(e.response.data.message);
        }
}
export const rename = async (name, surname, nickname) => {
        try {
            const response = await axios.post(`${url}/api/user/rename`, {
                userData: {name, surname, nickname}
            });
            User.setCurrentUser(response.data)
        } catch (e) {
            console.log(e.response.data.message);
        }
}

