const express      = require('express');
const path         = require('path');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const session      = require('express-session')
const passport     = require('passport');
const cors         = require('cors');


require('dotenv').config();

require('./config/passport-setup')

mongoose.connect(process.env.MONGODB_URI);


const app = express();


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'string is to avoid a warning',
    resave: true,
    saveUninitialized: true,
    cookie : { httpOnly: true, maxAge: 2419200000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  credentials: true,                   // allow other domains to send cookies
  origin: [ 'http://localhost:4200' ]  // these are the domains that are allowed
}));

// ROUTES
const myAuthRoutes = require('./routes/auth-routes');
app.use('/', myAuthRoutes);

const myCamelRoutes = require('./routes/travelPost-routes');
app.use('/', myTravelPostRoutes);


app.use((req, res, next) => {
  // If no routes match, send them the Angular HTML.
  res.sendfile(__dirname + '/public/index.html');
});


module.exports = app;
