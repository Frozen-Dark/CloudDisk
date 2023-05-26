const fs = require('fs')
const model = require('../models/models')
const {User, File} = require("../models/models");
const Uuid = require("uuid");

class AccessService {
    async getParent(link) {
        const File = await model.File.findOne({where: {access_link: link} });
        if(!File) {
            return console.log("Нет файла")
        }
        return File
    }

    async getFiles(parent) {
        const files = await model.File.findAll( {where: {parent: parent.id, userId: parent.userId} })
        return files
    }

}

module.exports = new AccessService();