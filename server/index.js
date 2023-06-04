require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const PORT = process.env.PORT || 6000
const fileUpload = require("express-fileupload")
const router = require('./routes/index')
const errorMiddleware = require('./middleware/errorMiddleware')
const corsMiddleware = require("./middleware/cors.middleware")
const cors = require("cors")
const cookieParser = require('cookie-parser')
const {config} = require("dotenv");


const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}\\data\\static`));

app.use(cookieParser());
app.use(corsMiddleware);
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate(); // Подключаеться к бд
        await sequelize.sync(); // Сверяет состояние бд с схемой данных
        app.listen(PORT, () => console.log(`Сервер запущен на порте: ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}
start()