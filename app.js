const express = require("express");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//Map global promise for Mongoose - fix warning
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {useNewUrlParser: true})
.then(() => console.log('Mongo DB connected'))
.catch(err => console.log(err));

//Load Idea Model
require("./models/Idea");
const Idea = mongoose.model('ideas');

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const port = process.env.PORT;

//Method override Middleware
//override with POST having ? method-DELETE
app.use(methodOverride('_method'));

//BodyParser Middleware
app.use(bodyParser.urlencoded({extended: false}));
//parse app/json
app.use(bodyParser.json());

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome to Vid Jot';
    res.render('index', {title: title});
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

//Idea Index Page Route
app.get('/ideas', (req, res) => {
    Idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//Add idea form Route
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit idea form Route
app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea: idea
        });
    });
});

//Process form 
app.post('/ideas', (req, res) => {
   let errors = [];
   
   /* check if title and description are blank, and 
      push any errors into the errors array */
   if(!req.body.title) {
       errors.push({text:'Please add a title'});
   }
   
   if(!req.body.details) {
       errors.push({text:'Please write detail description for this idea.'});
   }
   
   //check if errors exist
   if(errors.length > 0) {
       res.render('ideas/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   } else {
       const newUser = {
           title: req.body.title,
           details: req.body.details
       };
       new Idea(newUser)
        .save()
        .then(idea => {
            res.redirect('/ideas');
        });
   }
});

//Edit form Process
app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title,
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                res.redirect('/ideas');
            });
    });
});

//Delete form Process
app.delete('/ideas/:id', (req, res) => {
    Idea.deleteOne({_id: req.params.id})
        .then(idea => {
           res.redirect('/ideas'); 
        });
});

app.listen(port, () => {
    console.log('Server started on port ${port}');
});