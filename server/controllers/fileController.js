const {File, User} = require('../models/models')
const fileService = require('../services/fileService')
const accessService = require('../services/accessService')
const {where} = require("sequelize");
const fs = require("fs");
const ApiError = require("../exceptions/ApiError");
const Uuid = require("uuid")
const model = require("../models/models");
const sharp = require("sharp");
const UserDto = require("../dtos/user-dto");
const uuid = require("uuid");
const {STATIC_PATH, FILE_PATH} = require("../consts")


class FileController {

    async uploadAvatar(req, res, next) {
        try {
            const avatar = req.files.file;
            if (!avatar) {
                return next(ApiError.BadRequest("Ошибка при загрузки аватара"))
            }
            const type = avatar.name.split(".").pop()
            if (type !== "jpg" && type !== "png" && type !== "jfif") {
                return next(ApiError.BadRequest("Неверный тип аватара"))
            }

            const User = await model.User.findOne({where: {id: req.user.id}});

            let name = Uuid.v4() + ".jpg";
            if (User.avatar) {
                fs.unlinkSync(STATIC_PATH + "\\" + User.avatar);
            }

            await sharp(avatar.data)
                .resize(200, 200)
                .toFile(`${STATIC_PATH}\\${name}`);
            User.avatar = name;
            const userDto = new UserDto(User)
            await User.save();

            return res.json(userDto);
        } catch (e) {
            next(e)
        }
    }

    // async deleteAvatar(req, res, next) {
    //     try {
    //         const user = await model.User.findOne({where: {id: userId}});
    //
    //         if(!user.avatar) {
    //             return ApiError.BadRequest('Нет аватара');
    //         }
    //         const path = process.env.STATICPATH + "\\" + user.avatar;
    //         fs.unlinkSync(path);
    //         user.avatar = '';
    //         await user.save();
    //
    //         return res.json({avatar: user.avatar});
    //     } catch (e) {
    //         next(e)
    //     }
    // }
    // async changeAvatar(req, res, next) {
    //     try {
    //         const avatar = req.files.avatar;
    //          if(!avatar) {
    //             return next(ApiError.BadRequest("Ошибка при загрузки аватара"))
    //         }
    //         const type = avatar.name.split(".").pop()
    //         if(type !== "jpg" && type !== "png" && type !== "jfif") {
    //             return next(ApiError.BadRequest("Неверный тип аватара"))
    //         }
    //
    //         const user = await model.User.findOne({where: {id: req.user.id}});
    //
    //         let name;
    //         if(user.avatar) {
    //             name = user.avatar
    //         } else {
    //             name = Uuid.v4() + type;
    //         }
    //
    //         const path = process.env.STATICPATH + "\\" + name;
    //         fs.unlinkSync(path);
    //
    //         await sharp(avatar.data)
    //             .resize(200, 200)
    //             .toFile(`${process.env.STATICPATH}\\${name}`);
    //
    //         user.avatar = name;
    //         await user.save();
    //
    //         return res.json({avatar: user.avatar});
    //     } catch (e) {
    //         next(e)
    //     }
    // }

    async createDir(req, res) {
        try {
            const {name, type, parent} = req.body
            const file = new File({name, type, parent, userId: req.user.id})

            if (parent === -1 || parent === undefined) {
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
                File.findAll({where: {userId: req.user.id, parent: req.query.parent} });

            // const preview = fileService.preview();
            const preview = {}

            const parentDir = await File.findOne({where: {id: req.query.parent, userId: req.user.id}}) || {parent: -1};
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
        console.log(req)
        const file = req.files.file;
        console.log(file)

        const fileName = req.query.name;
        const user = await User.findOne({where: {id: req.user.id}});

        const size = (Number(file.size) / 1024).toFixed(2);
        user.usedSpace = (Number(user.usedSpace) + Number(size)).toFixed(2);
        const type = fileName.split(".").pop();

        const name = fileName.slice(0, fileName.length - type.length - 1);

        try {
            let path, dbFile, parent = {id: -1}, sharpObj, preview;

            if (req.body.parent === "-1") {
                path = fileName;
            } else {
                parent = await File.findOne({where: {userId: req.user.id, id: req.body.parent}});
                path = `${parent.path}\\${fileName}`;
            }

            if (fs.existsSync(`${FILE_PATH}\\${user.id}\\${path}`)) {
                return res.status(400).json({message: "Файл уже существует"});
            }
            await file.mv(`${FILE_PATH}\\${user.id}\\${path}`);

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

            if (parent.id !== -1) {
                parent.childs = [...parent.childs, dbFile.id];
                await parent.save();
            }

            res.json(dbFile);
        } catch (e) {
            console.log(e);
            return res.status(500).json({message: "Upload exceptions"});
        }
    }

    async downloadFile(req, res) {
        try {
            const file = await File.findOne({where: {id: req.query.id, userId: req.user.id}})

            const path = `${FILE_PATH}\\${req.user.id}\\${file.path}`

            if (fs.existsSync(path)) {
                return res.download(path, file.name + file.type)
            }
            return res.status(400).json({message: "Ошибка загрузки"})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: "Ошибка загрузки"})
        }
    }

