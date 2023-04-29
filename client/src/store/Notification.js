import {makeAutoObservable} from "mobx";
class Notification {
    constructor() {
        makeAutoObservable(this)
    }
    state = false
    animation = true
    status = false
    message = "Успешный вход"
    FIFO = []

    pushQueue(text, status) {
        this.FIFO = [{text: text, status: status}, ...this.FIFO]
    }
    popQueue() {
        if(this.FIFO.length !== 0) {
            const data = this.FIFO.pop()
            this.clientMessage(data.text, data.status)
        }
    }
    setAnimation(state) {
        this.animation = state
    }
    setState(state) {
        this.state = state
    }
    clientMessage(text, status) {
        if (this.state === false) {
            if (status === "pass") {
                this.message = text
                this.status = true
                this.showNotification()
            } else {
                this.message = text
                this.status = false
                this.showNotification()
            }
        } else {
            this.pushQueue(text, status)
        }
    }
    showNotification() {
        const animationDuration = 300 // ms
        const showTime = 2000 // ms

        this.setAnimation(true)
        this.setState(true)

        setTimeout (() => {
            this.setAnimation(false)

            setTimeout(() => {
                this.setState(false)
                this.popQueue() // вызывает следующий объект из очереди.
            }, animationDuration)

        }, showTime)
    }
}

export default new Notification()