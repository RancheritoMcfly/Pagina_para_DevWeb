const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mySQLStore = require('express-mysql-session');
const passport = require('passport');

const {database} = require('./keys')

//inicializaciónes
const app = express();
require('./lib/passport');

//settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'), //Ahorra mucho tiempo para colocar fragmentos de codigo en la carpeta partials y poder linkearlos al archivo main y poder visualizarlo desde cualquier pagina que se genere.
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'sesionDevWeb',
    resave: false,
    saveUninitialized: false,
    store: new mySQLStore(database)
}));
app.use(flash()); //Funcionalidad para poder enviar mensajes
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.success = req.flash('message');
    app.locals.user = req.user
    next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Archivos publicos a los que el navegador accede
app.use(express.static(path.join(__dirname, 'public')));

//Iniciador del servidor
app.listen(app.get('port'), ()=>{
    console.log('Servidor en linea', app.get('port'));
});