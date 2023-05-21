'use strict';

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const models = require('../models');

// Ham nay duoc goi khi xac thuc thanh cong va luu thong tin user vao session
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Ham nay duoc goi boi passport.session de lay thong tin cua user tu csdl va dua vao req.user
passport.deserializeUser(async (id, done) => {
    try {
        let user = await models.User.findOne({
            where: {id}
        });
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Ham xac thuc nguoi dung khi dang nhap
passport.use('local-login', new LocalStrategy({
    usernameField: 'email', // ten dang nhap la email
    passwordField: 'password',
    passReqToCallback: true // cho phep truyen req vao callback de kiem tra user da dang nhap chua
}, async (req, email, password, done) => {
    if( email) {
        email = email.toLowerCase();
    }
    try {
        if (!req.user) { // Neu user chua dang nhap
            let user = await models.User.findOne({ where: {email}})
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'Email does not exist!'));
            }
            if(bcrypt.compareSync(password, user.password)) { // Neu mat khau khong dung
                return done(null, false, req.flash('loginMessage', 'Invalid password'));
            }
            return done(null, user);
        }
        // bo qua dang nhap
        done(null, req.user);
    } catch (error) {
        done(error)
    }
}))

// Ham dang ky tai khoan
passport.use('local-register', new LocalStrategy({
    usernameField: 'email', // ten dang nhap la email
    passwordField: 'password',
    passReqToCallback: true // cho phep truyen req vao callback de kiem tra user da dang nhap chua
}, async (req, email, password, done) => {
    if (email)
        email = email.toLowerCase();
    if (req.user) { // Neu nguoi dung da dang nhap, bo qua
        return done(null, req.user)
    }
    try {
        let user = await models.User.findOne({ where: {email}})
        if (user) {
            return done(null, false, req.flash('registerMessage', 'Email is already registered!'))
        }
        user = await models.User.create({
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(8)),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile: req.body.mobile,
        })

        // Thong bao dang ky thanh cong
        return done(null, false, req.flash('registerMessage', 'You have been registered'));
    } catch (error) {
        done(error);
    }
}))

module.exports = passport;