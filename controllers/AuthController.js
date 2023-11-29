const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class AuthController {

    static login(req, res) {
        res.render('auth/login')
    }

    static async loginPost(req, res) {

        const {email, senha} = req.body

        // find user
        const user = await User.findOne({where: {email: email}})

        if(!user) {
            req.flash('message', 'Email não castrado!')
            res.render('auth/login')

            return
        }

        // check if passwords match
        const passwordMatch = bcrypt.compareSync(senha, user.senha)

        if(!passwordMatch){
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')

            return
        }

        // initialize session

        req.session.userid = user.id

        req.flash('message', 'Login realizado com sucesso!')

        req.session.save(() => {
            res.redirect('/')
        })

    }

    static register(req, res) {
        res.render('auth/register')
    }

    static async registerPost(req, res) {

        const {name, email, senha, confirmsenha} = req.body

        // password match validation
        if(senha != confirmsenha) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        // check if exists user
        const checkIfUserExist = await User.findOne({where: {email: email}})
        if(checkIfUserExist){
            req.flash('message', 'Email já cadastado!')
            res.render('auth/register')

            return
        }

        // create a password
        const salt = bcrypt.genSaltSync(10)
        const hashedSenha = bcrypt.hashSync(senha, salt)

        const user = {
            name,
            email,
            senha: hashedSenha
        }

        try {
            const createdUser = await User.create(user)

            // initialize session

            req.session.userid = createdUser.id

            req.flash('message', 'Cadastro realizado com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })

        } catch (err) {
            console.log(err)
        }

    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

}