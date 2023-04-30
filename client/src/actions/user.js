import axios from "axios";
import MessAuth from "../store/Auth"
import notification from '../store/Notification'
import User from "../store/User";

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
                User.setCurrentUser(response.data.user)
                notification.clientMessage("Успешный вход","pass")

            }
        } catch (e) {
            MessAuth.setMessage(`${e.response.data.message}`, "fail")
            console.log(e)
        }
}

export const auth = async () => {
        try {
            const response = await axios.get(`${url}/api/user/authorization`)
            console.log(response)
            if(response.status === 200) {
                MessAuth.setIsAuth(true)
                User.setCurrentUser(response.data.user)
                localStorage.setItem('token', response.data.token)
                notification.clientMessage("Успешный вход","pass")
            }
        } catch (e) {
            console.log(e)
        }
}
export const logout = async () => {
        try {
            const response = await axios.post(`${url}/api/user/logout`)
            console.log(response.data.message)
        } catch (e) {
            console.log(e.response.data.message)
        }
}

