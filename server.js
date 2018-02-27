const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs'); //we use this for our templating engine
const http = require('http');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');


const container = require('./container');


//we now resolve the files we specified in the container file
container.resolve(function(users){

    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/chatapp');

    const app = SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app); //we subtitute with socket.io later
        server.listen(3000, function(){
            console.log('Listening on port 3000');
        });

        ConfigureExpress(app);

        //seting up router
        const router = require('express-promise-router')();
        users.SetRouting(router);
        app.use(router);

    }

    //adding middleWares
    function ConfigureExpress(app){
        app.use(express.static('public')); //express would be able to use all static files in the public folder
        app.use(cookieParser());
        app.set('view engine', 'ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        app.use(validator());
        app.use(session({
            secret: 'secret key',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection}) //this store help store user metadata even if the page is refreshed
        }));

        app.use(flash()); //enable us display flash messages

        //don't add this two before the session above
        app.use(passport.initialize());
        app.use(passport.session());
    }
})