    async deleteFile(req, res) {
        try {
            const file = await File.findOne({where: {userId: req.user.id, id: req.query.id}})
            if (!file) {
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

    async renameFile(req, res) {
        try {
            const file = await File.findOne({where: {userId: req.user.id, id: req.query.id}})

            if (!file) {
                return res.status(400).json({message: "Файл не найден"})
            }

            file.name = req.query.name
            const oldFilePath = file.path

            if (file.parent !== -1) {
                let path = file.path.split("\\")
                path.pop()
                if (path.length > 1) {
                    path = path.join("\\")
                } else {
                    path = path[0]
                }
                if(file.type === 'dir') {
                    file.path = `${path}\\${req.query.name}`
                } else {
                    file.path = `${path}\\${req.query.name}.${file.type}`
                }
            } else {
                if(file.type === 'dir') {
                    file.path = `${req.query.name}`
                } else {
                    file.path = `${req.query.name}.${file.type}`
                }
            }
            await fileService.renameFile(oldFilePath, file.path, file.userId)
            file.save()
            return res.json({message: "Файл был переименован"})
        } catch (e) {
            console.log(e)
            return res.status(400).json({message: "Ошибка переименования"})
        }
    }

    async renameFolder(req, res) {
        try {
            const dir = await File.findOne({where: {id: req.query.id} })
            dir.name = req.query.name;
            const oldPath = dir.path;

            let path;

            if(dir.parent === -1) {
                path = dir.name
            } else {
                path = dir.path.split("\\");
                path.pop();
            }
            dir.path = path;
            await fileService.renameFile(oldPath, path, dir.userId);

            if(dir.childs.length >= 1) {
                const stack = [...dir.childs]
                const dirStack = [];

                while(stack.length >= 1) {
                    const childId = stack.pop()
                    const child = await File.findOne({where: {id: childId} })
                    if(child.type === 'dir') {
                        child.path = `${dir.name}\\${child.name}`;
                        dirStack.push(child.id)
                        child.save();
                        continue;
                    }
                    child.path = `${dir.name}\\${child.name}.${child.type}`;
                    child.save();
                }

            }

            dir.save();

            return res.json({childs: dir.childs, length: dir.childs.length})

        } catch (e) {
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
            if (currentDir !== -1 && currentDir !== undefined) {
                while (stack.length > 0) {
                    const id = stack.pop()
                    const dir = await File.findOne({where: {id: id, userId: req.user.id}})
                    folders.push({id: dir.id, path: dir.name})
                    if (dir.parent !== -1) {
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

    async setAccessLink(req, res) {
        try {
            const fileId = req.body.fileId;
            //const user = await model.User.findOne({where: {id: req.user.id} });
            const file = await model.File.findOne({where: {userId: req.user.id, id: fileId}});
            file.access_link = uuid.v4();
            await file.save();
            return res.json({file})
        } catch (e) {
            console.log(e)
            return res.status(206).json({message: "setAccessLink"})
        }
    }

    async removeAccessLink(req, res) {
        const fileId = req.body.fileId;
        const file = await model.File.findOne({where: {userId: req.user.id, id: fileId}});
        file.access_link = "";
        await file.save();
        return res.json({file})
    }

    async getGeneralFiles(req, res) {
        try {
            let parent, files;
            const link = req.body.link;
            parent = await accessService.getParent(link);
            const owner = await model.User.findOne({where: {id: parent.userId}});
            if (parent.type === "dir") {
                files = await accessService.getFiles(parent);
            }
            return res.json({files, parent, owner: owner.nickName});
        } catch (e) {
            console.log(e)
            return res.status(206).json({message: "getGeneralFiles"})
        }
    }

    async downloadGeneralFile(req, res) {
        try {
            const file = await File.findOne({where: {id: req.query.id}})
            const path = `${FILE_PATH}\\${file.userId}\\${file.path}`
            const parent = await File.findOne({where: {id: file.parent}})
            if (!parent.access_link) {
                return res.status(206).json({message: "downloadGeneralFile"})
            }

            if (fs.existsSync(path)) {
                return res.download(path, file.name + "." + file.type)
            }

            return res.status(400).json({message: "Ошибка загрузки"})
        } catch (e) {
            console.log(e)
            return res.status(206).json({message: "downloadGeneralFile"})
        }
    }

}

module.exports = new FileController()