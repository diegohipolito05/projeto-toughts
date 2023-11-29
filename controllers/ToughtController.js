const Tought = require('../models/Tought')
const User = require('../models/User')
const Coment = require('../models/Coment')
const ToughtLike = require('../models/ToughLike')

const { Op } = require('sequelize')

module.exports = class ToughtController {
    static async showToughts(req, res) {

        let search = ''

        if(req.query.search) {
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old') {
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`}
            },
            order: [['createdAt', order]]
        })

        const toughts = toughtsData.map((result) => result.get({plain: true}))

        let toughtsQty = toughts.length

        if(toughts === 0) {
            toughtsQty = false
        }

        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req, res) {
        const userId = req.session.userid

        const user = await User.findOne({
            include: Tought,
            where: {id: userId},
            plain: true
        })

        if(!user) {
            res.redirect('/login')
        }

        const toughts = user.Toughts.map((result) => result.dataValues)

        let emptyToughts = false

        if(toughts.length === 0) {
            emptyToughts = true
        }

        res.render('toughts/dashboard', { toughts, emptyToughts } )
    }

    static createTought(req, res) {
        res.render('toughts/create')
    }

    static async createToughtSave(req, res) {

        const tought = {
            title: req.body.title,
            UserId: req.session.userid
        }

        try {
            await Tought.create(tought)

            req.flash('message', 'Pensamento criado com sucesso!')

            req.session.save(() => {
                res.redirect('dashboard')
            })
        } catch (error) {
            console.log(error)
        }

    }

    static async removeTought(req, res) {

        const id = req.body.id

        const userId = req.session.userid

        try {

            await Tought.destroy({where: {id: id, UserId: userId}})

            req.flash('message', 'Pensamento removido com sucesso!')

            req.session.save(() => {
                res.redirect('dashboard')
            })

        } catch (error) {
            console.log(error)
        }

    }

    static async editTought(req, res) {

        const id = req.params.id

        const UserId = req.session.userid

        const tought = await Tought.findOne({where: {id: id, UserId: UserId}, raw: true})

        if (!tought){
            req.flash('message','Pensamento não encontrado!')

            req.session.save(() => {
                res.redirect('../dashboard')
            })

            return
        }

        res.render('toughts/edit', { tought })

    }

    static async editToughtSave(req, res) {
        
        const id = req.body.id

        const UserId = req.session.userid

        const tought = {
            title: req.body.title
        }

        try {

            await Tought.update(tought, {where: {id: id, UserId: UserId}})

            req.flash('message','Pensamento editado com sucesso!')

            req.session.save(() => {
                res.redirect('dashboard')
            })

        } catch (error) {
            console.log(error)
        }

    }

    static async viewTought(req, res) {

        const id = req.params.id

        const tought = await Tought.findOne({
            where: {id : id},
            raw: true
        })

        const user = await User.findOne({
            where: {
                id: tought.UserId
            },
            raw: true
        })

        const likes = await ToughtLike.findAll({where: {ToughtId: id}, raw: true})

        const likesQty = likes.length

        const userLike = await ToughtLike.findOne({
            where: {
                UserId: req.session.userid,
                ToughtId: id
            },
            raw: true
        })

        const comentsData = await Coment.findAll({
            include: [User, ComentLike],
            where: {
                ToughtId: id,
            }
        })

        const coments = comentsData.map((result) => result.get({plain: true}))

        const comentsQty = coments.length

        console.log(comentLikesQty)

        res.render('toughts/details', {tought, coments, comentsQty, user, likesQty, userLike})

    }

    static async addComent(req, res) {
        const coment = {
            title: req.body.title,
            UserId: req.session.userid,
            ToughtId: req.body.toughtId
        }

        try {

            console.log(coment)

            await Coment.create(coment)

            console.log('comentario criado com sucesso')

            req.flash('message', 'Comentario adicionado com sucesso')

            req.session.save(() => {
                res.redirect(`${coment.ToughtId}`)
            })
        } catch (error) {
            
        }
    }

    static async addLike(req, res) {
        const userLike = await ToughtLike.findOne({
            where: {
                UserId: req.session.userid,
                ToughtId: req.body.ToughtId
            },
            raw: true
        })

        if (userLike){
            await ToughtLike.destroy({
                where: {
                    UserId: req.session.userid,
                    ToughtId: req.body.ToughtId
                }
            })
        } else {
            const like = {
                UserId: req.session.userid,
                ToughtId: req.body.ToughtId
            }

            await ToughtLike.create(like)
        }

        res.redirect(`${req.body.ToughtId}`)
    }

    static async addComentLike(req, res) {
        const userLike = await ComentLike.findOne({
            where: {
                UserId: req.session.userid,
                ComentId: req.body.ComentId
            },
            raw: true
        })

        if (userLike){
            await ComentLike.destroy({
                where: {
                    UserId: req.session.userid,
                    ComentId: req.body.ComentId
                }
            })
        } else {
            const like = {
                UserId: req.session.userid,
                ComentId: req.body.ComentId
            }

            await ComentLike.create(like)
        }

        res.redirect(`/toughts/${req.body.ToughtId}`) 
    }
}