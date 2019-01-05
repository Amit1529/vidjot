const express=require('express');
const mongoose=require('mongoose');
const router=express.Router();

const {ensureAuthenticated}= require('../helpers/auth');

require('../models/Idea');
const Idea=mongoose.model('ideas');

router.get('/',ensureAuthenticated,(req,res)=>{
    Idea.find({user: req.user.id})
    .sort({date:'desc'})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    })
})

//Add idea form

router.get('/add',ensureAuthenticated,(req,res)=>{
    res.render('ideas/add');
});


//Edit idea form

router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea => {
        if(idea.user !=req.user.id)
        {
            req.flash('error_msg','Invalid Access');
            res.redirect('/ideas');
        }
        else{
            res.render('ideas/edit',{
                idea:idea
            });
        }
    });
});


//delete idea
// app.get('/ideas/delete/:id',(req,res)=>{
//     Idea.findOne({
//         _id:req.params.id
//     })
//     .then(idea => {
//         res.render('ideas/delete',{
//             idea:idea
//         });
//     });
// });


//Process form

router.post('/',ensureAuthenticated,(req,res)=>{
    let errors=[];
    if(!req.body.title){
        errors.push({text:'Please add some title'});
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'});
    }
    if(errors.length > 0)
    {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    }
    else
    {
        const newIdea={
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new Idea(newIdea)
        .save()
        .then(idea=>{
            req.flash('success_msg','video idea created successfully');
            res.redirect('/ideas');
        })
    }
});

router.put('/:id',ensureAuthenticated,(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    })
    .then(idea=>{
        //new values
        idea.title=req.body.title;
        idea.details=req.body.details;
        idea.save()
        .then(idea=>{
            req.flash('success_msg','Video idea Updated successfully');
            res.redirect('/ideas');
        })
    })
    // res.send('PUT');
})

router.delete('/:id',ensureAuthenticated,(req,res)=>{
    Idea.deleteOne({ _id: req.params.id })
    .then(() => {
        req.flash('success_msg','video idea deleted successfully');
        res.redirect('/ideas');
    });
});


module.exports=router;
