const fs = require('fs')
const model = require('../models/models')
const {config} = require("dotenv");
const sharp = require("sharp");
const {User, File} = require("../models/models");
const ApiError = require("../exceptions/ApiError");
const Uuid = require("uuid");
require('dotenv').config()



class FileService {

    getPath(file) {
        if(file.path.length > 0) {
            // const previewPath = `${process.env.PREVIEWPATH}\\${file.userId}\\${file.path}`
            const filePath = `${process.env.FILEPATH}\\${file.userId}\\${file.path}`
            return {filePath}
        }
        const previewPath = `${process.env.PREVIEWPATH}\\${file.userId}`
        const filePath = `${process.env.FILEPATH}\\${file.userId}`
        return {filePath}
    }
    //
    // preview() {
    //     const path = `D:\\CloudDiskData\\UsersPreview\\1\\foto (1).jpg`;
    //
    //     let photo = {
    //         data: '',
    //         name: '',
    //         size: 0
    //     };
    //     if(fs.existsSync(path)) {
    //         photo.data = fs.readFileSync(path).toString('base64');
    //         photo.name = 'Тестовое имя';
    //         photo.size = 32123;
    //         console.log(photo)
    //         return photo;
    //     }
    //     console.log("Error path")
    // }
    // async uploadPreview(photo) {
    //     try {
    //         const previewName = uuid.v4() + ".jpg";
    //         await photo.mv(process.env.STATICPATH + "\\" + previewName);
    //         return previewName;
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }

    createDir(file) {
        const {filePath, previewPath} = this.getPath(file)
        console.log("Path")
        return new Promise(((resolve, reject) => {
            try {
                if(!fs.existsSync(filePath)){
                    fs.mkdirSync(filePath)
                    //fs.mkdirSync(previewPath)
                    return resolve({message: 'Файл создан'})
                } else {
                    return resolve({message: 'Файл уже существует'})
                }
            } catch (e) {
                return reject({message: "File exceptions2"})
            }
        }))

    } // Функция для создания папки, на вход принимает объект модели базы данных.

    createStaticAndPreview(userId) {
        const {filePath, previewPath} = this.getPath({path: "", userId: userId})

        return new Promise(((resolve, reject) => {
            try {
                fs.mkdirSync(process.env.STATICPATH + "\\" + userId)
                fs.mkdirSync(previewPath)
                return resolve({message: "Папки созданы"})
            } catch (e) {
                return reject({message: "Ошибка при создании папок пользователя"})
            }
        }))
    }

    renameFile(file, oldFilePath) {
        const filePath = `${process.env.FILEPATH}\\${file.userId}\\${oldFilePath}`
        const newPath = `${process.env.FILEPATH}\\${file.userId}\\${file.path}`

        return new Promise(((resolve, reject) => {
            try {
                if(!fs.existsSync(newPath)) {
                    fs.renameSync(filePath, newPath)
                    return resolve({message: 'Файл переименован'})
                } else {
                    return resolve({message: 'Ошибка при переименовании'})
                }
            } catch (e) {
                return reject({message: "Rename exceptions", err: e})
            }
        }))
    }

    deleteFile(file) {
        const {filePath} = this.getPath(file)
        if (file.type === "dir") {
            fs.rmdirSync(filePath)
        } else {
            fs.unlinkSync(filePath)
        }
    }

    // createPreview(userId, image, parentPath) {
    //     return new Promise(((resolve, reject) => {
    //         try {
    //             if(userId || image) {
    //                 let sharpPath;
    //                 if(parentPath) {
    //                     sharpPath = `${process.env.PREVIEWPATH}\\${userId}\\${parentPath}\\${image.name}`;
    //                 } else {
    //                     sharpPath = `${process.env.PREVIEWPATH}\\${userId}\\${image.name}`;
    //                 }
    //                 sharp(image.data)
    //                     .resize(90, 90)
    //                     .toFile(sharpPath)
    //                 return resolve({sharpPath: sharpPath})
    //             } else {
    //                 return resolve({message: "Create preview error"});
    //             }
    //         } catch (e) {
    //             return reject({message: "Preview error!"});
    //         }
    //     }))
    // }

    // async uploadAvatar(avatar, userId) {
    //        try {
    //            const user = await model.User.findOne({where: {id: userId}});
    //            const name = Uuid.v4() + ".jpg";
    //            await sharp(avatar.data)
    //                .resize(200, 200)
    //                .toFile(`${process.env.STATICPATH}\\${name}`);
    //            user.avatar = name;
    //            await user.save();
    //            return {message: "Аватар создан"}
    //        } catch (e) {
    //            console.log(e)
    //            throw ApiError.internal('Ошибка загрузки аватара')
    //        }
    // }

    // async deleteAvatar(userId) {
    //
    // }

    // throw ApiError.BadRequest('Пользователь не найден');
}

module.exports = new FileService()