const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Load helper
const {ensureAuthenticated} = require("../helpers/auth");

//Load Idea Model
require("../models/Idea");
const Idea = mongoose.model('ideas');

//Idea Index Page Route
router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({user: req.user.id})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

//Add idea form Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

//Edit idea form Route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        if(idea.user != req.user.id) {
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/ideas');
        } else {
              res.render('ideas/edit', {
              idea: idea
            });   
        }
    });
});


//Process form 
router.post('/', ensureAuthenticated, (req, res) => {
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
       res.render('/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   } else {
       const newUser = {
           title: req.body.title,
           details: req.body.details,
           user: req.user.id
       };
       new Idea(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'Video idea successfully added');
            res.redirect('/ideas');
        });
   }
});

//Edit form Process
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title,
        idea.details = req.body.details;
        idea.save()
            .then(idea => {
                req.flash('success_msg', 'Idea successfully edited');
                res.redirect('/ideas');
            });
    });
});

//Delete form Process
router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.deleteOne({_id: req.params.id})
        .then(idea => {
            req.flash('success_msg', 'Video idea successfully removed');
            res.redirect('/ideas'); 
        });
});

module.exports = router;