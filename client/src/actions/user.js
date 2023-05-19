import axios from "axios";
import notification from '../store/Notification'
import User from "../store/User";
import {getFiles, getFolderPath} from "./file";

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
                if(response) {
                    localStorage.setItem("token", response.data.accessToken);
                } else {
                    localStorage.removeItem("token")
                }
                return axios.request((originalRequest))
            } catch (e) {
                console.log(e)
            }
        }
    })

export const refresh = async () => {
    try {
        const response = await axios.get(`http://localhost:5000/api/user/refresh`, {withCredentials: true} )
        if(response.status !== 200) {
            return localStorage.removeItem("token");
        }
    } catch (e) {

    }
}
export const registration = async (email, password) => {
    try {
        return await axios.post(`${url}/api/user/registration`, {
            email,
            password
        })
    } catch (e) {
        console.log(e)
    }
}

export const changePassword = async (newPassword) => {
    try {
        const response = await axios.post(`${url}/api/user/password/change`, {
            newPassword
        })
        return response;
    } catch (e) {
        console.log(e)
    }
}
export const verifyPassword = async (password) => {
    try {
        const response = await axios.post(`${url}/api/user/password/verify`, {
            password
        })
        return response;
    } catch (e) {
        console.log(e)
    }
}

export const login = async (email, password) => {
        try {
            return await axios.post(`${url}/api/user/login`, {
                email,
                password
            });

        } catch (e) {
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
                User.setAuth(true)
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
            return response;
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
            return response.status
        } catch (e) {
            console.log(e.response.data.message);
        }
}

export const checkName = async (name) => {
    try {
        return await axios.get(`${url}/api/user/checkName?name=${name}`);
    } catch (e) {
        console.log(e.response.data.message)
    }
}

