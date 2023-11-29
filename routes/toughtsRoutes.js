const express = require('express')
const router = express.Router()
const ToughtController = require('../controllers/ToughtController')

// helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, ToughtController.createTought)
router.post('/add', checkAuth, ToughtController.createToughtSave)
router.get('/edit/:id', checkAuth, ToughtController.editTought)
router.post('/edit', checkAuth, ToughtController.editToughtSave)
router.get('/dashboard', checkAuth, ToughtController.dashboard)
router.post('/remover', checkAuth, ToughtController.removeTought)
router.get('/:id', checkAuth, ToughtController.viewTought)
router.post('/addcoment', checkAuth, ToughtController.addComent)
router.post('/addlike', checkAuth, ToughtController.addLike)
router.post('/addcomentlike', checkAuth, ToughtController.addComentLike)
router.get('/', ToughtController.showToughts)

module.exports = router