const Router = require('express')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')
const fileController = require('../controllers/fileController')

router.post('', authMiddleware, fileController.createDir)
router.post('/upload', authMiddleware, fileController.uploadFiles)

router.post('/uploadAvatar', authMiddleware, fileController.uploadAvatar)
//router.post('/changeAvatar', authMiddleware, fileController.changeAvatar)

router.get('/download', authMiddleware, fileController.downloadFile)
router.get('', authMiddleware, fileController.getFiles)
router.get('/search', authMiddleware, fileController.searchFile)
router.get('/folderPath', authMiddleware, fileController.getPath)
router.delete('/delete', authMiddleware, fileController.deleteFile)
router.put('/rename', authMiddleware, fileController.renameFile)

module.exports = router