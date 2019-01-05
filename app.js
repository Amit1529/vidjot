const express = require('express');
const mongoose= require('mongoose');
const exphbs=require('express-handlebars');
const bodyParser = require('body-parser');
const session=require('express-session');
const flash=require('connect-flash');
const path=require('path');
const passport=require('passport');
const methodOverride = require('method-override');
// map global promise - get rid of warning

//Passport Config
require('./config/passport')(passport);

//DB config
const db= require('./config/database');




mongoose.Promise=global.Promise;
const app=express();
mongoose.connect(db.mongoURI,{
    useNewUrlParser: true 
    // useMongoClient:true
})
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.log(err));

//Load routes
const users=require('./routes/users');
const ideas=require('./routes/idea');


// const users=require('./routes/users');

//handlebar middleware 
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
//how middleware works

//Middlewares

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));


//static folder
app.use(express.static(path.join(__dirname,'public')));


// middleware for express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req,res,next){
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    res.locals.user=req.user || null;
    next();

})

app.use(function(req,res,next){
    // console.log(Date.now());
    req.name='Amit';
    next();
})


app.get('/',(req,res)=>{
    // console.log(req.name);
    const title='Welcome';
    res.render('index',{
        title:title
    });
});

app.get('/about',(req,res)=>{
    res.render('about');
});

// use users router
app.use('/users',users);


// Use Idea router

app.use('/ideas',ideas);


const port=process.env.PORT || 5000;
app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
});