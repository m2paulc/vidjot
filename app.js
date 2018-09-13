const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const session = require("express-session");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const app = express();

//Map global promise for Mongoose - fix warning
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {useNewUrlParser: true})
.then(() => console.log('Mongo DB connected'))
.catch(err => console.log(err));

//Load Ideas Routes
const ideas = require("./routes/ideas");

//Load Users Routes
const users = require("./routes/users");

//Load passport config
require("./config/passport")(passport);

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const port = process.env.PORT;

//Method override Middleware
//override with POST having ? method-DELETE
app.use(methodOverride('_method'));

//Express session Middleware
app.use(session({
    secret: 'secret dog',
    resave: true,
    saveUninitialized: true
}));

//it is important that this goes after Express session Middleware
//Passport Initialize and Session Middleware
app.use(passport.initialize());
app.use(passport.session());

//flash Middleware
app.use(flash());

//Global variables Middleware for messages
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
//parse app/json
app.use(bodyParser.json());

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Index Page
app.get('/', (req, res) => {
    const title = 'Welcome to Vid Jot';
    res.render('index', {title: title});
});

//About Page
app.get('/about', (req, res) => {
    res.render('about');
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});