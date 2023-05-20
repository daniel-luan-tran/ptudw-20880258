'use strict';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const {createStarList} = require('./controllers/handlebarsHelper');
const {createPagination} = require('express-handlebars-paginate');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname));
app.get('/sync', (req, res) => {
    let model = require('./models');
    model.sequelize.sync().then(() => {
        res.send('Tables created');
    });
})

app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions:{
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        createStarList,
        createPagination
    }
}));

app.set('view engine', 'hbs');

// cau hinh doc du lieu post tu body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cau hinh session
app.use(session({
    secret: 'S3cret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000
    }
}));

// middleware khoi tao gio hang
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart(req.session.cart ? req.session.cart : {});
    res.locals.quantity= req.session.cart.quantity;
    
    next();
})

//route
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'Page not found' });
});

/// Optional: This will cover the error
// app.use((err, req, res, next) => {
//     console.error('Internal error');
//     res.status(500).send('Internal error');
// });


app.listen(port, () => console.log(`Listening on port ${port}`));