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