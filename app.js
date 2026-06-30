if(process.env.NODE_ENV!="production")
{
  require('dotenv').config();
}

console.log(process.env.CLOUDINARY_SECRET);

const express=require('express');
const app=express();
const path=require('path');
const Campground=require('./models/campground');
const MethodOverride=require('method-override');
const ejsMate=require('ejs-mate');//to use boilerplate code 
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError');
const Joi=require('joi');
const flash=require('connect-flash')//to show flash messages
const {CampgroundSchema,reviewSchema}=require('./schemas');
const Review = require('./models/review');
const session = require('express-session');
const passport=require('passport')
const LocalStrategy=require('passport-local');//passport.js
const user=require('./models/user')


const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');

app.get('/',(req,res)=>{
  res.render('home');
});
const dbURL=process.env.DB_URL;
  const mongoose = require('mongoose');//mongoose connection
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yelp-camp-maptiler', {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
  })
    .then(() => {
      console.log("Mongoose Connection Established");

    
    })
    .catch(err=>{
      console.log("Oh NO ERROR in Mongoose");
      console.log(err);
    })
app.engine('ejs',ejsMate);//for boilerplate code (layouts)
app.set('view engine','ejs');//to render dynamic html pages res.render()
app.set('views',path.join(__dirname,'views'));//ejs files are in views



app.use(express.urlencoded({extended:true}));//to parse incoming data into json from form
app.use(MethodOverride('_method'));//in form cant use put and delete so to use that only get 
app.use(express.static(path.join(__dirname,'public')))//to use public directory static files

const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'thisshouldbeabettersecret',   // 🔐 Used to sign the session ID cookie
  resave: false,                         // 🔁 Don't save session if nothing changed
  saveUninitialized: true,               // 💾 Save new sessions (even if empty)
  cookie: {
    httpOnly: true,                      // 🔐 Prevents client-side JS from accessing the cookie (more secure)
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 📅 Cookie expiry date (7 days from now)
    maxAge: 1000 * 60 * 60 * 24 * 7       // ⏳ Cookie will last 7 days (in ms)
  }
};

app.use(session(sessionConfig));  // 🚀 Enable session support in your app
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{//middleware 
  res.locals.currentUser=req.user; 
  res.locals.success=req.flash('success');//res.locals means availble to all ejs files 
  res.locals.error=req.flash('error');
  next();
})

app.use('/',userRoutes);//all are middlewares
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

const validateReview=(req,res,next)=>
{
      const {error}=reviewSchema.validate(req.body);
        if(error)
        {
          const msg=error.details.map(el=>el.message).join(',');
          throw new ExpressError(msg,400);
        }
        else
        {
          next();
        }
  

}




// app.all('*', (req, res, next) => {
//   res.send('notfound'); // Create a views/notfound.ejs if needed
// });


app.use((err,req,res,next)=>{
    if(!err.message)
    {
      err.message="Something went Wrong!!!"
    }
    const{statusCode=500}=err;

  res.status(statusCode).render('error',{err});
 
})

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`LISTENING TO PORT ${PORT}`);
})