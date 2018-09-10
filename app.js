const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

//Map global promise for Mongoose - fix warning
mongoose.Promise = global.Promise;
//Connect to Mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {useNewUrlParser: true})
.then(() => console.log('Mongo DB connected'))
.catch(err => console.log(err));

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

const port = process.env.PORT;

//Middleware
// app.use((req, res, next) => {
//     console.log(Date.now());
//     next();
// });

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome to Vid Jot'
    res.render('index', {title: title});
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(port, () => {
    console.log('Server started on port ${port}');
});