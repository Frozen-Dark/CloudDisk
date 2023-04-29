const sequelize = require('../db')
const {DataTypes} = require('sequelize')


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    diskSpace: {type: DataTypes.DECIMAL, defaultValue: 10240000},
    usedSpace: {type: DataTypes.DECIMAL, defaultValue: 0},
    avatar: {type: DataTypes.STRING},
    userName: {type: DataTypes.STRING, defaultValue: "User"}
})

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, allowNull: false},
    refreshToken: {type: DataTypes.STRING},
})

const File = sequelize.define('file', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    preview: {type: DataTypes.STRING, defaultValue: ''},
    type: {type: DataTypes.STRING},
    access_link: {type: DataTypes.STRING},
    size: {type: DataTypes.DECIMAL, defaultValue: 0},
    path: {type: DataTypes.STRING, defaultValue: ''},
    userId: {type: DataTypes.INTEGER},
    parent: {type: DataTypes.INTEGER, defaultValue: -1},
    childs: {type: DataTypes.ARRAY(DataTypes.INTEGER), defaultValue: []},
})

User.hasMany(File)
File.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)


module.exports = {
    User,
    File,
    Token
}


