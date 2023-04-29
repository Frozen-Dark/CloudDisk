const {File, User} = require('../models/models')
const fileService = require('../services/fileService')
const {where} = require("sequelize");
const fs = require("fs");
const {config} = require("dotenv");
const ApiError = require("../exceptions/ApiError");
require('dotenv').config()
const Uuid = require("uuid")
const model = require("../models/models");

class FileController {

    async uploadAvatar(req, res, next) {
        try {
            const avatar = req.files.avatar;
            if(!avatar) {
                return next(ApiError.BadRequest("Ошибка при загрузки аватара"))
            }
            const type = avatar.name.split(".").pop()
            if(type !== "jpg" && type !== "png") {
                return next(ApiError.BadRequest("Неверный тип аватара"))
            }
            console.log("Work")
            const message = await fileService.uploadAvatar(avatar, req.user.id)

            return res.json(message)
        } catch (e) {
            next(e)
        }
    }

    async createDir(req, res) {
        console.log(req.body)
        try {

            const {name, type, parent} = req.body
            const file = new File({name, type, parent, userId: req.user.id})

           if(parent === -1 || parent === undefined) {
               file.path = name
               await fileService.createDir(file)
               await file.save()
           } else {
               const parentFile = await File.findOne({where: {id: parent}})
               file.path = `${parentFile.path}\\${file.name}`
               await fileService.createDir(file)
               await file.save()
               parentFile.childs = [...parentFile.childs, file.id]
               await parentFile.save()
           }
           return res.json(file)
        } catch (e) {
            console.log(e)
            return res.status(400).json(e)
        }
    }

    async getFiles(req, res) {
        try {

            const files = await
                File.findAll(
                    {where:
                            {
                                userId: req.user.id,
                                parent: req.query.parent
                            }}
                );

           // const preview = fileService.preview();
            const preview = {}

            const parentDir = await File.findOne({ where: {id: req.query.parent, userId: req.user.id} }) || {parent: -1};
            return res.json({files, parentDir, preview});

        } catch (e) {
            return res.status(500).json({message: "Can not get files"});
        }
    }
    // async getFiles(req, res) {
    //     try {
    //
    //         const files = await
    //             File.findAll(
    //                 {where:
    //                         {
    //                             userId: req.user.id,
    //                             parent: req.query.parent
    //                         }}
    //             );
    //         const parentDir = await File.findOne({ where: {id: req.query.parent, userId: req.user.id} }) || {parent: -1};
    //         return res.json({files, parentDir});
    //
    //     } catch (e) {
    //         return res.status(500).json({message: "Can not get files"});
    //     }
    // }



    async uploadFiles(req, res) {
        const file = req.files.file;

        const fileName = req.query.name;
        const user = await User.findOne({where: {id: req.user.id} });

        const size = (Number(file.size)/1024).toFixed(2);
        user.usedSpace = Number(user.usedSpace) + Number(size);
        const type = fileName.split(".").pop();

        const name = fileName.slice(0, fileName.length - type.length - 1);

        try {
            let path, dbFile, parent = {id: -1}, sharpObj, preview;

            if(req.body.parent === "-1") {
                path = fileName;
            } else {
                parent = await File.findOne({where: {userId: req.user.id, id: req.body.parent} });
                path = `${parent.path}\\${fileName}`;
            }

            if(fs.existsSync(`${process.env.FILEPATH}\\${user.id}\\${path}`)) {
                return res.status(400).json({message: "Файл уже существует"});
            }
            await file.mv(`${process.env.FILEPATH}\\${user.id}\\${path}`);

            // if(type === "jpg") {
            //     sharpObj = await fileService.createPreview(req.user.id, file, parent.path)
            // }
            // preview = await fileService.uploadPreview(file)


            dbFile = new File({
                name,
                type,
                size,
                userId: user.id,
                path: path,
                preview: "",
                parent: parent.id,
                sharpPath: "",
            });

            // if(preview) {
            //     dbFile.preview = preview;
            // }

            // if(sharpObj) {
            //     dbFile.preview = sharpObj.sharpPath;
            // }
            await user.save();
            await dbFile.save();

            if(parent.id !== -1) {
                parent.childs = [...parent.childs, dbFile.id];
                await parent.save();
            }

            res.json(dbFile);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Upload exceptions"});
        }
    }

    async downloadFile (req, res) {
        try {
            const file = await File.findOne({where: {id: req.query.id, userId: req.user.id}})

            const path = `${process.env.FILEPATH}\\${req.user.id}\\${file.path}`

            if(fs.existsSync(path)) {
                return res.download(path, file.name + file.type)
            }
            return res.status(400).json({message: "Ошибка загрузки"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Ошибка загрузки"})
        }
    }

    async deleteFile (req, res) {
        try {
            const file = await File.findOne({where: {userId: req.user.id, id: req.query.id}})
            if(!file) {
                return res.status(400).json({message: "Файл не найден"})
            }
            fileService.deleteFile(file)
            await file.destroy()
            return res.json({message: "Файл был удален"})

        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "В папке остались файлы"})
        }
    }
    async renameFile (req, res) {
        try {
            const file = await File.findOne({where: {userId: req.user.id, id: req.query.id}})

            if(!file) {
                return res.status(400).json({message: "Файл не найден"})
            }

            file.name = req.query.name
            const oldFilePath = file.path

            if(file.parent !== -1) {
                let path = file.path.split("\\")
                path.pop()
                if(path.length > 1) {
                    path = path.join("\\")
                } else {
                    path = path[0]
                }
                file.path = `${path}\\${req.query.name}.${file.type}`
            } else {
                file.path = `${req.query.name}.${file.type}`
            }
            await fileService.renameFile(file, oldFilePath)
            file.save()
            return res.json({message: "Файл был переименован"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка переименования"})
        }
    }


    async searchFile(req, res) {
        try {
            const searchName = req.query.name
            let files = await File.findAll({where: {userId: req.user.id}})
            files = files.filter(file => file.name.includes(searchName))
            return res.json(files)
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при поиске"})
        }
    }
    async getPath(req, res) {
        try {
            const currentDir = req.query.currentDirId;
            const folders = [];
            const stack = [currentDir]
            if(currentDir !== -1 && currentDir !== undefined) {
                while(stack.length > 0) {
                    const id = stack.pop()
                    const dir = await File.findOne({where: {id: id, userId: req.user.id}})
                    folders.push({id: dir.id, name: dir.name})
                    if(dir.parent !== -1) {
                        stack.push(dir.parent)
                    }
                }
                return res.json([...folders.reverse()])
            }
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка при получении пути папок"})
        }
    }




}

module.exports = new FileController()