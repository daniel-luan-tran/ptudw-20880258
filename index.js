'use strict';

const express = require('express');
const expressHandlebars = require('express-handlebars');
const {createStarList} = require('./controllers/handlebarsHelper');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(__dirname + '/bootstrap-ecommerce-template'));
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
        createStarList
    }
}));

app.set('view engine', 'hbs');

//route
app.use('/', require('./routes/indexRouter'));


/// Optional
app.use((err, req, res, next) => {
    const page = ['cart', 'checkout', 'contact', 'login', 'my-account', 'product-detail', 'product-list', 'wishlist', 'index'];
    if(page.includes(req.params.page)) {
        next();
    } else {
        res.status(404).render('error', { message: 'Page not found' });
        console.error('Page not found');
    }
});

app.use((err, req, res, next) => {
    console.error('Internal error');
    res.status(500).send('Internal error');
});
/// Optional

app.listen(port, () => console.log(`Listening on port ${port}`));