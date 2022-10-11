const bcrypt = require('bcrypt');

const { validationResult } = require('express-validator');

const users = require('../database/users.json');

module.exports = {
    login: (req, res) => {
        return res.render('login');
    },
    realizarLogin: (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('errors', errors.mapped());
            req.flash('body', req.body);

            return res.redirect('/login');
        }

        const { email, password } = req.body;
        const usuarioCadastrado = users.find((user) => user.email === email);

        if (!usuarioCadastrado) {
            req.flash('alert', {
                type: 'error',
                message: 'Usuário ou senha inválidos.'
            });

            return res.redirect('/login');
        }

        const asSenhasConferem = bcrypt.compareSync(password, usuarioCadastrado.password);

        if (!asSenhasConferem) {
            req.flash('alert', {
                type: 'error',
                message: 'Usuário ou senha inválidos.'
            });
            
            return res.redirect('/login');
        }

        req.session.usuario = usuarioCadastrado;

        return res.redirect('/posts/create');
    }
}