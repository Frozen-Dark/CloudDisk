import {makeAutoObservable} from 'mobx'
class Auth {
    constructor () {
        makeAutoObservable(this)
    }
    auth = false; // Авторизирован пользователь или нет
    state = true // Статус видимости сообщения
    message = "" // Само сообщение

    setIsAuth (state) {
        this.auth = state
    }
    setMessage (message, status) {
        if (status === "pass") {
            this.message = message
            this.state = true
        } else {
            this.message = message
            this.state = false
        }
    }
    setState (state) {
        this.state = state
    }
    clear () {
        this.auth = false
        this.state = true
        this.message = ""
    }
}



export default new Auth();
